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

package de.learnlib.alex;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.settings.dao.SettingsDAO;
import de.learnlib.alex.settings.entities.DriverSettings;
import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.testing.dao.TestReportDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.annotation.PostConstruct;
import javax.validation.ValidationException;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class AlexComponent {

    private final Environment env;
    private final UserDAO userDAO;
    private final SettingsDAO settingsDAO;
    private final TestReportDAO testReportDAO;
    private final LearnerResultDAO learnerResultDAO;

    @Autowired
    public AlexComponent(Environment env,
                         UserDAO userDAO,
                         SettingsDAO settingsDAO,
                         TestReportDAO testReportDAO,
                         LearnerResultDAO learnerResultDAO) {
        this.env = env;
        this.userDAO = userDAO;
        this.settingsDAO = settingsDAO;
        this.testReportDAO = testReportDAO;
        this.learnerResultDAO = learnerResultDAO;
    }

    /**
     * Create an admin at the start of th ALEX if no admin is currently in the DB.
     */
    @PostConstruct
    @Transactional(rollbackFor = Exception.class)
    public void createDefaultAdmin() {
        if (userDAO.getAllByRole(UserRole.ADMIN).size() == 0) {
            User admin = new User();
            admin.setEmail(env.getProperty("alex.admin.email"));
            admin.setUsername(env.getProperty("alex.admin.username"));
            admin.setRole(UserRole.ADMIN);
            admin.setEncryptedPassword(env.getProperty("alex.admin.password"));
            userDAO.create(admin);
        }
    }

    @PostConstruct
    public void abortActiveTestReports() {
        testReportDAO.abortActiveTestReports();
    }

    @PostConstruct
    public void abortActiveLearnerResults() {
        learnerResultDAO.abortActiveLearnerResults();
    }

    @PostConstruct
    public void configureLtsMin() {
        final String ltsminBinDir = env.getProperty("ltsmin.path");
        if (ltsminBinDir != null && !ltsminBinDir.trim().equals("")) {
            if (!Files.isDirectory(Paths.get(ltsminBinDir))) {
                System.err.println("Cannot find directory for ltsmin binaries.");
                System.exit(0);
            } else {
                System.setProperty("automatalib.ltsmin.path", ltsminBinDir);
            }
        }
    }

    @PostConstruct
    public void createSystemFilesDirectory() {
        try {
            final String path = env.getProperty("alex.filesRootDir");
            if (Files.notExists(Paths.get(path, "system"))) {
                Files.createDirectories(Paths.get(path, "system"));
            }
        } catch (IOException e) {
            System.err.println("Failed to initialize system files directory.");
            System.exit(0);
        }
    }

    /**
     * Initialize system properties and create the settings object if needed.
     */
    @PostConstruct
    @Transactional
    public void initializeSettings() {
        var settings = settingsDAO.get();

        // create settings for the first time
        if (settings == null) {
            try {
                settings = new Settings();
                final var remoteDriverURL = env.getProperty("webdriver.remote.url", "");
                final var driverSettings = new DriverSettings();
                driverSettings.setRemote(remoteDriverURL);
                settings.setDriverSettings(driverSettings);
                settingsDAO.create(settings);
            } catch (ValidationException e) {
                e.printStackTrace();
                System.exit(0);
            }
        }

        // overwrite web driver paths if specified as command line arguments
        try {
            final var remoteDriverUrl = env.getProperty("webdriver.remote.url", "");
            if (!remoteDriverUrl.isEmpty()) {
                new URL(remoteDriverUrl);
                settings.getDriverSettings().setRemote(remoteDriverUrl);
                settingsDAO.update(settings);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(0);
        }
    }

    /**
     * Allow requests from a all origins.
     *
     * @return The bean.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
