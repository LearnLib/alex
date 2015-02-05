package de.learnlib.weblearner.rest;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.UriInfo;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class IFrameProxyResourceTest {

    private static final String TEST_LINK_URL
                                    = "http://www.example.com/?url=http%3A%2F%2Fwww.example.com%2Fawesome_site.html";
    private static final String TEST_IMG_URL = "http://www.example.com/image.jpg";
    private static final String TEST_STYLE_URL = "http://www.example.com/css/style.css";
    private static final Object TEST_SCRIPT_URL = "http://www.example.com/js/script.js";

    private IFrameProxyResource ifpt;
    private Document doc;

    @Before
    public void setUp() throws NoSuchFieldException, SecurityException, URISyntaxException, IllegalArgumentException,
            IllegalAccessException, IOException {
        UriInfo uriInfo = mock(UriInfo.class);
        given(uriInfo.getAbsolutePath()).willReturn(new URI("http://www.example.com/"));

        ifpt = new IFrameProxyResource();
        Field uriInfoField = IFrameProxyResource.class.getDeclaredField("uriInfo");
        uriInfoField.setAccessible(true);
        uriInfoField.set(ifpt, uriInfo);

        File file = new File(getClass().getResource("/rest/IFrameProxyTestData.html").toURI());
        doc = Jsoup.parse(file, "UTF-8", "http://www.example.com/");
    }

    @Test
    public void testAbsolutifyURL() throws NoSuchMethodException, SecurityException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException, IOException, URISyntaxException {
        Method absolutifyURL = IFrameProxyResource.class
                                    .getDeclaredMethod("absolutifyURL", Element.class, String.class);
        absolutifyURL.setAccessible(true);

        for (Element image : doc.getElementsByTag("img")) {
            absolutifyURL.invoke(ifpt, image, "src");
            assertEquals(TEST_IMG_URL, image.attr("src"));
        }

        // special cases
        Element firstImg = doc.getElementsByTag("img").first();
        String originalSrc = firstImg.attr("src");
        absolutifyURL.invoke(ifpt, firstImg, "");
        assertEquals(originalSrc, firstImg.attr("src"));
    }

    @Test
    public void testProxiefyLink() throws NoSuchMethodException, SecurityException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException, IOException, URISyntaxException, NoSuchFieldException {
        Method proxiefyLink = IFrameProxyResource.class.getDeclaredMethod("proxiefyLink", Element.class);
        proxiefyLink.setAccessible(true);

        for (Element link : doc.getElementsByTag("a")) {
            proxiefyLink.invoke(ifpt, link);
            assertEquals(TEST_LINK_URL, link.attr("href"));
        }
    }

    @Test
    public void testProxiefy() throws NoSuchMethodException, SecurityException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException {
        Method proxiefy = IFrameProxyResource.class.getDeclaredMethod("proxiefy", Document.class);
        proxiefy.setAccessible(true);

        proxiefy.invoke(ifpt, doc);

        for (Element image : doc.getElementsByTag("link")) {
            assertEquals(TEST_STYLE_URL, image.attr("href"));
        }

        for (Element image : doc.getElementsByTag("script")) {
            assertEquals(TEST_SCRIPT_URL, image.attr("src"));
        }

        for (Element image : doc.getElementsByTag("img")) {
            assertEquals(TEST_IMG_URL, image.attr("src"));
        }

        for (Element link : doc.getElementsByTag("a")) {
            assertEquals(TEST_LINK_URL, link.attr("href"));
        }
    }

}
