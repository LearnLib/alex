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
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Interface to describe how Files are handled.
 */
public interface FileDAO {

    /**
     * Put a new file into the file system.
     *
     * @param user
     *         The user that belongs to the project
     * @param projectId
     *         The id of the project that the file belongs to.
     * @param uploadedInputStream
     *         The file as input stream.
     * @param fileDetail
     *         Other file (meta) data.
     * @throws IOException
     *         If something during the actual writing went wrong.
     * @throws IllegalStateException
     *         If the file already exists or the destination directory is not a directory or otherwise blocked.
     * @throws NotFoundException
     *         If one of the required resources could not be found.
     */
    void create(User user, Long projectId, InputStream uploadedInputStream, FormDataContentDisposition fileDetail)
            throws IllegalStateException, IOException, NotFoundException;

    /**
     * Get a list of all fiels of a user within a project.
     *
     * @param user
     *         The user that belongs to the project
     * @param projectId
     *         The project the files belong to.
     * @return A List of Files. Can be empty.
     * @throws NotFoundException
     *         If no files can be found.
     */
    List<UploadableFile> getAll(User user, Long projectId) throws NotFoundException;

    /**
     * Get the absolute path to a file on the machine.
     *
     * @param user
     *         The user that belongs to the project
     * @param projectId
     *         The id of the project that the file belongs to.
     * @param fileName
     *         The name of the file.
     * @return The absolute path to the file on the actual machine.
     * @throws NotFoundException
     *         If the file could not be found.
     */
    String getAbsoluteFilePath(User user, Long projectId, String fileName) throws NotFoundException;

    /**
     * Deletes a file.
     *
     * @param user
     *         The user that belongs to the project
     * @param projectId
     *         The id of the project that the file belongs to.
     * @param fileName
     *         The name of the file to delete.
     * @throws NotFoundException
     *         If the file could not be found.
     */
    void delete(User user, Long projectId, String fileName) throws NotFoundException;

    /**
     * Deletes the complete project directory.
     *
     * @param user
     *         The user that belongs to the project.
     * @param projectId
     *         The id of the project that is deleted.
     * @throws IOException
     *         If deleting the directory failed.
     */
    void deleteProjectDirectory(User user, Long projectId) throws IOException;

    /**
     * Deletes the complete user directory.
     *
     * @param user
     *         The user who has been deleted.
     * @throws IOException
     *         If deleting the directory failed.
     */
    void deleteUserDirectory(User user) throws IOException;
}
