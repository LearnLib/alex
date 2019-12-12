# REST API

## Authentication

The REST API of ALEX supports authentication via [JSON Web Tokens (JWT)][jwt].

1. Make a `POST` request to `/rest/users/login` with a HTTP body that contains a serialized user object which looks like `{"email":"<yourEmail>", "password":"<yourPassword>", "role":"<yourRole>"}`.
2. You should receive a base64 encoded JWT in a JSON object `{"token": "THEBASE64ENCODEDTOKEN"}`. 
   Save it somewhere and send it with each HTTP request to the API in the HTTP-Authorization header as follows: `Authorization: Bearer THEBASE64ENCODEDTOKEN`.

The token provides information about the user as a base64 encoded JSON object as payload.
The payload looks like:

```JSON
{
  "email": "<EMAIL>", 
  "id": <ID>, 
  "role": "<ROLE>"
}
```


[jwt]: http://jwt.io/
