package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.ResourceErrorHandler;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * REST API to manage files.
 * @resourcePath files
 * @resourceDescription Operations about files
 */
@Path("/projects/{project_id}/files")
@RolesAllowed({"REGISTERED"})
public class FileResource {

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

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
            User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
            fileDAO.create(user.getId(), projectId, uploadedInputStream, fileDetail);

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
            User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
            List<UploadableFile> allFiles = fileDAO.getAll(user.getId(), projectId);
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
            User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
            fileDAO.delete(user.getId(), projectId, fileName);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", Response.Status.NOT_FOUND, e);
        }
    }


}
