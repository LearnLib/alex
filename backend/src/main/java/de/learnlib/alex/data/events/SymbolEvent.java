/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.data.events;

import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.webhooks.entities.Event;

import java.util.List;

import static de.learnlib.alex.webhooks.entities.EventType.SYMBOLS_CREATED;
import static de.learnlib.alex.webhooks.entities.EventType.SYMBOLS_DELETED;
import static de.learnlib.alex.webhooks.entities.EventType.SYMBOLS_UPDATED;
import static de.learnlib.alex.webhooks.entities.EventType.SYMBOL_CREATED;
import static de.learnlib.alex.webhooks.entities.EventType.SYMBOL_DELETED;
import static de.learnlib.alex.webhooks.entities.EventType.SYMBOL_UPDATED;

/** Symbol related events. */
public class SymbolEvent {

    /** Event for when a symbol is created. */
    public static class Created extends Event<Symbol> {

        /**
         * Constructor.
         *
         * @param symbol The created symbol.
         */
        public Created(Symbol symbol) {
            super(symbol, SYMBOL_CREATED);
        }
    }

    /** Event for when multiple symbols are created at once. */
    public static class CreatedMany extends Event<List<Symbol>> {

        /**
         * Constructor.
         *
         * @param symbols The created symbols.
         */
        public CreatedMany(List<Symbol> symbols) {
            super(symbols, SYMBOLS_CREATED);
        }
    }

    /** Event for when a symbol is updated. */
    public static class Updated extends Event<Symbol> {

        /**
         * Constructor.
         *
         * @param symbol The updated symbol.
         */
        public Updated(Symbol symbol) {
            super(symbol, SYMBOL_UPDATED);
        }
    }

    /** Event for when multiple symbols are updated at once. */
    public static class UpdatedMany extends Event<List<Symbol>> {

        /**
         * Constructor.
         *
         * @param symbols The updated symbols.
         */
        public UpdatedMany(List<Symbol> symbols) {
            super(symbols, SYMBOLS_UPDATED);
        }
    }

    public static class Deleted extends Event<Long> {
        public Deleted(Long id) {
            super(id, SYMBOL_DELETED);
        }
    }

    public static class DeletedMany extends Event<List<Long>> {
        public DeletedMany(List<Long> ids) {
            super(ids, SYMBOLS_DELETED);
        }
    }
}
