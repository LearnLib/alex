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

package de.learnlib.alex.data.entities;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class ExecuteResultTest {

    @Test
    public void shouldGetTheDefaultSuccessOutput() {
        assertEquals("Ok", new ExecuteResult().getOutput());
        assertEquals("Ok", new ExecuteResult(true).getOutput());
    }

    @Test
    public void shouldGetTheCorrectSuccessOutputWithMessage() {
        assertEquals("Ok (works)", new ExecuteResult(true, "works").getOutput());
    }

    @Test
    public void shouldGetTheDefaultFailureOutput() {
        assertEquals("Failed", new ExecuteResult(false).getOutput());
    }

    @Test
    public void shouldGetTheCorrectFailureOutputWithMessage() {
        assertEquals("Failed (does not work)", new ExecuteResult(false, "does not work").getOutput());
    }

    @Test
    public void shouldGetTheCorrectOutputAfterSuccessNegation() {
        final ExecuteResult r1 = new ExecuteResult(true);
        r1.negate();
        assertEquals("Failed", r1.getOutput());

        final ExecuteResult r2 = new ExecuteResult(true, "works");
        r2.negate();
        assertEquals("Failed (works)", r2.getOutput());
    }

    @Test
    public void shouldGetTheCorrectOutputAfterFailureNegation() {
        final ExecuteResult r1 = new ExecuteResult(false);
        r1.negate();
        assertEquals("Ok", r1.getOutput());

        final ExecuteResult r2 = new ExecuteResult(false, "does not work");
        r2.negate();
        assertEquals("Ok (does not work)", r2.getOutput());
    }
}
