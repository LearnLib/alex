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

package de.learnlib.alex.learning.entities.webdrivers;

import java.util.Arrays;
import java.util.List;

/**
 * The supported web drivers.
 */
public class WebDrivers {
    public static final String CHROME = "chrome";
    public static final String EDGE = "edge";
    public static final String FIREFOX = "firefox";
    public static final String HTML_UNIT = "htmlUnit";
    public static final String REMOTE = "remote";
    public static final String SAFARI = "safari";

    /** Constructor. */
    private WebDrivers() {
    }

    public static List<String> asList() {
        return Arrays.asList(CHROME, EDGE, FIREFOX, HTML_UNIT, REMOTE, SAFARI);
    }
}
