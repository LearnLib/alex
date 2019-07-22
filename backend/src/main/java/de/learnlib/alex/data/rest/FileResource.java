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

package de.learnlib.alex.data.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.entities.UploadableFile;
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
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * REST API to manage files.
 */
@Path("/projects/{projectId}/files")
@RolesAllowed({"REGISTERED"})
public class FileResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The FileDAO to use. */
    @Inject
    private FileDAO fileDAO;

    /**
     * Uploads a new file to the corresponding upload directory uploads/{userId}/{projectId}/{filename}.
     *
     * @param projectId
     *         The id of the project the file belongs to.
     * @param uploadedInputStream
     *         The input stream for the file.
     * @param fileDetail
     *         The form data of the file.
     * @return The HTTP response with the file object on success.
     */
    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@PathParam("projectId") Long projectId,
                               @FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("uploadFile({}, {}, {}) for user {}.", projectId, uploadedInputStream, fileDetail, user);

        try {
            final UploadableFile file = fileDAO.create(user, projectId, uploadedInputStream, fileDetail);
            LOGGER.traceExit(file);
            return Response.ok(file).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", Response.Status.NOT_FOUND, e);
        } catch (IOException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile",
                    Response.Status.INTERNAL_SERVER_ERROR, e);
        } catch (IllegalStateException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile",
                    Response.Status.BAD_REQUEST, e);
        }
    }

    /**
     * Downloads a file.
     *
     * @param projectId
     *         The id of the project.
     * @param fileId
     *         The ID of the file.
     * @return The file as blob.
     */
    @GET
    @Path("/{fileId}/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@PathParam("projectId") Long projectId, @PathParam("fileId") Long fileId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("downloadFile({}, {}) for user {}.", projectId, fileId, user);
        final File file = fileDAO.getFile(user, projectId, fileId);
        return Response.ok(file)
                .header("content-disposition", "attachment; filename = " + file.getName())
                .build();
    }

    /**
     * Get all available files of a project.
     *
     * @param projectId
     *         The id of the project.
     * @return The list of all files of the project.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFiles(@PathParam("projectId") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAllFiles({}) for user {}.", projectId, user);

        final List<UploadableFile> files = fileDAO.getAll(user, projectId);

        LOGGER.traceExit(files);
        return Response.ok(files).build();
    }

    /**
     * Delete a single file from the project directory.
     *
     * @param projectId
     *         The id of the project.
     * @param fileId
     *         The ID of the file.
     * @return Status 204 No Content on success.
     */
    @DELETE
    @Path("/{fileId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteFile(@PathParam("projectId") Long projectId, @PathParam("fileId") Long fileId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("deleteFile({}, {}) for user {}.", projectId, fileId, user);

        fileDAO.delete(user, projectId, fileId);

        LOGGER.traceExit("File deleted.");
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @DELETE
    @Path("/batch/{fileIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteFiles(@PathParam("projectId") Long projectId, @PathParam("fileIds") IdsList fileIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("deleteFiles({}, {}) for user {}.", projectId, fileIds, user);

        fileDAO.delete(user, projectId, fileIds);

        LOGGER.traceExit("Files deleted.");
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
