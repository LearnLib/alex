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

package de.learnlib.alex.data.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.entities.actions.misc.IncrementCounterAction;
import de.learnlib.alex.data.entities.actions.misc.SetCounterAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import java.util.ArrayList;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SymbolParameterTest {

    private static final Long PROJECT_ID = 1L;

    private static final String VARIABLE_NAME = "v1";
    private static final String VARIABLE_VALUE_PRE = "test";
    private static final String VARIABLE_VALUE_POST = "test2";

    private static final String COUNTER_NAME = "c1";
    private static final Integer COUNTER_VALUE_PRE = 5;
    private static final Integer COUNTER_VALUE_POST = 7;

    private ParameterizedSymbol symbol;
    private ParameterizedSymbol reset;

    private ConnectorManager connectors;

    @BeforeEach
    public void setUp() {
        symbol = new ParameterizedSymbol();
        final Symbol s = new Symbol();
        s.setProject(new Project(PROJECT_ID));
        symbol.setSymbol(s);

        setUpReset();

        connectors = new ConnectorManager(new ProjectEnvironment());
        CounterStoreConnector counterStore = new CounterStoreConnector(mock(CounterDAO.class), mock(User.class), mock(Project.class), new ArrayList<>());
        VariableStoreConnector variableStore = new VariableStoreConnector();

        connectors.addConnector(counterStore);
        connectors.addConnector(variableStore);
    }

    private void setUpReset() {
        reset = new ParameterizedSymbol();
        final Symbol r = new Symbol();
        r.setProject(new Project(PROJECT_ID));
        reset.setSymbol(r);

        SetVariableAction a1 = new SetVariableAction();
        a1.setSymbol(r);
        a1.setName(VARIABLE_NAME);
        a1.setValue(VARIABLE_VALUE_PRE);
        r.getSteps().add(new SymbolActionStep(a1));

        SetCounterAction a2 = new SetCounterAction();
        a2.setSymbol(r);
        a2.setName(COUNTER_NAME);
        a2.setValueType(SetCounterAction.ValueType.NUMBER);
        a2.setValue(String.valueOf(COUNTER_VALUE_PRE));
        r.getSteps().add(new SymbolActionStep(a2));

        SymbolOutputParameter out1 = new SymbolOutputParameter();
        out1.setSymbol(r);
        out1.setName(VARIABLE_NAME);
        out1.setParameterType(SymbolParameter.ParameterType.STRING);
        r.getOutputs().add(out1);

        SymbolOutputParameter out2 = new SymbolOutputParameter();
        out2.setSymbol(r);
        out2.setName(COUNTER_NAME);
        out2.setParameterType(SymbolParameter.ParameterType.COUNTER);
        r.getOutputs().add(out2);
    }

    @Test
    public void shouldNotModifyTheGlobalCounterStoreIfNoOutputIsDefined() {
        SymbolInputParameter inParam = new SymbolInputParameter();
        inParam.setName(COUNTER_NAME);
        inParam.setParameterType(SymbolParameter.ParameterType.COUNTER);
        symbol.getSymbol().getInputs().add(inParam);

        IncrementCounterAction action = new IncrementCounterAction();
        action.setIncrementBy(2);
        action.setName(COUNTER_NAME);
        action.setSymbol(symbol.getSymbol());
        symbol.getSymbol().getSteps().add(new SymbolActionStep(action));

        reset.execute(connectors);
        symbol.execute(connectors);

        assertEquals(connectors.getConnector(CounterStoreConnector.class).get(COUNTER_NAME), COUNTER_VALUE_PRE);
    }

    @Test
    public void shouldModifyTheGlobalCounterStoreIfOutputIsDefined() {
        SymbolInputParameter inParam = new SymbolInputParameter();
        inParam.setName(COUNTER_NAME);
        inParam.setParameterType(SymbolParameter.ParameterType.COUNTER);
        symbol.getSymbol().getInputs().add(inParam);

        IncrementCounterAction action = new IncrementCounterAction();
        action.setIncrementBy(2);
        action.setName(COUNTER_NAME);
        action.setSymbol(symbol.getSymbol());
        symbol.getSymbol().getSteps().add(new SymbolActionStep(action));

        SymbolOutputParameter outParam = new SymbolOutputParameter();
        outParam.setName(COUNTER_NAME);
        outParam.setParameterType(SymbolParameter.ParameterType.COUNTER);
        symbol.getSymbol().getOutputs().add(outParam);

        reset.execute(connectors);
        symbol.execute(connectors);

        assertEquals(connectors.getConnector(CounterStoreConnector.class).get(COUNTER_NAME), COUNTER_VALUE_POST);
    }

    @Test
    public void shouldNotModifyTheGlobalVariableStoreIfNoOutputIsDefined() {
        SymbolInputParameter inParam = new SymbolInputParameter();
        inParam.setName(VARIABLE_NAME);
        inParam.setParameterType(SymbolParameter.ParameterType.STRING);
        symbol.getSymbol().getInputs().add(inParam);

        SetVariableAction action = new SetVariableAction();
        action.setSymbol(symbol.getSymbol());
        action.setName(VARIABLE_NAME);
        action.setValue(VARIABLE_VALUE_POST);
        symbol.getSymbol().getSteps().add(new SymbolActionStep(action));

        reset.execute(connectors);
        symbol.execute(connectors);

        assertEquals(connectors.getConnector(VariableStoreConnector.class).get(VARIABLE_NAME), VARIABLE_VALUE_PRE);
    }

    @Test
    public void shouldModifyTheGlobalVariableStoreIfOutputIsDefined() {
        SymbolInputParameter inParam = new SymbolInputParameter();
        inParam.setName(VARIABLE_NAME);
        inParam.setParameterType(SymbolParameter.ParameterType.STRING);
        symbol.getSymbol().getInputs().add(inParam);

        SymbolOutputParameter outParam = new SymbolOutputParameter();
        outParam.setName(VARIABLE_NAME);
        outParam.setParameterType(SymbolParameter.ParameterType.STRING);
        symbol.getSymbol().getOutputs().add(outParam);

        SetVariableAction action = new SetVariableAction();
        action.setSymbol(symbol.getSymbol());
        action.setName(VARIABLE_NAME);
        action.setValue(VARIABLE_VALUE_POST);
        symbol.getSymbol().getSteps().add(new SymbolActionStep(action));

        reset.execute(connectors);
        symbol.execute(connectors);

        assertEquals(connectors.getConnector(VariableStoreConnector.class).get(VARIABLE_NAME), VARIABLE_VALUE_POST);
    }

    @Test
    public void shouldFailIfUndefinedCounterIsSpecifiedAsInput() {
        SymbolInputParameter inParam = new SymbolInputParameter();
        inParam.setName("undefined");
        inParam.setParameterType(SymbolParameter.ParameterType.COUNTER);
        symbol.getSymbol().getInputs().add(inParam);

        reset.execute(connectors);
        ExecuteResult result = symbol.execute(connectors);

        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldFailIfUndefinedVariableIsSpecifiedAsInput() {
        SymbolInputParameter inParam = new SymbolInputParameter();
        inParam.setName("undefined");
        inParam.setParameterType(SymbolParameter.ParameterType.STRING);
        symbol.getSymbol().getInputs().add(inParam);

        reset.execute(connectors);
        ExecuteResult result = symbol.execute(connectors);

        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldFailIfUndefinedCounterIsSpecifiedAsOutput() {
        SymbolOutputParameter outParam = new SymbolOutputParameter();
        outParam.setName("undefined");
        outParam.setParameterType(SymbolParameter.ParameterType.COUNTER);
        symbol.getSymbol().getOutputs().add(outParam);

        reset.execute(connectors);
        ExecuteResult result = symbol.execute(connectors);

        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldFailIfUndefinedVariableIsSpecifiedAsOutput() {
        SymbolOutputParameter outParam = new SymbolOutputParameter();
        outParam.setName("undefined");
        outParam.setParameterType(SymbolParameter.ParameterType.STRING);
        symbol.getSymbol().getOutputs().add(outParam);

        reset.execute(connectors);
        ExecuteResult result = symbol.execute(connectors);

        assertFalse(result.isSuccess());
    }
}
