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

package de.learnlib.alex.standalone;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlets.GzipFilter;
import org.eclipse.jetty.webapp.WebAppContext;

import javax.servlet.DispatcherType;
import java.io.File;
import java.net.URLDecoder;
import java.util.EnumSet;

public class Main {

    private static final String PORT_ARGUMENT="-port=";
    private static final int    PORT_NUMBER=8000;

    public static void main(String[] args) throws Exception {
        int port = readPortNumberOrFail(args);

        String path = Main.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        String decodedPath = URLDecoder.decode(path, "UTF-8");
        File standaloneJar = new File(decodedPath);
        String folder = standaloneJar.getParent();
        File applicationWar = new File(folder + "/ALEX.war");

        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath("/");
        webapp.setWar(applicationWar.getAbsolutePath());
        webapp.addFilter(GzipFilter.class, "/*", EnumSet.of(DispatcherType.REQUEST));

        Server server = new Server(port);
        server.setHandler(webapp);
        server.start();
        server.join();
    }

    private static int readPortNumberOrFail(String[] args) {
        int port = PORT_NUMBER;
        if (args.length > 0) {
            if (args.length == 1 && args[0].startsWith(PORT_ARGUMENT)) {
                String portAsString = args[0].replaceFirst(PORT_ARGUMENT, "");
                try {
                    port = Integer.valueOf(portAsString);
                } catch (NumberFormatException e) {
                    System.err.println("Unknown port number '" + portAsString + "'!");
                    System.exit(2);
                }
            } else {
                System.err.println("Unknown commandline argument!");
                System.err.println("Usage: " + PORT_ARGUMENT + PORT_NUMBER);
                System.exit(1);
            }
        }
        return port;
    }

}
