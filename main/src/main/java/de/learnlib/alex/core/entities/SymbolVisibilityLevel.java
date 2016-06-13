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
 * Enumeration used to filter the symbol list by a query parameter.
 */
public enum SymbolVisibilityLevel {

    /** Show all symbols. */
    ALL(new Boolean[] { true, false }),

    /** Show only visible ones. */
    VISIBLE(new Boolean[] { false }),

    /** Show only hidden ones. */
    HIDDEN(new Boolean[] { true });


    /** A criterion/ expression related to the entry. */
    private Boolean[] criterion;

    /**
     * Private constructor because it's an enum.
     *
     * @param criterion
     *         The criterion/ expression the entry represents.
     */
    SymbolVisibilityLevel(Boolean[] criterion) {
        this.criterion = criterion;
    }

    /**
     * Get the criterion/ expression which is represented by the enum entry.
     *
     * @return The criterion/ expression of the entry.
     */
    public Boolean[] getCriterion() {
        return criterion;
    }

    /**
     * Parse a string into an entry of this enum.
     * It is forbidden to override toValue(), so we use this method to allow the lowercase variants, too.
     *
     * @param name
     *         THe name to parse into an entry.
     * @return The fitting entry of this enum.
     * @throws IllegalArgumentException
     *         If the name could not be parsed.
     */
    public static SymbolVisibilityLevel fromString(String name) throws IllegalArgumentException {
        return SymbolVisibilityLevel.valueOf(name.toUpperCase());
    }

    @Override
    public String toString() {
        return name().toLowerCase();
    }

}
