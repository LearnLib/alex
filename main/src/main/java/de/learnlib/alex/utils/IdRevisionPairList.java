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

import de.learnlib.alex.core.entities.IdRevisionPair;

import java.util.LinkedList;

/**
 * Helper class to allow batch get of symbols by id/revision pairs.
 */
public class IdRevisionPairList extends LinkedList<IdRevisionPair> {

    /**
     * Constructor
     * This is needed for Jersey, so that an IdRevisionPairList can be used as PathParameter.
     *
     * @param value
     *         The id/revision pairs as comma separated list
     *         id_1:rev_1,...,id_n:rev_n
     */
    public IdRevisionPairList(String value) {
        String[] parts = value.split(",");
        if (parts.length == 0) {
            throw new IllegalArgumentException("No id/revision pair found!");
        }

        for (String part : parts) {
            String[] idRevision = part.split(":");
            if (idRevision.length != 2) {
                throw new IllegalArgumentException("Wrong format used for id/revision pairs");
            }
            add(new IdRevisionPair(
                    Long.parseLong(idRevision[0]),
                    Long.parseLong(idRevision[1])));
        }
    }
}
