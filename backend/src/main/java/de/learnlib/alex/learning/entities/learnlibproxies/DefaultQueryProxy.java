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

package de.learnlib.alex.learning.entities.learnlibproxies;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.api.query.DefaultQuery;
import net.automatalib.words.Word;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Transient;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Proxy around a {@link DefaultQuery}.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 */
@Embeddable
public class DefaultQueryProxy implements Serializable {

    private static final long serialVersionUID = 4759682392322006213L;

    /** Create one static ObjectMapper to (de-)serialize the Proxy for the DB. */
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /** The Prefix of the query as Strings. */
    private List<String> prefix;

    /** The Suffix of the query as Strings. */
    private List<String> suffix;

    /** The Output of the query as Strings. */
    private List<String> output;

    /**
     * Default constructor that creates a new list for the prefix, the suffix and the output.
     */
    public DefaultQueryProxy() {
        this.prefix = new ArrayList<>();
        this.suffix = new ArrayList<>();
        this.output = new ArrayList<>();
    }

    /**
     * Create a new Proxy based on the provided DefaultQuery.
     *
     * @param query
     *         The base Query of the new proxy. Can be null.
     * @return The new Proxy around the DefaultQuery..
     */
    public static DefaultQueryProxy createFrom(DefaultQuery<String, Word<String>> query) {
        DefaultQueryProxy newProxy = new DefaultQueryProxy();
        if (query != null) {
            newProxy.prefix = query.getPrefix().asList();
            newProxy.suffix = query.getSuffix().asList();
            if (query.getOutput() != null) {
                newProxy.output = query.getOutput().asList();
            }
        }

        return newProxy;
    }

    /**
     * @return The Prefix of the Proxy.
     */
    @Transient
    @JsonProperty
    public List<String> getPrefix() {
        return prefix;
    }

    /**
     * @param prefix The new prefix of the Proxy.
     */
    public void setPrefix(List<String> prefix) {
        this.prefix = prefix;
    }

    /**
     * @return The Suffix of the Proxy.
     */
    @Transient
    @JsonProperty
    public List<String> getSuffix() {
        return suffix;
    }

    /**
     * @param suffix The new suffix of the Proxy.
     */
    public void setSuffix(List<String> suffix) {
        this.suffix = suffix;
    }

    /**
     * @return The Output of the Proxy.
     */
    @Transient
    @JsonProperty
    public List<String> getOutput() {
        return output;
    }

    /**
     * @param output The new output of the Proxy.
     */
    public void setOutput(List<String> output) {
        this.output = output;
    }

    /**
     * Getter method to interact with the DB, because the Java standard serialization doesn't work.
     *
     * @return The Proxy as JSON string.
     */
    @Column(name = "counterExample", columnDefinition = "MEDIUMTEXT")
    @JsonIgnore
    public String getProxyDB() {
        try {
            return OBJECT_MAPPER.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }

    /**
     * Setter method to interact with the DB, because the Java standard deserialization doesn't work.
     *
     * @param proxyAsString
     *         The Proxy as JSON string.
     */
    @JsonIgnore
    public void setProxyDB(String proxyAsString) {
        try {
            DefaultQueryProxy that = OBJECT_MAPPER.readValue(proxyAsString, DefaultQueryProxy.class);
            this.prefix = that.prefix;
            this.suffix = that.suffix;
            this.output = that.output;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Create a DefaultQuery based on this proxy.
     *
     * @return The new DefaultQuery.
     */
    public DefaultQuery<String, Word<String>> createDefaultQuery() {
        Word<String> prefixAsWord = Word.fromList(prefix);
        Word<String> suffixAsWord = Word.fromList(suffix);
        Word<String> outputAsWord = Word.fromList(output);
        return new DefaultQuery<>(prefixAsWord, suffixAsWord, outputAsWord);
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|NeedBraces|OperatorWrap - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DefaultQueryProxy that = (DefaultQueryProxy) o;
        return Objects.equals(prefix, that.prefix) &&
                Objects.equals(suffix, that.suffix) &&
                Objects.equals(output, that.output);
    }

    @Override
    public int hashCode() {
        return Objects.hash(prefix, suffix, output);
    }
    // CHECKSTYLE.OFF: AvoidInlineConditionals|NeedBraces|OperatorWrap

}
