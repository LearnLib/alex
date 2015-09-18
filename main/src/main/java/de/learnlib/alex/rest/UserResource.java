package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.security.RsaKeyHolder;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.internal.constraintvalidators.EmailValidator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.lang.JoseException;

import org.apache.shiro.crypto.hash.Sha512Hash;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;

import javax.inject.Inject;
import javax.validation.ConstraintValidatorContext;
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

    private final int HASH_ITERATIONS = 2048;

    @Inject
    private UserDAO userDAO;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(User user) {
        try {
            // validate email address
            if (! new EmailValidator().isValid(user.getEmail(), null)) {
                throw new ValidationException("The email is not valid");
            }

            // create and save hashed password and salt
            String salt = new SecureRandomNumberGenerator().nextBytes().toBase64();
            String hashedPassword = new Sha512Hash(user.getPassword(), salt, HASH_ITERATIONS).toBase64();

            user.setPassword(hashedPassword);
            user.setSalt(salt);

            // create user
            userDAO.create(user);
            return Response.status(Status.CREATED).entity(user).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.create", Status.BAD_REQUEST, e);
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
                String hashedPassword = new Sha512Hash(user.getPassword(), realUser.getSalt(), HASH_ITERATIONS).toBase64();
                if (hashedPassword.equals(realUser.getPassword())) {
                    return Response.ok(generateJWT(realUser)).build();
                } else {
                    return Response.status(Status.BAD_REQUEST).build();
                }
            } catch (JoseException e) {
                e.printStackTrace();
                return Response.status(Status.NOT_FOUND).build();
            }
        } else {
            return Response.status(Status.BAD_REQUEST).build();
        }
    }

    /**
     * Generates a JWT as String representation with JSON {"token": [the-encoded-token]}
     * Encodes the id and the role of the user as "userId" and "userRole" in the claims of the jwt
     *
     * @param user The user to generate the JWT from
     * @return The string representation of the jwt
     * @throws JoseException
     */
    private String generateJWT(User user) throws JoseException {

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
