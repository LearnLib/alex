package de.learnlib.weblearner.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.WebSymbol;
import de.learnlib.weblearner.utils.ResourceErrorHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import java.util.List;

/**
 * REST API to manage the symbols.
 * @resourcePath symbols
 * @resourceDescription Operations about symbols
 */
@Path("/projects/{project_id}/symbols")
public class SymbolResource {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    /** The {@link SymbolDAO} to use. */
    @Inject
    private SymbolDAO symbolDAO;

    /**
     * Create a new Symbol.
     *
     * @param projectId
     *            The ID of the project the symbol should belong to.
     * @param symbol
     *            The symbol to add.
     * @return On success the added symbol (enhanced with information from the DB); An error message on failure.
     * @responseType de.learnlib.weblearner.entities.Symbol
     * @successResponse 201 created
     * @errorResponse   400 bad request `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSymbol(@PathParam("project_id") long projectId, Symbol<?> symbol) {
        try {
            checkSymbolBeforeCreation(projectId, symbol); // can throw an IllegalArgumentException
            symbolDAO.create(symbol);

            String symbolURL = uri.getBaseUri() + "projects/" + symbol.getProjectId() + "/symbols/" + symbol.getId();
            return Response.status(Status.CREATED).header("Location", symbolURL).entity(symbol).build();

        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.BAD_REQUEST, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Create a bunch of new Symbols.
     *
     * @param projectId
     *            The ID of the project the symbol should belong to.
     * @param symbols
     *            The symbols to add.
     * @return On success the added symbols (enhanced with information from the DB); An error message on failure.
     * @responseType java.util.List<de.learnlib.weblearner.entities.Symbol>
     * @successResponse 201 created
     * @errorResponse   400 bad request `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response batchCreateSymbols(@PathParam("project_id") long projectId, List<Symbol<?>> symbols) {
        try {
            //TODO (Alex S.): can this loop be moved down to prevent multiple iteration over the symbol list?
            for (Symbol<?> symbol : symbols) {
                checkSymbolBeforeCreation(projectId, symbol); // can throw an IllegalArgumentException
            }
            symbolDAO.create(symbols);

            String json = createSymbolsJSON(symbols);
            return Response.status(Status.CREATED).entity(json).build();

        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.BAD_REQUEST, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.batchCreateSymbols",
                    Status.BAD_REQUEST, e);
        } catch (JsonProcessingException e) {
            LOGGER.error("Could write the symbols from the DB into proper JSON!", e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.batchCreateSymbols",
                    Status.INTERNAL_SERVER_ERROR, null);
        }
    }

    private void checkSymbolBeforeCreation(long projectId, Symbol<?> symbol) {
        if (symbol.getProjectId() == 0) {
            symbol.setProjectId(projectId);
        } else if (symbol.getProjectId() != projectId) {
            throw new IllegalArgumentException("The symbol should not have a project"
                    + "or at least the project id should be the one in the get parameter");
        }
    }

    /**
     * Get all the Symbols of a specific Project.
     *
     * @param projectId
     *         The ID of the project.
     * @param type
     *         Specify the type of the symbols you are intressted in.
     *         Valid valus are: 'all', web, 'rest'. Default is 'all'.
     * @return A list of all Symbols belonging to the project.
     * @responseType java.util.List<de.learnlib.weblearner.entities.Symbol>
     * @successResponse 200 OK
     * @errorResponse   400 bad request `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("project_id") long projectId,
                           @QueryParam("type") @DefaultValue("all") String type) {
        try {
            List<Symbol<?>> symbols;
            switch(type) {
            case "all":
                symbols = symbolDAO.getAll(projectId);
                break;
            case "web":
                symbols = symbolDAO.getAll(projectId, WebSymbol.class);
                break;
            case "rest":
                symbols = symbolDAO.getAll(projectId, RESTSymbol.class);
                break;
            default:
                IllegalArgumentException e = new IllegalArgumentException("Unknown type:" + type + ".");
                return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.create", Status.BAD_REQUEST, e);
            }

            String json = createSymbolsJSON(symbols);
            return Response.status(Status.OK).header("X-Total-Count", symbols.size()).entity(json).build();
        } catch (JsonProcessingException e) {
            LOGGER.error("Could write the symbols from the DB into proper JSON!", e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.getAll", Status.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    /**
     * Get a Symbol by its ID.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @return A Symbol matching the projectID & ID or a not found response.
     * @responseType de.learnlib.weblearner.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") long projectId, @PathParam("id") long id) {
        Symbol<?> symbol = symbolDAO.get(projectId, id);
        if (symbol != null) {
            return Response.ok(symbol).build();
        } else {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.get", Status.NOT_FOUND, null);
        }
    }

    /**
     * Get a Symbol by its ID & revision.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @param revision
     *            The revision of the symbol.
     * @return A Symbol matching the projectID, ID & revision or a not found response.
     * @responseType de.learnlib.weblearner.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}:{revision}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWithRevision(@PathParam("project_id") long projectId, @PathParam("id") long id,
            @PathParam("revision") long revision) {
        Symbol<?> symbol = symbolDAO.get(projectId, id, revision);
        if (symbol != null) {
            return Response.ok(symbol).build();
        } else {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.get", Status.NOT_FOUND, null);
        }
    }

    /**
     * Update a Symbol.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @param symbol
     *            The new symbol data.
     * @return On success the updated symbol (maybe enhanced with information from the DB); An error message on failure.
     * @responseType de.learnlib.weblearner.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   400 bad request `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("project_id") long projectId, @PathParam("id") long id, Symbol<?> symbol) {
        if (id != symbol.getId() || projectId != symbol.getProjectId()) {
            return  Response.status(Status.BAD_REQUEST).build();
        } else {
            try {
                symbolDAO.update(symbol);
                return Response.ok(symbol).build();
            } catch (IllegalArgumentException e) {
                return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.update", Status.NOT_FOUND, e);
            } catch (ValidationException e) {
                return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.update", Status.BAD_REQUEST, e);
            }
        }
    }

    /*
    @PUT
    @Path("/{id}:{revision}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateWithRevision(@PathParam("project_id") long projectId, @PathParam("id") long id,
            @PathParam("revision") long revision, Symbol symbol) {
        symbolDAO.update(symbol);
        return Response.ok(symbol).build();
    }
    */

    /**
     * Mark on symbol as deleted.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/{id}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("project_id") long projectId, @PathParam("id") long id) {
        try {
            symbolDAO.hide(projectId, id);
            return Response.status(Status.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.delete", Status.NOT_FOUND, e);
        }
    }

    /**
     * Remove the deleted flag from a symbol.
     *
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/{id}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("project_id") long projectId, @PathParam("id") long id) {
        try {
            symbolDAO.show(projectId, id);
            return Response.status(Status.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.delete", Status.NOT_FOUND, e);
        }
    }

    /**
     * Create the JSON for a list of Symbols with the 'type' property. Workaround of a Jackson thing.
     * 
     * @param symbols
     *            The List of Symbols to convert into JSON.
     * @return The Symbols in JSON.
     * @throws JsonProcessingException
     *             If something went wrong while converting to JSON.
     */
    private String createSymbolsJSON(List<Symbol<?>> symbols) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writerWithType(new TypeReference<List<Symbol<?>>>() { })
                .writeValueAsString(symbols);
    }

}
