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

package de.learnlib.alex.modelchecking.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.BaseEntity;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import org.hibernate.annotations.Type;

@Entity
public class ModelCheckingResult extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 6775415609263387261L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    protected Long id;

    @OneToOne
    private LtsFormula formula;

    /** The prefix of the counterexample. */
    @Type(type = "list-array")
    @Column(columnDefinition = "text[]")
    @Basic(fetch = FetchType.EAGER)
    private List<String> prefix;

    /** The loop part of the counterexample. */
    @Type(type = "list-array")
    @Column(columnDefinition = "text[]")
    @Basic(fetch = FetchType.EAGER)
    private List<String> loop;

    public ModelCheckingResult() {
        this.prefix = new ArrayList<>();
        this.loop = new ArrayList<>();
    }

    public LtsFormula getFormula() {
        return formula;
    }

    public void setFormula(LtsFormula formula) {
        this.formula = formula;
    }

    public List<String> getPrefix() {
        return prefix;
    }

    public void setPrefix(List<String> prefix) {
        this.prefix = prefix;
    }

    public List<String> getLoop() {
        return loop;
    }

    public void setLoop(List<String> loop) {
        this.loop = loop;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonProperty("passed")
    @Transient
    public boolean isPassed() {
        return this.prefix.isEmpty() && this.loop.isEmpty();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ModelCheckingResult)) {
            return false;
        }
        ModelCheckingResult that = (ModelCheckingResult) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
