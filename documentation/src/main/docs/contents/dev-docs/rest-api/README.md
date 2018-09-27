# REST API

ALEX offers a [REST API](http://en.wikipedia.org/wiki/Representational_state_transfer) to access its features.
The documentation of this API can be found at *"/restdocs/"* on your running server, e.g. *http://localhost:8000/restdocs*.


## Swagger

To create this documentation, a tool called [Swagger](http://swagger.io/) is used together with
[a JavaDoc doclet](https://github.com/Carma-Public/swagger-jaxrs-doclet) which creates the files for swagger based on
the code and some extra information in the JavaDoc.

![Swagger](./assets/swagger.jpg)

To test REST resources which require an active user, please use the login method (which does not need an active user)
and copy the returned token into the *api_key* field on the top of the page.


## Authentication

The REST API of ALEX supports authentication via [JSON Web Tokens (JWT)][jwt].

1. Make a `POST` request to `/rest/users/login` with a HTTP body that contains a serialized user object which looks like `{"email":"<yourEmail>", "password":"<yourPassword>"}`.
2. You should receive a base64 encoded JWT. Save it somewhere and send it with each HTTP request to the API in the HTTP-Authorization header as follows: `Authorization: Bearer <theEncodedToken>`.

The token provides information about the user as a base64 encoded JSON object as payload.
It looks like `{"email": "<yourEmail>", "id": <ID> "role": "<ROLE>"}` where the role is either *ADMIN* or *REGISTERED*.

That's it. 
Currently, the password is transferred in plain text since there is no HTTPS connection available.

[jwt]: http://jwt.io/
