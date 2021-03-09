package de.learnlib.alex.integrationtests.resources.api;

import java.util.List;
import java.util.stream.Collectors;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

public class WebhookApi extends AbstractApi {

    public WebhookApi(Client client, int port) {
        super(client, port);
    }

    public Response create(String webhook, String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(webhook));
    }

    public Response get(String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .get();
    }

    public Response update(Integer webhookId, String webhook, String jwt) {
        return client.target(url() + "/" + webhookId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(webhook));
    }

    public Response delete(Integer webhookId, String jwt) {
        return client.target(url() + "/" + webhookId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response delete(List<Integer> webhookIds, String jwt) {
        final List<String> ids = webhookIds.stream().map(String::valueOf).collect(Collectors.toList());
        return client.target(url() + "/batch/" + String.join(",", ids)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response getEvents(String jwt) {
        return client.target(url() + "/events").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .get();
    }

    public String url() {
        return baseUrl() + "/webhooks";
    }
}
