/*
 * Copyright 2015 - 2019 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.actions.Credentials;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.ws.rs.core.Cookie;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * RESTSymbolAction to make a request to the API.
 */
@Entity
@DiscriminatorValue("rest_call")
@JsonTypeName("rest_call")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CallAction extends RESTSymbolAction {

    private static final long serialVersionUID = 7971257988991996022L;

    private static final Logger LOGGER = LogManager.getLogger();

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
     * The url to call. This is just the suffix which will be appended to the base url.
     */
    @NotBlank
    private String url;

    /** The amount of time in ms before the request is aborted. The value 0 means wait infinitely long. */
    @NotNull
    @Min(value = 0)
    private int timeout;

    /**
     * Map to store headers, that will be send with the requests. Every header name has a list of values, to be standard
     * conform (e.g. Accept: text/html,application/xml).
     */
    @Lob
    private HashMap<String, String> headers;

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
    private HashMap<String, String> cookies; // OM NOM NOM NOM!!!

    /**
     * Optional data to sent with a POST or PUT request.
     */
    @Column(columnDefinition = "MEDIUMTEXT")
    private String data;

    /**
     * Default constructor that just initializes the internal data structures.
     */
    public CallAction() {
        this.headers = new HashMap<>();
        this.cookies = new HashMap<>();
        this.timeout = 0;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        try {
            LOGGER.info(LoggerMarkers.LEARNER, "Doing REST request '{} {}'.",
                    method, url);

            doRequest(target);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not call {}.", getUrlWithVariableValues(), e);
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
        return headers;
    }

    /**
     * Like {@link #getHeaders()}, but all values of the header fields will have variables and counters inserted.
     *
     * @return The map of request headers, with the actual values of counters and variables in their values.
     */
    private Map<String, String> getHeadersWithVariableValues() {
        Map<String, String> result = new HashMap<>();
        headers.forEach((k, v) -> result.put(k, insertVariableValues(v)));
        return result;
    }

    public void setHeaders(HashMap<String, String> headers) {
        this.headers = headers;
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
        return cookies;
    }

    /**
     * Creates a new Set of Cookies out of the map of cookies. In every cookie value the counter and variables are
     * replaced with their actual value.
     *
     * @return A new Set of Cookies, with the actual variable and counter values.
     */
    private Set<Cookie> getCookiesWithVariableValues() {
        Set<Cookie> result = new HashSet<>();
        cookies.forEach((n, v) -> result.add(new Cookie(n, insertVariableValues(v))));
        return result;
    }

    public void setCookies(HashMap<String, String> cookies) {
        this.cookies = cookies;
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

    private void doRequest(WebServiceConnector target) {
        final Map<String, String> requestHeaders = getHeadersWithVariableValues();
        if (credentials != null && credentials.areValid()) {
            LOGGER.info(LoggerMarkers.LEARNER, "Using credentials '{}'.", credentials);
            requestHeaders.put("Authorization", "Basic " + getCredentialsWithVariableValues().toBase64());
        }

        switch (method) {
            case GET:
                target.get(getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(), timeout);
                break;
            case POST:
                target.post(getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(),
                        getDataWithVariableValues(), timeout);
                break;
            case PUT:
                target.put(getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(),
                        getDataWithVariableValues(), timeout);
                break;
            case DELETE:
                target.delete(getUrlWithVariableValues(), requestHeaders, getCookiesWithVariableValues(), timeout);
                break;
            default:
                LOGGER.error(LoggerMarkers.LEARNER, "Tried to make a call to a REST API with an unknown method '{}'.",
                        method.name());
        }
    }

}
