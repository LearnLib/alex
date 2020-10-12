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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class LearnerSetup implements Serializable {

    private static final long serialVersionUID = 4839405295048332641L;

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    private Project project;

    private String name;

    private boolean enableCache;

    private boolean saved;

    @Cascade(CascadeType.ALL)
    private AbstractLearningAlgorithm<String, String> algorithm;

    @ManyToMany
    @NotEmpty
    private List<ProjectEnvironment> environments;

    @ManyToMany(cascade = javax.persistence.CascadeType.REMOVE)
    @NotEmpty
    private List<ParameterizedSymbol> symbols;

    @ManyToOne(optional = false, cascade = javax.persistence.CascadeType.REMOVE)
    @NotNull
    private ParameterizedSymbol preSymbol;

    @ManyToOne(cascade = javax.persistence.CascadeType.REMOVE)
    private ParameterizedSymbol postSymbol;

    @NotNull
    @Column(columnDefinition = "BLOB")
    private AbstractEquivalenceOracleProxy equivalenceOracle;

    @NotNull
    @OneToOne(cascade = {javax.persistence.CascadeType.PERSIST, javax.persistence.CascadeType.MERGE, javax.persistence.CascadeType.REMOVE})
    private WebDriverConfig webDriver;

    public LearnerSetup() {
        this.environments = new ArrayList<>();
        this.symbols = new ArrayList<>();
        this.enableCache = false;
        this.saved = false;
    }

    @Transient
    @JsonIgnore
    public List<String> getSigma() {
        return symbols.stream()
                .map(ParameterizedSymbol::getAliasOrComputedName)
                .collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @JsonProperty("project")
    public Long getProjectId() {
        return project.getId();
    }

    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project();
        this.project.setId(projectId);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null || name.trim().equals("") ? "" : name;
    }

    public boolean isEnableCache() {
        return enableCache;
    }

    public void setEnableCache(boolean enableCache) {
        this.enableCache = enableCache;
    }

    public AbstractLearningAlgorithm<String, String> getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(AbstractLearningAlgorithm<String, String> algorithm) {
        this.algorithm = algorithm;
    }

    public List<ProjectEnvironment> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<ProjectEnvironment> environments) {
        this.environments = environments;
    }

    public List<ParameterizedSymbol> getSymbols() {
        return symbols;
    }

    public void setSymbols(List<ParameterizedSymbol> symbols) {
        this.symbols = symbols;
    }

    public ParameterizedSymbol getPreSymbol() {
        return preSymbol;
    }

    public void setPreSymbol(ParameterizedSymbol preSymbol) {
        this.preSymbol = preSymbol;
    }

    public ParameterizedSymbol getPostSymbol() {
        return postSymbol;
    }

    public void setPostSymbol(ParameterizedSymbol postSymbol) {
        this.postSymbol = postSymbol;
    }

    public AbstractEquivalenceOracleProxy getEquivalenceOracle() {
        return equivalenceOracle;
    }

    public void setEquivalenceOracle(AbstractEquivalenceOracleProxy equivalenceOracle) {
        this.equivalenceOracle = equivalenceOracle;
    }

    public WebDriverConfig getWebDriver() {
        return webDriver;
    }

    public void setWebDriver(WebDriverConfig webDriver) {
        this.webDriver = webDriver;
    }

    public boolean isSaved() {
        return saved;
    }

    public void setSaved(boolean saved) {
        this.saved = saved;
    }
}
