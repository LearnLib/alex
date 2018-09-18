/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.integrationtests.resources;

import de.learnlib.alex.integrationtests.resources.api.SymbolParameterApi;
import org.junit.Before;
import org.junit.Test;

public class SymbolParameterResourceIT extends AbstractResourceIT {

    private SymbolParameterApi symbolParameterApi;

    @Before
    public void pre() {
        symbolParameterApi = new SymbolParameterApi(client, port);
    }

    @Test
    public void shouldCreateAPublicInputStringParameter() {
        // TODO
    }

    @Test
    public void shouldCreateAPrivateInputStringParameter() {
        // TODO
    }

    @Test
    public void shouldCreateAPublicInputCounterParameter() {
        // TODO
    }

    @Test
    public void shouldCreateAPrivateInputCounterParameter() {
        // TODO
    }

    @Test
    public void shouldCreateAnOutputStringParameter() {
        // TODO
    }

    @Test
    public void shouldCreateAnOutputCounterParameter() {
        // TODO
    }

    @Test
    public void shouldNotCreateInputParameterIfNameIsTaken() {
        // TODO
    }

    @Test
    public void shouldNotCreateOutputParameterIfNameIsTaken() {
        // TODO
    }

    @Test
    public void shouldUpdateInputParameter() {
        // TODO
    }

    @Test
    public void shouldUpdateOutputParameter() {
        // TODO
    }

    @Test
    public void shouldNotUpdateInputParameterIfNameIsTaken() {
        // TODO
    }

    @Test
    public void shouldNotUpdateOutputParameterIfNameIsTaken() {
        // TODO
    }

    @Test
    public void shouldDeleteInputParameter() {
        // TODO
    }

    @Test
    public void shouldDeleteOutputParameter() {
        // TODO
    }

    @Test
    public void shouldDeleteReferencesToParameterInTestsIfParameterIsDeleted() {
        // TODO
    }

    @Test
    public void shouldDeleteReferencesToParameterInLearnerResultsIfParameterIsDeleted() {
        // TODO
    }

    @Test
    public void shouldDeleteReferencesToParameterInSymbolStepsIfParameterIsDeleted() {
        // TODO
    }
}
