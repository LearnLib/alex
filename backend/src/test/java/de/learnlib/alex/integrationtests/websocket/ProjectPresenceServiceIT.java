package de.learnlib.alex.integrationtests.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.ReadContext;
import de.learnlib.alex.integrationtests.resources.AbstractResourceIT;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.websocket.util.ProjectPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class ProjectPresenceServiceIT extends AbstractResourceIT {

    private WebSocketUser user1;

    private WebSocketUser user2;

    private WebSocketUser user3;

    private long projectId1;

    private long projectId2;

    private ProjectApi projectApi;

    private UserApi userApi;

    private ProjectPresenceServiceWSMessages projectPresenceServiceWSMessages;

    private Configuration suppressExceptionConfiguration;

    @Before
    public void pre() throws InterruptedException, ExecutionException, TimeoutException, URISyntaxException, IOException {
        user1 = new WebSocketUser("user1", client, port);
        user2 = new WebSocketUser("user2", client, port);
        user3 = new WebSocketUser("user3", client, port);

        projectApi = new ProjectApi(client, port);
        userApi = new UserApi(client, port);
        projectPresenceServiceWSMessages = new ProjectPresenceServiceWSMessages();

        suppressExceptionConfiguration = Configuration
                .defaultConfiguration()
                .addOptions(Option.SUPPRESS_EXCEPTIONS);

        final Response res1 = projectApi.create("{\"name\":\"project1\",\"url\":\"http://localhost:8080\"}", user1.getJwt());
        projectId1 = Integer.toUnsignedLong(JsonPath.read(res1.readEntity(String.class), "$.id"));

        projectApi.addMembers(projectId1, Collections.singletonList(user2.getUserId()), user1.getJwt());

        final Response res2 = projectApi.create("{\"name\":\"project2\",\"url\":\"http://localhost:8080\"}", user2.getJwt());
        projectId2 = Integer.toUnsignedLong(JsonPath.read(res2.readEntity(String.class), "$.id"));

        user1.getMessages("default").clear();
        user2.getMessages("default").clear();
        user3.getMessages("default").clear();
    }

    @After
    @Override
    public void post() throws Exception {
        user1.forceDisconnectAll();
        user2.forceDisconnectAll();
        user3.forceDisconnectAll();

        super.post();
    }

    @Test
    public void shouldAddUserPresence() throws JsonProcessingException, InterruptedException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
    }

    @Test
    public void shouldRemoveUserPresence() throws JsonProcessingException, InterruptedException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldSupportMultipleUserSessions() throws InterruptedException, ExecutionException, TimeoutException, IOException, URISyntaxException {
        user1.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        String color = JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("otherSession", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals(color, JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1"));

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals(color, JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1"));

        user1.send("otherSession", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldReuseMaximumContrastColorsFirst() throws JsonProcessingException, InterruptedException {
        projectApi.addMembers(projectId1, Collections.singletonList(user3.getUserId()), user1.getJwt());

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        String color1 = JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        String color2 = JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        assertTrue(!color2.equals(color1));

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);

        user3.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals(color1, JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user3"));
    }

    @Test
    public void shouldSwitchUserPresence() throws JsonProcessingException, InterruptedException {
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user2.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject((projectId2)));
        response = user2.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());

        response = user2.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].userColors.user2");
    }

    @Test
    public void shouldIgnoreDuplicateEnteredMessage() throws InterruptedException, JsonProcessingException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertNull(response);
    }

    @Test
    public void shouldIgnoreDuplicateLeftMessage() throws InterruptedException, JsonProcessingException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        assertNull(response);
    }

    @Test
    public void shouldCorrectlyAssembleProjectStatus() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        user2.send("otherSession", projectPresenceServiceWSMessages.userEnteredProject(projectId2));

        user2.clearMessagesDelayed("default");
        user1.clearMessagesDelayed("default");

        user2.send("default", projectPresenceServiceWSMessages.requestStatus(Collections.singletonList(projectId1)));
        WebSocketMessage response = user2.getMessages("default").poll(1, TimeUnit.SECONDS);
        System.out.println(response.getContent());
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");
        JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].userColors.user2");

        response = user1.getMessages("default").poll(1, TimeUnit.SECONDS);
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");
    }
}
