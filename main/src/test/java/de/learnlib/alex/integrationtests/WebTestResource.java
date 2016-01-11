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

package de.learnlib.alex.integrationtests;

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
        String content = new Scanner(new File(path), "UTF-8").useDelimiter("\\Z").next();

        return content;
    }

}
