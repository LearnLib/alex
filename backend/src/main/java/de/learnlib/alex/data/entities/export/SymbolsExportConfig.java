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

package de.learnlib.alex.data.entities.export;

import java.util.ArrayList;
import java.util.List;

public class SymbolsExportConfig {

    /** The ids of the symbols to export. */
    private List<Long> symbolIds = new ArrayList<>();

    /** If true, symbols are exported in a flat array without their groups. */
    private boolean symbolsOnly;

    public boolean isSymbolsOnly() {
        return symbolsOnly;
    }

    public void setSymbolsOnly(boolean symbolsOnly) {
        this.symbolsOnly = symbolsOnly;
    }

    public List<Long> getSymbolIds() {
        return symbolIds;
    }

    public void setSymbolIds(List<Long> symbolIds) {
        this.symbolIds = symbolIds;
    }
}
