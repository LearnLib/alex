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

package de.learnlib.alex.data.utils;

import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolParameter;
import java.util.ArrayList;
import java.util.List;
import javax.validation.ValidationException;

public class SymbolOutputMappingUtils {

    private SymbolOutputMappingUtils() {
    }

    public static void checkIfMappedNamesAreUnique(List<SymbolOutputMapping> outputMappings) throws ValidationException {
        final List<String> stringNames = new ArrayList<>();
        final List<String> counterNames = new ArrayList<>();

        for (SymbolOutputMapping om : outputMappings) {
            final String name = om.getName();
            if (om.getParameter().getParameterType().equals(SymbolParameter.ParameterType.STRING)) {
                if (counterNames.contains(name)) {
                    throw new ValidationException("Names in the data context are not unique: " + name);
                } else {
                    stringNames.add(name);
                }
            } else {
                if (stringNames.contains(name)) {
                    throw new ValidationException("Names in the data context are not unique: " + name);
                } else {
                    counterNames.add(name);
                }
            }
        }
    }
}
