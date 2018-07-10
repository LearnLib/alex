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

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;

/** Class to determine if a symbol has been executed successfully. */
@Entity
public class ExecuteResult implements Serializable {

    private static final long serialVersionUID = -4296479981133118914L;

    /** The default output on success. */
    public static final String DEFAULT_SUCCESS_OUTPUT = "Ok";

    /** The default output on error. */
    public static final String DEFAULT_ERROR_OUTPUT = "Failed";

    /** The id of the execute result in the db. */
    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

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
     * @param success
     *         {@link #success}.
     */
    public ExecuteResult(boolean success) {
        this(success, null);
    }

    /**
     * Constructor.
     *
     * @param success
     *         {@link #success}.
     * @param output
     *         {@link #output}.
     */
    public ExecuteResult(boolean success, String output) {
        this.success = success;

        if (success) {
            if (output == null) {
                setOutput(DEFAULT_SUCCESS_OUTPUT);
            } else {
                setSuccessOutput(output);
            }
        } else {
            if (output == null) {
                setOutput(DEFAULT_ERROR_OUTPUT);
            } else {
                setErrorOutput(output);
            }
        }
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

    public void setSuccessOutput(String output) {
        this.output = DEFAULT_SUCCESS_OUTPUT + " (" + output + ")";
    }

    public void setErrorOutput(String output) {
        this.output = DEFAULT_ERROR_OUTPUT + " (" + output + ")";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
