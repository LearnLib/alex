/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.common.utils.StringList;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.entities.Counter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * Resource to read and delete Counters.
 */
@Path("/projects/{project_id}/counters")
public class CounterResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The CounterDAO to use. */
    @Inject
    private CounterDAO counterDAO;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /**
     * Get all counters of a project.
     *
     * @param projectId
     *         The Project ID.
     * @return A List of the counters within the project. This list can be empty.
     * @throws NotFoundException
     *         If the related User or Project could not be found.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCounters(@PathParam("project_id") Long projectId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAllCounters({}) for user {}.", projectId, user);

        List<Counter> counters = counterDAO.getAll(user, projectId);

        LOGGER.traceExit(counters);
        return Response.ok(counters).build();
    }

    /**
     * Creates a new counter.
     *
     * @param projectId
     *         The id of the project.
     * @param counter
     *         The counter to create.
     * @return The created counter.
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createCounter(@PathParam("project_id") Long projectId, Counter counter) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("createCounter({}, {}) for user {}.", projectId, counter.getName(), user);

        try {
            if (!counter.getProjectId().equals(projectId)) {
                throw new ValidationException("The ID of the project does not match with the URL.");
            }

            counterDAO.create(user, counter);
            return Response.ok(counter).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("CounterResource.createCounter",
                    Response.Status.NOT_FOUND, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("CounterResource.createCounter",
                    Response.Status.BAD_REQUEST, e);
        }
    }

    /**
     * Update the value of a counter.
     *
     * @param projectId
     *         The id of the project.
     * @param name
     *         The name of the counter.
     * @param counter
     *         The updated counter to update.
     * @return The updated counter.
     */
    @PUT
    @Path("/{counter_name}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateCounter(@PathParam("project_id") Long projectId,
            @PathParam("counter_name") String name,
            Counter counter) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("updateCounter({}, {}) for user {}.", projectId, name, user);

        try {
            if (!counter.getProjectId().equals(projectId)) {
                throw new ValidationException("The ID of the project does not match with the URL.");
            }

            if (!name.equals(counter.getName())) {
                throw new ValidationException("The name of a counter cannot be updated.");
            }

            Counter counterInDB = counterDAO.get(user, projectId, name);
            counterInDB.setValue(counter.getValue());

            counterDAO.update(user, counterInDB);
            return Response.ok(counterInDB).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("CounterResource.updateCounter",
                    Response.Status.BAD_REQUEST,
                    e);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("CounterResource.updateCounter",
                    Response.Status.NOT_FOUND,
                    e);
        }
    }

    /**
     * Delete one counter.
     *
     * @param projectId
     *         The Project ID.
     * @param name
     *         The name of the counter to remove.
     * @return Nothing if everything went OK.
     * @throws NotFoundException
     *         If the given Counter or the related User or Project could not be found.
     */
    @DELETE
    @Path("/{counter_name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCounter(@PathParam("project_id") Long projectId, @PathParam("counter_name") String name)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("deleteCounter({}, {}) for user {}.", projectId, name, user);

        counterDAO.delete(user, projectId, name);

        LOGGER.traceExit("Counter {} deleted.", name);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    /**
     * Delete multiple counters.
     *
     * @param projectId
     *         The Project ID.
     * @param names
     *         The names of the counters to remove.
     * @return Nothing if everything went OK.
     * @throws NotFoundException
     *         If the given Counters or the related User or Project could not be found.
     */
    @DELETE
    @Path("/batch/{counter_names}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCounter(@PathParam("project_id") Long projectId,
            @PathParam("counter_names") StringList names)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("deleteCounter({}, {}) for user {}.", projectId, names, user);

        counterDAO.delete(user, projectId, names.toArray(new String[names.size()]));

        LOGGER.traceExit("Counter(s) {} deleted.", names);
        return Response.status(Response.Status.NO_CONTENT).build();

    }

}
