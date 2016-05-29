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

package de.learnlib.alex.core.learner;

import de.learnlib.alex.actions.Credentials;

/**
 * Class to mange a URL and get URL based on this.
 */
public class BaseUrlManager {

    /** The base url of the connection. All other urls just extends this. */
    private String baseUrl;

    /**
     * Advanced constructor which sets the base url field.
     *
     * @param baseUrl
     *         The base url to use.
     */
    public BaseUrlManager(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Get the base url of the API to call. All absolute paths will be based on this!
     *
     * @return The current base url.
     */
    public String getBaseUrl() {
        return baseUrl;
    }

    /**
     * Set the base url. All absolute paths will be based on this!
     *
     * @param baseUrl
     *         The new base url to use.
     */
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Get the absolute URL of a path, i.e. based on the base url (base url + '/' + path'), as String.
     *
     * @param path
     *         The path to append on the base url.
     * @return An absolute URL as String
     */
    public String getAbsoluteUrl(String path) {
        return combineUrls(baseUrl, path);
    }

    /**
     * Get the absolute URL of a path, i.e. based on the base url (base url + '/' + path'), as String
     * and insert the credentials if possible.
     *
     * @param path
     *         The path to append on the base url.
     * @param credentials
     *         The credentials to insert into the URL.
     * @return An absolute URL as String
     */
    public String getAbsoluteUrl(String path, Credentials credentials) {
        String url = combineUrls(baseUrl, path);
        url = url.replaceFirst("^(http[s]?://)", "$1" + credentials.getName() + ":" + credentials.getPassword() + "@");
        return url;
    }

    /**
     * Append apiPath to basePath and make sure that only one '/' is between them.
     *
     * @param basePath
     *         The prefix of the new URL.
     * @param apiPath
     *         The suffix of the new URL.
     * @return The combined URL.
     */
    private String combineUrls(String basePath, String apiPath) {
        if (basePath.endsWith("/") && apiPath.startsWith("/")) {
            // both have a '/' -> remove one
            return basePath + apiPath.substring(1);
        } else if (!basePath.endsWith("/") && !apiPath.startsWith("/")) {
            // no one has a '/' -> add one
            return basePath + "/" + apiPath;
        } else {
            // exact 1. '/' in between -> good to go
            return basePath + apiPath;
        }
    }

}
