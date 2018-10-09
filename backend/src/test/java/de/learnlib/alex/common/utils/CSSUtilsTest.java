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

public class CSSUtilsTest {

    @Test
    public void shouldLeaveUncriticalSelectorsUntouched() {
        final String s1 = ".some-class";
        Assert.assertEquals(".some-class", CSSUtils.escapeSelector(s1));

        final String s2 = "body";
        Assert.assertEquals("body", CSSUtils.escapeSelector(s2));

        final String s3 = "body > div > ul:nth-child(3)";
        Assert.assertEquals("body > div > ul:nth-child(3)", CSSUtils.escapeSelector(s3));

        final String s4 = "#some-element";
        Assert.assertEquals("#some-element", CSSUtils.escapeSelector(s4));
    }

    @Test
    public void shouldEscapeIdsWithSpecialCharacters() {
        final String[] specialChars = {"!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", ".", "/", ":", ";",
            "<", "=", ">", "?", "@", "[", "\\", "]", "^", "`", "{", "|", "}", "~"};

        for (int i = 0; i < specialChars.length; i++) {
            final String s1 = "#some" + specialChars[i] + "el";
            Assert.assertEquals("#some\\" + specialChars[i] + "el", CSSUtils.escapeSelector(s1));

            final String s2 = "body > #some" + specialChars[i] + "el";
            Assert.assertEquals("body > #some\\" + specialChars[i] + "el", CSSUtils.escapeSelector(s2));
        }
    }
}
