/*
 * Copyright 2018 TU Dortmund
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
package de.learnlib.alex.plugin;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.text.WordUtils;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.stringtemplate.v4.ST;

/**
 * @author Philip Koch
 * @author frohme
 */
@Mojo(name = "generate", defaultPhase = LifecyclePhase.GENERATE_TEST_RESOURCES)
public class TestSuiteGeneratorMojo extends AbstractMojo {

    @Parameter(required = true)
    private File sourceFile;

    @Parameter(required = true)
    private String driverPath;

    @Parameter(defaultValue = "${project.build.directory}/generated-test-sources", required = true)
    private File targetDirectory;

    @Override
    public void execute() throws MojoExecutionException {

        final ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        final TestSuite export;

        try {
            export = mapper.readValue(sourceFile, TestSuite.class);
        } catch (IOException e) {
            throw new MojoExecutionException("Error reading export file", e);
        }

        writeAbstractSuperClass(export);

        final List<TestCase> testCases = export.getTestCases();
        for (int i = 0; i < testCases.size(); i++) {
            writeTestCase(testCases.get(i), i);
        }

        writeTestSuiteConfiguration(export);
    }

    private void writeAbstractSuperClass(TestSuite export) throws MojoExecutionException {
        final ST template = getTemplate("/abstractTest.st");

        template.add("driverPath", this.driverPath);
        template.add("exportFileName", this.sourceFile.getName());
        template.add("projectUrl", "http://google.de");

        writeToFile(template.render(), fileWithPackage("AbstractExportedTest.java"));
    }

    private void writeTestCase(TestCase export, int idx) throws MojoExecutionException {
        final ST template = getTemplate("/testCase.st");

        template.add("testName", export.getName());
        template.add("testClassName", escape(export.getName()));
        template.add("testCaseIndex", idx);

        final StringBuilder testMethodBuilder = new StringBuilder();

        for (int i = 0; i < export.getSteps().size(); i++) {
            testMethodBuilder.append(generateTestCaseMethod(export, i));
        }

        template.add("testCases", testMethodBuilder.toString());

        writeToFile(template.render(), fileWithPackage(escape(export.getName()) + ".java"));
    }

    private void writeTestSuiteConfiguration(TestSuite export) throws MojoExecutionException {
        final ST template = getTemplate("/testSuiteConfiguration.st");

        template.add("testSuiteName", export.getName());

        final List<String> testCaseNames = export.getTestCases()
                                                 .stream()
                                                 .map(TestCase::getName)
                                                 .map(TestSuiteGeneratorMojo::escape)
                                                 .collect(Collectors.toList());

        template.add("testCaseNames", testCaseNames);

        writeToFile(template.render(), new File(escape(export.getName()) + ".xml"));
    }

    private String generateTestCaseMethod(TestCase export, int idx) throws MojoExecutionException {
        final ST template = getTemplate("/testCaseMethod.st");

        final TestCaseStep step = export.getSteps().get(idx);
        final ParameterizedSymbol input = step.getPSymbol();
        final String output = step.getExpectedResult();

        template.add("testName", input.getSymbol().getName());
        template.add("output", output);
        template.add("testMethodMethod", escape(input.getSymbol().getName()));
        template.add("testMethodIndex", idx);

        if (idx > 0) {
            final String previousName = export.getSteps().get(idx - 1).getPSymbol().getSymbol().getName();
            template.add("previousTestMethodName", previousName);
        }

        return template.render();
    }

    private ST getTemplate(String templatePath) throws MojoExecutionException {
        try (InputStream is = TestSuiteGeneratorMojo.class.getResourceAsStream(templatePath)) {
            return new ST(IOUtils.toString(is, StandardCharsets.UTF_8));
        } catch (IOException e) {
            throw new MojoExecutionException("Could not read template", e);
        }
    }

    private File fileWithPackage(final String fileName) {
        return this.targetDirectory.toPath().resolve("de/learnlib/alex/plugin/generated").resolve(fileName).toFile();
    }

    private void writeToFile(final String content, final File dest) throws MojoExecutionException {
        try {
            FileUtils.write(dest, content, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new MojoExecutionException("Could not write file", e);
        }
    }

    private static String escape(String src) {
        return src.replaceAll("\\W", "_");
    }
}

