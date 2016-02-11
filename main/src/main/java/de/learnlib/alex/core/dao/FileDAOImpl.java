/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;

/**
 * Simple implementation of a FileDAO.
 */
@Repository
public class FileDAOImpl implements FileDAO {

    /** The size of the output write buffer in bytes. */
    public static final int WRITE_BUFFER_SIZE = 1024;

    /** Path to the root of the upload directory. */
    private java.nio.file.Path uploadedDirectoryBaseLocation;

    /**
     * Default consturtor that jsut initialises the internal data structures.
     */
    public FileDAOImpl() {
        this.uploadedDirectoryBaseLocation = Paths.get(System.getProperty("user.dir"), "uploads");

        File uploadBaseDirectory = uploadedDirectoryBaseLocation.toFile();
        if (!uploadBaseDirectory.exists()) {
            uploadBaseDirectory.mkdir();
        }
    }

    @Override
    public void create(Long userId, Long projectId, InputStream uploadedInputStream,
                       FormDataContentDisposition fileDetail)
            throws IOException, IllegalStateException {
        java.nio.file.Path uploadedDirectoryLocation = Paths.get(uploadedDirectoryBaseLocation.toString(),
                                                                 String.valueOf(userId),
                                                                 String.valueOf(projectId));

        File uploadDirectory = uploadedDirectoryLocation.toFile();
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdir();
        }

        if (!uploadDirectory.isDirectory()) {
            throw new IllegalStateException("Could not find the right directory to upload the file.");
        }

        java.nio.file.Path uploadedFileLocation = Paths.get(uploadedDirectoryLocation.toString(),
                                                            fileDetail.getFileName());

        if (uploadedFileLocation.toFile().exists()) {
            throw new IllegalStateException("The file already exists.");
        }

        writeToFile(uploadedInputStream, uploadedFileLocation.toString());

    }

    @Override
    public List<UploadableFile> getAll(Long userId, Long projectId) throws NotFoundException {
        File uploadDirectory = getUploadDirectory(userId, projectId);

        List<UploadableFile> files = new LinkedList<>();
        for (File f : uploadDirectory.listFiles()) {
            UploadableFile uploadableFile = new UploadableFile();
            uploadableFile.setProjectId(projectId);
            uploadableFile.setName(f.getName());

            files.add(uploadableFile);
        }

        if (files.isEmpty()) {
            throw new NotFoundException("No files found for the User <" + userId + "> and "
                                                + "the project <" + projectId + ">.");
        }

        return files;
    }

    @Override
    public String getAbsoluteFilePath(Long userId, Long projectId, String fileName) throws NotFoundException {
        File uploadDirectory = getUploadDirectory(userId, projectId);

        java.nio.file.Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), fileName);
        File file = uploadedFileLocation.toFile();

        if (!file.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        return file.getAbsolutePath();
    }

    @Override
    public void delete(Long userId, Long projectId, String fileName) throws NotFoundException {
        File uploadDirectory = getUploadDirectory(userId, projectId);

        java.nio.file.Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), fileName);
        File file = uploadedFileLocation.toFile();

        if (!file.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        file.delete();
    }

    private File getUploadDirectory(Long userId, Long projectId) throws NotFoundException {
        java.nio.file.Path uploadedDirectoryLocation = Paths.get(uploadedDirectoryBaseLocation.toString(),
                                                                 String.valueOf(userId),
                                                                 String.valueOf(projectId));
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


}
