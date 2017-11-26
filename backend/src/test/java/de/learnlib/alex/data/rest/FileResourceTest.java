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

package de.learnlib.alex.data.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.data.dao.FileDAO;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.MultiPart;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.media.multipart.file.FileDataBodyPart;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileResourceTest extends JerseyTest {

    private static final long PROJECT_TEST_ID = 10;

    @Mock
    private FileDAO fileDAO;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(FileResource.class);
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(fileDAO).to(FileDAO.class);
            }
        });
        return testApplication;
    }

    @Test
    public void shouldUploadAFile() {
        Path path = Paths.get(System.getProperty("user.dir"),
                              "src", "test", "resources", "rest", "IFrameProxyTestData.html");
        FileDataBodyPart filePart = new FileDataBodyPart("file", path.toFile());
        filePart.setContentDisposition(FormDataContentDisposition.name("file")
                                               .fileName("IFrameProxyTestData.html")
                                               .build());
        MultiPart multipartEntity = new FormDataMultiPart().bodyPart(filePart);
        Response response = target("/projects/" + PROJECT_TEST_ID + "/files")
                                .register(MultiPartFeature.class)
                                .request()
                                .post(Entity.entity(multipartEntity, MediaType.MULTIPART_FORM_DATA));
        System.out.println(" -> " + response.readEntity(String.class));
//        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

}
