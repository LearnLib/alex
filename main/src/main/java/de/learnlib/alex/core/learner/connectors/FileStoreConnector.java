package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.FileDAOImpl;
import de.learnlib.alex.exceptions.NotFoundException;

/**
 * Connector to store and manage files.
 */
public class FileStoreConnector implements Connector {

    private FileDAO fileDAO;

    public FileStoreConnector() {
        this.fileDAO = new FileDAOImpl();
    }

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

    public String getAbsoluteFileLocation(Long userId, Long projectId, String fileName) throws IllegalStateException {
        try {
            return fileDAO.getAbsoulteFilePath(userId, projectId, fileName);
        } catch (NotFoundException e) {
            throw new IllegalStateException("No file with the name '" + fileName + "' was uploaded into the project "
                                                    + projectId + ".");
        }
    }
}
