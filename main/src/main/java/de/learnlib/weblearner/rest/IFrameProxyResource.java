package de.learnlib.weblearner.rest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

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
    public Response doIt(@QueryParam("url") String url) {
        try {
            Document doc = Jsoup.connect(url).get();
            proxiefy(doc);
            return Response.ok(doc.html()).build();

        } catch (IllegalArgumentException e) { // Java 1.6 has no multi catch
            LOGGER.info("Bad URL: {}", url);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown URL").build();
        } catch (IOException e) {
            LOGGER.info("Bad request type: {}", url);
            return Response.status(Status.BAD_REQUEST).entity("400 - Bad Request: Unknown request type").build();
        }
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
            proxiefyLink(link);
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
     * @param link
     *            The Link-Element to proxiefy.
     */
    private void proxiefyLink(Element link) {
        absolutifyURL(link, "href");
        try {
            link.attr("href", uriInfo.getAbsolutePath() + "?url=" + URLEncoder.encode(link.attr("href"), "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            // should never happen
            LOGGER.error("Could not encode the URL because of an unsopperted encoding", e);
        }
    }
}
