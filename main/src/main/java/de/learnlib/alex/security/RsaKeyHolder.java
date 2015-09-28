package de.learnlib.alex.security;

import org.jose4j.jwk.RsaJsonWebKey;

import java.security.Key;

/**
 * Holds the RSA public/private key pair that is used to sign and verify JWTs
 * The key should be created once the application has started and saved in here
 */
public class RsaKeyHolder {

    /**
     * The RSA public/private key pair
     */
    private static RsaJsonWebKey rsaJsonWebKey;

    /**
     * Set the RSA key pair
     *
     * @param key - The RSA key pair
     */
    public static void setKey(RsaJsonWebKey key) {
        rsaJsonWebKey = key;
    }

    /**
     * Get the RSA key pair
     *
     * @return The RSA key pair
     */
    public static RsaJsonWebKey getKey() {
        return rsaJsonWebKey;
    }
}
