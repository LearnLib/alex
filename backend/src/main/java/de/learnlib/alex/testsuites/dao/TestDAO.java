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

package de.learnlib.alex.testsuites.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.testsuites.entities.Test;

import javax.validation.ValidationException;
import java.util.List;

public interface TestDAO {

    void create(User user, Test test) throws ValidationException, NotFoundException;

    void create(User user, List<Test> tests) throws ValidationException, NotFoundException;

    Test get(User user, Long projectId, Long id) throws NotFoundException;

    void update(User user, Test test) throws NotFoundException;

    void delete(User user, Long projectId, Long id) throws NotFoundException;

    void delete(User user, Long projectId, IdsList ids) throws NotFoundException;
}
