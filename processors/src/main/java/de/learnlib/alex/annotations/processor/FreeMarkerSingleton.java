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
