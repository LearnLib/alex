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

}
