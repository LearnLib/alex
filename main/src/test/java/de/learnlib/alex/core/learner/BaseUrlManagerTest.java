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

import de.learnlib.alex.actions.Credentials;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class BaseUrlManagerTest {

    private static final String BASE_URL                   = "http://localhost";
    private static final String FINAL_URL                  = "http://localhost/test";
    private static final String FINAL_URL_WITH_CREDENTIALS = "http://alex:alex@localhost/test";

    private static final String SECURE_BASE_URL                   = "https://localhost";
    private static final String SECURE_FINAL_URL                  = "https://localhost/test";
    private static final String SECURE_FINAL_URL_WITH_CREDENTIALS = "https://alex:alex@localhost/test";

    @Test
    public void shouldCreateCorrectUrls() {
        BaseUrlManager manager = new BaseUrlManager(BASE_URL);

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

    @Test
    public void shouldCreateCorrectUrlsWithCredentials() {
        BaseUrlManager manager = new BaseUrlManager(BASE_URL);
        //
        Credentials credentials = new Credentials("alex", "alex");

        String url = manager.getAbsoluteUrl("/test", credentials);
        assertThat(url, is(equalTo(FINAL_URL_WITH_CREDENTIALS)));
    }

    @Test
    public void shouldCreateCorrectSecureUrls() {
        BaseUrlManager manager = new BaseUrlManager(SECURE_BASE_URL);

        String url = manager.getAbsoluteUrl("test");
        assertEquals(SECURE_FINAL_URL, url);

        url = manager.getAbsoluteUrl("/test");
        assertEquals(SECURE_FINAL_URL, url);

        manager.setBaseUrl(SECURE_BASE_URL + "/");
        url = manager.getAbsoluteUrl("test");
        assertEquals(SECURE_FINAL_URL, url);

        url = manager.getAbsoluteUrl("/test");
        assertEquals(SECURE_FINAL_URL, url);
    }

    @Test
    public void shouldCreateCorrectSecureUrlsWithCredentials() {
        BaseUrlManager manager = new BaseUrlManager(SECURE_BASE_URL);
        //
        Credentials credentials = new Credentials("alex", "alex");

        String url = manager.getAbsoluteUrl("/test", credentials);
        assertThat(url, is(equalTo(SECURE_FINAL_URL_WITH_CREDENTIALS)));
    }

}
