package de.learnlib.alex.integrationtests.resources.utils;

import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByJSONAttributeAction;
import de.learnlib.alex.data.entities.actions.rest.CallAction;
import de.learnlib.alex.data.entities.actions.rest.CheckStatusAction;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;

public class SymbolUtils {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final SymbolApi symbolApi;

    public SymbolUtils(SymbolApi symbolApi) {
        this.symbolApi = symbolApi;
    }

    public ParameterizedSymbol createResetSymbol(Project project, String jwt) throws Exception {
        final SetVariableAction action = new SetVariableAction();
        action.setValue("test");
        action.setName("var");

        final SymbolActionStep step = new SymbolActionStep();
        step.setAction(action);

        Symbol resetSymbol = new Symbol();
        resetSymbol.setProject(project);
        resetSymbol.setName("reset");
        resetSymbol.getSteps().add(step);

        resetSymbol = symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(resetSymbol), jwt)
                .readEntity(Symbol.class);

        final ParameterizedSymbol pResetSymbol = new ParameterizedSymbol();
        pResetSymbol.setSymbol(resetSymbol);

        return pResetSymbol;
    }

    public ParameterizedSymbol createAuthSymbol(Project project, String email, String password, String jwt) throws Exception {
        final CallAction a1 = new CallAction();
        a1.setUrl("/rest/users/login");
        a1.setBaseUrl("Base");
        a1.setMethod(CallAction.Method.POST);
        a1.setData("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}");

        final CheckStatusAction a0 = new CheckStatusAction();
        a0.setStatus(200);

        final SymbolActionStep step0 = new SymbolActionStep();
        step0.setAction(a0);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(a1);

        final SetVariableByJSONAttributeAction a2 = new SetVariableByJSONAttributeAction();
        a2.setName("jwt");
        a2.setValue("token");

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(a2);

        final SymbolOutputParameter output = new SymbolOutputParameter();
        output.setParameterType(SymbolParameter.ParameterType.STRING);
        output.setName("jwt");

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setName("auth");
        symbol.getSteps().add(step1);
        symbol.getSteps().add(step0);
        symbol.getSteps().add(step2);
        symbol.getOutputs().add(output);

        symbol = symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(symbol), jwt)
                .readEntity(Symbol.class);

        final ParameterizedSymbol pS1 = new ParameterizedSymbol();
        pS1.setSymbol(symbol);

        final SymbolOutputMapping som = new SymbolOutputMapping();
        som.setName("jwt");
        som.setParameter(symbol.getOutputs().get(0));
        pS1.getOutputMappings().add(som);

        return pS1;
    }

    public ParameterizedSymbol createGetProfileSymbol(Project project, String jwt) throws Exception {
        final HashMap<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer: {{$jwt}}");

        final CallAction a1 = new CallAction();
        a1.setUrl("/rest/users/myself");
        a1.setBaseUrl("Base");
        a1.setMethod(CallAction.Method.GET);
        a1.setHeaders(headers);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(a1);

        final CheckStatusAction a2 = new CheckStatusAction();
        a2.setStatus(200);

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(a2);

        final SymbolInputParameter input = new SymbolInputParameter();
        input.setParameterType(SymbolParameter.ParameterType.STRING);
        input.setName("jwt");

        Symbol s2 = new Symbol();
        s2.setProject(project);
        s2.setName("getProfile");
        s2.getSteps().add(step1);
        s2.getSteps().add(step2);
        s2.getInputs().add(input);

        s2 = symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(s2), jwt)
                .readEntity(Symbol.class);

        final SymbolParameterValue spv = new SymbolParameterValue();
        spv.setValue("{{$jwt}}");
        spv.setParameter(s2.getInputs().get(0));

        final ParameterizedSymbol pS2 = new ParameterizedSymbol();
        pS2.getParameterValues().add(spv);
        pS2.setSymbol(s2);

        return pS2;
    }
}
