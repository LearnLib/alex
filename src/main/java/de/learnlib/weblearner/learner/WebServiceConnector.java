package de.learnlib.weblearner.learner;

import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

/**
 * A Wrapper/ Facade around a @{link WebTarget}.
 */
public class WebServiceConnector implements Connector {

    /** The target behind the connector. */
    private WebTarget target;

    /** A managed base url to use. */
    private BaseUrlManager baseUrl;

    /** Internal field to determine if the target called at least once (-> other fields have a value). */
    private boolean init;

    /** The response HTTP status of the last call done by the connection. */
    private int status;

    /** The response HTTP headers of the last call done by the connection.  */
    private MultivaluedMap<String, Object> headers;

    /** The response body of the last call done by the connection. */
    private String body;

    /**
     * Constructor which sets the WebTarget to use.
     *
     * @param baseUrl
     *         The base url used by the connector. All other paths will treated as suffix to this.
     */
    public WebServiceConnector(String baseUrl) {
        this.baseUrl = new BaseUrlManager(baseUrl);

        this.target = ClientBuilder.newClient().target(baseUrl);
    }

    /**
     * Constructor for testing purpose which sets the WebTarget to use.
     *
     * @param target
     *         The WebTarget the connection will use.
     * @param baseUrl
     *         The base URL used by the connector. All other paths will treated as suffix to this.
     * @param resetUrl
     *         The url to reset the SUL. This URL is relative to the base URL.
     */
     WebServiceConnector(WebTarget target, String baseUrl, String resetUrl) {
        this.baseUrl = new BaseUrlManager(baseUrl);

        this.target = target;
        reset(resetUrl);
    }


    /**
     * Get the response status of the last request.
     * You have to do at least on request ({@link #get(String)}|{@link #post(String, String)}|
     * {@link #put(String, String)}|{@link #delete(String)}).
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
     * You have to do at least on request ({@link #get(String)}|{@link #post(String, String)}|
     * {@link #put(String, String)}|{@link #delete(String)}).
     *
     * @return The last HTTP header received by the connections.
     * @throws java.lang.IllegalStateException
     *         If no request was done before the method call.
     */
    public MultivaluedMap<String, Object> getHeaders() throws IllegalStateException {
        if (!init) {
            throw  new IllegalStateException();
        }
        return headers;
    }

    /**
      * Get the response body of the last request.
      * You have to do at least on request ({@link #get(String)}|{@link #post(String, String)}|
      * {@link #put(String,String)}|{@link #delete(String)}).
      *
      * @return The last body received by the connections.
      * @throws java.lang.IllegalStateException
      *         If no request was done before the method call.
     */
    public String getBody() throws IllegalStateException {
        if (!init) {
            throw  new IllegalStateException();
        }
        return body;
    }

    /**
     * Do a HTTP GET request.
     *
     * @param path
     *         The path to send the request to.
     */
    public void get(String path) {
        Response response = getRequestObject(path).get();
        rememberResponseComponents(response);
    }

    /**
     * Do a HTTP POST request.
     *
     * @param path
     *         The path to send the request to.
     * @param jsonData
     *         The data to send with the request.
     */
    public void post(String path, String jsonData) {
        Response response = getRequestObject(path).post(Entity.json(jsonData));
        rememberResponseComponents(response);
    }

    /**
     * Do a HTTP PUT request.
     *
     * @param path
     *         The path to send the request to.
     * @param jsonData
     *         The data to send with the request.
     */
    public void put(String path, String jsonData) {
        Response response = getRequestObject(path).put(Entity.json(jsonData));
        rememberResponseComponents(response);
    }

    /**
     * Do a HTTP DELETE request.
     *
     * @param path
     *         The path to send the request to.
     */
    public void delete(String path) {
        Response response = getRequestObject(path).delete();
        rememberResponseComponents(response);
    }

    /**
     * Reset the connector and the SUL.
     *
     * @param resetUrl
     *         The url (based on the base url) to reset the SUL.
     */
    public void reset(String resetUrl) {
        get(resetUrl);
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
        init = true;
    }

    /**
     * Get the base url of the API to call. All requests will be based on this!
     * @see BaseUrlManager#getBaseUrl()

     * @return The base url for all the requests.
     */
    public String getBaseUrl() {
        return baseUrl.getBaseUrl();
    }

    private Invocation.Builder getRequestObject(String path) {
        return target.path(path).request();
    }
}
