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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.dao.FileDAOImpl;

/**
 * Connector to store and manage files.
 */
public class FileStoreConnector implements Connector {

    /** The FileDAO to use. */
    private FileDAO fileDAO;

    /** Constructor. */
    public FileStoreConnector() {
        this.fileDAO = new FileDAOImpl();
    }

    /**
     * Constructor.
     * @param fileDAO An instance of the file dao.
     */
    public FileStoreConnector(FileDAO fileDAO) {
        this.fileDAO = fileDAO;
    }

    @Override
    public void reset() {
        // nothing to do here
    }

    @Override
    public void dispose() {
        // nothing to do here
    }

    /**
     * Get the absolute path of a file in the uploads directory.
     *
     * @param userId The id of the user.
     * @param projectId The id of the project.
     * @param fileName The name of the file.
     * @return The absolute path to the file.
     * @throws IllegalStateException
     *          If no file with 'fileName' has been uploaded.
     */
    public String getAbsoluteFileLocation(Long userId, Long projectId, String fileName) throws IllegalStateException {
        try {
            return fileDAO.getAbsoluteFilePath(userId, projectId, fileName);
        } catch (NotFoundException e) {
            throw new IllegalStateException("No file with the name '" + fileName + "' was uploaded into the project "
                                                    + projectId + ".");
        }
    }
}
