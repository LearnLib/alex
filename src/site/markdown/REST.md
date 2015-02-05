REST Documentation
------------------

The server offers a [REST API](http://en.wikipedia.org/wiki/Representational_state_transfer) to manage projects and
symbols, and to start and control the learning.
The documentation of this API can be found at "/restdocs/" on your running server, e.g. http://localhost:8080/restdocs.

## Swagger

To create this documentation a tool called [Swagger](http://swagger.io/) is used together with
[an JavaDoc doclet](https://github.com/Carma-Public/swagger-jaxrs-doclet) which creates the files for swagger based on
the code and some extra informations in the JavaDoc.

Please notice: The swagger specification and the doclet both support inheritance of model classes, but sadly is
swagger-ui incapable to render this information
(there is an [open issue](https://github.com/swagger-api/swagger-ui/issues/300) about this).

## Rest Actions

// call a url 
{
	type : 'call',	
	method : GET,POST,PUT,PATCH,DELETE,
	url : ...
	json : jsonString
}

// check http response status
{
	type: 'checkStatus',
	status: 200,404, ...
}

// check http header field value
{
          type: ‘checkHeaderField’,
          key : ….
          value: ….
          regexp: true,false
}

// check http body for text
{
	type : ‘checkForText’
	value: …,
	regexp: true,false’
}

// check if http respnse body json attribute exists
{
	type: 'checkAttributeExists',
	attribute : object.attribute
}

// check http response body json attribute value 
{
	type: 'checkAttributeValue',
	attribute : object.attribute,
	value: ...,
	regexp: true,false
}

// check http response body json attribute type
{
	type: 'checkAttributeType',
	attribute: object.attribute,
	jsonType: String,Integer,Boolean,Null,Object,Array
}