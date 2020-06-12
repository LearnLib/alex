/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.entities.UploadableFile;
import de.learnlib.alex.security.AuthContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * REST API to manage files.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/files")
public class FileResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    private AuthContext authContext;

    /** The FileDAO to use. */
    private FileDAO fileDAO;

    @Autowired
    public FileResource(AuthContext authContext, FileDAO fileDAO) {
        this.authContext = authContext;
        this.fileDAO = fileDAO;
    }

    /**
     * Uploads a new file to the corresponding upload directory uploads/{userId}/{projectId}/{filename}.
     *
     * @param projectId
     *         The id of the project the file belongs to.
     * @param fileToUpload
     *         The file to upload.
     * @return The HTTP ResponseEntity with the file object on success.
     */
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity uploadFile(@PathVariable("projectId") Long projectId,
                                     @RequestParam("file") MultipartFile fileToUpload) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("uploadFile({}, {}) for user {}.", projectId, fileToUpload, user);

        try {
            final UploadableFile file = fileDAO.create(user, projectId, fileToUpload);
            LOGGER.traceExit(file);
            return ResponseEntity.ok(file);
        } catch (IOException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", HttpStatus.INTERNAL_SERVER_ERROR, e);
        } catch (IllegalStateException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("FileResource.uploadFile", HttpStatus.BAD_REQUEST, e);
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
    @GetMapping(
            value = "/{fileId}/download"
    )
    public ResponseEntity<Resource> downloadFile(@PathVariable("projectId") Long projectId,
                                                 @PathVariable("fileId") Long fileId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("downloadFile({}, {}) for user {}.", projectId, fileId, user);
        final File file = fileDAO.getFile(user, projectId, fileId);

        final Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    /**
     * Get all available files of a project.
     *
     * @param projectId
     *         The id of the project.
     * @return The list of all files of the project.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAllFiles(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getAllFiles({}) for user {}.", projectId, user);

        final List<UploadableFile> files = fileDAO.getAll(user, projectId);

        LOGGER.traceExit(files);
        return ResponseEntity.ok(files);
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
    @DeleteMapping(
            value = "/{fileId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity deleteFile(@PathVariable("projectId") Long projectId, @PathVariable("fileId") Long fileId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("deleteFile({}, {}) for user {}.", projectId, fileId, user);

        fileDAO.delete(user, projectId, fileId);

        LOGGER.traceExit("File deleted.");
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(
            value = "/batch/{fileIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity deleteFiles(@PathVariable("projectId") Long projectId, @PathVariable("fileIds") List<Long> fileIds) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("deleteFiles({}, {}) for user {}.", projectId, fileIds, user);

        fileDAO.delete(user, projectId, fileIds);

        LOGGER.traceExit("Files deleted.");
        return ResponseEntity.noContent().build();
    }
}
