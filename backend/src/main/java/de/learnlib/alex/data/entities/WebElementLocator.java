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

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Embeddable class that helps working with selenium web elements.
 */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class WebElementLocator implements Serializable {

    private static final long serialVersionUID = -6070241271039096113L;

    /** The type of selectors. */
    public enum Type {

        /** If the selector is a CSS selector. */
        CSS,

        /** If the selector is an XPath expression. */
        XPATH,

        /** If the element should be received by a JavaScript. */
        JS
    }

    /** The selector of the element[s]. */
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String selector;

    /** What kind of selector {@link #selector} is. */
    @NotNull
    @Column(name = "selectorType")
    private Type type;

    public WebElementLocator() {
    }

    public WebElementLocator(String selector, Type type) {
        this.selector = selector;
        this.type = type;
    }

    public String getSelector() {
        return selector;
    }

    public void setSelector(String selector) {
        this.selector = selector;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return selector + "(" + type.toString() + ")";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        WebElementLocator that = (WebElementLocator) o;

        if (!Objects.equals(selector, that.selector)) return false;
        return type == that.type;
    }

    @Override
    public int hashCode() {
        int result = selector != null ? selector.hashCode() : 0;
        result = 31 * result + (type != null ? type.hashCode() : 0);
        return result;
    }
}
