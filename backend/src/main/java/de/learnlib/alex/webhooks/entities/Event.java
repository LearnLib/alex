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

package de.learnlib.alex.webhooks.entities;

/**
 * The event.
 *
 * @param <T>
 *         The type of the data that is passed by the event.
 */
public abstract class Event<T> {

    /** The data that is send to the receiver. */
    private T data;

    /** The name of the event. */
    private EventType eventType;

    /**
     * Constructor.
     *
     * @param data
     *         {@link #data}
     * @param eventType
     *         {@link #eventType}
     */
    public Event(T data, EventType eventType) {
        this.data = data;
        this.eventType = eventType;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }
}
