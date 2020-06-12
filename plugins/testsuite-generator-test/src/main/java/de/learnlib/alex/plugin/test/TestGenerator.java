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
package de.learnlib.alex.plugin.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.data.entities.actions.web.ClearAction;
import de.learnlib.alex.data.entities.actions.web.FillAction;
import de.learnlib.alex.data.entities.actions.web.GotoAction;
import de.learnlib.alex.data.entities.actions.web.PressKeyAction;
import de.learnlib.alex.data.entities.actions.web.WaitForNodeAction;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class TestGenerator {

    private static final long PROJECT_ID = 1L;

    private static String OUTPUT = "SUCCESS";

    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            throw new IllegalAccessException("The argument for the path of the json file has to be specified.");
        }

        final TestCaseStep s1 = new TestCaseStep();
        s1.setPSymbol(createResetSymbol());
        s1.setExpectedOutputMessage(OUTPUT);

        final TestCaseStep s2 = new TestCaseStep();
        s2.setPSymbol(createSearchSymbol());

        final TestCaseStep s3 = new TestCaseStep();
        s3.setPSymbol(createFailingSymbol());
        s3.setExpectedOutputSuccess(false);

        final TestCase testCase = new TestCase();
        testCase.setName("TestGoogleSearch");
        testCase.setProjectId(PROJECT_ID);
        testCase.getSteps().add(s1);
        testCase.getSteps().add(s2);
        testCase.getSteps().add(s3);

        final TestSuite testSuite = new TestSuite();
        testSuite.setName("GoogleTestSuite");
        testSuite.setProjectId(PROJECT_ID);
        testSuite.addTest(testCase);

        final ObjectMapper om = new ObjectMapper();
        final String ts = om.writeValueAsString(testSuite);

        final Path path = Paths.get(args[0]);
        path.toFile().getParentFile().mkdirs();
        Files.write(path, ts.getBytes());
    }

    private static ParameterizedSymbol createResetSymbol() {
        final GotoAction a1 = new GotoAction();
        a1.setUrl("/");

        final SymbolActionStep s1 = new SymbolActionStep();
        s1.setAction(a1);

        final WaitForNodeAction a2 = new WaitForNodeAction();
        a2.setNode(new WebElementLocator("input[name='q']", WebElementLocator.Type.CSS));
        a2.setWaitCriterion(WaitForNodeAction.WaitCriterion.CLICKABLE);
        a2.setMaxWaitTime(5);

        final SymbolActionStep s2 = new SymbolActionStep();
        s2.setAction(a2);

        final Symbol symbol = new Symbol();
        symbol.setProjectId(PROJECT_ID);
        symbol.setName("Reset");
        symbol.getSteps().add(s1);
        symbol.getSteps().add(s2);
        symbol.setSuccessOutput(OUTPUT);

        final ParameterizedSymbol pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(symbol);

        return pSymbol;
    }

    private static ParameterizedSymbol createSearchSymbol() {
        final ClearAction a1 = new ClearAction();
        a1.setNode(new WebElementLocator("input[name='q']", WebElementLocator.Type.CSS));

        final SymbolActionStep s1 = new SymbolActionStep();
        s1.setAction(a1);

        final FillAction a2 = new FillAction();
        a2.setNode(new WebElementLocator("input[name='q']", WebElementLocator.Type.CSS));
        a2.setValue("potato");

        final SymbolActionStep s2 = new SymbolActionStep();
        s2.setAction(a2);

        final PressKeyAction a3 = new PressKeyAction();
        a3.setNode(new WebElementLocator("input[name='q']", WebElementLocator.Type.CSS));
        a3.setKey("\\ue007");

        final SymbolActionStep s3 = new SymbolActionStep();
        s3.setAction(a3);

        final Symbol symbol = new Symbol();
        symbol.setProjectId(PROJECT_ID);
        symbol.setName("Search");
        symbol.getSteps().add(s1);
        symbol.getSteps().add(s2);
        symbol.getSteps().add(s3);

        final ParameterizedSymbol pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(symbol);

        return pSymbol;
    }

    private static ParameterizedSymbol createFailingSymbol() {
        final ClearAction a1 = new ClearAction();
        a1.setNode(new WebElementLocator("input[name='definitely_not_existing']", WebElementLocator.Type.CSS));

        final SymbolActionStep s1 = new SymbolActionStep();
        s1.setAction(a1);

        final Symbol symbol = new Symbol();
        symbol.setProjectId(PROJECT_ID);
        symbol.setName("Failing");
        symbol.getSteps().add(s1);

        final ParameterizedSymbol pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(symbol);

        return pSymbol;
    }
}
