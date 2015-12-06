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

    /**
     * Create a Response for a List that includes the "X-Total-Count" header.
     * This method will treat the list elements as JSON ready objects.
     *
     * @param list
     *         The list to include in the Response.
     *         The Elements of the list will be "rendered" using the standard JSON processor.
     * @param status
     *         The status of the Response.
     * @return The corresponding Response.
     */
    public static Response renderList(List<?> list, Response.Status status) {
        return Response.status(status)
                       .header("X-Total-Count", list.size())
                       .entity(list)
                       .build();
    }

    /**
     * Create a Response for a List that includes the "X-Total-Count" header.
     * This method will call toString() on all list elements before they are returned in the Response.
     *
     * @param list
     *         The list to include in the Response.
     *         The Elements of the list will be "rendered" using the toString method.
     * @param status
     *         The status of the Response.
     * @return The corresponding Response.
     */
    public static Response renderStringList(List<?> list, Response.Status status) {
        return Response.status(status)
                       .header("X-Total-Count", list.size())
                       .entity(list.toString())
                       .build();
    }

}
