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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

/**
 * The settings entity.
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class Settings implements Serializable {

    /** To be serialized. */
    private static final long serialVersionUID = -4417681626093036478L;

    /** The id of the settings object in the database. */
    @Id
    private Long id = 1L;

    /** The settings regarding available web drivers. */
    @Embedded
    @NotNull
    private DriverSettings driverSettings;

    /** If new users are allowed to create accounts. If false, only admins are allowed to create new users. */
    @NotNull
    private boolean allowUserRegistration;

    private String runtime;

    /** Constructor. */
    public Settings() {
        this.driverSettings = new DriverSettings();
        this.allowUserRegistration = true;
        this.runtime = "kubernetes";
    }

    /**
     * Get the driver settings.
     *
     * @return {@link DriverSettings}
     */
    @JsonProperty("driver")
    public DriverSettings getDriverSettings() {
        return driverSettings;
    }

    /**
     * Set the id.
     *
     * @param id
     *         {@link Settings#id}
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the id.
     *
     * @return {@link Settings#id}
     */
    public Long getId() {
        return id;
    }

    /**
     * Set the driver settings.
     *
     * @param driverSettings
     *         {@link DriverSettings}
     */
    @JsonProperty("driver")
    public void setDriverSettings(DriverSettings driverSettings) {
        this.driverSettings = driverSettings;
    }

    public boolean isAllowUserRegistration() {
        return allowUserRegistration;
    }

    public void setAllowUserRegistration(boolean allowUserRegistration) {
        this.allowUserRegistration = allowUserRegistration;
    }

    public String getRuntime() {
        return runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Settings)) {
            return false;
        }
        Settings settings = (Settings) o;
        return allowUserRegistration == settings.allowUserRegistration
                && Objects.equals(id, settings.id)
                && Objects.equals(runtime, settings.runtime)
                && Objects.equals(driverSettings, settings.driverSettings);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, driverSettings, runtime, allowUserRegistration);
    }
}
