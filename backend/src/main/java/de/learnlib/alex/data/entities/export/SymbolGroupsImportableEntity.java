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

package de.learnlib.alex.data.entities.export;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;

public class SymbolGroupsImportableEntity extends SymbolGroupsExportableEntity {

    /**
     * Map symbol name -> resolutionStrategy
     */
    private Map<String, SymbolImportConflictResolutionStrategy> conflictResolutions;

    public SymbolGroupsImportableEntity() {
        this("0.0.0", null);
    }

    public SymbolGroupsImportableEntity(String version, JsonNode symbolGroups) {
        super(version, symbolGroups);
        this.conflictResolutions = new HashMap<>();
    }

    public Map<String, SymbolImportConflictResolutionStrategy> getConflictResolutions() {
        return conflictResolutions;
    }

    public void setConflictResolutions(Map<String, SymbolImportConflictResolutionStrategy> conflictResolutions) {
        this.conflictResolutions = conflictResolutions;
    }
}
