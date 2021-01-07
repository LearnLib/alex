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

package de.learnlib.alex.modelchecking.services.reporters;

import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.entities.ModelCheckingResult;
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

public class JUnitModelCheckingResultReporter {

    public String createReport(LearnerResultStep step) {
        try {
            final DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            final DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            final Document doc = docBuilder.newDocument();

            final var testNo = step.getResult().getTestNo();
            final var stepNo = step.getStepNo();

            // create the root element
            final Element rootElement = doc.createElement("testsuites");
            rootElement.setAttribute("name", "MC Report (learn run: " + testNo + ", step: " + stepNo + ")");
            doc.appendChild(rootElement);

            final var idToFormulaSuiteMap = new HashMap<Long, LtsFormulaSuite>();
            final var idToNumTests = new HashMap<Long, Integer>();
            final var idToNumFailures = new HashMap<Long, Integer>();
            var totalTests = step.getModelCheckingResults().size();
            var totalFailures = 0;

            for (var result: step.getModelCheckingResults()) {
                final var suite = result.getFormula().getSuite();

                idToFormulaSuiteMap.putIfAbsent(suite.getId(), suite);

                idToNumTests.putIfAbsent(suite.getId(), 0);
                idToNumTests.put(suite.getId(), idToNumTests.get(suite.getId()) + 1);

                idToNumFailures.putIfAbsent(suite.getId(), 0);
                if (!result.isPassed()) {
                    idToNumFailures.put(suite.getId(), idToNumFailures.get(suite.getId()) + 1);
                    totalFailures++;
                }
            };

            // create xml elements for test suites and add them to the root element
            final Map<Long, Element> testSuiteElements = new HashMap<>();
            idToFormulaSuiteMap.forEach((id, formulaSuite) -> {
                final Element el = createTestSuiteElement(doc, formulaSuite, idToNumTests.get(id), idToNumFailures.get(id));
                testSuiteElements.put(id, el);
                rootElement.appendChild(el);
            });

            // create xml elements for all test cases and append them to their corresponding test suite element
            step.getModelCheckingResults().forEach((result) -> {
                final Element el = createTestCaseElement(doc, result);
                testSuiteElements.get(result.getFormula().getSuite().getId()).appendChild(el);
            });

            // add the summed up statistics of the report to the root 'testsuites' element
            rootElement.setAttribute("tests", String.valueOf(totalTests));
            rootElement.setAttribute("failures", String.valueOf(totalFailures));
            rootElement.setAttribute("time", "n/a");

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

    private Element createTestSuiteElement(final Document doc, final LtsFormulaSuite suite, int numTests, int numTestsFailed) {
        final Element testSuiteEl = doc.createElement("testsuite");
        testSuiteEl.setAttribute("id", String.valueOf(suite.getId()));
        testSuiteEl.setAttribute("name", suite.getName());
        testSuiteEl.setAttribute("tests", String.valueOf(numTests));
        testSuiteEl.setAttribute("failures", String.valueOf(numTestsFailed));
        testSuiteEl.setAttribute("time", "n/a");
        return testSuiteEl;
    }

    private Element createTestCaseElement(final Document doc, final ModelCheckingResult result) {
        final Element testCaseEl = doc.createElement("testcase");
        testCaseEl.setAttribute("name", result.getFormula().getName());
        testCaseEl.setAttribute("id", String.valueOf(result.getId()));
        testCaseEl.setAttribute("time", "n/a");

        if (!result.isPassed()) {
            final Element failureEl = doc.createElement("failure");
            failureEl.setAttribute("message", "prefix: " + result.getPrefix() + ", loop: " + result.getLoop());
            testCaseEl.appendChild(failureEl);
        }

        return testCaseEl;
    }
}
