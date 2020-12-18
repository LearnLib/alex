/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.modelchecking.dao;

import de.learnlib.alex.modelchecking.entities.ModelCheckingResult;
import de.learnlib.alex.modelchecking.repositories.ModelCheckingResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class ModelCheckingResultDAO {

    private final ModelCheckingResultRepository modelCheckingResultRepository;

    @Autowired
    public ModelCheckingResultDAO(ModelCheckingResultRepository modelCheckingResultRepository) {
        this.modelCheckingResultRepository = modelCheckingResultRepository;
    }

    public ModelCheckingResult create(ModelCheckingResult result) {
        return modelCheckingResultRepository.save(result);
    }

    public List<ModelCheckingResult> create(List<ModelCheckingResult> results) {
        return modelCheckingResultRepository.saveAll(results);
    }
}
