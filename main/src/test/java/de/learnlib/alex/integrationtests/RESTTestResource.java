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

import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/test")
public class RESTTestResource {

    public static class RESTTestEntity {

        private String field1;

        private String field2;

        public String getField1() {
            return field1;
        }

        public void setField1(String field1) {
            this.field1 = field1;
        }

        public String getField2() {
            return field2;
        }

        public void setField2(String field2) {
            this.field2 = field2;
        }
    }

    private static int counter;

    @Path("/reset")
    @GET
    public void reset() {
        counter = 0;
    }

    @Path("")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getHello(@HeaderParam("X-CustomHeader") String customHeader, @CookieParam("MyCookie") String cookie) {
        return customHeader + ":" + cookie;
    }

    @Path("/entity")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public RESTTestEntity getEntity() {
        RESTTestEntity entity = new RESTTestEntity();
        if (counter % 2 == 0) {
            entity.setField1("Foo");
            entity.setField2("Bar");
        } else {
            entity.setField1("Hello");
            entity.setField2("World");
        }
        counter++;

        return entity;
    }

}
