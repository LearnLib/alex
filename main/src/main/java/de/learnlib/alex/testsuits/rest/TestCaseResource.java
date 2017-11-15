package de.learnlib.alex.testsuits.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.common.utils.ResponseHelper;
import de.learnlib.alex.testsuits.dao.TestCaseDAO;
import de.learnlib.alex.testsuits.entities.TestCase;

import javax.annotation.security.RolesAllowed;
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
import javax.ws.rs.core.UriInfo;
import java.util.List;

@Path("/projects/{project_id}/tests")
@RolesAllowed({"REGISTERED"})
public class TestCaseResource {

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link TestCaseDAO} to use. */
    @Inject
    private TestCaseDAO testCaseDAO;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTestCase(@PathParam("project_id") Long projectId, TestCase testCase) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        testCase.setUser(user);
        testCase.setProjectId(projectId);

        try {
            testCaseDAO.create(testCase);

            return Response.ok(testCase).status(Response.Status.CREATED).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("TestCase.create", Response.Status.BAD_REQUEST, e);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("project_id") Long projectId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        List<TestCase> resultList = testCaseDAO.getAll(user.getId(), projectId);

        return ResponseHelper.renderList(resultList, Response.Status.OK);
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        TestCase result = testCaseDAO.get(user.getId(), projectId, id);

        return Response.ok(result).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("project_id") Long projectId, @PathParam("id") Long id, TestCase testCase) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        if (testCase.getId() == null) {
            testCase.setId(id);
        }

        if (!testCase.getId().equals(id)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        testCase.setUser(user);
        testCase.setProjectId(projectId);

        try {
            testCaseDAO.update(testCase);

            return Response.ok(testCase).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("TestCase.update", Response.Status.BAD_REQUEST, e);
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        testCaseDAO.delete(user.getId(), projectId, id);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
