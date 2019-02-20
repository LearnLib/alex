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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.FileDAO;

/**
 * Connector to store and manage files.
 */
public class FileStoreConnector implements Connector {

    /** The current user. */
    private User user;

    /** The FileDAO to use. */
    private FileDAO fileDAO;

    /**
     * Constructor.
     *
     * @param fileDAO
     *         An instance of the file dao.
     * @param user
     *         The current user.
     */
    public FileStoreConnector(FileDAO fileDAO, User user) {
        this.user = user;
        this.fileDAO = fileDAO;
    }

    @Override
    public void reset() {
    }

    @Override
    public void dispose() {
    }

    @Override
    public void post() {
    }

    /**
     * Get the absolute path of a file in the uploads directory.
     *
     * @param projectId
     *         The id of the project.
     * @param fileName
     *         The name of the file.
     * @return The absolute path to the file.
     * @throws IllegalStateException
     *         If no file with 'fileName' has been uploaded.
     */
    public String getAbsoluteFileLocation(Long projectId, String fileName) throws IllegalStateException {
        try {
            return fileDAO.getAbsoluteFilePath(user, projectId, fileName);
        } catch (NotFoundException e) {
            throw new IllegalStateException("No file with the name '" + fileName + "' was uploaded into the project "
                    + projectId + ".");
        }
    }
}
