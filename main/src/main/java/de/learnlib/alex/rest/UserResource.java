package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.security.RsaKeyHolder;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.ValidationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.security.interfaces.RSAPublicKey;
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
    public Response getAll() {
        List<User> users = userDAO.getAll();
        return ResponseHelper.renderList(users, Status.OK);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/login")
    public Response login(User user) {
        User realUser = userDAO.getByEmail(user.getEmail());
        if (realUser != null) {
            try {
                return Response.ok(generateJWT(realUser)).build();
            } catch (JoseException e) {
                e.printStackTrace();
                return Response.status(Status.NOT_FOUND).build();
            }
        } else {
            return Response.status(Status.BAD_REQUEST).build();
        }
    }

    private String generateJWT(User user) throws JoseException{

        // generate claims with user data
        JwtClaims claims = new JwtClaims();
        claims.setIssuer("ALEX");
        claims.setGeneratedJwtId();
        claims.setClaim("userId", user.getId());
        claims.setClaim("userRole", user.getRole());

        // create signature
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());
        jws.setKey(RsaKeyHolder.getKey().getPrivateKey());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);

        // return signed jwt
        return "{\"token\": \"" + jws.getCompactSerialization() + "\"}";
    }
}
