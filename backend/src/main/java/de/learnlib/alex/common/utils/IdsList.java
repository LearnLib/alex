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

package de.learnlib.alex.common.utils;

import java.util.LinkedList;

/**
 * Helper class to allow batch paths to have a csv-list of IDs.
 */
public class IdsList extends LinkedList<Long> {

    /**
     * Constructor
     * This is needed for Jersey, so that an IdList can be used as PathParameter.
     *
     * @param value
     *         The ids as comma separated list.
     */
    public IdsList(String value) {
        if (value == null || value.trim().equals("")) {
            throw new IllegalArgumentException("You cannot pass null or an empty string.");
        }

        final String[] parts = value.split(",");
        if (parts.length == 0) {
            throw new IllegalArgumentException("There are no values specified.");
        }

        for (String number : parts) {
            add(Long.valueOf(number));
        }
    }

}
