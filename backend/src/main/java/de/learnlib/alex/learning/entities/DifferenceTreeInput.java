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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;

import javax.validation.constraints.NotNull;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "automata", value = DifferenceTreeInput.AutomataInput.class),
        @JsonSubTypes.Type(name = "learnerResults", value = DifferenceTreeInput.LearnerResultInput.class),
})
public abstract class DifferenceTreeInput {

    @NotNull
    public DifferenceTreeStrategy strategy;

    @JsonTypeName("automata")
    public static class AutomataInput extends DifferenceTreeInput {

        @NotNull
        public CompactMealyMachineProxy automaton1;

        @NotNull
        public CompactMealyMachineProxy automaton2;
    }

    @JsonTypeName("learnerResults")
    public static class LearnerResultInput extends DifferenceTreeInput {

        @NotNull
        public Long result1;

        @NotNull
        public Integer step1;

        @NotNull
        public Long result2;

        @NotNull
        public Integer step2;
    }
}
