package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface FileDAO {

    void create(Long projectId, InputStream uploadedInputStream, FormDataContentDisposition fileDetail)
            throws IllegalArgumentException, IOException, IllegalStateException;

    List<UploadableFile> getAll(Long projectId) throws NotFoundException;

    String getAbsoulteFilePath(Long projectId, String fileName) throws NotFoundException;

    void delete(Long projectId, String fileName) throws NotFoundException;

}
