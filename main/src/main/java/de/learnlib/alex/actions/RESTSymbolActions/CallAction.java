/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.actions.Credentials;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Lob;
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

    /** to be serializable. */
    private static final long serialVersionUID = 7971257988991996022L;

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /**
     * Enumeration to specify the HTTP method.
     */
    public enum Method {
        /** Refers to the GET method. */
        GET,

        /** Refers to the POST method. */
        POST,

        /** Refers to the PUT method. */
        PUT,

        /** Refers to the DELETE method. */
        DELETE
    }

    /** The method to use for the call. */
    @NotNull
    private Method method;

    /** The url to call. This is just the suffix which will be appended to the base url. */
    @NotBlank
    private String url;

    /**
     * Map to store headers, that will be send with the requests.
     * Every header name has a list of values, to be standard conform (e.g. Accept: text/html,application/xml).
     */
    @Lob
    private HashMap<String, String> headers;

    /**
     * Optional credentials to authenticate via HTTP basic auth.
     */
    @Embedded
    private Credentials credentials;

    /**
     * Map to store cookies, that will be send with the request.
     * Cookies are a normal header field, but this should make things easier.
     */
    @Lob
    private HashMap<String, String> cookies; // OM NOM NOM NOM!!!

    /** Optional data to sent with a POST or PUT request. */
    @Column(columnDefinition = "CLOB")
    private String data;

    /**
     * Default constructor that just initializes the internal data structures.
     */
    public CallAction() {
        this.headers = new HashMap<>();
        this.cookies = new HashMap<>();
    }

    /**
     * Get the method to use for the next request.
     *
     * @return The selected method.
     */
    public Method getMethod() {
        return method;
    }

    /**
     * Select a method to use for the request.
     *
     * @param method
     *         The new method to use.
     */
    public void setMethod(Method method) {
        this.method = method;
    }

    /**
     * Get the URL the request will go to.
     *
     * @return The URL which will be called.
     */
    public String getUrl() {
        return url;
    }

    /**
     * Get the URL the request will go to.
     * In the URL all the variables and counters will be replace with their values.
     *
     * @return The URL which will be called.
     */
    private String getUrlWithVariableValues() {
        return insertVariableValues(url);
    }

    /**
     * Set the URL to send the request to.
     *
     * @param url
     *         The URL to call.
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Get the map of the request header fields.
     * Every header has a list of values to follow the HTTP standard (e.g. Accept: text/html,application/xml).
     *
     * @return The map of request headers.
     */
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

    /**
     * Set the map of request headers.
     * Every header can have multiple values, see {@link #getHeaders()} for more information.
     *
     * @param headers
     *         The new request headers.
     */
    public void setHeaders(HashMap<String, String> headers) {
        this.headers = headers;
    }

    /**
     * Get the credentials to authenticate.
     *
     * @return The credentials to use for authentication.
     */
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

        String name     = insertVariableValues(credentials.getName());
        String password = insertVariableValues(credentials.getPassword());

        return new Credentials(name, password);
    }

    /**
     * Set the credentials to use for authentication.
     *
     * @param credentials The new credentials to use.
     */
    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    /**
     * Get the map of cookies that will be used for the requests.
     *
     * @return The map of cookies.
     */
    public HashMap<String, String> getCookies() {
        return cookies;
    }

    /**
     * Creates a new Set of Cookies out of the map of cookies.
     * In every cookie value the counter and variables are replaced with their actual value.
     *
     * @return A new Set of Cookies, with the actual variable and counter values.
     */
    private Set<Cookie> getCookiesWithVariableValues() {
        Set<Cookie> result = new HashSet<>();
        cookies.forEach((n, v) -> result.add(new Cookie(n, insertVariableValues(v))));
        return result;
    }

    /**
     * Set a new map of cookies for the request.
     *
     * @param cookies
     *         The new cookies.
     */
    public void setCookies(HashMap<String, String> cookies) {
        this.cookies = cookies;
    }

    /**
     * Get the optional data which will be send together with a POST or PUT request.
     *
     * @return The data to include in the next POST/ PUT request.
     */
    public String getData() {
        return data;
    }

    /**
     * Get the optional data which will be send together with a POST or PUT request.
     * All variables and counters will be replaced with their values.
     *
     * @return The data to include in the next POST/ PUT request.
     */
    private String getDataWithVariableValues() {
        return insertVariableValues(data);
    }

    /**
     * Set the optional data which will be send together with a POST or PUT request.
     *
     * @param data
     *         The data to include in the next POST/ PUT request.
     */
    public void setData(String data) {
        this.data = data;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        try {
            LOGGER.info("Do REST request '" + method + " " + url + "' "
                        + "(ignoreFailure : " + ignoreFailure + ", negated: " + negated + ").");

            doRequest(target);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info("Could not call " + getUrlWithVariableValues(), e);
            return getFailedOutput();
        }
    }

    private void doRequest(WebServiceConnector target) {
        Map<String, String> headers = getHeadersWithVariableValues();
        if (credentials != null) {
            headers.put("Authorization", "Basic " + getCredentialsWithVariableValues().toBase64());
        }

        switch (method) {
            case GET:
                target.get(getUrlWithVariableValues(), headers,
                           getCookiesWithVariableValues());
                break;
            case POST:
                target.post(getUrlWithVariableValues(), headers,
                            getCookiesWithVariableValues(), getDataWithVariableValues());
                break;
            case PUT:
                target.put(getUrlWithVariableValues(), headers,
                           getCookiesWithVariableValues(), getDataWithVariableValues());
                break;
            case DELETE:
                target.delete(getUrlWithVariableValues(), headers,
                              getCookiesWithVariableValues());
                break;
            default:
                LOGGER.warn("tried to make a call to a REST API with an unknown method '" + method.name() + "'.");
        }
    }

}
