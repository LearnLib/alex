package de.learnlib.alex.utils;

import javax.ws.rs.core.Response;
import java.util.List;

public class ResponseHelper {

    private ResponseHelper() {
    }

    public static Response renderList(List<?> list, Response.Status status) {
        return Response.status(status)
                       .header("X-Total-Count", list.size())
                       .entity(list)
                       .build();
    }

    public static Response renderStringList(List<?> list, Response.Status status) {
        return Response.status(status)
                       .header("X-Total-Count", list.size())
                       .entity(list.toString())
                       .build();
    }

}
