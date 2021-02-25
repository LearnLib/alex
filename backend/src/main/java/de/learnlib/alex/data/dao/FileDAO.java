/*
 * Copyright 2015 - 2021 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.UploadableFile;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.UploadableFileRepository;
import org.apache.commons.io.FileUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Simple implementation of a FileDAO.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class FileDAO {

    /** The size of the output write buffer in bytes. */
    public static final int WRITE_BUFFER_SIZE = 1024;

    private final ProjectDAO projectDAO;
    private final UploadableFileRepository fileRepository;
    private final ProjectRepository projectRepository;

    /**
     * The path of the upload directory as String. This will be injected by Spring and is configured in the
     * applications.properties file.
     */
    @Value("${alex.filesRootDir}")
    private String filesRootDir;

    /**
     * Constructor.
     *
     * @param projectDAO
     *         The injected project DAO to use.
     * @param fileRepository
     *         The injected file repository.
     */
    @Autowired
    public FileDAO(ProjectDAO projectDAO, UploadableFileRepository fileRepository, ProjectRepository projectRepository) {
        this.projectDAO = projectDAO;
        this.fileRepository = fileRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * Create the uploads directory, if necessary. Called by Spring after the DAO object is created and all injections
     * are present.
     */
    @PostConstruct
    private void init() {
        File uploadBaseDirectory = Paths.get(filesRootDir, "users").toFile();
        if (!uploadBaseDirectory.exists()) {
            uploadBaseDirectory.mkdirs();
        }
    }

    public UploadableFile create(User user, Long projectId, MultipartFile file)
            throws IllegalStateException, IOException {
        final Project project = projectDAO.getByID(user, projectId); // access check

        Path uploadedDirectoryLocation = Paths.get(getUploadsDir(user, projectId));

        File uploadDirectory = uploadedDirectoryLocation.toFile();
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        if (!uploadDirectory.isDirectory()) {
            throw new IllegalStateException("Could not find the right directory to upload the file.");
        }

        Path uploadedFileLocation = Paths.get(uploadedDirectoryLocation.toString(),
                file.getOriginalFilename());

        if (uploadedFileLocation.toFile().exists()) {
            throw new IllegalStateException("The file already exists.");
        }

        writeToFile(file.getInputStream(), uploadedFileLocation.toString());

        final UploadableFile uf = new UploadableFile();
        uf.setProject(project);
        uf.setName(file.getOriginalFilename());
        return fileRepository.save(uf);
    }

    public List<UploadableFile> getAll(User user, Long projectId) {
        projectDAO.getByID(user, projectId); // access check

        final List<UploadableFile> files = fileRepository.findAllByProject_Id(projectId);
        return files;
    }

    public File getFile(User user, Long projectId, Long fileId) {
        return getFileInternal(user, projectId, fileId);
    }

    public File getFileByName(User user, Long projectId, String filename) {
        final UploadableFile uf = fileRepository.findByProject_IdAndName(projectId, filename);
        return getFileInternal(user, projectId, uf.getId());
    }

    public void delete(User user, Long projectId, Long fileId) {
        final File file = getFileInternal(user, projectId, fileId);
        file.delete();
        fileRepository.deleteById(fileId);
    }

    public void delete(User user, Long projectId, List<Long> fileIds) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final List<UploadableFile> files = fileRepository.findAllByIdIn(fileIds);

        for (UploadableFile f: files) {
            checkAccess(user, project, f);
        }

        for (UploadableFile f: files) {
            final File fileToDelete = getFileInternal(user, project, f);
            fileToDelete.delete();
            fileRepository.deleteById(f.getId());
        }
    }

    private File getFileInternal(User user, Long projectId, Long fileId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final UploadableFile uf = fileRepository.findById(fileId).orElse(null);
        return getFileInternal(user, project, uf);
    }

    private File getFileInternal(User user, Project project, UploadableFile file) {
        checkAccess(user, project, file);

        final File uploadDirectory = getUploadDirectory(user, project.getId());
        final Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), file.getName());
        final File f = uploadedFileLocation.toFile();

        if (!f.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        return f;
    }

    public void deleteProjectDirectory(User user, Long projectId) throws IOException {
        File dir = Paths.get(getProjectDir(user, projectId)).toFile();
        if (dir.exists()) {
            FileUtils.deleteDirectory(dir);
            fileRepository.deleteAllByProject_Id(projectId);
        }
    }

    public void deleteUserDirectory(User user) throws IOException {
        File dir = Paths.get(getUserDir(user)).toFile();
        if (dir.exists()) {
            FileUtils.deleteDirectory(dir);
        }
    }

    private File getUploadDirectory(User user, Long projectId) {
        Path uploadedDirectoryLocation = Paths.get(getUploadsDir(user, projectId));
        File uploadDirectory = uploadedDirectoryLocation.toFile();

        if (!uploadDirectory.exists() || !uploadDirectory.isDirectory()) {
            try {
                uploadDirectory.mkdirs();
            } catch (SecurityException e) {
                throw new NotFoundException("Could not find the project directory you are looking for.");
            }
        }

        return uploadDirectory;
    }

    // save uploaded file to new location
    private void writeToFile(InputStream uploadedInputStream, String uploadedFileLocation)
            throws IOException {
        try (OutputStream out = new FileOutputStream(new File(uploadedFileLocation))) {
            int read;
            byte[] bytes = new byte[WRITE_BUFFER_SIZE];

            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            out.flush();
        }
    }

    private String getUserDir(User user) {
        return Paths.get(filesRootDir, "users", String.valueOf(user.getId())).toString();
    }

    private String getProjectDir(User user, Long projectId) {
        return Paths.get(getUserDir(user), "projects", String.valueOf(projectId)).toString();
    }

    private String getUploadsDir(User user, Long projectId) {
        return Paths.get(getProjectDir(user, projectId), "uploads").toString();
    }

    private void checkAccess(User user, Project project, UploadableFile file) {
        projectDAO.checkAccess(user, project);

        if (file == null) {
            throw new NotFoundException("The file could not be found.");
        }

        if (!project.equals(file.getProject())) {
            throw new UnauthorizedException("You may not access the file.");
        }
    }
}
