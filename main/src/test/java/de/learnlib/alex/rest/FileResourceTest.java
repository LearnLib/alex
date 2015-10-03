package de.learnlib.alex.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.FakeAuthenticationFilter;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.UserDAO;
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
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileResourceTest extends JerseyTest {

    private static final long PROJECT_TEST_ID = 10;

    @Mock
    private UserDAO userDAO;

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
    private FileDAO fileDAO;

    @Mock
    private Learner learner;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new ALEXTestApplication(userDAO, projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                       learnerResultDAO, fileDAO, learner, FileResource.class);
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
