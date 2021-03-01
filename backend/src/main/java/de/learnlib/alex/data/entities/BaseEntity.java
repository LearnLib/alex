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

import com.vladmihalcea.hibernate.type.array.ListArrayType;
import javax.persistence.MappedSuperclass;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

@MappedSuperclass
@TypeDefs({
        @TypeDef(name = "list-array", typeClass = ListArrayType.class)
})
public class BaseEntity {
}
