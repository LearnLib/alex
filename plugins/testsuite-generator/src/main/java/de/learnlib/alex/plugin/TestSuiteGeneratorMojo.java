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
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.testing.export.TestCaseExport;
import de.learnlib.alex.testing.export.TestSuiteExport;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
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

        final TestSuiteExport export;

        try {
            export = mapper.readValue(sourceFile, TestSuiteExport.class);
        } catch (IOException e) {
            throw new MojoExecutionException("Error reading export file", e);
        }

        final List<TestCaseExport> testCases = export.getTestCases();

        writeAbstractSuperClass(export);

        for (int i = 0; i < testCases.size(); i++) {
            final TestCaseExport testCase = testCases.get(i);
            writeTestCase(testCase, i);
        }

        writeTestSuiteConfiguration(export);
    }

    private void writeAbstractSuperClass(TestSuiteExport export) throws MojoExecutionException {
        final ST template = getTemplate("/abstractTest.st");

        template.add("driverPath", this.driverPath);
        template.add("exportFileName", this.sourceFile.getName());
        template.add("projectUrl", export.getProjectURL());

        writeToFile(template.render(), fileWithPackage("AbstractExportedTest.java"));
    }

    private void writeTestCase(TestCaseExport export, int idx) throws MojoExecutionException {
        final ST template = getTemplate("/testCase.st");

        template.add("testName", export.getName());
        template.add("testClassName", escape(export.getName()));
        template.add("testCaseIndex", idx);

        final StringBuilder testMethodBuilder = new StringBuilder();

        for (int i = 0; i < export.getSymbols().size(); i++) {
            testMethodBuilder.append(generateTestCaseMethod(export, 0));
        }

        template.add("testCases", testMethodBuilder.toString());

        writeToFile(template.render(), fileWithPackage(escape(export.getName()) + ".java"));
    }

    private void writeTestSuiteConfiguration(TestSuiteExport export) throws MojoExecutionException {
        final ST template = getTemplate("/testSuiteConfiguration.st");

        template.add("testSuiteName", export.getName());

        final List<String> testCaseNames = export.getTestCases()
                                                 .stream()
                                                 .map(TestCaseExport::getName)
                                                 .map(TestSuiteGeneratorMojo::escape)
                                                 .collect(Collectors.toList());

        template.add("testCaseNames", testCaseNames);

        writeToFile(template.render(), new File(escape(export.getName()) + ".xml"));
    }

    private String generateTestCaseMethod(TestCaseExport export, int idx) throws MojoExecutionException {
        final ST template = getTemplate("/testCaseMethod.st");

        final ParameterizedSymbol input = export.getSymbols().get(idx);
        final String output = export.getOutputs().get(idx);

        template.add("testName", input.getSymbol().getName());
        template.add("output", output);
        template.add("testMethodMethod", escape(input.getSymbol().getName()));
        template.add("testMethodIndex", idx);

        if (idx > 0) {
            template.add("previousTestMethodName", escape(export.getSymbols().get(idx - 1).getSymbol().getName()));
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
        return this.targetDirectory.toPath().resolve("/de/learnlib/alex/plugin/generated").resolve(fileName).toFile();
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

