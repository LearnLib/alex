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

package de.learnlib.alex.data.entities.actions.rest;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.actions.Credentials;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.ws.rs.core.Cookie;
import org.hibernate.annotations.Type;
import org.springframework.util.SerializationUtils;

/**
 * RESTSymbolAction to make a request to the API.
 */
@Entity
@DiscriminatorValue("rest_call")
@JsonTypeName("rest_call")
public class CallAction extends RESTSymbolAction {

    /**
     * Enumeration to specify the HTTP method.
     */
    public enum Method {
        /**
         * Refers to the GET method.
         */
        GET,

        /**
         * Refers to the POST method.
         */
        POST,

        /**
         * Refers to the PUT method.
         */
        PUT,

        /**
         * Refers to the DELETE method.
         */
        DELETE
    }

    /**
     * The method to use for the call.
     */
    @NotNull
    private Method method;

    /**
     * The url to call.
     * The URL can either be a path relative to the project's base URL or a absolute URL that starts with https?://
     */
    @NotBlank
    private String url;

    @NotBlank
    private String baseUrl;

    /** The amount of time in ms before the request is aborted. The value 0 means wait infinitely long. */
    @NotNull
    @Min(value = 0)
    private int timeout;

    /**
     * Map to store headers, that will be send with the requests. Every header name has a list of values, to be standard
     * conform (e.g. Accept: text/html,application/xml).
     */
    @Lob
    @Column(columnDefinition = "BYTEA")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] headers;

    /**
     * Optional credentials to authenticate via HTTP basic auth.
     */
    @Embedded
    private Credentials credentials;

    /**
     * Map to store cookies, that will be send with the request. Cookies are a normal header field, but this should make
     * things easier.
     */
    @Lob
    @Column(columnDefinition = "BYTEA")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] cookies; // OM NOM NOM NOM!!!

    /**
     * Optional data to sent with a POST or PUT request.
     */
    @Column(columnDefinition = "TEXT")
    private String data;

    /**
     * Default constructor that just initializes the internal data structures.
     */
    public CallAction() {
        this.timeout = 0;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        try {
            logger.info(LoggerMarkers.LEARNER, "Doing {} request to '{}'.", method, url);
            doRequest(target);
            return getSuccessOutput();
        } catch (Exception e) {
            logger.info(LoggerMarkers.LEARNER, "Could not call {}.", getUrlWithVariableValues(), e);
            return getFailedOutput();
        }
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public String getUrl() {
        return url;
    }

    /**
     * Get the URL the request will go to. In the URL all the variables and counters will be replace with their values.
     *
     * @return The URL which will be called.
     */
    private String getUrlWithVariableValues() {
        return insertVariableValues(url);
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public HashMap<String, String> getHeaders() {
        if (headers == null) {
            return new HashMap<>();
        }
        return (HashMap<String, String>) SerializationUtils.deserialize(headers);
    }

    /**
     * Like {@link #getHeaders()}, but all values of the header fields will have variables and counters inserted.
     *
     * @return The map of request headers, with the actual values of counters and variables in their values.
     */
    private Map<String, String> getHeadersWithVariableValues() {
        Map<String, String> result = new HashMap<>();
        getHeaders().forEach((k, v) -> result.put(k, insertVariableValues(v)));
        return result;
    }

    public void setHeaders(HashMap<String, String> headers) {
        this.headers = SerializationUtils.serialize(headers);
    }

    public Credentials getCredentials() {
        return credentials;
    }

    /**
     * Like {@link #getCredentials()}, but the name and password will have all variables and counters inserted.
     *
     * @return The credentials to use, with the actual values of counters and variables in their values.
     */
    private Credentials getCredentialsWithVariableValues() {
        if (credentials == null) {
            return new Credentials();
        }

        String name = insertVariableValues(credentials.getName());
        String password = insertVariableValues(credentials.getPassword());

        return new Credentials(name, password);
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public HashMap<String, String> getCookies() {
        if (cookies == null) {
            return new HashMap<>();
        }
        return (HashMap<String, String>) SerializationUtils.deserialize(cookies);
    }

    /**
     * Creates a new Set of Cookies out of the map of cookies. In every cookie value the counter and variables are
     * replaced with their actual value.
     *
     * @return A new Set of Cookies, with the actual variable and counter values.
     */
    private Set<Cookie> getCookiesWithVariableValues() {
        Set<Cookie> result = new HashSet<>();
        getCookies().forEach((n, v) -> result.add(new Cookie(n, insertVariableValues(v))));
        return result;
    }

    public void setCookies(HashMap<String, String> cookies) {
        this.cookies = SerializationUtils.serialize(cookies);
    }

    public String getData() {
        return data;
    }

    /**
     * Get the optional data which will be send together with a POST or PUT request. All variables and counters will be
     * replaced with their values.
     *
     * @return The data to include in the next POST/ PUT request.
     */
    private String getDataWithVariableValues() {
        return insertVariableValues(data);
    }

    public void setData(String data) {
        this.data = data;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    private void doRequest(WebServiceConnector target) throws Exception {
        final Map<String, String> requestHeaders = getHeadersWithVariableValues();
        if (credentials != null && credentials.areValid()) {
            logger.info(LoggerMarkers.LEARNER, "Using credentials '{}'.", credentials);
            requestHeaders.put("Authorization", "Basic " + getCredentialsWithVariableValues().toBase64());
        }

        switch (method) {
            case GET:
                target.get(baseUrl, getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(), timeout);
                break;
            case POST:
                target.post(baseUrl, getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(),
                        getDataWithVariableValues(), timeout);
                break;
            case PUT:
                target.put(baseUrl, getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(),
                        getDataWithVariableValues(), timeout);
                break;
            case DELETE:
                target.delete(baseUrl, getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(), timeout);
                break;
            default:
                logger.error(LoggerMarkers.LEARNER, "Tried to make a call to a REST API with an unknown method '{}'.",
                        method.name());
        }
    }

}
