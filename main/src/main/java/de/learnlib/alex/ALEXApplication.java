/*
 * Copyright 2016 TU Dortmund
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
import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.config.rest.SettingsResource;
import de.learnlib.alex.data.dao.SettingsDAO;
import de.learnlib.alex.data.rest.CounterResource;
import de.learnlib.alex.data.rest.FileResource;
import de.learnlib.alex.data.rest.ProjectResource;
import de.learnlib.alex.data.rest.SymbolGroupResource;
import de.learnlib.alex.data.rest.SymbolResource;
import de.learnlib.alex.iframeproxy.rest.IFrameProxyResource;
import de.learnlib.alex.learning.rest.LearnerResource;
import de.learnlib.alex.learning.rest.LearnerResultResource;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.filter.HiddenHttpMethodFilter;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ValidationException;
import javax.ws.rs.ApplicationPath;
import java.io.IOException;

/**
 * Main class of the REST API. Implements the Jersey {@link ResourceConfig} and does some configuration and stuff.
 */
@Component
@ApplicationPath("rest")
public class ALEXApplication extends ResourceConfig {

    /**
     * The E-Mail for the default admin, i.e. the admin that will be auto created if no other admin exists.
     */
    public static final String DEFAULT_ADMIN_EMAIL = "admin@alex.example";

    /**
     * The Password for the default admin, i.e. the admin that will be auto created if no other admin exists.
     */
    public static final String DEFAULT_ADMIN_PASSWORD = "admin";

    /**
     * The spring boot environment.
     */
    @Inject
    private Environment env;

    /**
     * The UserDOA to create an admin if needed.
     */
    @Inject
    private UserDAO userDAO;

    /**
     * The SettingsDAO to create the settings object if needed.
     */
    @Inject
    private SettingsDAO settingsDAO;

    /**
     * Constructor where the magic happens.
     */
    public ALEXApplication() {
        // REST Resources
        register(CounterResource.class);
        register(FileResource.class);
        register(IFrameProxyResource.class);
        register(LearnerResource.class);
        register(LearnerResultResource.class);
        register(ProjectResource.class);
        register(SettingsResource.class);
        register(SymbolGroupResource.class);
        register(SymbolResource.class);
        register(UserResource.class);

        // Exceptions
        register(NotFoundExceptionMapper.class);

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

                Settings.DriverSettings driverSettings = new Settings.DriverSettings(
                        chromeDriverPath, geckoDriverPath, edgeDriverPath);
                settings.setDriverSettings(driverSettings);

                settingsDAO.create(settings);
            } catch (ValidationException e) {
                e.printStackTrace();
                System.exit(0);
            }
        } else {
            Settings.DriverSettings driverSettings = settings.getDriverSettings();
            System.setProperty("webdriver.chrome.driver", driverSettings.getChrome());
            System.setProperty("webdriver.gecko.driver", driverSettings.getFirefox());
            System.setProperty("webdriver.edge.driver", driverSettings.getEdge());
        }
    }

    /**
     * HTTP request filter that is required for the {@link IFrameProxyResource} to work properly.
     *
     * @return The filter.
     */
    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter() {
        return new HiddenHttpMethodFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain filterChain) throws ServletException, IOException {
                if (request.getMethod().equals("POST")
                        && request.getContentType().equals(MediaType.APPLICATION_FORM_URLENCODED_VALUE)) {
                    filterChain.doFilter(request, response);
                } else {
                    super.doFilterInternal(request, response, filterChain);
                }
            }
        };
    }

    /**
     * Allow requests from a specific port on localhost.
     *
     * @return The bean.
     */
    @Bean
    @Conditional(CorsCondition.class)
    public FilterRegistrationBean corsFilter() {
        final int port = Integer.valueOf(env.getProperty("alex.frontendPort"));

        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:" + port);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        final FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(0);

        return bean;
    }
}
