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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Settings;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import javax.validation.ValidationException;

/**
 * Implementation of a SettingsDAO using Hibernate.
 */
@Repository
public class SettingsDAOImpl implements SettingsDAO {

    @Override
    public void create(Settings settings) throws ValidationException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            if (session.createCriteria(Settings.class).uniqueResult() != null) {
                throw new ValidationException("The settings have already been created.");
            }

            session.save(settings);
            HibernateUtil.commitTransaction();
        } catch (javax.validation.ConstraintViolationException
                | org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The settings could not be created because it is invalid.", e);
        }
    }

    @Override
    public Settings get() {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        Settings settings = (Settings) session.createCriteria(Settings.class)
                .uniqueResult();

        HibernateUtil.commitTransaction();

        if (settings == null) {
            HibernateUtil.rollbackTransaction();
        }

        return settings;
    }

    @Override
    public void update(Settings settings) throws Exception {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            session.update(settings);
            HibernateUtil.commitTransaction();
        } catch (Exception e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }
}
