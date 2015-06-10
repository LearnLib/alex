package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.ResourceErrorHandler;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Path("/projects/{project_id}/files")
public class FileResource {

    @Inject
    private FileDAO fileDAO;

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@PathParam("project_id") Long projectId,
                               @FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) {
        try {
            fileDAO.create(projectId, uploadedInputStream, fileDetail);

            UploadableFile result = new UploadableFile();
            result.setName(fileDetail.getFileName());
            result.setProjectId(projectId);

            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", Response.Status.NOT_FOUND, e);
        } catch (IOException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile",
                                                               Response.Status.INTERNAL_SERVER_ERROR, e);
        } catch (IllegalStateException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile",
                                                               Response.Status.BAD_REQUEST, e);
        }
    }

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFiles(@PathParam("project_id") Long projectId) {
        try {
            List<UploadableFile> allFiles = fileDAO.getAll(projectId);
            return Response.ok(allFiles).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.getAllFiles",
                                                               Response.Status.NOT_FOUND, e);
        }
    }

    @DELETE
    @Path("/{file_name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteOneFile(@PathParam("project_id") Long projectId, @PathParam("file_name") String fileName) {
        try {
            fileDAO.delete(projectId, fileName);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", Response.Status.NOT_FOUND, e);
        }
    }


}
