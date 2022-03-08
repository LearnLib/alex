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

package de.learnlib.alex.learning.services.oracles;

import de.learnlib.alex.common.exceptions.LearnerInterruptedException;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.Query;
import java.util.Collection;
import javax.annotation.ParametersAreNonnullByDefault;
import net.automatalib.words.Word;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Oracle that delegates queries to another oracle that can be exchanged.
 *
 * @param <I>
 *         Input symbol type.
 * @param <O>
 *         Output symbol type.
 */
@ParametersAreNonnullByDefault
public class DelegationOracle<I, O> implements MembershipOracle<I, Word<O>> {

    private static final Logger logger = LoggerFactory.getLogger(DelegationOracle.class);

    /** How often the queries should be posed in case an exception is thrown. */
    private static final int MAX_RETRIES = 5;

    /** How long to wait before retrying. */
    private static final int SLEEP_TIME = 2000;

    /** The sul the membership queries should be posed to. */
    private MembershipOracle<I, Word<O>> delegate;

    @Override
    public void processQueries(Collection<? extends Query<I, Word<O>>> queries) {
        int i = 0;
        Exception lastException;
        while (i < MAX_RETRIES) {
            try {
                delegate.processQueries(queries);
                break;
            } catch (LearnerInterruptedException e) {
                throw new LearnerException(e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
                lastException = e;
                logger.warn(LoggerMarkers.LEARNER, "Failed to execute query on {}. try. Retry in {}ms", i + 1, SLEEP_TIME);
                i++;

                if (i == MAX_RETRIES) {
                    logger.error(LoggerMarkers.LEARNER, "Failed to execute query for " + MAX_RETRIES + " times\"", lastException);
                    throw new LearnerException(lastException.getMessage());
                } else {
                    try {
                        Thread.sleep(SLEEP_TIME);
                    } catch (InterruptedException e2) {
                    }
                }
            }
        }
    }

    public void setDelegate(MembershipOracle<I, Word<O>> delegate) {
        this.delegate = delegate;
    }

}
