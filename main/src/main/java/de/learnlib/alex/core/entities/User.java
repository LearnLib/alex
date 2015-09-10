package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * The model for a user
 */
@Entity
public class User implements Serializable {

    // auto generated id for saving it into the db
    private static final long serialVersionUID = -3567360676364330143L;

    /** The unique id of the user */
    @Id
    @GeneratedValue
    private Long id;

    /** The email address of the user he uses to login */
    @NotNull
    @Column(unique = true)
    private String email;

    @NotNull
    private String password;

    private UserRole role;

    public User() {
        role = UserRole.REGISTERED;
    }

    // auto generated getter & setter

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}