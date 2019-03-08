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

package de.learnlib.alex.modelchecking.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.common.utils.RESTError;
import de.learnlib.alex.modelchecking.dao.LtsFormulaDAO;
import de.learnlib.alex.modelchecking.entities.LtsCheckingConfig;
import de.learnlib.alex.modelchecking.entities.LtsCheckingResult;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.services.LtsCheckingService;
import net.automatalib.exception.ModelCheckingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
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

/** The lts formula endpoints for the REST API. */
@Path("/projects/{projectId}/ltsFormulas")
@RolesAllowed({"REGISTERED"})
public class LtsFormulaResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The DAO for lts formulas. */
    @Inject
    private LtsFormulaDAO ltsFormulaDAO;

    @Inject
    private LtsCheckingService ltsCheckingService;

    /**
     * Get all lts formulas in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @return Status 200 and the list of formulas.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("projectId") Long projectId) {
        LOGGER.traceEntry("enter getAll(projectId: {})", projectId);
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<LtsFormula> formulas = ltsFormulaDAO.getAll(user, projectId);

        LOGGER.traceExit("leave getAll() with formulas: {}", formulas);
        return Response.ok(formulas).build();
    }

    /**
     * Create a new formula.
     *
     * @param projectId
     *         The ID of the project.
     * @param formula
     *         The formula to create.
     * @return Status 201 and the created formula.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("projectId") Long projectId, LtsFormula formula) {
        LOGGER.traceEntry("enter create(projectId: {}, formula: {})", projectId, formula);
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final LtsFormula createdFormula = ltsFormulaDAO.create(user, projectId, formula);

        LOGGER.traceExit("create create() with formula: {}", createdFormula);
        return Response.status(Response.Status.CREATED).entity(createdFormula).build();
    }

    /**
     * Updates an existing formula.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaId
     *         The ID of the formula to update.
     * @param formula
     *         The updated formula object.
     * @return Status 200 and the updated formula.
     */
    @Path("/{formulaId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId,
                           @PathParam("formulaId") Long formulaId,
                           LtsFormula formula) {
        LOGGER.traceEntry("enter update(projectId: {}, formulaId: {})", projectId, formulaId);
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final LtsFormula updatedFormula = ltsFormulaDAO.update(user, projectId, formula);

        LOGGER.traceExit("leave update() with formula: {}", updatedFormula);
        return Response.ok(updatedFormula).build();
    }

    /**
     * Delete a formula.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaId
     *         The ID of the formula to delete.
     * @return Status 204 on success.
     */
    @Path("/{formulaId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("formulaId") Long formulaId) {
        LOGGER.traceEntry("enter delete(projectId: {}, formulaId: {})", projectId, formulaId);
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        ltsFormulaDAO.delete(user, projectId, formulaId);

        LOGGER.traceExit("leave delete()");
        return Response.noContent().build();
    }

    /**
     * Delete multiple formulas at once.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaIds
     *         The IDs of the formulas to delete.
     * @return Status 204 on success.
     */
    @Path("/batch/{formulaIds}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("formulaIds") IdsList formulaIds) {
        LOGGER.traceEntry("enter delete(projectId: {}, formulaIds: {})", projectId, formulaIds);
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        ltsFormulaDAO.delete(user, projectId, formulaIds);

        LOGGER.traceExit("leave delete()");
        return Response.noContent().build();
    }

    /**
     * Check formulas against a learned model.
     *
     * @param projectId
     *         The ID of the project.
     * @param config
     *         The configuration.
     * @return A map of counterexamples.
     */
    @Path("/check")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response check(@PathParam("projectId") Long projectId, LtsCheckingConfig config) {
        LOGGER.traceEntry("enter check(projectId: {})", projectId);
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        config.validate();
        try {
            final List<LtsCheckingResult> results = ltsCheckingService.check(user, projectId, config);
            LOGGER.traceExit("leave check() with {}", results);
            return Response.ok(results).build();
        } catch (ModelCheckingException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new RESTError(Response.Status.BAD_REQUEST, e))
                    .build();
        }
    }

}
