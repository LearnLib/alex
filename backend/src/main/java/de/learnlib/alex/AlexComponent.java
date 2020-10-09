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
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.webdrivers.WebDrivers;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.settings.dao.SettingsDAO;
import de.learnlib.alex.settings.entities.DriverSettings;
import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.annotation.PostConstruct;
import javax.validation.ValidationException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Component
public class AlexComponent {

    private final Environment env;
    private final UserDAO userDAO;
    private final SettingsDAO settingsDAO;
    private final TestReportRepository testReportRepository;
    private final LearnerResultRepository learnerResultRepository;

    @Autowired
    public AlexComponent(Environment env,
                         UserDAO userDAO,
                         SettingsDAO settingsDAO,
                         TestReportRepository testReportRepository,
                         LearnerResultRepository learnerResultRepository) {
        this.env = env;
        this.userDAO = userDAO;
        this.settingsDAO = settingsDAO;
        this.testReportRepository = testReportRepository;
        this.learnerResultRepository = learnerResultRepository;
    }

    /**
     * Create an admin at the start of th ALEX if no admin is currently in the DB.
     */
    @PostConstruct
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
    public void abortPendingTestProcesses() {
        final List<TestReport> pendingReports = testReportRepository.findAllByStatusIn(
                Arrays.asList(TestReport.Status.IN_PROGRESS, TestReport.Status.PENDING)
        );
        pendingReports.forEach(r -> r.setStatus(TestReport.Status.ABORTED));
        testReportRepository.saveAll(pendingReports);
    }

    @PostConstruct
    public void abortPendingLearningProcesses() {
        final List<LearnerResult> pendingLearnerProcesses = learnerResultRepository.findAllByStatusIn(
                Arrays.asList(LearnerResult.Status.IN_PROGRESS, LearnerResult.Status.PENDING)
        );
        pendingLearnerProcesses.forEach(p -> p.setStatus(LearnerResult.Status.ABORTED));
        learnerResultRepository.saveAll(pendingLearnerProcesses);
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

    private String getDriverPath(String driver) {
        final Path driverPath = Paths.get(env.getProperty("alex.filesRootDir"), "system", driver);
        if (Files.notExists(driverPath)) {
            return "";
        } else {
            return driver;
        }
    }

    /**
     * Initialize system properties and create the settings object if needed.
     */
    @PostConstruct
    public void initializeSettings() {
        Settings settings = settingsDAO.get();
        if (settings == null) {
            try {
                settings = new Settings();

                final String chromeDriverPath = System.getProperty("webdriver.chrome.driver", "");
                final String geckoDriverPath = System.getProperty("webdriver.gecko.driver", "");
                final String edgeDriverPath = System.getProperty("webdriver.edge.driver", "");
                final String ieDriverPath = System.getProperty("webdriver.ie.driver", "");
                final String remoteDriverURL = System.getProperty("webdriver.remote.url", "");

                final DriverSettings driverSettings = new DriverSettings(chromeDriverPath, geckoDriverPath,
                        edgeDriverPath, remoteDriverURL, ieDriverPath);

                settings.setDriverSettings(driverSettings);
                settingsDAO.create(settings);
            } catch (ValidationException e) {
                e.printStackTrace();
                System.exit(0);
            }
        }

        final DriverSettings driverSettings = settings.getDriverSettings();
        driverSettings.setChrome(getDriverPath(driverSettings.getChrome()));
        driverSettings.setFirefox(getDriverPath(driverSettings.getFirefox()));
        driverSettings.setEdge(getDriverPath(driverSettings.getEdge()));
        driverSettings.setIe(getDriverPath(driverSettings.getIe()));
        settingsDAO.update(settings);

        // overwrite web driver paths if specified as command line arguments
        try {
            final String chromeDriver = env.getProperty("chromeDriver");
            if (!chromeDriver.isEmpty()) {
                final File f = new File(chromeDriver);
                settingsDAO.updateDriver(new FileInputStream(f), f.getName(), WebDrivers.CHROME);
            }

            final String geckoDriver = env.getProperty("geckoDriver");
            if (!geckoDriver.isEmpty()) {
                final File f = new File(geckoDriver);
                settingsDAO.updateDriver(new FileInputStream(f), f.getName(), WebDrivers.FIREFOX);
            }

            final String edgeDriver = env.getProperty("edgeDriver");
            if (!edgeDriver.isEmpty()) {
                final File f = new File(edgeDriver);
                settingsDAO.updateDriver(new FileInputStream(f), f.getName(), WebDrivers.EDGE);
            }

            final String ieDriver = env.getProperty("ieDriver");
            if (!ieDriver.isEmpty()) {
                final File f = new File(ieDriver);
                settingsDAO.updateDriver(new FileInputStream(f), f.getName(), WebDrivers.IE);
            }

            final String remoteDriver = env.getProperty("remoteDriver");
            if (!remoteDriver.isEmpty()) {
                new URL(remoteDriver);
                settings.getDriverSettings().setRemote(remoteDriver);
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
