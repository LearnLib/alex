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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;

/** The input parameter. */
@Entity
@JsonTypeName("input")
public class SymbolInputParameter extends SymbolParameter {

    private static final long serialVersionUID = 6221255069083369750L;

    /** The values for the parameter. */
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "parameter"
    )
    @JsonIgnore
    private List<SymbolParameterValue> parameterValues;

    /** Constructor. */
    public SymbolInputParameter() {
        this.parameterValues = new ArrayList<>();
    }

    public List<SymbolParameterValue> getParameterValues() {
        return parameterValues;
    }

    public void setParameterValues(List<SymbolParameterValue> parameterValues) {
        this.parameterValues = parameterValues;
    }
}
