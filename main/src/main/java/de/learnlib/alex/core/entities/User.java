package de.learnlib.alex.core.entities;

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

    /**
     * The unique id of the user
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * The email address of the user he uses to login
     */
    @NotNull
    @Column(unique = true)
    private String email;

    @NotNull
    private String password;

    private UserRole role;

    public User() {
        role = UserRole.REGISTERED;
    }

    public User(Long id) {
        role = UserRole.REGISTERED;
        this.id = id;
    }

    // auto generated equals and hashcode method

    /**
     * Two users are equals if they have the same id
     *
     * @param o Object to compare with
     * @return if both users have the same id
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        return id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
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