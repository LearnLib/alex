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

package de.learnlib.alex.testsuites.services.reporters;

import de.learnlib.alex.testsuites.entities.TestCaseResult;
import de.learnlib.alex.testsuites.entities.TestResult;
import de.learnlib.alex.testsuites.entities.TestSuiteResult;
import de.learnlib.alex.testsuites.entities.TestReportConfig;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;

/**
 * Creates a JUnit report of a test result.
 *
 * @see <a href="https://www.ibm.com/support/knowledgecenter/en/SSQ2R2_9.5.0/com.ibm.rsar.analysis.codereview.cobol.doc/topics/cac_useresults_junit.html">JUnit XML format</a>
 */
public class JUnitTestResultReporter extends TestResultReporter<String> {

    /**
     * Creates a report
     *
     * @param reportConfig The config to create a report from.
     * @return The serialized and formatted xml report as string.
     */
    @Override
    public String createReport(final TestReportConfig reportConfig) {
        try {
            final DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            final DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            final Document doc = docBuilder.newDocument();

            // create the root element
            final Element rootElement = doc.createElement("testsuites");
            doc.appendChild(rootElement);

            // the element for the parent test suite
            final Element parentTestSuiteElement = doc.createElement("testSuite");
            parentTestSuiteElement.setAttribute("id", String.valueOf(reportConfig.getParent().getId()));
            parentTestSuiteElement.setAttribute("name", reportConfig.getParent().getName());
            rootElement.appendChild(parentTestSuiteElement);

            // test suite id -> test suite element
            final Map<Long, Element> testSuiteElements = new HashMap<>();
            testSuiteElements.put(reportConfig.getParent().getId(), parentTestSuiteElement);

            // create elements for all test suites
            reportConfig.getResults().forEach((id, result) -> {
                if (result instanceof TestSuiteResult) {
                    final Element el = createTestSuiteElement(doc, (TestSuiteResult) result);
                    rootElement.appendChild(el);
                    testSuiteElements.put(id, el);
                }
            });

            final TestSuiteResult parentTestSuiteResult = new TestSuiteResult();
            final TestSuiteResult overallResult = new TestSuiteResult();

            // create elements for test cases
            reportConfig.getResults().forEach((id, result) -> {
                if (result instanceof TestCaseResult) {
                    final Element el = createTestCaseElement(doc, (TestCaseResult) result);
                    testSuiteElements.get(result.getTest().getParent()).appendChild(el);

                    if (result.getTest().getParent().equals(reportConfig.getParent().getId())) {
                        parentTestSuiteResult.add((TestCaseResult) result);
                    }

                    overallResult.add((TestCaseResult) result);
                }
            });

            // set attributes of the parent test suite element
            parentTestSuiteElement.setAttribute("tests", String.valueOf(parentTestSuiteResult.getTestCasesRun()));
            parentTestSuiteElement.setAttribute("failures", String.valueOf(parentTestSuiteResult.getTestCasesFailed()));
            parentTestSuiteElement.setAttribute("time", String.valueOf(parentTestSuiteResult.getTime()));

            // set attributes for the containing element
            rootElement.setAttribute("tests", String.valueOf(overallResult.getTestCasesRun()));
            rootElement.setAttribute("failures", String.valueOf(overallResult.getTestCasesFailed()));
            rootElement.setAttribute("time", String.valueOf(overallResult.getTime()));

            // write the elements as xml string
            final Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            final DOMSource source = new DOMSource(doc);
            final StringWriter stringWriter = new StringWriter();
            final StreamResult streamResult = new StreamResult(stringWriter);
            transformer.transform(source, streamResult);

            return stringWriter.getBuffer().toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private Element createTestSuiteElement(final Document doc,
                                           final TestSuiteResult suiteResult) {

        final Element testSuiteEl = doc.createElement("testsuite");
        testSuiteEl.setAttribute("id", String.valueOf(suiteResult.getTest().getId()));
        testSuiteEl.setAttribute("name", suiteResult.getTest().getName());
        testSuiteEl.setAttribute("tests", String.valueOf(suiteResult.getTestCasesRun()));
        testSuiteEl.setAttribute("failures", String.valueOf(suiteResult.getTestCasesFailed()));
        testSuiteEl.setAttribute("time", String.valueOf(suiteResult.getTime()));
        return testSuiteEl;
    }

    private Element createTestCaseElement(final Document doc, final TestCaseResult result) {
        final Element testCaseEl = doc.createElement("testcase");
        testCaseEl.setAttribute("name", result.getTest().getName());
        testCaseEl.setAttribute("id", String.valueOf(result.getTest().getId()));
        testCaseEl.setAttribute("time", String.valueOf(result.getTime()));

        if (!result.isPassed()) {
            final Element failureEl = doc.createElement("failure");
            failureEl.setAttribute("message", result.getFailureMessage());
            testCaseEl.appendChild(failureEl);
        }

        return testCaseEl;
    }

}
