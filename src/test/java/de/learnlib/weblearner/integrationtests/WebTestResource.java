package de.learnlib.weblearner.integrationtests;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.util.Scanner;

@Path("/web")
public class WebTestResource {

    @Path("/reset")
    @GET
    public void reset() {
        System.out.println("WebTestResource.reset ()");
    }

    @Path("/page1")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getPage1() throws IOException {
        String path = System.getProperty("user.dir") + "/src/test/resources/integrationtest/test_app.html";
        String content = new Scanner(new File(path)).useDelimiter("\\Z").next();

        System.out.println(content);

        return content;
    }

}
