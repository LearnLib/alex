package de.learnlib.alex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

/**
 * The entry point to ALEX.
 */
@SpringBootApplication
public class App extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(App.class);
    }

    /**
     * Starts the standalone modus of ALEX.
     *
     * @param args
     *         Additional commandline parameters.
     */
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

