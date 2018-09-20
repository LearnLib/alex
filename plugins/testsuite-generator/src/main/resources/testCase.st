package de.learnlib.alex.plugin.generated;

import java.util.List;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.plugin.generated.AbstractExportedTest;
import de.learnlib.alex.testing.export.TestCaseExport;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

// TestCase: <testName>
public class <testClassName> extends AbstractExportedTest {

    private List<ParameterizedSymbol> testCase;
    private List<String> outcome;

    @BeforeClass
    public void setup() {
        final TestCaseExport testCaseExport = super.getTestCase(<testCaseIndex>);
        this.testCase = testCaseExport.getSymbols();
        this.outcome = testCaseExport.getOutputs();
    }

    <testCases>

}