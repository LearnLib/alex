package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Settings;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.junit.After;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class SettingsDAOImplTest {

    private static SettingsDAOImpl settingsDAO;

    @BeforeClass
    public static void beforeClass() {
        settingsDAO = new SettingsDAOImpl();
    }

    @After
    public void tearDown() throws NotFoundException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();
        Settings settings = (Settings) session.createCriteria(Settings.class).uniqueResult();
        if (settings != null) {
            session.delete(settings);
        }
        HibernateUtil.commitTransaction();
    }

    @Test
    public void shouldCreateSettingsObject() {
        Settings settings = new Settings();
        settingsDAO.create(settings);
        assertNotNull(settings.getId());
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToCreateIfSettingsAlreadyExist() {
        Settings settings1 = new Settings();
        settingsDAO.create(settings1);

        Settings settings2 = new Settings();
        settingsDAO.create(settings2);
    }

    @Test
    public void shouldGetSettingsOnceCreated() {
        Settings settings1 = new Settings();
        settingsDAO.create(settings1);
        assertNotNull(settingsDAO.get());
    }

    @Test
    public void shouldReturnNullForGetIfNotCreated() {
        assertNull(settingsDAO.get());
    }

    @Test
    public void shouldUpdateSettings() throws Exception {
        Settings settings1 = new Settings();
        settingsDAO.create(settings1);

        String chromePath = "new/path/to/chrome";
        String firefoxPath = "new/path/to/firefox";

        settings1.getDriverSettings().setChrome(chromePath);
        settings1.getDriverSettings().setFirefox(firefoxPath);
        settingsDAO.update(settings1);

        assertEquals(settings1.getDriverSettings().getChrome(), chromePath);
        assertEquals(settings1.getDriverSettings().getFirefox(), firefoxPath);
    }

    @Test(expected = Exception.class)
    public void shouldFailToUpdate() throws Exception {
        Settings settings1 = new Settings();
        settingsDAO.create(settings1);

        settings1.setId(-1L);
        settingsDAO.update(settings1);
    }
}
