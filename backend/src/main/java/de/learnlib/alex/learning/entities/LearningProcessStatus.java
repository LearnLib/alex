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

import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.services.LearnerService;
import java.util.List;

public class LearningProcessStatus {
    private LearnerResult result;
    private LearnerService.LearnerPhase phase;
    private List<DefaultQueryProxy> currentQueries;
    private Long currentQueryCount = 0L;
    private Long currentSymbolCount = 0L;

    public LearnerResult getResult() {
        return result;
    }

    public void setResult(LearnerResult result) {
        this.result = result;
    }

    public LearnerService.LearnerPhase getPhase() {
        return phase;
    }

    public void setPhase(LearnerService.LearnerPhase phase) {
        this.phase = phase;
    }

    public List<DefaultQueryProxy> getCurrentQueries() {
        return currentQueries;
    }

    public void setCurrentQueries(List<DefaultQueryProxy> currentQueries) {
        this.currentQueries = currentQueries;
    }

    public Long getCurrentQueryCount() {
        return currentQueryCount;
    }

    public void setCurrentQueryCount(Long currentQueryCount) {
        this.currentQueryCount = currentQueryCount;
    }

    public Long getCurrentSymbolCount() {
        return currentSymbolCount;
    }

    public void setCurrentSymbolCount(Long currentSymbolCount) {
        this.currentSymbolCount = currentSymbolCount;
    }
}
