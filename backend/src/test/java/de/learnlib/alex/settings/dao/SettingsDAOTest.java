package de.learnlib.alex.settings.dao;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.settings.repositories.SettingsRepository;
import javax.validation.ValidationException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class SettingsDAOTest {

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
    public void shouldGetTheSettings() {
        Settings settings = new Settings();
        given(settingsRepository.get()).willReturn(settings);
        Settings s = settingsDAO.get();
        assertEquals(settings, s);
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

}
