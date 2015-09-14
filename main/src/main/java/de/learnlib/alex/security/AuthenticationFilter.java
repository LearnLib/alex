package de.learnlib.alex.security;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    @Inject
    UserDAO userDAO;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        try {
            // get the jwt from Authorization Header and split at 'Bearer [token]'
            String jwt = requestContext.getHeaderString("Authorization");
            if (jwt != null) {
                jwt = jwt.split(" ")[1];

                // check if the jwt is valid
                JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                        .setExpectedIssuer("ALEX")
                        .setVerificationKey(RsaKeyHolder.getKey().getPublicKey())
                        .build();

                // get payload and get user id
                // if no exception was throws up to here you can be sure that the jwt has not been modified
                // and that the user that send the jwt is the one he seems to be
                JwtClaims claims = jwtConsumer.processToClaims(jwt);
                Long id = (Long) claims.getClaimsMap().get("userId");

                // get him from the db
                User user = userDAO.getById(id);

                // TODO: create injectable security context with user here
            }
        } catch (InvalidJwtException e) {
            e.printStackTrace();
        }
    }
}
