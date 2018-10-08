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

package de.learnlib.alex.common.utils;

import org.junit.Assert;
import org.junit.Test;

public class IdsListTest {

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithNullConstructor() {
        new IdsList(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithEmptyString() {
        new IdsList("  ");
    }

    @Test(expected = Exception.class)
    public void shouldFailWithNonInteger() {
        new IdsList("1,test,2");
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithEmptyValues() {
        new IdsList(",,,");
    }

    @Test
    public void shouldInitializeCorrectly() {
        final IdsList sl1 = new IdsList("3");
        Assert.assertEquals(1, sl1.size());
        Assert.assertEquals(3L, (long) sl1.get(0));

        final IdsList sl2 = new IdsList("1,2");
        Assert.assertEquals(2, sl2.size());
        Assert.assertEquals(1L, (long) sl2.get(0));
        Assert.assertEquals(2L, (long) sl2.get(1));
    }
}
