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

package de.learnlib.alex.auth.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.webhooks.entities.Webhook;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Sha512Hash;
import org.hibernate.annotations.Cascade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * The model for a user.
 */
@Entity
public class User implements Serializable {

    /** Auto generated id for saving it into the db. */
    private static final long serialVersionUID = -3567360676364330143L;

    /** the number of iterations to perform to create a secure hash. */
    private static final int HASH_ITERATIONS = 2048;

    /** The unique id of the user. */
    @Id
    @GeneratedValue
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

    /** The salt that is used to hash the password. */
    private String salt;

    /** The role of the user. */
    private UserRole role;

    /** The set of projects in which the user is an owner. */
    @ManyToMany(mappedBy = "owners")
    private Set<Project> projectsOwner;

    /** The set of projects in which the user is a member. */
    @ManyToMany(mappedBy = "members")
    private Set<Project> projectsMember;

    /** The list of webhooks. */
    @OneToMany(mappedBy = "user")
    @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.REMOVE})
    @JsonIgnore
    private List<Webhook> webhooks;

    /**
     * Default constructor that gives the user the role of "registered".
     */
    public User() {
        this.projectsOwner = new HashSet<>();
        this.projectsMember = new HashSet<>();
        this.webhooks = new ArrayList<>();
        role = UserRole.REGISTERED;
    }

    /**
     * Constructor that sets a specific ID and gives the user the role of "registered".
     *
     * @param id The ID of the User.
     */
    public User(Long id) {
        role = UserRole.REGISTERED;
        this.id = id;
    }

    /**
     * @return The ID of the User in the DB.
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id The ID of the user.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return The current username of the user.
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username The new username of the user.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return The current EMail of the User.
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email The new EMail of the User.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return The current Role of the User.
     */
    public UserRole getRole() {
        return role;
    }

    /**
     * @param role The new Role of the User.
     */
    public void setRole(UserRole role) {
        this.role = role;
    }

    /**
     * @return The set of projects in which the user is an owner.
     */
    @JsonIgnore
    public Set<Project> getProjectsOwner() {
        return projectsOwner;
    }

    /**
     * @param projectsOwner The set of projects in which the user is an owner.
     */
    @JsonIgnore
    public void setProjectsOwner(Set<Project> projectsOwner) {
        this.projectsOwner = projectsOwner;
    }

    /**
     * @return The set of projects in which the user is a member.
     */
    @JsonIgnore
    public Set<Project> getProjectsMember() {
        return projectsMember;
    }

    /**
     * @param projectsMember The set of projects in which the user is a member.
     */
    @JsonIgnore
    public void setProjectsMember(Set<Project> projectsMember) {
        this.projectsMember = projectsMember;
    }

    /**
     * @return The list of ids of projects in which the user is a member.
     */
    @JsonProperty("projectsMember")
    public List<Long> getProjectsMemberIds() {
        return this.projectsMember.stream().map(Project::getId).collect(Collectors.toList());
    }

    /**
     * @return The list of ids of projects in which the user is an owner.
     */
    @JsonProperty("projectsOwner")
    public List<Long> getProjectsOwnerIds() {
        return this.projectsOwner.stream().map(Project::getId).collect(Collectors.toList());
    }

    /**
     * @return The hashed password of the User.
     */
    @JsonIgnore
    @JsonProperty("password")
    public String getPassword() {
        return password;
    }

    /**
     * @param password The new (already hashed) password of the User.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @param plainPassword The new password of the User as plain text.
     */
    @JsonIgnore
    public void setEncryptedPassword(String plainPassword) {
        this.salt = new SecureRandomNumberGenerator().nextBytes().toBase64();
        this.password = new Sha512Hash(plainPassword, this.salt, HASH_ITERATIONS).toBase64();
    }

    /**
     * Checks if the given password equals the password of the user.
     *
     * @param plainPasswordToCheck The password to check.
     * @return True, if both passwords matched, false otherwise.
     */
    @JsonIgnore
    public boolean isValidPassword(String plainPasswordToCheck) {
        String hashedPassword = new Sha512Hash(plainPasswordToCheck, this.salt, HASH_ITERATIONS).toBase64();
        return hashedPassword.equals(this.password);
    }

    /**
     * @return The current salt to ahs the password of the user.
     */
    @JsonIgnore
    @JsonProperty("salt")
    public String getSalt() {
        return salt;
    }

    /**
     * @param salt The new Salt to hash the password of the user.
     */
    public void setSalt(String salt) {
        this.salt = salt;
    }

    public List<Webhook> getWebhooks() {
        return webhooks;
    }

    public void setWebhooks(List<Webhook> webhooks) {
        this.webhooks = webhooks;
    }

    @Override
    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "<" + id + "> '" + email + "'";
    }
}
