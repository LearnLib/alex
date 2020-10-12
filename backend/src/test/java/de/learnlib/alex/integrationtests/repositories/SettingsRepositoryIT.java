package de.learnlib.alex.integrationtests.repositories;

import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.settings.repositories.SettingsRepository;
import org.junit.Test;

import javax.inject.Inject;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class SettingsRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private SettingsRepository settingsRepository;

    @Test
    public void shouldSaveTheSettings() {
        var settings = new Settings();
        settings = settingsRepository.save(settings);

        assertTrue(settings.getId() > 0);
    }

    @Test
    public void shouldNotSaveTwoSettings() {
        final var settings1 = new Settings();
        final var settings2 = new Settings();

        settingsRepository.save(settings1);
        settingsRepository.save(settings2); // should update and not create

        assertEquals(settingsRepository.count(), 1L);
    }

    @Test
    public void shouldGetTheSettings() {
        final var settings = new Settings();
        settingsRepository.save(settings);
        final var settingsFromDB = settingsRepository.get();
        assertNotNull(settingsFromDB);
    }

}
