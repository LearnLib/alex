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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolParameter;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * The DAO for symbol parameters.
 */
public interface SymbolParameterDAO {

    /**
     * Creates a new symbol parameter.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameter
     *         The parameter to create.
     * @return The created parameter.
     * @throws NotFoundException
     *         If the project or the symbol could not be found.
     * @throws UnauthorizedException
     *         If the user has no access to one of the resources.
     * @throws ValidationException
     *         If the parameter is not valid.
     */
    SymbolParameter create(User user, Long projectId, Long symbolId, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException, ValidationException;

    /**
     * Creates multiple symbol parameters at once.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameters
     *         The parameters to create.
     * @return The created parameters.
     * @throws NotFoundException
     *         If the project could not be found.
     * @throws UnauthorizedException
     *         If the user no access to one of the resources.
     * @throws ValidationException
     *         If one of the parameters is not valid.
     */
    List<SymbolParameter> create(User user, Long projectId, Long symbolId, List<SymbolParameter> parameters)
            throws NotFoundException, UnauthorizedException, ValidationException;

    /**
     * Updates an existing symbol parameter.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameter
     *         The parameter to update.
     * @return The updated parameter.
     * @throws NotFoundException
     *         If the project or the symbol could not be found.
     * @throws UnauthorizedException
     *         If the user has no access to one of the resources.
     * @throws ValidationException
     *         If the parameter is not valid.
     */
    SymbolParameter update(User user, Long projectId, Long symbolId, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException, ValidationException;

    /**
     * Deletes a symbol parameter.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameterId
     *         The id of the parameter to delete.
     * @throws NotFoundException
     *         If the project, the symbol or the parameter could not be found.
     * @throws UnauthorizedException
     *         If the user has no access to one of the resources.
     */
    void delete(User user, Long projectId, Long symbolId, Long parameterId)
            throws NotFoundException, UnauthorizedException;

    /**
     * Check if the user is allowed to access or modify the symbol parameter.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param symbol
     *         The symbol.
     * @param parameter
     *         The symbol parameter.
     * @throws NotFoundException
     *         If one of the resources can not be found.
     * @throws UnauthorizedException
     *         If one of the resources can not be accessed.
     */
    void checkAccess(User user, Project project, Symbol symbol, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException;
}
