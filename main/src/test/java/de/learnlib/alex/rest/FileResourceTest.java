package de.learnlib.alex.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.learner.Learner;
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
import java.io.File;

public class FileResourceTest extends JerseyTest {

    private static final long PROJECT_TEST_ID = 10;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private CounterDAO counterDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Learner learner;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new ALEXTestApplication(projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                       learnerResultDAO, learner, FileResource.class);
    }

    @Test
    public void shouldUploadAFile() {
        FileDataBodyPart filePart = new FileDataBodyPart("file", new File("/media/data/Coding/uni/ALEX/alex/main/src/test/resources/rest/IFrameProxyTestData.html"));
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