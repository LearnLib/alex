package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.exceptions.NotFoundException;
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
     * @param userId
     *         The user the file belongs to.
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
     */
    void create(Long userId, Long projectId, InputStream uploadedInputStream, FormDataContentDisposition fileDetail)
            throws IOException, IllegalStateException;

    /**
     * Get a list of all fiels of a user within a project.
     *
     * @param userId
     *         The user to show the files of.
     * @param projectId
     *         The project the files belong to.
     * @return A List of Files. Can be empty.
     * @throws NotFoundException
     *         If no files can be found.
     */
    List<UploadableFile> getAll(Long userId, Long projectId) throws NotFoundException;

    /**
     * Get the absolute path to a file on the machine.
     *
     * @param userId
     *         The user the file belongs to.
     * @param projectId
     *         The id of the project that the file belongs to.
     * @param fileName
     *         The name of the file.
     * @return The absolute path to the file on the actual machine.
     * @throws NotFoundException
     *         If the file could not be found.
     */
    String getAbsoluteFilePath(Long userId, Long projectId, String fileName) throws NotFoundException;

    /**
     * Deletes a file.
     *
     * @param userId
     *         The user the file belongs to.
     * @param projectId
     *         The id of the project that the file belongs to.
     * @param fileName
     *         The name of the file to delete.
     * @throws NotFoundException
     *         If the file could not be found.
     */
    void delete(Long userId, Long projectId, String fileName) throws NotFoundException;

}
