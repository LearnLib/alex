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

import com.google.common.collect.Iterators;
import com.google.common.collect.Streams;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.DefaultQuery;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Word;
import org.checkerframework.checker.nullness.qual.Nullable;

public class FuzzyStateCoverEQOracle<I, O> implements EquivalenceOracle.MealyEquivalenceOracle<I, O> {

  private final MembershipOracle<I, Word<O>> mqOracle;
  private final int minLength;
  private final int maxLength;
  private final int maxNoOfTests;
  private final Random random;
  private final int batchSize;

  public FuzzyStateCoverEQOracle(
      MembershipOracle<I, Word<O>> mqOracle,
      int minLength,
      int maxLength,
      int maxNoOfTests,
      Random random,
      int batchSize
  ) {
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.maxNoOfTests = maxNoOfTests;
    this.random = random;
    this.mqOracle = mqOracle;
    this.batchSize = batchSize;
  }

  @Override
  public @Nullable DefaultQuery<I, Word<O>> findCounterExample(MealyMachine<?, I, ?, O> hypothesis,
      Collection<? extends I> inputs) {
    final List<Word<I>> accessSequences = Automata.stateCover(hypothesis, inputs);
    final List<I> symbolList = new ArrayList<>(inputs);

    try {
      for (int i = 0; i < maxNoOfTests; i++) {
        final var batch = new ArrayList<DefaultQuery<I, Word<O>>>();

        for (Word<I> accessSequence : accessSequences) {
          var query = accessSequence.concat(Word.epsilon());

          final int length = minLength + random.nextInt((maxLength - minLength) + 1);

          for (int j = 0; j < length; j++) {
            int symbolIndex = random.nextInt(symbolList.size());
            I sym = symbolList.get(symbolIndex);
            query = query.append(sym);
          }

          batch.add(new DefaultQuery<>(query));
        }

        var batches = Streams
            .stream(Iterators.partition(batch.iterator(), this.batchSize))
            .collect(Collectors.toList());

        for (var b : batches) {
          mqOracle.processQueries(b);
          for (var query : b) {
            if (!Objects.equals(hypothesis.computeOutput(query.getInput()), query.getOutput())) {
              return query;
            }
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }

    return null;
  }
}
