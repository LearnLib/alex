package de.learnlib.alex.security;

import org.jose4j.jwk.RsaJsonWebKey;

import java.security.Key;

public class RsaKeyHolder {
    private static RsaJsonWebKey rsaJsonWebKey;

    public static void setKey(RsaJsonWebKey key) {
        rsaJsonWebKey = key;
    }

    public static RsaJsonWebKey getKey() {
        return rsaJsonWebKey;
    }
}
