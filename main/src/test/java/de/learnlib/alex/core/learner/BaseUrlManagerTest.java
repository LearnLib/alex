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

package de.learnlib.alex.core.learner;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class BaseUrlManagerTest {

    private static final String BASE_URL = "http://localhost";
    private static final String FINAL_URL = "http://localhost/test";

    private BaseUrlManager manager;

    @Before
    public void setUp() {
        manager = new BaseUrlManager(BASE_URL);
    }

    @Test
    public void shouldCreateCorrectUrls() {
        String url = manager.getAbsoluteUrl("test");
        assertEquals(FINAL_URL, url);

        url = manager.getAbsoluteUrl("/test");
        assertEquals(FINAL_URL, url);

        manager.setBaseUrl(BASE_URL + "/");
        url = manager.getAbsoluteUrl("test");
        assertEquals(FINAL_URL, url);

        url = manager.getAbsoluteUrl("/test");
        assertEquals(FINAL_URL, url);
    }

}
