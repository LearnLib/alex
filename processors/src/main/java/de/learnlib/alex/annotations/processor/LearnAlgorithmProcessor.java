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

import de.learnlib.alex.annotations.LearnAlgorithm;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.tools.Diagnostic;
import javax.tools.JavaFileObject;
import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Processor to collect all LearnAlgorithms and put them into an enum.
 */
@SupportedAnnotationTypes("de.learnlib.alex.annotations.LearnAlgorithm")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class LearnAlgorithmProcessor extends AbstractProcessor {

    /** The name of the annotation to mark a LearnAlgorithm as such. */
    private static final String ANNOTATION_NAME = "de.learnlib.alex.core.entities.LearnAlgorithms";

    @Override
    public boolean process(Set<? extends TypeElement> set, RoundEnvironment roundEnvironment) {
        Map<String, Object> root = new HashMap<>();
        List<Map<String, Object>> algorithms = new LinkedList<>();

        for (Element element : roundEnvironment.getElementsAnnotatedWith(LearnAlgorithm.class)) {
            Map<String, Object> entry = new HashMap<>();
            TypeElement classElement = (TypeElement) element;
            LearnAlgorithm algorithmInfo = element.getAnnotation(LearnAlgorithm.class);

            entry.put("name", algorithmInfo.name());
            entry.put("class", classElement);

            algorithms.add(entry);
        }

        if (algorithms.isEmpty()) {
            return false;
        }
        root.put("algorithms", algorithms);

        try {
            Configuration templateConfig = FreeMarkerSingleton.getConfiguration();

            Template template = templateConfig.getTemplate("LearnAlgorithmsEnumTemplate.ftl");
            JavaFileObject jfo = processingEnv.getFiler().createSourceFile(ANNOTATION_NAME);

            processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE,
                                                     "creating source file: " + jfo.toUri());

            Writer writer = jfo.openWriter();
            template.process(root, writer);
            writer.close();
        } catch (TemplateException | IOException e) {
            e.printStackTrace();
        }

        return true;
    }

}
