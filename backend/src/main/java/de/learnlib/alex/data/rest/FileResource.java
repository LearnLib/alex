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
@Path("/projects/{project_id}/files")
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
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@PathParam("project_id") Long projectId,
                               @FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("uploadFile({}, {}, {}) for user {}.", projectId, uploadedInputStream, fileDetail, user);

        try {
            fileDAO.create(user, projectId, uploadedInputStream, fileDetail);

            UploadableFile result = new UploadableFile();
            result.setName(fileDetail.getFileName());
            result.setProjectId(projectId);

            LOGGER.traceExit(result);
            return Response.ok(result).build();
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
     * @param filename
     *         The name of the file.
     * @return The file as blob.
     */
    @GET
    @Path("/{file_name}/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@PathParam("project_id") Long projectId, @PathParam("file_name") String filename) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("downloadFile({}, {}) for user {}.", projectId, filename, user);

        final String filePath = fileDAO.getAbsoluteFilePath(user, projectId, filename);
        final File file = new File(filePath);

        return Response.ok(file)
                .header("content-disposition", "attachment; filename = " + filename)
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
    public Response getAllFiles(@PathParam("project_id") Long projectId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAllFiles({}) for user {}.", projectId, user);

        List<UploadableFile> allFiles = fileDAO.getAll(user, projectId);

        LOGGER.traceExit(allFiles);
        return Response.ok(allFiles).build();
    }

    /**
     * Delete a single file from the project directory.
     *
     * @param projectId
     *         The id of the project.
     * @param fileName
     *         The name of the file.
     * @return Status 204 No Content on success.
     */
    @DELETE
    @Path("/{file_name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteOneFile(@PathParam("project_id") Long projectId, @PathParam("file_name") String fileName) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("deleteOneFile({}, {}) for user {}.", projectId, fileName, user);

        fileDAO.delete(user, projectId, fileName);

        LOGGER.traceExit("File deleted.");
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
