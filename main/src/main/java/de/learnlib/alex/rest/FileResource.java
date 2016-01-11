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

package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.entities.UploadableFile;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.ResourceErrorHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    @Inject
    private FileDAO fileDAO;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@PathParam("project_id") Long projectId,
                               @FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("FileResource.uploadFile(" + projectId + ", " + uploadedInputStream + ", " + fileDetail + ") "
                     + "for user " + user + ".");

        try {
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
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFiles(@PathParam("project_id") Long projectId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("FileResource.getAllFiles(" + projectId + ") for user " + user + ".");

        try {
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
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("FileResource.deleteOneFile(" + projectId + ", " + fileName + ") for user " + user + ".");

        try {
            fileDAO.delete(user.getId(), projectId, fileName);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", Response.Status.NOT_FOUND, e);
        }
    }
}
