package de.learnlib.alex.testsuites.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.common.utils.ResponseHelper;
import de.learnlib.alex.config.entities.BrowserConfig;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.SymbolSet;
import de.learnlib.alex.learning.services.Learner;
import de.learnlib.alex.testsuites.dao.TestDAO;
import de.learnlib.alex.testsuites.entities.Test;
import de.learnlib.alex.testsuites.entities.TestCase;
import de.learnlib.alex.testsuites.entities.TestSuite;

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
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

@Path("/projects/{project_id}/tests")
@RolesAllowed({"REGISTERED"})
public class TestResource {

    private class TestExecutionResult {

        private long testCasesPassed;
        private long testCasesFailed;

        public TestExecutionResult() {
            this.testCasesPassed = 0L;
            this.testCasesFailed = 0L;
        }

        public TestExecutionResult(long testCasesPassed, long testCasesFailed) {
            this.testCasesPassed = testCasesPassed;
            this.testCasesFailed = testCasesFailed;
        }

        public long getTestCasesRun() {
            return testCasesPassed + testCasesFailed;
        }

        public long getTestCasesPassed() {
            return testCasesPassed;
        }

        public void setTestCasesPassed(long testCasesPassed) {
            this.testCasesPassed = testCasesPassed;
        }

        public void addTestCasesPassed(long amount) {
            this.testCasesPassed += amount;
        }

        public long getTestCasesFailed() {
            return testCasesFailed;
        }

        public void setTestCasesFailed(long testCasesFailed) {
            this.testCasesFailed = testCasesFailed;
        }

        public void addTestCasesFailed(long amount) {
            this.testCasesFailed += amount;
        }

        public boolean isSuccess() {
            return testCasesFailed == 0;
        }

        public void add(TestExecutionResult result) {
            this.testCasesPassed += result.testCasesPassed;
            this.testCasesFailed += result.testCasesFailed;
        }

    }

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link TestDAO} to use. */
    private TestDAO testDAO;

    private Learner learner;

    @Inject
    public TestResource(TestDAO testDAO, Learner learner) {
        this.testDAO = testDAO;
        this.learner = learner;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTestCase(@PathParam("project_id") Long projectId, Test test) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        test.setProjectId(projectId);

        try {
            testDAO.create(user, test);

            return Response.ok(test).status(Response.Status.CREATED).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("TestCase.create", Response.Status.BAD_REQUEST, e);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("project_id") Long projectId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        List<Test> resultList = testDAO.getAll(user, projectId);

        return ResponseHelper.renderList(resultList, Response.Status.OK);
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        Test result = testDAO.get(user, projectId, id);

        return Response.ok(result).build();
    }

    @POST
    @Path("/{id}/execute")
    @Produces(MediaType.APPLICATION_JSON)
    public Response execute(@PathParam("project_id") Long projectId,
                            @PathParam("id") Long id,
                            BrowserConfig browserConfig)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        Test test = testDAO.get(user, projectId, id);

        TestExecutionResult result = executeTest(user, test, browserConfig);

        return Response.ok(result).build();
    }

    private TestExecutionResult executeTest(User user, Test test, BrowserConfig browserConfig) {
        Queue<Test> tests = new LinkedBlockingQueue<>();
        tests.add(test);
        TestExecutionResult result = new TestExecutionResult();

        for (Test current : tests) {
            if (current instanceof TestCase) {
                TestExecutionResult currentResult = executeTestCase(user, (TestCase) current, browserConfig);
                result.add(currentResult);
            } else if (current instanceof TestSuite) {
                TestSuite testSuite = (TestSuite) current;
                tests.addAll(testSuite.getTests());
            }
        }

        return result;
    }

    private TestExecutionResult executeTestCase(User user, TestCase testCase, BrowserConfig browserConfig) {
        List<Symbol> symbols = testCase.getSymbols();

        Symbol resetSymbol = symbols.get(0);
        symbols.remove(0);
        SymbolSet symbolSet = new SymbolSet(resetSymbol, symbols);
        ReadOutputConfig config = new ReadOutputConfig(symbolSet, browserConfig);

        List<ExecuteResult> outputs = learner.readOutputs(user, testCase.getProject(), config);

        long symbolsFailed = outputs.stream().filter(o -> !o.isSuccessful()).count();
        if (symbolsFailed == 0) {
            return new TestExecutionResult(1L, 0L);
        } else {
            return new TestExecutionResult(0L, 1L);
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("project_id") Long projectId, @PathParam("id") Long id, Test test) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        if (test.getId() == null) {
            test.setId(id);
        }

        if (!test.getId().equals(id)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        test.setProjectId(projectId);

        try {
            testDAO.update(user, test);

            return Response.ok(test).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("TestCase.update", Response.Status.BAD_REQUEST, e);
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        testDAO.delete(user, projectId, id);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
