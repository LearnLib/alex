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

package de.learnlib.alex.modelchecking.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.services.export.EntityExporter;
import de.learnlib.alex.modelchecking.dao.LtsFormulaSuiteDAO;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.entities.export.LtsFormulaSuitesExportableEntity;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LtsFormulaSuitesExporter extends EntityExporter {

    @Autowired
    private LtsFormulaSuiteDAO ltsFormulaSuiteDAO;

    public LtsFormulaSuitesExporter() {
        om.addMixIn(LtsFormulaSuite.class, IgnoreFieldsForLtsFormulaSuiteMixin.class);
        om.addMixIn(LtsFormula.class, IgnoreFieldsForLtsFormulaMixin.class);
    }

    public ExportableEntity export(User user, Long projectId) throws Exception {
        final List<LtsFormulaSuite> suites = ltsFormulaSuiteDAO.getAll(user, projectId);
        return new LtsFormulaSuitesExportableEntity(
                version,
                om.readTree(om.writeValueAsString(suites))
        );
    }

    public abstract static class IgnoreFieldsForLtsFormulaSuiteMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getProjectId();
    }

    public abstract static class IgnoreFieldsForLtsFormulaMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getSuiteId();
    }

}
