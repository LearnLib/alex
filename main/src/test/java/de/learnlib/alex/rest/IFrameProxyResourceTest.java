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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class IFrameProxyResourceTest {

    private static final String TEST_LINK_URL
                                    = "http://www.example.com/?url=http%3A%2F%2Fwww.example.com%2Fawesome_site.html";
    private static final String TEST_IMG_URL = "http://www.example.com/image.jpg";
    private static final String TEST_STYLE_URL = "http://www.example.com/css/style.css";
    private static final Object TEST_SCRIPT_URL = "http://www.example.com/js/script.js";

    private IFrameProxyResource iFrameProxyResource;
    private Document doc;

    @Before
    public void setUp() throws Exception {
        UriInfo uriInfo = mock(UriInfo.class);
        given(uriInfo.getAbsolutePath()).willReturn(new URI("http://www.example.com/"));

        iFrameProxyResource = new IFrameProxyResource();
        Field uriInfoField = IFrameProxyResource.class.getDeclaredField("uriInfo");
        uriInfoField.setAccessible(true);
        uriInfoField.set(iFrameProxyResource, uriInfo);

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
            absolutifyURL.invoke(iFrameProxyResource, image, "src");
            assertEquals(TEST_IMG_URL, image.attr("src"));
        }

        // special cases
        Element firstImg = doc.getElementsByTag("img").first();
        String originalSrc = firstImg.attr("src");
        absolutifyURL.invoke(iFrameProxyResource, firstImg, "");
        assertEquals(originalSrc, firstImg.attr("src"));
    }

    @Test
    public void testProxiefyLink() throws Exception {
        Method proxiefyLink = IFrameProxyResource.class.getDeclaredMethod("proxiefy", Element.class, String.class);
        proxiefyLink.setAccessible(true);

        for (Element link : doc.getElementsByTag("a")) {
            proxiefyLink.invoke(iFrameProxyResource, link, "href");
            assertEquals(TEST_LINK_URL, link.attr("href"));
        }
    }

    @Test
    public void testProxiefy() throws Exception {
        Method proxiefy = IFrameProxyResource.class.getDeclaredMethod("proxiefy", Document.class);
        proxiefy.setAccessible(true);

        proxiefy.invoke(iFrameProxyResource, doc);

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

    @Test
    public void shouldNotProxiefySiteAnchors() throws  Exception {
        Method proxiefy = IFrameProxyResource.class.getDeclaredMethod("proxiefy", Element.class, String.class);
        proxiefy.setAccessible(true);
        Element element = mock(Element.class);
        given(element.attr("href")).willReturn("#foobar");

        proxiefy.invoke(iFrameProxyResource, element, "href");

        verify(element, never()).attr(eq("href"), anyString());
    }

}
