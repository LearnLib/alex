/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.testing.services.reporters;

import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestSuiteResult;
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
import java.util.HashMap;
import java.util.Map;

/**
 * Creates a JUnit report of a test result.
 */
public class JUnitTestResultReporter extends TestResultReporter<String> {

    /**
     * Creates a report.
     *
     * @param report The config to create a report from.
     * @return The serialized and formatted xml report as string.
     */
    @Override
    public String createReport(final TestReport report) {
        try {
            final DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            final DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            final Document doc = docBuilder.newDocument();

            // create the root element
            final Element rootElement = doc.createElement("testsuites");
            rootElement.setAttribute("name", "Report (" + report.getStartDateAsString() + ")");
            doc.appendChild(rootElement);

            // create and collect all data from all test cases
            // each test suite result contains the summed up statistics for all its direct child test cases
            final Map<Long, TestSuiteResult> testSuiteResultMap = new HashMap<>();
            report.getTestResults().stream()
                    .filter((r) -> r instanceof TestCaseResult)
                    .forEach((result) -> {
                        final Test parent = result.getTest().getParent();

                        // create a new test suite result if it has not been discovered yet
                        if (!testSuiteResultMap.containsKey(parent.getId())) {
                            final TestSuiteResult testSuiteResult = new TestSuiteResult();
                            testSuiteResult.setTest(parent);
                            testSuiteResultMap.put(parent.getId(), testSuiteResult);
                        }

                        // add the statistics of the test case to its test suite
                        testSuiteResultMap.get(parent.getId()).add((TestCaseResult) result);
                    });

            // create xml elements for test suites and add them to the root element
            final Map<Long, Element> testSuiteElements = new HashMap<>();
            testSuiteResultMap.forEach((id, testSuiteResult) -> {
                final Element el = createTestSuiteElement(doc, testSuiteResult);
                testSuiteElements.put(id, el);
                rootElement.appendChild(el);
            });

            // create xml elements for all test cases and append them to their corresponding test suite element
            report.getTestResults().stream()
                    .filter((r) -> r instanceof TestCaseResult)
                    .forEach((result) -> {
                        final Element el = createTestCaseElement(doc, (TestCaseResult) result);
                        final Test parent = result.getTest().getParent();
                        testSuiteElements.get(parent.getId()).appendChild(el);
                    });

            // add the summed up statistics of the report to the root 'testsuites' element
            rootElement.setAttribute("tests", String.valueOf(report.getNumTests()));
            rootElement.setAttribute("failures", String.valueOf(report.getNumTestsFailed()));
            rootElement.setAttribute("time", String.valueOf(report.getTime()));

            // create the xml
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

    private Element createTestSuiteElement(final Document doc, final TestSuiteResult suiteResult) {
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
