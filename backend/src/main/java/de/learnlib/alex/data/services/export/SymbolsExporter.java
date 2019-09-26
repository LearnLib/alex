/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.data.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.dao.SymbolGroupDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.entities.export.SymbolGroupsExportableEntity;
import de.learnlib.alex.data.entities.export.SymbolsExportConfig;
import de.learnlib.alex.data.entities.export.SymbolsExportableEntity;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SymbolsExporter extends EntityExporter {

    @Autowired
    private SymbolRepository symbolRepository;

    @Autowired
    private SymbolGroupRepository symbolGroupRepository;

    @Autowired
    private SymbolGroupDAO symbolGroupDAO;

    @Autowired
    private SymbolDAO symbolDAO;

    public SymbolsExporter() {
        super();

        om.addMixIn(SymbolGroup.class, IgnoreFieldsForSymbolGroupMixin.class);
        om.addMixIn(Symbol.class, IgnoreFieldsForSymbolMixin.class);
        om.addMixIn(SymbolParameter.class, IgnoreIdFieldMixin.class);
        om.addMixIn(SymbolStep.class, IgnoreFieldsForSymbolStepMixin.class);
        om.addMixIn(SymbolParameterValue.class, IgnoreIdFieldMixin.class);
        om.addMixIn(SymbolAction.class, IgnoreIdFieldMixin.class);
        om.addMixIn(ParameterizedSymbol.class, IgnoreIdFieldMixin.class);

        final SimpleModule module = new SimpleModule();
        module.addSerializer(new ParameterizedSymbolSerializer(om, ParameterizedSymbol.class));
        om.registerModule(module);
    }

    @Transactional
    public ExportableEntity export(User user, Long projectId, SymbolsExportConfig config) throws Exception {
        if (config.isSymbolsOnly()) {
            final List<Symbol> symbols = symbolRepository.findAllByProject_idAndIdIn(projectId, config.getSymbolIds());
            for (Symbol s: symbols) {
                symbolDAO.checkAccess(user, s.getProject(), s);
            }
            return new SymbolsExportableEntity(version, om.readTree(om.writeValueAsString(symbols)));
        } else {
            final List<SymbolGroup> groups = symbolGroupRepository.findAllByProject_IdAndParent_id(projectId, null);
            for (SymbolGroup g: groups) {
                symbolGroupDAO.checkAccess(user, g.getProject(), g);
            }
            final List<SymbolGroup> groupsToExport = getExportableGroups(groups, config);
            return new SymbolGroupsExportableEntity(version, om.readTree(om.writeValueAsString(groupsToExport)));
        }
    }

    @Transactional
    public ExportableEntity exportAll(User user, Long projectId) throws Exception {
        final List<SymbolGroup> groups = symbolGroupRepository.findAllByProject_IdAndParent_id(projectId, null);
        for (SymbolGroup g: groups) {
            symbolGroupDAO.checkAccess(user, g.getProject(), g);
        }
        return new SymbolGroupsExportableEntity(version, om.readTree(om.writeValueAsString(groups)));
    }

    private List<SymbolGroup> getExportableGroups(List<SymbolGroup> groups, SymbolsExportConfig config) {
        return groups.stream().filter(group -> {
            group.setSymbols(group.getSymbols().stream()
                    .filter(s -> config.getSymbolIds().contains(s.getId()))
                    .collect(Collectors.toSet()));
            group.setGroups(getExportableGroups(group.getGroups(), config));
            return !group.getSymbols().isEmpty() || !group.getGroups().isEmpty();
        }).collect(Collectors.toList());
    }

    public static class ParameterizedSymbolSerializer extends StdSerializer<ParameterizedSymbol> {

        private ObjectMapper om;

        public ParameterizedSymbolSerializer(ObjectMapper om, Class<ParameterizedSymbol> t) {
            super(t);
            this.om = om;
        }

        @Override
        public void serialize(ParameterizedSymbol ps, JsonGenerator jgen, SerializerProvider provider) throws IOException {
            final ObjectNode symbolNode = om.createObjectNode();
            symbolNode.put("name", ps.getSymbol().getName());

            jgen.writeStartObject();
            jgen.writeObjectField("parameterValues", ps.getParameterValues());
            jgen.writeObjectField("symbol", symbolNode);
            jgen.writeEndObject();
        }
    }

    private static abstract class IgnoreFieldsForSymbolGroupMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getProjectId();
        @JsonIgnore abstract Long getParentId();
    }

    private static abstract class IgnoreFieldsForSymbolMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getProjectId();
        @JsonIgnore abstract Long getGroupId();
        @JsonIgnore abstract boolean isHidden();
    }

    private static abstract class IgnoreFieldsForSymbolStepMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getPosition();
        @JsonIgnore abstract Long getSymbolId();
    }

}
