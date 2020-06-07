package de.learnlib.alex.websocket.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.auth.entities.User;

public class WebSocketMessage {

    @JsonIgnore
    private User user;

    @JsonIgnore
    private String sessionId;

    private String type;

    private String entity;

    private String content;

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
       this.type = type;
    }

    public String getEntity() {
        return this.entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
