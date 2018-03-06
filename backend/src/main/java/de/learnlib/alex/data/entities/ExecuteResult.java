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

package de.learnlib.alex.data.entities;

/** Class to determine if a symbol has been executed successfully. */
public class ExecuteResult {

    /** The default output on success. */
    public static final String DEFAULT_SUCCESS_OUTPUT = "Ok";

    /** The default output on error. */
    public static final String DEFAULT_ERROR_OUTPUT = "Failed";

    /** If the symbol has been execute successfully. */
    private boolean success;

    /** The output of the SUL. */
    private String output;

    /** Constructor. */
    public ExecuteResult() {
        this(true);
    }

    /**
     * Constructor.
     *
     * @param success {@link #success}.
     */
    public ExecuteResult(boolean success) {
        this(success, null);
    }

    /**
     * Constructor.
     *
     * @param success {@link #success}.
     * @param output  {@link #output}.
     */
    public ExecuteResult(boolean success, String output) {
        this.success = success;
        this.output = output == null ? success ? DEFAULT_SUCCESS_OUTPUT : DEFAULT_ERROR_OUTPUT : output;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

}
