/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.actions.Credentials;
import java.util.HashMap;
import java.util.Map;

/**
 * Class to mange a URL and get URL based on this.
 */
public class BaseUrlManager {

    private final Map<String, ProjectUrl> urlMap;

    /** Advanced constructor which sets the base url field. */
    public BaseUrlManager(ProjectEnvironment environment) {
        this.urlMap = new HashMap<>();
        environment.getUrls().forEach(u -> this.urlMap.put(u.getName(), u));
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
    public String getAbsoluteUrl(String urlName, String path, Credentials credentials) {
        final String url = combineUrls(urlMap.get(urlName).getUrl(), path);
        return BaseUrlManager.getUrlWithCredentials(url, credentials);
    }

    public String getAbsoluteUrl(String urlName, String path) {
        final String url = combineUrls(urlMap.get(urlName).getUrl(), path);
        return BaseUrlManager.getUrlWithCredentials(url, null);
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

    private static String getUrlWithCredentials(String url, Credentials credentials) {
        if (credentials != null && credentials.areValid()) {
            return url.replaceFirst("^(http[s]?://)", "$1"
                    + credentials.getName() + ":"
                    + credentials.getPassword() + "@");
        } else {
            return url;
        }
    }
}
