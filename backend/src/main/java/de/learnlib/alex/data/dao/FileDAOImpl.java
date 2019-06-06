/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.data.entities.UploadableFile;
import org.apache.commons.io.FileUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * Simple implementation of a FileDAO.
 */
@Service
public class FileDAOImpl implements FileDAO {

    /** The size of the output write buffer in bytes. */
    public static final int WRITE_BUFFER_SIZE = 1024;

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

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
     */
    @Inject
    public FileDAOImpl(ProjectDAO projectDAO) {
        this.projectDAO = projectDAO;
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

    @Override
    public void create(User user, Long projectId, InputStream uploadedInputStream,
            FormDataContentDisposition fileDetail)
            throws IllegalStateException, IOException, NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        Path uploadedDirectoryLocation = Paths.get(getUploadsDir(user, projectId));

        File uploadDirectory = uploadedDirectoryLocation.toFile();
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdir();
        }

        if (!uploadDirectory.isDirectory()) {
            throw new IllegalStateException("Could not find the right directory to upload the file.");
        }

        Path uploadedFileLocation = Paths.get(uploadedDirectoryLocation.toString(),
                fileDetail.getFileName());

        if (uploadedFileLocation.toFile().exists()) {
            throw new IllegalStateException("The file already exists.");
        }

        writeToFile(uploadedInputStream, uploadedFileLocation.toString());
    }

    @Override
    public List<UploadableFile> getAll(User user, Long projectId) throws NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        File uploadDirectory = getUploadDirectory(user, projectId);

        List<UploadableFile> files = new ArrayList<>();
        for (File file : uploadDirectory.listFiles()) {
            UploadableFile uploadableFile = new UploadableFile();
            uploadableFile.setProjectId(projectId);
            uploadableFile.setName(file.getName());

            files.add(uploadableFile);
        }

        if (files.isEmpty()) {
            return new ArrayList<>();
        }

        return files;
    }

    @Override
    public String getAbsoluteFilePath(User user, Long projectId, String fileName) throws NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        File uploadDirectory = getUploadDirectory(user, projectId);

        Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), fileName);
        File file = uploadedFileLocation.toFile();

        if (!file.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        return file.getAbsolutePath();
    }

    @Override
    public void delete(User user, Long projectId, String fileName) throws NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        File uploadDirectory = getUploadDirectory(user, projectId);

        Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), fileName);
        File file = uploadedFileLocation.toFile();

        if (!file.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        file.delete();
    }

    @Override
    public void deleteProjectDirectory(User user, Long projectId) throws IOException {
        File dir = Paths.get(getProjectDir(user, projectId)).toFile();
        if (dir.exists()) {
            FileUtils.deleteDirectory(dir);
        }
    }

    @Override
    public void deleteUserDirectory(User user) throws IOException {
        File dir = Paths.get(getUserDir(user)).toFile();
        if (dir.exists()) {
            FileUtils.deleteDirectory(dir);
        }
    }

    private File getUploadDirectory(User user, Long projectId) throws NotFoundException {
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
}
