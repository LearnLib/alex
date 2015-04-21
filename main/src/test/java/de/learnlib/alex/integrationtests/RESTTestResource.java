package de.learnlib.alex.integrationtests;

import javax.ws.rs.GET;
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
    public String getHello() {
        return "Hello";
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
