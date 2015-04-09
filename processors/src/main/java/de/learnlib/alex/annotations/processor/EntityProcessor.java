package de.learnlib.alex.annotations.processor;

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
import javax.persistence.Entity;
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
 * Processor to collect all entities and create the HibernateUtl class with them.
 */
@SupportedAnnotationTypes("javax.persistence.Entity")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class EntityProcessor extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> set, RoundEnvironment roundEnvironment) {
        Map<String, Object> root = new HashMap<>();
        List<TypeElement> entities = new LinkedList<>();

        for (Element element : roundEnvironment.getElementsAnnotatedWith(Entity.class)) {
            TypeElement classElement = (TypeElement) element;
            entities.add(classElement);
        }

        if (entities.isEmpty()) {
            return false;
        }
        root.put("entities", entities);

        try {
            Configuration templateConfig = FreeMarkerSingleton.getConfiguration();

            Template template = templateConfig.getTemplate("HibernateUtilTemplate.ftl");
            JavaFileObject jfo = processingEnv.getFiler().createSourceFile("de.learnlib.alex.utils.HibernateUtil");

            processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE,
                                                     "creating source file: " + jfo.toUri());
            System.out.println("creating source file: " + jfo.toUri());

            Writer writer = jfo.openWriter();
            template.process(root, writer);
            writer.close();
        } catch (IOException | TemplateException e) {
            e.printStackTrace();
        }

        return true;
    }

}
