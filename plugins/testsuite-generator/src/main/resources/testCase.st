package de.learnlib.alex.plugin.generated;

import java.util.List;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.plugin.generated.AbstractExportedTest;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

// TestCase: <testName>
public class <testClassName> extends AbstractExportedTest {

    private TestCase testCaseExport;

    private List\<TestCaseStep> testCase;

    @BeforeClass
    public void setup() {
        this.testCaseExport = super.getTestCase(<testCaseIndex>);
        this.testCase = testCaseExport.getSteps();
        this.testCase.forEach(testStep -> {
                    final Symbol s = testStep.getPSymbol().getSymbol();
                    s.setProjectId(0L);
                    s.getSteps().forEach(symbolStep -> {
                        symbolStep.setSymbol(s);
                        if (symbolStep instanceof SymbolActionStep) {
                            ((SymbolActionStep) symbolStep).getAction().setSymbol(s);
                        }
                    });
                });

        testCaseExport.getPreSteps().forEach(step -> step.execute(super.cm));
    }

    <testCases>

    @AfterClass
    public void destroy() {
        testCaseExport.getPostSteps().forEach(step -> step.execute(super.cm));
    }
}