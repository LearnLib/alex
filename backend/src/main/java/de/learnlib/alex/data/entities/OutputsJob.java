package de.learnlib.alex.data.entities;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class OutputsJob {
  public String id;
  public boolean success;
  public String message;
  public Long projectId;
  public Long environmentId;
  public List<String> outputs = new ArrayList<>();
  public Instant statedAt;
  public Instant finishedAt;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Long getProjectId() {
    return projectId;
  }

  public void setProjectId(Long projectId) {
    this.projectId = projectId;
  }

  public Long getEnvironmentId() {
    return environmentId;
  }

  public void setEnvironmentId(Long environmentId) {
    this.environmentId = environmentId;
  }

  public List<String> getOutputs() {
    return outputs;
  }

  public void setOutputs(List<String> outputs) {
    this.outputs = outputs;
  }

  public Instant getStatedAt() {
    return statedAt;
  }

  public void setStatedAt(Instant statedAt) {
    this.statedAt = statedAt;
  }

  public Instant getFinishedAt() {
    return finishedAt;
  }

  public void setFinishedAt(Instant finishedAt) {
    this.finishedAt = finishedAt;
  }
}
