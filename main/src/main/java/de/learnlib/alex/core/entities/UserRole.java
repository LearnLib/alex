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

package de.learnlib.alex.core.entities;

/**
 * Enumeration for User roles.
 */
public enum UserRole {

    /**
     * User is default registered user.
     */
    REGISTERED,

    /**
     * User is administrator with higher privileges.
     */
    ADMIN
//
//    /**
//     * Parse a string into an entry of this enum.
//     *
//     * @param name The name to parse into an entry.
//     * @return The fitting entry of this enum.
//     * @throws IllegalArgumentException If the name could not be parsed
//     */
//    public static UserRole fromString(String name) throws IllegalArgumentException {
//        return UserRole.valueOf(name.toUpperCase());
//    }
//
//    /**
//     * Transform uppercase enum entry to lowercase
//     *
//     * @return An enum entry in lowercase
//     */
//    @Override
//    public String toString() {
//        return name().toLowerCase();
//    }
}
