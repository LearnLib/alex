package de.learnlib.alex.rest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Proxy class needed to workaround some 'iframe' restrictions when working with multiple domains.
 * @exclude
 * @resourcePath Proxy for IFrame
 */
@Path("proxy")
public class IFrameProxyResource {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** Get the UriInfo from the Context. */
    @Context
    private UriInfo uriInfo;

    /**
     * Method used to pretend the requested site has our domain.
     *
     * @param url
     *            The URL of the requested page.
     * @return The requested page, modified to fit our needs.
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response doGetProxy(@QueryParam("url") String url, @HeaderParam("Cookie") String cookies) {
        try {
            Connection connection = Jsoup.connect(url);
            connection = parseAndProcessCookies(connection, cookies);
            connection = connection.method(Connection.Method.GET);

            return createResponse(connection);
        } catch (IllegalArgumentException e) { // Java 1.6 has no multi catch
            LOGGER.info("Bad URL: {}", url);
            LOGGER.info(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown URL").build();
        } catch (IOException e) {
            LOGGER.info("Bad request type: {}", url);
            LOGGER.info(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown request type").build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response doPostProxy(@QueryParam("url") String url, @HeaderParam("Cookie") String cookies, MultivaluedMap<String, String> body) {
        try {
            Connection connection = Jsoup.connect(url);
            connection = parseAndProcessCookies(connection, cookies);
            connection = parseAndProcessFormData(connection, body);
            connection = connection.method(Connection.Method.POST);

            return createResponse(connection);
        } catch (IllegalArgumentException e) {
            LOGGER.info("Bad URL: {}", url);
            LOGGER.info(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown URL").build();
        } catch (IOException e) {
            LOGGER.info("Bad request type: {}", url);
            LOGGER.info(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown request type").build();
        }
    }

    private Connection parseAndProcessCookies(Connection connection, String cookies) {
        if (cookies == null) {
            return connection;
        }

        for (String cookie : cookies.split(";")) {
            String[] keyValuePair = cookie.split("=");
            String key = keyValuePair[0].trim();
            String value = keyValuePair[1].trim();
            connection = connection.cookie(key, value);
        }
        return connection;
    }

    private Connection parseAndProcessFormData(Connection connection, MultivaluedMap<String, String> body) {
        for (String key : body.keySet()) {
            List<String> values = body.get(key);
            for (String value : values) {
                connection = connection.data(key, value);
            }
        }
        return connection;
    }

    private Response createResponse(Connection connection) throws IOException {
        Connection.Response response = connection.execute();
        Document doc = response.parse();
        proxiefy(doc);
        List<NewCookie> cookieList = new LinkedList<>();
        response.cookies().forEach((key, value) -> cookieList.add(new NewCookie(key, value)));
        NewCookie[] cookiesAsArray = cookieList.toArray(new NewCookie[cookieList.size()]);

        return Response.status(response.statusCode()).cookie(cookiesAsArray).entity(doc.html()).build();
    }

    /**
     * Changes all references to other sites, images, ... in one Document to an absolute path or to a path using this
     * proxy.
     * 
     * @param doc
     *            The Document to change.
     */
    private void proxiefy(Document doc) {
        // make references from elements with a 'src' attribute absolute
        for (Element style : doc.select("img, script")) {
            absolutifyURL(style, "src");
        }

        // make references from elements with a 'href' attribute absolute
        for (Element link : doc.select("link")) {
            absolutifyURL(link, "href");
        }

        // links should use this proxy
        for (Element link : doc.getElementsByTag("a")) {
            proxiefy(link, "href");
        }

        // forms
        for (Element form : doc.getElementsByTag("form")) {
            proxiefy(form, "action");
        }
    }

    /**
     * Changes an URL in one attribute of an element to an absolute path. Is 'absolutify a real word?
     * 
     * @param elem
     *            The Element having the relative attribute.
     * @param attribute
     *            The Attribute to change.
     */
    private void absolutifyURL(Element elem, String attribute) {
        String url = elem.attr(attribute);

        if (!url.isEmpty()) {
            elem.attr(attribute, elem.absUrl(attribute));
        }
    }

    /**
     * Changes the 'href' attribute of a link to a version which uses this proxy. Is 'proxiefy' a real word?
     *
     * @param elem
     *         The Link-Element to proxiefy.
     * @param attribute
     *         The Attribute to change.
     */
    private void proxiefy(Element elem, String attribute) {
        try {
            String originalReference = elem.attr(attribute);
            if (!originalReference.startsWith("#")) {
                absolutifyURL(elem, attribute);
                elem.attr(attribute, uriInfo.getAbsolutePath() + "?url=" + URLEncoder.encode(elem.attr(attribute), "UTF-8"));
            }
        } catch (UnsupportedEncodingException e) {
            // should never happen
            LOGGER.error("Could not encode the URL because of an unsupported encoding", e);
        }
    }

}
