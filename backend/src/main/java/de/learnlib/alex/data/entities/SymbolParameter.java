/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.Objects;

/**
 * Symbol parameter class.
 */
@Entity
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "input", value = SymbolInputParameter.class),
        @JsonSubTypes.Type(name = "output", value = SymbolOutputParameter.class),
})
public abstract class SymbolParameter implements Serializable {

    private static final long serialVersionUID = -5863108479982983205L;

    /** The type of the parameter. */
    public enum ParameterType {

        /** If the parameter is a counter. */
        COUNTER,

        /** If the parameter is a string. */
        STRING
    }

    /** The ID of the Action in the DB. */
    @Id
    @GeneratedValue
    protected Long id;

    /** The symbol the action belongs to. */
    @ManyToOne
    @JoinColumn(name = "symbolId")
    @JsonIgnore
    protected Symbol symbol;

    /** The name of the parameter. */
    @NotBlank
    protected String name;

    /** The type of the parameter. */
    protected ParameterType parameterType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Symbol getSymbol() {
        return symbol;
    }

    public void setSymbol(Symbol symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ParameterType getParameterType() {
        return parameterType;
    }

    public void setParameterType(ParameterType parameterType) {
        this.parameterType = parameterType;
    }

    @Override
    @SuppressWarnings({"checkstyle:needbraces", "checkstyle:operatorwrap"})
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SymbolParameter)) return false;
        SymbolParameter parameter = (SymbolParameter) o;
        return Objects.equals(getId(), parameter.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
