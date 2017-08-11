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

package de.learnlib.alex.utils;

import java.util.LinkedList;

/**
 * Helper class to allow batch paths to have a csv-list of Strings.
 */
public class StringList extends LinkedList<String> {

    /**
     * Constructor
     * This is needed for Jersey, so that an StringList can be used as PathParameter.
     *
     * @param value
     *         The strings as comma separated list.
     */
    public StringList(String value) {
        String[] parts = value.split(",");
        if (parts.length == 0) {
            throw new IllegalArgumentException("No parts found!");
        }

        for (String s : parts) {
            add(s);
        }
    }

}
