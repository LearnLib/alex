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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.services.BaseUrlManager;
import org.glassfish.jersey.client.ClientProperties;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.Set;

/**
 * A Wrapper around a @{link WebTarget}.
 */
public class WebServiceConnector implements Connector {

    /** Internal field to determine if the target called at least once (-> other fields have a value). */
    private boolean init;

    /** The response HTTP status of the last call done by the connection. */
    private int status;

    /** The response HTTP headers of the last call done by the connection. */
    private MultivaluedMap<String, Object> headers;

    /** The response body of the last call done by the connection. */
    private String body;

    /** The cookies from th last call done by the connection. */
    private Map<String, NewCookie> cookies;

    /** Client for following redirects. */
    private Client client;

    private BaseUrlManager baseUrlManager;

    /**
     * Constructor which sets the WebTarget to use.
     */
    public WebServiceConnector(ProjectEnvironment environment) {
        this.client = ClientBuilder.newClient().property(ClientProperties.FOLLOW_REDIRECTS, false);
        this.baseUrlManager = new BaseUrlManager(environment);
    }

    @Override
    public void reset() {
    }

    @Override
    public void dispose() {
    }

    @Override
    public void post() {
    }

    /**
     * Get the response status of the last request.
     *
     * @return The last status received by the connections.
     * @throws java.lang.IllegalStateException
     *         If no request was done before the method call.
     */
    public int getStatus() throws IllegalStateException {
        if (!init) {
            throw new IllegalStateException();
        }
        return status;
    }

    /**
     * Get the response HTTP header of the last request.
     *
     * @return The last HTTP header received by the connections.
     * @throws java.lang.IllegalStateException
     *         If no request was done before the method call.
     */
    public MultivaluedMap<String, Object> getHeaders() throws IllegalStateException {
        if (!init) {
            throw new IllegalStateException();
        }
        return headers;
    }

    /**
     * Get the response body of the last request.
     *
     * @return The last body received by the connections.
     * @throws java.lang.IllegalStateException
     *         If no request was done before the method call.
     */
    public String getBody() throws IllegalStateException {
        if (!init) {
            throw new IllegalStateException();
        }
        return body;
    }

    /**
     * Get the cookies.
     *
     * @return The cookies.
     * @throws IllegalStateException
     *         If no request was done before the method call.
     */
    public Map<String, NewCookie> getCookies() throws IllegalStateException {
        if (!init) {
            throw new IllegalStateException();
        }
        return cookies;
    }

    /**
     * Do a HTTP GET request.
     *
     * @param path
     *         The path to send the request to.
     * @param requestHeaders
     *         The headers to send with the request.
     * @param requestCookies
     *         The cookies to send with the request.
     * @param timeout
     *         The amount of time in ms before the request is canceled.
     */
    public void get(String baseUrl, String path, Map<String, String> requestHeaders, Set<Cookie> requestCookies, int timeout) throws Exception {
        final Response response = getRequestObject(baseUrl, path, requestHeaders, requestCookies, timeout).get();
        rememberResponseComponents(response);
        followRedirects(response);
    }

    private Entity getBody(Map<String, String> requestHeaders, String data) {
        if (requestHeaders.containsKey("Content-Type")) {
            return Entity.entity(data, requestHeaders.get("Content-Type"));
        } else {
            return Entity.json(data);
        }
    }

    /**
     * Do a HTTP POST request.
     *
     * @param path
     *         The path to send the request to.
     * @param requestHeaders
     *         The headers to send with the request.
     * @param requestCookies
     *         The cookies to send with the request.
     * @param data
     *         The data to send with the request.
     * @param timeout
     *         The amount of time in ms before the request is canceled.
     */
    public void post(String baseUrl, String path, Map<String, String> requestHeaders, Set<Cookie> requestCookies, String data,
            int timeout) throws Exception {
        final Entity body = getBody(requestHeaders, data);
        final Response response = getRequestObject(baseUrl, path, requestHeaders, requestCookies, timeout).post(body);
        rememberResponseComponents(response);
        followRedirects(response);
    }

