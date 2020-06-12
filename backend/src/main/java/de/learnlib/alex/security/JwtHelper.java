/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.security;

import de.learnlib.alex.auth.entities.User;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.NumericDate;
import org.jose4j.lang.JoseException;

/**
 * Helper class around the JWTs, including the security aspect.
 */
public final class JwtHelper {

    /** The number of bits used by the JWK lib. */
    public static final int JWK_STRENGTH_IN_BITS = 2048;

    /**
     * The RSA public/private key pair.
     */
    private static RsaJsonWebKey rsaJsonWebKey;


    /**
     * Default constructor disabled, because this is just a helper class.
     */
    private JwtHelper() {
    }

    /**
     * Get the RSA key pair.
     * The method will create a pair, if non exists, i.e. the first call of this method.
     * If no pair can be created, it will shutdown the VM because this would mean a hugh security risk.
     *
     * @return The RSA key pair
     */
    public static RsaJsonWebKey getKey() {
        if (rsaJsonWebKey == null) {
            try {
                rsaJsonWebKey = RsaJwkGenerator.generateJwk(JWK_STRENGTH_IN_BITS);
            } catch (JoseException e) {
                e.printStackTrace();
                System.exit(0);
            }
        }

        return rsaJsonWebKey;
    }

    /**
     * Generates a JWT as String representation.
     * Encodes the id and the role of the user as "userId" and "userRole" in the claims of the jwt
     *
     * @param user
     *         The user to generate the JWT from.
     * @return The string representation of the jwt.
     * @throws JoseException
     *         If the Jose library failed to create a JWT token.
     */
    public static String generateJWT(User user) throws JoseException {
        // generate claims with user data
        final JwtClaims claims = new JwtClaims();
        claims.setIssuer("ALEX");
        claims.setGeneratedJwtId();
        claims.setClaim("id", user.getId());
        claims.setClaim("role", user.getRole());
        claims.setClaim("email", user.getEmail());
        claims.setIssuedAt(NumericDate.now());

        final NumericDate expirationDate = NumericDate.now();
        expirationDate.addSeconds(604800);
        claims.setExpirationTime(expirationDate);

        // create signature
        final JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());
        jws.setKey(getKey().getPrivateKey());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);

        // return signed jwt
        return jws.getCompactSerialization();
    }

}
