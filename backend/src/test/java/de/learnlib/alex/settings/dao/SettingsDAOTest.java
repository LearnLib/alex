package de.learnlib.alex.settings.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.settings.repositories.SettingsRepository;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SettingsDAOTest {

    @Mock
    private SettingsRepository settingsRepository;

    private SettingsDAO settingsDAO;

    @BeforeEach
    public void setUp() {
        settingsDAO = new SettingsDAO(settingsRepository);
    }

    @Test
    public void shouldCreateTheSettings() {
        Settings settings = new Settings();
        settingsDAO.create(settings);
        verify(settingsRepository).save(settings);
    }

    @Test
    public void shouldCreateTheSettingsOnlyOnce() {
        Settings settings = new Settings();
        settingsDAO.create(settings);
        given(settingsRepository.count()).willReturn(1L);
        assertThrows(ValidationException.class, () -> settingsDAO.create(settings));
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
