package de.learnlib.alex.core.learner;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class BaseUrlManagerTest {

    private static final String BASE_URL = "http://localhost";
    private static final String FINAL_URL = "http://localhost/test";

    private BaseUrlManager manager;

    @Before
    public void setUp() {
        manager = new BaseUrlManager(BASE_URL);
    }

    @Test
    public void shouldCreateCorrectUrls() {
        String url = manager.getAbsoluteUrl("test");
        assertEquals(FINAL_URL, url);

        url = manager.getAbsoluteUrl("/test");
        assertEquals(FINAL_URL, url);

        manager.setBaseUrl(BASE_URL + "/");
        url = manager.getAbsoluteUrl("test");
        assertEquals(FINAL_URL, url);

        url = manager.getAbsoluteUrl("/test");
        assertEquals(FINAL_URL, url);
    }

}
