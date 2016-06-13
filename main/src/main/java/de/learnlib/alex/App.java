package de.learnlib.alex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The entry point to ALEX.
 */
@SpringBootApplication
public class App /*extends SpringBootServletInitializer*/ {

    /*
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(App.class);
    }

    @Primary
    @Bean
    public Validator getValidatorBean() {
        return new LocalValidatorFactoryBean();
    }

    @Primary
    @Bean
    public LocalValidatorFactoryBean getLocalValidatorFactoryBean() {
        return new LocalValidatorFactoryBean();
    }
    */

    /**
     * Starts the standalone version of ALEX.
     *
     * @param args
     *         Additional commandline parameters.
     */
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

