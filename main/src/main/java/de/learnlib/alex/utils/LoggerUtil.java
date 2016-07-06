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
package de.learnlib.alex.utils;

import org.apache.logging.log4j.ThreadContext;

/**
 * Helper class to manage the indent in the log files.
 */
public final class LoggerUtil {

    /** Per default indent by 4. */
    private static final String DEFAULT_INDENT = "    ";

    /**
     * Disabled default constructor, this is only a utility class with static methods.
     */
    private LoggerUtil() {
    }

    /**
     * Increase the indent for the logger.
     * This applies only for the current thread.
     */
    public static void increaseIndent() {
        String currentIndent = ThreadContext.get("indent");

        ThreadContext.put("indent", currentIndent + DEFAULT_INDENT);
    }

    /**
     * Decrease the indent for the logger.
     * This applies only for the current thread.
     */
    public static void decreaseIndent() {
        String currentIndent = ThreadContext.get("indent");
        int newIndentSize = currentIndent.length() - DEFAULT_INDENT.length();

        ThreadContext.put("indent", currentIndent.substring(0, newIndentSize));
    }

}
