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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.SymbolOutputMappingRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

/**
 * The implementation of the {@link ParameterizedSymbolDAO}.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ParameterizedSymbolDAO {

    private SymbolRepository symbolRepository;
    private SymbolParameterValueRepository symbolParameterValueRepository;
    private ParameterizedSymbolRepository parameterizedSymbolRepository;
    private SymbolOutputMappingRepository symbolOutputMappingRepository;

    @Autowired
    public ParameterizedSymbolDAO(
            SymbolRepository symbolRepository,
            SymbolParameterValueRepository symbolParameterValueRepository,
            ParameterizedSymbolRepository parameterizedSymbolRepository,
            SymbolOutputMappingRepository symbolOutputMappingRepository) {
        this.symbolRepository = symbolRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolOutputMappingRepository = symbolOutputMappingRepository;
    }

    public ParameterizedSymbol create(ParameterizedSymbol pSymbol) {
        final Symbol symbol = symbolRepository.findById(pSymbol.getSymbol().getId()).orElse(null);
        pSymbol.setSymbol(symbol);
        pSymbol.setParameterValues(symbolParameterValueRepository.saveAll(pSymbol.getParameterValues()));

        if (pSymbol.getOutputMappings().size() != pSymbol.getSymbol().getOutputs().size()) {
            pSymbol.setOutputMappings(pSymbol.getSymbol().getOutputs().stream().map(out -> {
                final SymbolOutputMapping mapping = new SymbolOutputMapping();
                mapping.setParameter(out);
                mapping.setName(out.getName());
                return mapping;
            }).collect(Collectors.toList()));
        }

        pSymbol.setOutputMappings(symbolOutputMappingRepository.saveAll(pSymbol.getOutputMappings()));
        return parameterizedSymbolRepository.save(pSymbol);
    }

    public static void loadLazyRelations(ParameterizedSymbol pSymbol) {
        Hibernate.initialize(pSymbol.getParameterValues());
        Hibernate.initialize(pSymbol.getOutputMappings());
        SymbolDAO.loadLazyRelations(pSymbol.getSymbol());
    }
}
