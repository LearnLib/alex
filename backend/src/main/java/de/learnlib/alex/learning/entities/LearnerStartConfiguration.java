/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.learning.entities;

public class LearnerStartConfiguration {

    /** Options for the learning process. */
    private LearnerOptions options;

    /** The setup to execute. */
    private LearnerSetup setup;

    public LearnerStartConfiguration() {
        this.options = new LearnerOptions();
    }

    public LearnerOptions getOptions() {
        return options;
    }

    public void setOptions(LearnerOptions options) {
        this.options = options == null ? new LearnerOptions() : options;
    }

    public LearnerSetup getSetup() {
        return setup;
    }

    public void setSetup(LearnerSetup setup) {
        this.setup = setup;
    }
}
