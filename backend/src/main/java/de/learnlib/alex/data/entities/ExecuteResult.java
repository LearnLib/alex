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

package de.learnlib.alex.data.entities;

/** Enum to determine if a symbol has been executed successfully. */
public enum ExecuteResult {

    /** The symbol has been executed successfully. */
    OK(true),

    /** The execution of an action of the symbol failed during its execution. */
    FAILED(false);

    /** The default output on success. */
    public static final String DEFAULT_SUCCESS_OUTPUT = "Ok";

    /** The default output on error. */
    public static final String DEFAULT_ERROR_OUTPUT = "Failed";

    private boolean successful;

    /** The output. */
    private String output;

    ExecuteResult(boolean successful) {
        this.successful = successful;
    }

    public boolean isSuccessful() {
        return successful;
    }

    /** @return {@link #output}. */
    public String getOutput() {
        return output;
    }

    /** @param output {@link #output}. */
    public void setOutput(String output) {
        this.output = output;
    }

    @Override
    public String toString() {
        return output;
    }
}
