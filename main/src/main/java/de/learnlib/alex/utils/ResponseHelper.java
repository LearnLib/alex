package de.learnlib.alex.utils;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * A utility class to render List to a response with additional information in the header.
 */
public final class ResponseHelper {

    /**
     * Deactivated the default constructor because this is only a utility class.
     */
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
