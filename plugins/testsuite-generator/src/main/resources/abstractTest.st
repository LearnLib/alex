package de.learnlib.alex.plugin.generated;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.entities.webdrivers.ChromeDriverConfig;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestCase;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

public class AbstractExportedTest {

    protected ConnectorManager cm;
    private List\<TestCase> testCases;

    @BeforeSuite
    public void setupSuite() throws Exception {

        final String driverPath = "<driverPath>";
        System.setProperty("webdriver.chrome.driver", driverPath);

        final ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        final TestSuite export = mapper.readValue(AbstractExportedTest.class.getResourceAsStream("/<exportFileName>"), TestSuite.class);

        testCases = export.getTestCases();

        final ChromeDriverConfig cdc = new ChromeDriverConfig();
        final WebSiteConnector wsc = new WebSiteConnector("<projectUrl>", cdc);
        final WebServiceConnector wService = new WebServiceConnector(wsc.getBaseUrl());
        final VariableStoreConnector vsc = new VariableStoreConnector();
        final CounterStoreConnector csc = new CounterStoreConnector(null, null, null, new ArrayList\<>());

        cdc.setHeadless(<headless>);

        wsc.reset();
        wsc.getDriver().get(wsc.getBaseUrl());

        cm = new ConnectorManager();
        cm.addConnector(wsc);
        cm.addConnector(wService);
        cm.addConnector(vsc);
        cm.addConnector(csc);
    }

    protected TestCase getTestCase(int idx) {
        return this.testCases.get(idx);
    }

    @AfterSuite(alwaysRun = true)
    public void tearDownSuite() {
        try {
            cm.dispose();
        } finally {
            cm.post();
        }
    }
}
