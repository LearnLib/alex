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

@SupportedAnnotationTypes("de.learnlib.alex.annotations.LearnAlgorithm")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class LearnAlgorithmProcessor extends AbstractProcessor {

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
            JavaFileObject jfo = processingEnv.getFiler().createSourceFile("de.learnlib.alex.core.entities.LearnAlgorithms");

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
