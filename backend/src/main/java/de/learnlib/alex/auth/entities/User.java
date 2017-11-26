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

package de.learnlib.alex.auth.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.Project;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Sha512Hash;
import org.hibernate.annotations.Cascade;
import org.hibernate.validator.constraints.Email;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

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

    /** The email address of the user he uses to login. */
    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    /** * The hash of the users password. */
    @NotNull
    private String password;

    /** The salt that is used to hash the password. */
    private String salt;

    /** The role of the user. */
    private UserRole role;

    /** The projects of the user. */
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.REMOVE})
    @JsonIgnore
    private Set<Project> projects;

    /**
     * Default constructor that gives the user the role of "registered".
     */
    public User() {
        role = UserRole.REGISTERED;
    }

    /**
     * Constructor that sets a specific ID and gives the user the role of "registered".
     *
     * @param id
     *         The ID of the User.
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

    public void setId(Long id) {
        this.id = id;
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
     * @param plainPasswordToCheck
     *         The password to check.
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

    /**
     * @return All Projects owned by the User.
     */
    public Set<Project> getProjects() {
        return projects;
    }

    /**
     * @param projects The new set of the Projects owned by the User.
     */
    public void setProjects(Set<Project> projects) {
        this.projects = projects;
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
