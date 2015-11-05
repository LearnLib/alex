REST Documentation
==================

The server offers a [REST API](http://en.wikipedia.org/wiki/Representational_state_transfer) to manage projects and
symbols, and to start and control the learning.
The documentation of this API can be found at "/restdocs/" on your running server, e.g. http://localhost:8080/restdocs.

Swagger
-------
To create this documentation a tool called [Swagger](http://swagger.io/) is used together with
[an JavaDoc doclet](https://github.com/Carma-Public/swagger-jaxrs-doclet) which creates the files for swagger based on
the code and some extra information in the JavaDoc.

To test REST resources which require an active user, please use the Login method (which do not need an active user)
and copy the returned token into the 'api_key' field on the top of the page.

Please notice: The swagger specification and the doclet both support inheritance of model classes, but sadly is
swagger-ui incapable to render this information
(there is are [several](https://github.com/swagger-api/swagger-ui/issues/300) 
[issues](https://github.com/swagger-api/swagger-ui/issues/1526) about that).

Actions
-------
Swagger does not show the actions, so here we go.
Every actions can also have two special attributes

```json
{
    ...
    "negated": true|false,
    "ignoreFailure": true|false
}
```

### Web Actions

```json
{
    "type": "web_checkForNode",
    "value": "#node"
}
```

```json
{
    "type": "web_checkForText",
    "value": "Lorem Ipsum"
}
```

```json
{
    "type": "web_clear",
    "node": "#node"
}
```

```json
{
    "type": "web_clickLinkByText",
    "value": "Click Me"
}
```

```json
{
    "type": "web_click",
    "node": "#node"
}
```

```json
{
    "type" : "web_fill",
    "node" : "#input",
    "value" : "Lorem Ipsum"
}
```

```json
{
    "type": "web_goto",
    "url":  "http://example.com"
}
```

```json
{
    "type": "web_select",
    "node": "#input",
    "value": "Lorem Ipsum"
}
```

```json
{
    "type": "web_submit",
    "node": "#node_id"
}
```

### Rest Actions
Call a url:

```json
{
  "type" : "rest_call",
  "method" : "GET|POST|PUT|DELETE",
  "url" : "http://example.com/api",
  "data" : "{}"
}
```

```json
{
  "type": "rest_checkAttributeExists",
  "attribute": "object.attribute"
}
```

```json
{
  "type": "rest_checkAttributeType",
  "attribute": "object.attribute",
  "jsonType": "STRING"
}
```

```json
{
  "type": "rest_checkAttributeValue",
  "attribute": "object.attribute",
  "value": "FooBar Lorem",
  "regexp": true
}
```

```json
{
  "type": "rest_checkForText",
  "value": "Lorem Ipsum",
  "regexp": true
}
```

```json
{
  "type": "rest_checkHeaderField",
  "key": "Key",
  "value": "Value",
  "regexp": true
}
```

```json
{
  "type": "rest_checkStatus",
  "status": 200
}
```

### Variable/ Counter Actions

```json
{
  "type": "incrementCounter",
  "name": "counter"
}
```

```json
{
  "type": "setCounter",
  "name": "counter",
  "value": 42
}
```

```json
{
  "type": "setVariableByHTML",
  "name": "variable",
  "value": "foobar"
}
```

```json
{
  "type": "setVariableByJSON",
  "name": "variable",
  "value": "foobar"
}
```

```json
{
  "type": "setVariable",
  "name": "variable",
  "value": "foobar"
}
```

### Misc. Actions

```json
{
    "type": "executeSymbol",
    "symbolToExecute": {
        "id": 42,
        "revision": 1
    }
}
```

```json
{
    "type": "wait",
    "duration": 1000
}
```
