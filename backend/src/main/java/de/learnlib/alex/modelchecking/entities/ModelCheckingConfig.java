/*
 * Copyright 2015 - 2021 TU Dortmund
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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Entity
public class ModelCheckingConfig implements Serializable {

    private static final long serialVersionUID = 8982283686107232388L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToMany
    private List<LtsFormulaSuite> formulaSuites;

    @NotNull
    @Min(1)
    private Integer minUnfolds;

    @NotNull
    @DecimalMin("0.1")
    private Double multiplier;

    public ModelCheckingConfig() {
        this.formulaSuites = new ArrayList<>();
        this.minUnfolds = 1;
        this.multiplier = 0.1;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<LtsFormulaSuite> getFormulaSuites() {
        return formulaSuites;
    }

    public void setFormulaSuites(List<LtsFormulaSuite> formulaSuites) {
        this.formulaSuites = formulaSuites;
    }

    public Integer getMinUnfolds() {
        return minUnfolds;
    }

    public void setMinUnfolds(Integer minUnfolds) {
        this.minUnfolds = minUnfolds;
    }

    public Double getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(Double multiplier) {
        this.multiplier = multiplier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ModelCheckingConfig)) return false;
        ModelCheckingConfig that = (ModelCheckingConfig) o;
        return id.equals(that.id)
                && minUnfolds.equals(that.minUnfolds)
                && multiplier.equals(that.multiplier);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, minUnfolds, multiplier);
    }
}