    /**
     * Do a HTTP PUT request.
     *
     * @param path
     *         The path to send the request to.
     * @param requestHeaders
     *         The headers to send with the request.
     * @param requestCookies
     *         The cookies to send with the request.
     * @param data
     *         The data to send with the request.
     * @param timeout
     *         The amount of time in ms before the request is canceled.
     */
    public void put(String baseUrl, String path, Map<String, String> requestHeaders, Set<Cookie> requestCookies,
            String data, int timeout) throws Exception {
        final Entity body = getBody(requestHeaders, data);
        final Response response = getRequestObject(baseUrl, path, requestHeaders, requestCookies, timeout).put(body);
        rememberResponseComponents(response);
        followRedirects(response);
    }

    /**
     * Do a HTTP DELETE request.
     *
     * @param path
     *         The path to send the request to.
     * @param requestHeaders
     *         The headers to send with the request.
     * @param requestCookies
     *         The cookies to send with the request.
     * @param timeout
     *         The amount of time in ms before the request is canceled.
     */
    public void delete(String baseUrl, String path, Map<String, String> requestHeaders, Set<Cookie> requestCookies, int timeout) throws Exception {
        final Response response = getRequestObject(baseUrl, path, requestHeaders, requestCookies, timeout).delete();
        rememberResponseComponents(response);
        followRedirects(response);
    }

    /**
     * Reset the connector and the SUL.
     *
     * @param resetUrl
     *         The url (based on the base url) to reset the SUL.
     */
    public void reset(String resetUrl) {
        client.target("").path(resetUrl).request().get();
        this.init = false;
    }

    /**
     * Multi setter for all the fields based on the response.
     *
     * @param response
     *         The response all other fields will be based on.
     */
    private void rememberResponseComponents(Response response) {
        status = response.getStatus();
        headers = response.getHeaders();
        body = response.readEntity(String.class);
        cookies = response.getCookies();
        init = true;
    }

    private void followRedirects(Response response) {
        while (response.getStatus() == Response.Status.FOUND.getStatusCode()) { // 302
            final String location = response.getHeaderString("Location");
            response = client.target(location).request().get();

            status = response.getStatus();
            headers = response.getHeaders();
            body = response.readEntity(String.class);

            // Overwrite cookies from previous requests if there are new cookies, otherwise keep the old ones.
            // This way, cookies that may be required don't get lost in redirects.
            if (!response.getCookies().isEmpty()) {
                cookies = response.getCookies();
            }
        }
    }

    /**
     * Creates a request object that is passed to further REST actions.
     *
     * @param path
     *         The URI that is called.
     * @param requestHeaders
     *         The HTTP headers of the request.
     * @param requestCookies
     *         The cookies of the request.
     * @param timeout
     *         The amount of time in ms before the request is canceled.
     * @return The request object.
     */
    private Invocation.Builder getRequestObject(String baseUrl, String path, Map<String, String> requestHeaders,
            Set<Cookie> requestCookies, int timeout) throws Exception {
        final String[] splitPath = path.split("\\?");

        final String url = baseUrlManager.getAbsoluteUrl(baseUrl, path);
        try {
            new URL(url);
        } catch (MalformedURLException e) {
            throw new Exception("The URL is malformed.");
        }

        WebTarget tmpTarget = client.target(url).path(splitPath[0]);

        if (splitPath.length > 1) {
            for (final String queryParam : splitPath[1].split("&")) {
                final String[] queryParamPair = queryParam.split("\\=");

                if (queryParamPair.length == 2) {
                    tmpTarget = tmpTarget.queryParam(queryParamPair[0], queryParamPair[1]);
                }
            }
        }
        final Invocation.Builder builder = tmpTarget.request();
        requestHeaders.forEach(builder::header);
        requestCookies.forEach(builder::cookie);

        builder.property(ClientProperties.CONNECT_TIMEOUT, timeout);
        builder.property(ClientProperties.READ_TIMEOUT, timeout);

        return builder;
    }
}
