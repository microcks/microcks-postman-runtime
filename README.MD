microcks-postman-runtime
========================

## Build Status

Current development version is `0.2.0-SNAPSHOT`. [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/microcks/microcks-postman-runtime/build-package?logo=github&style=for-the-badge)](https://github.com/microcks/microcks-postman-runtime/actions)

## Information

`microcks-postman-runtime` is a thin HTTP wrapper around [`postman-runtime`](https://github.com/postmanlabs/postman-runtime/) lib. It allows running tests for Microcks and then sending results on a `callbackUrl`

This is a simple sample of the interface for calling this component :

```sh
curl -X POST http://localhost:3000/tests/598850b8b2799dac88a33cd5 -H "Content-Type: application/json" -d '{"operation": "GET /order/:id", "callbackUrl": "http://localhost:9090/api/tests/598850b8b2799dac88a33cd5/testCaseResult", "testScript": { "listen": "test", "script": { "type": "text/javascript", "exec": [ "var jsonData = JSON.parse(responseBody);", "var expectedId = globals[\"id\"]", "tests[\"Check id value\"] = jsonData.id === expectedId;", "tests[\"Check id value again\"] = jsonData.id === expectedId;" ] } }, "requests": [ { "endpointUrl": "http://localhost:8080/rest/Test%20API/0.0.1/order/123456", "name": "get-123456", "method": "GET", "queryParams": [{"key": "id", "value": "123456"}] } ] }'
```
It is important to note that when submitting multiple requests to this component, Postman will end treating requests as it encounters a failure. So you may specify many requests into the interface but have less returns as a result.
