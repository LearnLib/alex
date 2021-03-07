/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.testing.entities;

public class TestProcessQueueItem {
    public Long userId;
    public Long projectId;
    public Long reportId;
    public TestExecutionConfig config;

    public TestProcessQueueItem(Long userId, Long projectId, Long reportId, TestExecutionConfig config) {
        this.userId = userId;
        this.projectId = projectId;
        this.reportId = reportId;
        this.config = config;
    }
}