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

package de.learnlib.alex.common.utils;

import org.junit.Assert;
import org.junit.Test;

public class StringListTest {

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithNullConstructor() {
        new StringList(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithEmptyString() {
        new StringList("  ");
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithEmptyValues() {
        new StringList(",,,");
    }

    @Test
    public void shouldInitializeCorrectly() {
        final StringList sl1 = new StringList("test");
        Assert.assertEquals(1, sl1.size());
        Assert.assertEquals("test", sl1.get(0));

        final StringList sl2 = new StringList("test1,test2");
        Assert.assertEquals(2, sl2.size());
        Assert.assertEquals("test1", sl2.get(0));
        Assert.assertEquals("test2", sl2.get(1));
    }
}
