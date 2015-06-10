package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;

public class FileDAOImpl implements FileDAO {

    private java.nio.file.Path uploadedDirectoryBaseLocation;

    public FileDAOImpl() {
        this.uploadedDirectoryBaseLocation = Paths.get(System.getProperty("user.dir"), "uploads");

        File uploadBaseDirectory = uploadedDirectoryBaseLocation.toFile();
        if (!uploadBaseDirectory.exists()) {
            uploadBaseDirectory.mkdir();
        }
    }

    @Override
    public void create(Long projectId, InputStream uploadedInputStream, FormDataContentDisposition fileDetail)
            throws IllegalArgumentException, IOException, IllegalStateException {
        java.nio.file.Path uploadedDirectoryLocation = Paths.get(uploadedDirectoryBaseLocation.toString(),
                                                                 String.valueOf(projectId));

        File uploadDirectory = uploadedDirectoryLocation.toFile();
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdir();
        }

        if (!uploadDirectory.isDirectory()) {
            throw new IllegalArgumentException("Could not find the right directory to upload the file.");
        }

        java.nio.file.Path uploadedFileLocation = Paths.get(uploadedDirectoryLocation.toString(),
                                                            fileDetail.getFileName());

        if (uploadedFileLocation.toFile().exists()) {
            throw new IllegalStateException("The file already exists.");
        }

        writeToFile(uploadedInputStream, uploadedFileLocation.toString());

    }

    @Override
    public List<UploadableFile> getAll(Long projectId) throws NotFoundException {
        File uploadDirectory = getUploadDirectory(projectId);

        List<UploadableFile> files = new LinkedList<>();
        for (File f : uploadDirectory.listFiles()) {
            UploadableFile uploadableFile = new UploadableFile();
            uploadableFile.setProjectId(projectId);
            uploadableFile.setName(f.getName());

            files.add(uploadableFile);
        }

        return files;
    }

    @Override
    public String getAbsoulteFilePath(Long projectId, String fileName) throws NotFoundException {
        File uploadDirectory = getUploadDirectory(projectId);

        java.nio.file.Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), fileName);
        File file = uploadedFileLocation.toFile();

        if (!file.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        return file.getAbsolutePath();
    }

    @Override
    public void delete(Long projectId, String fileName) throws NotFoundException {
        File uploadDirectory = getUploadDirectory(projectId);

        java.nio.file.Path uploadedFileLocation = Paths.get(uploadDirectory.getPath(), fileName);
        File file = uploadedFileLocation.toFile();

        if (!file.exists()) {
            throw new NotFoundException("Could not find the file in the project.");
        }

        file.delete();
    }

    private File getUploadDirectory(Long projectId) throws NotFoundException{
        java.nio.file.Path uploadedDirectoryLocation = Paths.get(uploadedDirectoryBaseLocation.toString(),
                                                                 String.valueOf(projectId));
        File uploadDirectory = uploadedDirectoryLocation.toFile();

        if (!uploadDirectory.exists() || !uploadDirectory.isDirectory()) {
            throw new NotFoundException("Could not find the project directory you are looking for.");
        }

        return uploadDirectory;
    }

    // save uploaded file to new location
    private void writeToFile(InputStream uploadedInputStream, String uploadedFileLocation)
            throws IOException {
        OutputStream out;
        int read;
        byte[] bytes = new byte[1024];

        out = new FileOutputStream(new File(uploadedFileLocation));
        while ((read = uploadedInputStream.read(bytes)) != -1) {
            out.write(bytes, 0, read);
        }
        out.flush();
        out.close();
    }


}
