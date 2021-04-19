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

package de.learnlib.alex.webhooks.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.auth.entities.User;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * Webhook.
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class Webhook implements Serializable {

    private static final long serialVersionUID = 2533300421211466078L;

    /** The id of the webhook. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The url to send data to. */
    @NotNull
    @Pattern(regexp = "^https?://.+?")
    private String url;

    /** The name associated with the webhook. */
    @NotBlank
    private String name;

    /** The user that registered the webhook. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JsonIgnore
    private User user;

    /** The event that triggers the webhook. */
    @ElementCollection
    @NotEmpty
    private List<EventType> events;

    /** Constructor. */
    public Webhook() {
        this.events = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @JsonProperty("user")
    public Long getUserId() {
        return user.getId();
    }

    @JsonProperty("user")
    public void setUserId(Long userId) {
        user = new User(userId);
    }

    public List<EventType> getEvents() {
        return events;
    }

    public void setEvents(List<EventType> events) {
        this.events = events;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Webhook)) {
            return false;
        }
        Webhook webhook = (Webhook) o;
        return Objects.equals(id, webhook.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Webhook{"
                + "id=" + id
                + ", url='" + url + '\''
                + ", name='" + name + '\''
                + ", user=" + user
                + '}';
    }
}
