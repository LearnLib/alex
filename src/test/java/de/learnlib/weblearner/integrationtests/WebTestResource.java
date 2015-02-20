package de.learnlib.weblearner.integrationtests;

import org.hsqldb.types.Charset;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Scanner;

@Path("/web")
public class WebTestResource {

    @Path("/reset")
    @GET
    public void reset() {
    }

    @Path("/page1")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public String getEntity() throws IOException {
        java.nio.file.Path path = Paths.get(System.getProperty("user.dir")
                                                    + "/src/test/resources/integrationtest/test_app.html");
        String content = new Scanner(new File("filename")).useDelimiter("\\Z").next();

        return content;
    }

}
