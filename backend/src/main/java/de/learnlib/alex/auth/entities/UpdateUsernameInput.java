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

package de.learnlib.alex.auth.entities;

import de.learnlib.alex.auth.rest.UserResource;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UpdateUsernameInput {

    @NotBlank(message = "The username must not be blank.")
    @Pattern(
            regexp = "^[a-zA-Z][a-zA-Z0-9]*$",
            message = "The username must start with a letter followed by letters or numbers."
    )
    @Size(
            min = 1,
            max = UserResource.MAX_USERNAME_LENGTH,
            message = "The username can only contain " + UserResource.MAX_USERNAME_LENGTH + " characters."
    )
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
