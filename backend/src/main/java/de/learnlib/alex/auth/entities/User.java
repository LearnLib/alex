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

package de.learnlib.alex.auth.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.webhooks.entities.Webhook;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import org.hibernate.annotations.Cascade;

/**
 * The model for a user.
 */
@Entity
@Table(name = "user", schema = "public")
public class User implements Serializable {

    /** Auto generated id for saving it into the db. */
    private static final long serialVersionUID = -3567360676364330143L;

    /** The unique id of the user. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The username of the user. */
    @Column(unique = true)
    private String username;

    /** The email address of the user he uses to login. */
    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    /** The hash of the users password. */
    @NotBlank
    private String password;

    /** The role of the user. */
    private UserRole role;

    /** The set of projects in which the user is an owner. */
    @ManyToMany(mappedBy = "owners")
    @JsonIgnore
    private Set<Project> projectsOwner;

    /** The set of projects in which the user is a member. */
    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private Set<Project> projectsMember;

    /** The list of webhooks. */
    @OneToMany(mappedBy = "user")
    @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.REMOVE})
    @JsonIgnore
    private List<Webhook> webhooks;

    @Min(value = 1, message = "The number of allowed processes has to be greater than 0.")
    private int maxAllowedProcesses;

    /**
     * Default constructor that gives the user the role of "registered".
     */
    public User() {
        this.projectsOwner = new HashSet<>();
        this.projectsMember = new HashSet<>();
        this.webhooks = new ArrayList<>();
        this.role = UserRole.REGISTERED;
        this.maxAllowedProcesses = 1;
    }

    /**
     * Constructor that sets a specific ID and gives the user the role of "registered".
     *
     * @param id
     *         The ID of the User.
     */
    public User(Long id) {
        this();
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Set<Project> getProjectsOwner() {
        return projectsOwner;
    }

    public void setProjectsOwner(Set<Project> projectsOwner) {
        this.projectsOwner = projectsOwner;
    }

    public Set<Project> getProjectsMember() {
        return projectsMember;
    }

    public void setProjectsMember(Set<Project> projectsMember) {
        this.projectsMember = projectsMember;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonIgnore
    public void setPassword(String password) {
        this.password = password;
    }

    public List<Webhook> getWebhooks() {
        return webhooks;
    }

    public void setWebhooks(List<Webhook> webhooks) {
        this.webhooks = webhooks;
    }

    public void setMaxAllowedProcesses(int maxAllowedProcesses) {
        this.maxAllowedProcesses = maxAllowedProcesses;
    }

    public int getMaxAllowedProcesses() {
        return this.maxAllowedProcesses;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof User)) {
            return false;
        }
        User user = (User) o;
        return Objects.equals(id, user.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{"
                + "id=" + id
                + ", username='" + username + '\''
                + ", email='" + email + '\''
                + ", role=" + role
                + '}';
    }
}
