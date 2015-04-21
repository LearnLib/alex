package de.learnlib.alex.annotations.processor;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;

/**
 * Singleton to handel the FreeMarker configuration and stuff.
 */
public final class FreeMarkerSingleton {

    /** The configuration instance of the singleton. */
    private static Configuration configuration;

    private FreeMarkerSingleton() {
    }

    /**
     * Get the one and only FreeMarker configuration.
     *
     * @return The Freemarker configuration.
     */
    public static synchronized Configuration getConfiguration() {
        if (configuration == null) {
            configuration = new Configuration(Configuration.VERSION_2_3_22);
            configuration.setDefaultEncoding("UTF-8");
            configuration.setClassForTemplateLoading(LearnAlgorithmProcessor.class, "/");
            configuration.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        }

        return configuration;
    }

}
