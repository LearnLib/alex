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
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.stream.Collectors;

@Path("/projects/{project_id}/tests")
@RolesAllowed({"REGISTERED"})
public class TestResource {

    private class TestSuiteExecutionResult {

        private long testCasesPassed;
        private long testCasesFailed;

        public TestSuiteExecutionResult() {
            this.testCasesPassed = 0L;
            this.testCasesFailed = 0L;
        }

        public TestSuiteExecutionResult(long testCasesPassed, long testCasesFailed) {
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

        public void add(TestSuiteExecutionResult result) {
            this.testCasesPassed += result.testCasesPassed;
            this.testCasesFailed += result.testCasesFailed;
        }

    }

    private class TestCaseExecutionResult extends TestSuiteExecutionResult {
        private List<String> outputs;

        public TestCaseExecutionResult(long testCasesPassed, long testCasesFailed, List<String> outputs) {
            super(testCasesPassed, testCasesFailed);
            this.outputs = outputs;
        }

        public List<String> getOutputs() {
            return outputs;
        }

        public void setOutputs(List<String> outputs) {
            this.outputs = outputs;
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

        if (test instanceof TestSuite) {
            TestSuiteExecutionResult result = executeTestSuite(user, (TestSuite) test, browserConfig);
            return Response.ok(result).build();
        } else {
            TestCaseExecutionResult result = executeTestCase(user, (TestCase) test, browserConfig);
            return Response.ok(result).build();
        }
    }

    private TestSuiteExecutionResult executeTestSuite(User user, TestSuite test, BrowserConfig browserConfig) {
        Queue<Test> tests = new LinkedBlockingQueue<>();
        tests.offer(test);
        TestSuiteExecutionResult result = new TestSuiteExecutionResult();

        while (!tests.isEmpty()) {
            Test current = tests.poll();
            if (current instanceof TestCase) {
                if (((TestCase) current).getSymbols().isEmpty()) {
                    continue;
                }
                TestCaseExecutionResult currentResult = executeTestCase(user, (TestCase) current, browserConfig);
                result.add(currentResult);
            } else if (current instanceof TestSuite) {
                if (((TestSuite) current).getTests().isEmpty()) {
                    continue;
                }
                TestSuite testSuite = (TestSuite) current;
                testSuite.getTests().forEach(tests::offer);
            }
        }

        return result;
    }

    private TestCaseExecutionResult executeTestCase(User user, TestCase testCase, BrowserConfig browserConfig) {
        List<Symbol> symbols = testCase.getSymbols();

        Symbol resetSymbol = symbols.get(0);
        symbols.remove(0);
        SymbolSet symbolSet = new SymbolSet(resetSymbol, symbols);
        ReadOutputConfig config = new ReadOutputConfig(symbolSet, browserConfig);

        List<ExecuteResult> outputs = learner.readOutputs(user, testCase.getProject(), config, testCase.getVariables());

        long symbolsFailed = outputs.stream().filter(o -> !o.isSuccessful()).count();
        List<String> sulOutputs = outputs.stream().map(ExecuteResult::getOutput).collect(Collectors.toList());
        if (symbolsFailed == 0) {
            return new TestCaseExecutionResult(1L, 0L, sulOutputs);
        } else {
            return new TestCaseExecutionResult(0L, 1L, sulOutputs);
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
