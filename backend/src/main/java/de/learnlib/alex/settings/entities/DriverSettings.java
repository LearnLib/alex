/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.settings.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Embeddable;

/**
 * The entity for web driver settings.
 */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class DriverSettings implements Serializable {

    /** To be serialized. */
    private static final long serialVersionUID = -4199641230344018378L;

    /** The URL path to the Remote Selenium Server. */
    private String remote;

    /** Constructor. */
    public DriverSettings() {
    }

    public String getRemote() {
        return remote == null ? "" : remote;
    }

    public void setRemote(String remote) {
        this.remote = remote;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DriverSettings)) {
            return false;
        }
        DriverSettings that = (DriverSettings) o;
        return Objects.equals(remote, that.remote);
    }

    @Override
    public int hashCode() {
        return Objects.hash(remote);
    }
}
