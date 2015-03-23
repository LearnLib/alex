package de.learnlib.weblearner.annotations.processor;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;

public class FreeMarkerSingleton {

    private static Configuration configuration;

    public static Configuration getConfiguration() {
        if (configuration == null) {
            configuration = new Configuration(Configuration.VERSION_2_3_22);
            configuration.setDefaultEncoding("UTF-8");
            configuration.setClassForTemplateLoading(LearnAlgorithmProcessor.class, "/");
            configuration.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        }

        return configuration;
    }

}
