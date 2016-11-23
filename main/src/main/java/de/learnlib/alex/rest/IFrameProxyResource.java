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

package de.learnlib.alex.rest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
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

    /** The timeout time in ms. */
    private static final int REQUEST_TIMEOUT_TIME = 10000; // in ms

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker REST_MARKER     = MarkerManager.getMarker("REST");
    private static final Marker RESOURCE_MARKER = MarkerManager.getMarker("IFRAME_PROXY_RESOURCE")
                                                                    .setParents(REST_MARKER);

    /** Get the UriInfo from the Context. */
    @Context
    private UriInfo uriInfo;

    /**
     * Method used to pretend the requested site (over GET) has our domain .
     *
     * @param url
     *            The URL of the requested page.
     * @param cookies
     *         The cookies to send through.
     * @return The requested page, modified to fit our needs.
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response doGetProxy(@QueryParam("url") String url, @HeaderParam("Cookie") String cookies) {
        LOGGER.traceEntry("doGetProxy({}, {}).", url, cookies);

        try {
            Connection.Response response = Jsoup.connect(url)
                    .method(Connection.Method.GET)
                    .cookies(parseCookies(cookies))
                    .timeout(REQUEST_TIMEOUT_TIME)
                    .followRedirects(true)
                    .execute();

            LOGGER.traceExit(response);
            return createResponse(response);
        } catch (IllegalArgumentException e) {
            LOGGER.info(RESOURCE_MARKER, "Bad URL: {}", url);
            LOGGER.traceExit(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown URL").build();
        } catch (IOException e) {
            LOGGER.info(RESOURCE_MARKER, "Bad request type: {}", url);
            LOGGER.traceExit(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown request type").build();
        }
    }

    /**
     * Method used to pretend the requested site (over GET) has our domain .
     *
     * @param url
     *         The URL of the requested page.
     * @param cookies
     *         The cookies to send through.
     * @param body
     *         The body to send through.
     * @return The requested page, modified to fit our needs.
     */
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response doPostProxy(@QueryParam("url") String url,
                                @HeaderParam("Cookie") String cookies,
                                MultivaluedMap<String, String> body) {
        LOGGER.traceEntry("doPostProxy({}, {}, {}).", url, cookies, body);

        try {
            Connection.Response response = Jsoup.connect(url)
                    .method(Connection.Method.POST)
                    .cookies(parseCookies(cookies))
                    .data(parseFormData(body))
                    .timeout(REQUEST_TIMEOUT_TIME)
                    .followRedirects(true)
                    .execute();

            LOGGER.traceExit(response);
            return createResponse(response);
        } catch (IllegalArgumentException e) {
            LOGGER.info(RESOURCE_MARKER, "Bad URL: {}", url);
            LOGGER.traceExit(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown URL").build();
        } catch (IOException e) {
            LOGGER.info(RESOURCE_MARKER, "Bad request type: {}", url);
            LOGGER.traceExit(e);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown request type").build();
        }
    }

    private Map<String, String> parseCookies(String cookies) {
        Map<String, String> cookieMap = new HashMap<>();
        if (cookies != null) {
            for (String cookie : cookies.split(";")) {
                String[] keyValuePair = cookie.split("=");
                String key = keyValuePair[0].trim();
                String value = keyValuePair[1].trim();
                cookieMap.put(key, value);
            }
        }
        return cookieMap;
    }

    private Map<String, String> parseFormData(MultivaluedMap<String, String> body) {
        Map<String, String> formData = new HashMap<>();
        for (Map.Entry<String, List<String>> entry : body.entrySet()) {
            String key = entry.getKey();
            for (String value : entry.getValue()) {
                System.out.println(key);
                System.out.println(value);
                formData.put(key, value);
            }
        }
        return formData;
    }

    private Response createResponse(Connection.Response response) throws IOException {
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
                String newUrl = uriInfo.getAbsolutePath() + "?url=" + URLEncoder.encode(elem.attr(attribute), "UTF-8");
                elem.attr(attribute, newUrl);
            }
        } catch (UnsupportedEncodingException e) {
            // should never happen
            LOGGER.error("Could not encode the URL because of an unsupported encoding", e);
        }
    }

}
