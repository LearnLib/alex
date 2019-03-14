/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.auth.rest.UserResource;
import de.learnlib.alex.auth.security.AuthenticationFilter;
import de.learnlib.alex.common.exceptions.NotFoundExceptionMapper;
import de.learnlib.alex.common.exceptions.TransactionSystemExceptionMapper;
import de.learnlib.alex.common.exceptions.UnauthorizedExceptionMapper;
import de.learnlib.alex.common.exceptions.ValidationExceptionMapper;
import de.learnlib.alex.config.dao.SettingsDAO;
import de.learnlib.alex.config.entities.DriverSettings;
import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.config.rest.SettingsResource;
import de.learnlib.alex.data.rest.CounterResource;
import de.learnlib.alex.data.rest.FileResource;
import de.learnlib.alex.data.rest.ProjectResource;
import de.learnlib.alex.data.rest.SymbolGroupResource;
import de.learnlib.alex.data.rest.SymbolParameterResource;
import de.learnlib.alex.data.rest.SymbolResource;
import de.learnlib.alex.learning.rest.LearnerResource;
import de.learnlib.alex.learning.rest.LearnerResultResource;
import de.learnlib.alex.modelchecking.rest.LtsFormulaResource;
import de.learnlib.alex.testing.rest.TestExecutionConfigResource;
import de.learnlib.alex.testing.rest.TestReportResource;
import de.learnlib.alex.testing.rest.TestResource;
import de.learnlib.alex.webhooks.rest.WebhookResource;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.ApplicationPath;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Main class of the REST API. Implements the Jersey {@link ResourceConfig} and does some configuration and stuff.
 */
@Component
@ApplicationPath("rest")
public class ALEXApplication extends ResourceConfig {

    /**
     * The E-Mail for the default admin, i.e. the admin that will be auto created if no other admin exists.
     */
    private static final String DEFAULT_ADMIN_EMAIL = "admin@alex.example";

    /**
     * The Password for the default admin, i.e. the admin that will be auto created if no other admin exists.
     */
    private static final String DEFAULT_ADMIN_PASSWORD = "admin";

    /**
     * The spring boot environment.
     */
    @Inject
    private Environment env;

    /**
     * The UserDAO to create an admin if needed.
     */
    @Inject
    private UserDAO userDAO;

    /**
     * The SettingsDAO to create the settings object if needed.
     */
    @Inject
    private SettingsDAO settingsDAO;

    /**
     * Access to environment variables.
     */
    @Inject
    private Environment environment;

    /**
     * Constructor where the magic happens.
     */
    public ALEXApplication() {
        // REST Resources
        register(CounterResource.class);
        register(FileResource.class);
        register(LearnerResource.class);
        register(LearnerResultResource.class);
        register(ProjectResource.class);
        register(SettingsResource.class);
        register(SymbolResource.class);
        register(SymbolGroupResource.class);
        register(SymbolParameterResource.class);
        register(UserResource.class);
        register(TestResource.class);
        register(TestReportResource.class);
        register(WebhookResource.class);
        register(TestExecutionConfigResource.class);
        register(LtsFormulaResource.class);

        // Exceptions
        register(NotFoundExceptionMapper.class);
        register(UnauthorizedExceptionMapper.class);
        register(ValidationExceptionMapper.class);
        register(TransactionSystemExceptionMapper.class);

        // Other
        register(MultiPartFeature.class);
        register(AuthenticationFilter.class);
        register(RolesAllowedDynamicFeature.class); // allow protecting routes with user roles
        register(JacksonConfiguration.class);
    }

    /**
     * Create an admin at the start of th ALEX if no admin is currently in the DB.
     */
    @PostConstruct
    public void createAdminIfNeeded() {
        // create an admin if none exists
        if (userDAO.getAllByRole(UserRole.ADMIN).size() == 0) {
            User admin = new User();
            admin.setEmail(DEFAULT_ADMIN_EMAIL);
            admin.setRole(UserRole.ADMIN);
            admin.setEncryptedPassword(DEFAULT_ADMIN_PASSWORD);
            userDAO.create(admin);
        }
    }

    /**
     * Set properties for ltsmin.
     */
    @PostConstruct
    public void handleProperties() {
        final String ltsminBinDir = environment.getProperty("ltsmin.path");
        if (ltsminBinDir != null && !ltsminBinDir.trim().equals("")) {
            if (!Files.isDirectory(Paths.get(ltsminBinDir))) {
                System.err.println("Cannot find directory for ltsmin binaries.");
                System.exit(0);
            } else {
                System.setProperty("automatalib.ltsmin.path", ltsminBinDir);
            }
        }
    }

    /**
     * Initialize system properties and create the settings object if needed.
     */
    @PostConstruct
    public void initSettings() {
        Settings settings = settingsDAO.get();
        if (settings == null) {
            try {
                settings = new Settings();

                String chromeDriverPath = System.getProperty("webdriver.chrome.driver", "");
                String geckoDriverPath = System.getProperty("webdriver.gecko.driver", "");
                String edgeDriverPath = System.getProperty("webdriver.edge.driver", "");
                String ieDriverPath = System.getProperty("webdriver.ie.driver", "");
                String remoteDriverURL = System.getProperty("webdriver.remote.url", "");

                final DriverSettings driverSettings = new DriverSettings(chromeDriverPath, geckoDriverPath,
                        edgeDriverPath, remoteDriverURL, ieDriverPath);

                settings.setDriverSettings(driverSettings);
                settingsDAO.create(settings);
            } catch (ValidationException e) {
                e.printStackTrace();
                System.exit(0);
            }
        }

        // overwrite web driver paths if specified as command line arguments
        final String chromeDriver = env.getProperty("chromeDriver");
        final String geckoDriver = env.getProperty("geckoDriver");
        final String edgeDriver = env.getProperty("edgeDriver");
        final String ieDriver = env.getProperty("ieDriver");
        final String remoteDriver = env.getProperty("remoteDriver");

        if (!chromeDriver.isEmpty()) {
            settings.getDriverSettings().setChrome(chromeDriver);
        }

        if (!geckoDriver.isEmpty()) {
            settings.getDriverSettings().setFirefox(geckoDriver);
        }

        if (!edgeDriver.isEmpty()) {
            settings.getDriverSettings().setEdge(edgeDriver);
        }

        if (!ieDriver.isEmpty()) {
            settings.getDriverSettings().setIe(ieDriver);
        }

        if (!remoteDriver.isEmpty()) {
            settings.getDriverSettings().setRemote(remoteDriver);
        }

        try {
            settings.checkValidity();
        } catch (ValidationException e) {
            e.printStackTrace();
            System.exit(0);
        }

        settingsDAO.update(settings);

        System.setProperty("webdriver.chrome.driver", settings.getDriverSettings().getChrome());
        System.setProperty("webdriver.gecko.driver", settings.getDriverSettings().getFirefox());
        System.setProperty("webdriver.edge.driver", settings.getDriverSettings().getEdge());
        System.setProperty("webdriver.ie.driver", settings.getDriverSettings().getIe());
        System.setProperty("webdriver.remote.url", settings.getDriverSettings().getRemote());
    }

    /**
     * Allow requests from a all origins.
     *
     * @return The bean.
     */
    @Bean
    public FilterRegistrationBean corsFilter() {
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        final FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(0);

        return bean;
    }
}
