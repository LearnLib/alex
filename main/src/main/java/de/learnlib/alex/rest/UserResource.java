package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.ValidationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.List;

/**
 * REST resource to handle users
 */
@Path("/users")
public class UserResource {

    @Inject
    private UserDAO userDAO;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(User user) {
        try {
            userDAO.create(user);
            return Response.status(Status.CREATED).entity(user).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.create", Status.BAD_REQUEST, e);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll () {
        List<User> users = userDAO.getAll();
        return ResponseHelper.renderList(users, Status.OK);
    }
}
