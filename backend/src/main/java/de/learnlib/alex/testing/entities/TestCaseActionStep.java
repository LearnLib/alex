/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.testing.entities;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

/** Step that executes an action. */
@Entity
@JsonTypeName("action")
public class TestCaseActionStep extends TestCaseStep {

    private static final long serialVersionUID = 1302977205045005922L;

    /** The action to execute. */
    @OneToOne(
            fetch = FetchType.EAGER
    )
    @NotNull
    private SymbolAction action;

    @Override
    public ExecuteResult execute(ConnectorManager connectors) {

        // since the action in a test case step does not belong to a symbol
        // but it may be used during the execution, we create a dummy here
        // and assign it to the action in order to prevent NPEs
        final Symbol dummy = new Symbol();
        dummy.setName("dummy");
        dummy.setProject(getTestCase().getProject());
        dummy.getActions().add(action);
        action.setSymbol(dummy);

        return dummy.execute(connectors);
    }

    public SymbolAction getAction() {
        return action;
    }

    public void setAction(SymbolAction action) {
        this.action = action;
    }
}
