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

package de.learnlib.alex.modelchecking.entities.export;

import com.fasterxml.jackson.databind.JsonNode;
import de.learnlib.alex.data.entities.export.ExportableEntity;

public class LtsFormulaSuitesExportableEntity extends ExportableEntity {

    private JsonNode formulaSuites;

    public LtsFormulaSuitesExportableEntity(String version, JsonNode formulaSuites) {
        super(version, "formulaSuites");
        this.formulaSuites = formulaSuites;
    }

    public JsonNode getFormulaSuites() {
        return formulaSuites;
    }

    public void setFormulaSuites(JsonNode formulaSuites) {
        this.formulaSuites = formulaSuites;
    }

}
