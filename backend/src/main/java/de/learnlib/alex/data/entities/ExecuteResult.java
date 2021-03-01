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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.testing.entities.TestScreenshot;
import java.io.Serializable;
import java.util.StringJoiner;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    /** If the symbol has been execute successfully. */
    private boolean success;

    /** The output of the SUL. */
    private String message;

    @Column(columnDefinition = "TEXT")
    private String trace;

    /** The time in ms it took to execute the step. */
    private Long time;

    @OneToOne(
            cascade = {CascadeType.ALL}
    )
    private TestScreenshot testScreenshot;

    /** Constructor. */
    public ExecuteResult() {
        this(true);
    }

    public ExecuteResult(boolean success) {
        this(success, null);
    }

    public ExecuteResult(boolean success, String message) {
        this(success, message, 0L);
    }

    public ExecuteResult(boolean success, String message, Long time) {
        this(success, message, "", time, null);
    }

    public ExecuteResult(boolean success, String message, String trace, Long time, TestScreenshot testScreenshot) {
        this.success = success;
        this.message = message;
        this.time = time;
        this.trace = trace;
        this.testScreenshot = testScreenshot;
    }

    public void addTrace(Symbol symbol, ExecuteResult result) {
        if (!trace.equals("")) {
            trace = " > " + trace;
        }
        trace = "[" + symbol.getName() + " / " + result.getOutput() + "]" + trace;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Transient
    @JsonProperty("output")
    public String getOutput() {
        if (success) {
            return DEFAULT_SUCCESS_OUTPUT + (message == null ? "" : " (" + message + ")");
        } else {
            return DEFAULT_ERROR_OUTPUT + (message == null ? "" : " (" + message + ")");
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getTrace() {
        return trace;
    }

    public void setTrace(String trace) {
        this.trace = trace;
    }

    /** Negate the result. */
    public void negate() {
        this.success = !this.success;
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", this.getClass().getSimpleName() + "[", "]")
                .add("success = " + success)
                .add("output = " + getOutput())
                .toString();
    }

    public TestScreenshot getTestScreenshot() {
        return testScreenshot;
    }

    public void setTestScreenshot(TestScreenshot testScreenshot) {
        this.testScreenshot = testScreenshot;
    }
}
