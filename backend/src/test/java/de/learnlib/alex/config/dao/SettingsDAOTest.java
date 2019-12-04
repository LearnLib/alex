package de.learnlib.alex.config.dao;

import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.config.repositories.SettingsRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import javax.validation.ValidationException;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class SettingsDAOTest {

    private static final String PATH_TO_CHROME  = "path/to/chrome";
    private static final String PATH_TO_FIREFOX = "path/to/firefox";
    private static final String PATH_TO_EDGE = "path/to/edge";

    @Mock
    private SettingsRepository settingsRepository;

    private SettingsDAO settingsDAO;

    @Before
    public void setUp() {
        settingsDAO = new SettingsDAO(settingsRepository);
    }

    @Test
    public void shouldCreateTheSettings() throws ValidationException {
        Settings settings = new Settings();
        settingsDAO.create(settings);
        verify(settingsRepository).save(settings);
    }

    @Test(expected = ValidationException.class)
    public void shouldCreateTheSettingsOnlyOnce() throws ValidationException {
        Settings settings = new Settings();
        settingsDAO.create(settings);
        given(settingsRepository.count()).willReturn(1L);
        settingsDAO.create(settings);
    }

    @Test
    public void shouldSetTheDriverPropertiesOnCreation() {
        Settings settings = new Settings();
        settings.getDriverSettings().setChrome(PATH_TO_CHROME);
        settings.getDriverSettings().setFirefox(PATH_TO_FIREFOX);
        settings.getDriverSettings().setEdge(PATH_TO_EDGE);

        settingsDAO.create(settings);

        assertEquals("null/system/" + PATH_TO_CHROME, System.getProperty("webdriver.chrome.driver"));
        assertEquals( "null/system/" + PATH_TO_FIREFOX, System.getProperty("webdriver.gecko.driver"));
        assertEquals("null/system/" + PATH_TO_EDGE, System.getProperty("webdriver.edge.driver"));
    }

    @Test
    public void shouldGetTheSettings() {
        Settings settings = new Settings();
        given(settingsRepository.get()).willReturn(settings);
        Settings s = settingsDAO.get();
        assertThat(s, is(equalTo(settings)));
    }

    @Test
    public void shouldReturnNullForGetIfNotCreated() {
        assertNull(settingsDAO.get());
    }

    @Test
    public void shouldUpdateTheSettings() {
        Settings settings = new Settings();
        settingsDAO.create(settings);
        settingsDAO.update(settings);
        verify(settingsRepository, times(2)).save(settings); // only 1 x creation & 1 x update should call save
    }

    @Test
    public void shouldSetTheDriverPropertiesOnUpdate() {
        Settings settings = new Settings();
        settings.getDriverSettings().setChrome(PATH_TO_CHROME);
        settings.getDriverSettings().setFirefox(PATH_TO_FIREFOX);
        settings.getDriverSettings().setEdge(PATH_TO_EDGE);

        settingsDAO.create(settings);

        String chromePath  = "new/" + PATH_TO_CHROME;
        String firefoxPath = "new/" + PATH_TO_FIREFOX;
        String edgePath = "new/" + PATH_TO_EDGE;
        settings.getDriverSettings().setChrome(chromePath);
        settings.getDriverSettings().setFirefox(firefoxPath);
        settings.getDriverSettings().setEdge(edgePath);

        settingsDAO.update(settings);

        assertEquals("null/system/new/" + PATH_TO_CHROME, System.getProperty("webdriver.chrome.driver"));
        assertEquals( "null/system/new/" + PATH_TO_FIREFOX, System.getProperty("webdriver.gecko.driver"));
        assertEquals("null/system/new/" + PATH_TO_EDGE, System.getProperty("webdriver.edge.driver"));
    }

}
