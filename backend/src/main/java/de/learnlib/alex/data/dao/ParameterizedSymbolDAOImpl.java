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
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

/**
 * The implementation of the {@link ParameterizedSymbolDAO}.
 */
@Service
public class ParameterizedSymbolDAOImpl implements ParameterizedSymbolDAO {

    /** The repository for symbols. */
    private SymbolRepository symbolRepository;

    /** The repository for symbol parameter values. */
    private SymbolParameterValueRepository symbolParameterValueRepository;

    /** The repository for parameterized symbols. */
    private ParameterizedSymbolRepository parameterizedSymbolRepository;

    /**
     * Constructor.
     *
     * @param symbolRepository
     *         {@link #symbolRepository}.
     * @param symbolParameterValueRepository
     *         {@link #symbolParameterValueRepository}.
     * @param parameterizedSymbolRepository
     *         {@link #parameterizedSymbolRepository}.
     */
    @Inject
    public ParameterizedSymbolDAOImpl(
            SymbolRepository symbolRepository,
            SymbolParameterValueRepository symbolParameterValueRepository,
            ParameterizedSymbolRepository parameterizedSymbolRepository) {
        this.symbolRepository = symbolRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
    }

    @Override
    @Transactional
    public ParameterizedSymbol create(ParameterizedSymbol pSymbol) {
        final Symbol symbol = symbolRepository.findById(pSymbol.getSymbol().getId()).orElse(null);
        pSymbol.setSymbol(symbol);

        pSymbol.setParameterValues(symbolParameterValueRepository.saveAll(pSymbol.getParameterValues()));
        return parameterizedSymbolRepository.save(pSymbol);
    }

    /**
     * Load lazy relations.
     *
     * @param pSymbol
     *         The parameterized symbol.
     */
    public static void loadLazyRelations(ParameterizedSymbol pSymbol) {
        Hibernate.initialize(pSymbol.getParameterValues());
        SymbolDAOImpl.loadLazyRelations(pSymbol.getSymbol());
    }
}
