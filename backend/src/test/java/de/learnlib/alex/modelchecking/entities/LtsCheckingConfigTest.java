/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.modelchecking.entities;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Arrays;
import java.util.Collections;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class LtsCheckingConfigTest {

    private LtsCheckingConfig config;

    @BeforeEach
    public void before() {
        config = new LtsCheckingConfig();

        final LtsFormula f1 = new LtsFormula();
        f1.setFormula("true");
        final LtsFormula f2 = new LtsFormula();
        f2.setFormula("true");

        config.setFormulas(Arrays.asList(f1, f2));
        config.setLearnerResultId(1L);
        config.setStepNo(1);
    }

    @Test
    public void shouldThrowExceptionIfResultIdIsNull() {
        config.setLearnerResultId(null);
        assertThrows(ValidationException.class, () -> config.validate());
    }

    @Test
    public void shouldThrowExceptionIfResultIdIsLessThanZero() {
        config.setLearnerResultId(-1L);
        assertThrows(ValidationException.class, () -> config.validate());
    }

    @Test
    public void shouldThrowExceptionIfStepNoIsNull() {
        config.setStepNo(null);
        assertThrows(ValidationException.class, () -> config.validate());
    }

    @Test
    public void shouldThrowExceptionIfStepNoIsLessThanOne() {
        config.setStepNo(0);
        assertThrows(ValidationException.class, () -> config.validate());
    }

    @Test
    public void shouldThrowExceptionIsFormulasAreEmpty() {
        config.setFormulas(Collections.emptyList());
        assertThrows(ValidationException.class, () -> config.validate());
    }

    @Test
    public void shouldThrowExceptionIfMinUnfoldsIsLessThanZero() {
        config.setMinUnfolds(-1);
        assertThrows(ValidationException.class, () -> config.validate());
    }

    @Test
    public void shouldThrowExceptionIfMultiplierIsLessThanZero() {
        config.setMultiplier(-1.0);
        assertThrows(ValidationException.class, () -> config.validate());
    }
}
