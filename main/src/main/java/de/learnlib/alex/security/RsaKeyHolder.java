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

package de.learnlib.alex.security;

import org.jose4j.jwk.RsaJsonWebKey;

/**
 * Holds the RSA public/private key pair that is used to sign and verify JWTs.
 * The key should be created once the application has started and saved in here.
 */
public final class RsaKeyHolder {

    /**
     * The RSA public/private key pair.
     */
    private static RsaJsonWebKey rsaJsonWebKey;

    /**
     * Deactivate the constructor because this is a utility class.
     */
    private RsaKeyHolder() {
    }

    /**
     * Set the RSA key pair.
     *
     * @param key - The RSA key pair
     */
    public static void setKey(RsaJsonWebKey key) {
        rsaJsonWebKey = key;
    }

    /**
     * Get the RSA key pair.
     *
     * @return The RSA key pair
     */
    public static RsaJsonWebKey getKey() {
        return rsaJsonWebKey;
    }
}
