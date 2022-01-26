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

package de.learnlib.alex.data.entities.actions;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.persistence.Embeddable;

/**
 * Helper class to store and transfer authentication credentials, i.e. user name / email and password.
 */
@Embeddable
public class Credentials implements Serializable {

    private static final long serialVersionUID = 4146724090787542690L;

    /** The name to use for authentication. */
    private String name;

    /** The password to use for authentication. */
    private String password;

    /**
     * Default constructor.
     */
    public Credentials() {
        this("", "");
    }

    /**
     * Create a credential with a user and password.
     *
     * @param name
     *         The name to use.
     * @param password
     *         The password to use.
     */
    public Credentials(String name, String password) {
        this.name = name;
        this.password = password;
    }

    /**
     * Return the name and password encoded in Base64 to be used in for HTTP Basic Authentication.
     *
     * @return "name:password" encoded in Base64.
     */
    public String toBase64() {
        var credentialsAsString = name + ":" + password;
        var credentialsAsByteArray = credentialsAsString.getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(credentialsAsByteArray);
    }

    /**
     * Check if the credentials are not empty.
     *
     * @return If the credentials are valid.
     */
    public boolean areValid() {
        return !name.trim().equals("") && !password.trim().equals("");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
