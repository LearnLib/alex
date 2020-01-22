/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.modelchecking.events;

import de.learnlib.alex.modelchecking.entities.LtsCheckingResult;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.EventType;

import java.util.List;

/** Events for model checking. */
public class ModelCheckerEvent {

    public static class Created extends Event<LtsFormula> {
        public Created(LtsFormula formula) {
            super(formula, EventType.LTS_FORMULA_CREATED);
        }
    }

    public static class Updated extends Event<LtsFormula> {
        public Updated(LtsFormula formula) {
            super(formula, EventType.LTS_FORMULA_UPDATED);
        }
    }

    public static class Deleted extends Event<Long> {
        public Deleted(Long id) {
            super(id, EventType.LTS_FORMULA_DELETED);
        }
    }

    public static class DeletedMany extends Event<List<Long>> {
        public DeletedMany(List<Long> ids) {
            super(ids, EventType.LTS_FORMULAS_DELETED);
        }
    }

    public static class CheckedMany extends Event<List<LtsCheckingResult>> {
        public CheckedMany(List<LtsCheckingResult> results) {
            super(results, EventType.LTS_FORMULAS_CHECKED);
        }
    }
}
