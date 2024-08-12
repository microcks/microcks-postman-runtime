# Microcks Postman Runtime

`microcks-postman-runtime` is a thin HTTP wrapper around [`postman-runtime`](https://github.com/postmanlabs/postman-runtime/) lib. It allows running tests for Microcks and then sending results on a `callbackUrl`

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/microcks/microcks-postman-runtime/build-package.yml?logo=github&style=for-the-badge)](https://github.com/microcks/microcks-postman-runtime/actions)
[![Container](https://img.shields.io/badge/dynamic/json?color=blueviolet&logo=docker&style=for-the-badge&label=Quay.io&query=tags[0].name&url=https://quay.io/api/v1/repository/microcks/microcks-postman-runtime/tag/?limit=10&page=1&onlyActiveTags=true)](https://quay.io/repository/microcks/microcks-postman-runtime?tab=tags)
[![License](https://img.shields.io/github/license/microcks/microcks-postman-runtime?style=for-the-badge&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)
[![Project Chat](https://img.shields.io/badge/discord-microcks-pink.svg?color=7289da&style=for-the-badge&logo=discord)](https://microcks.io/discord-invite/)

## Build Status

Latest released version is `0.4.0`.

Current development version is `0.5.0-SNAPSHOT`.

## How to use it?

This is a simple sample of the interface for calling this component:

```sh
curl -X POST http://localhost:3000/tests/598850b8b2799dac88a33cd5 -H "Content-Type: application/json" -d '{"operation": "GET /order/:id", "callbackUrl": "http://localhost:9090/api/tests/598850b8b2799dac88a33cd5/testCaseResult", "testScript": { "listen": "test", "script": { "type": "text/javascript", "exec": [ "var jsonData = JSON.parse(responseBody);", "var expectedId = globals[\"id\"]", "tests[\"Check id value\"] = jsonData.id === expectedId;", "tests[\"Check id value again\"] = jsonData.id === expectedId;" ] } }, "requests": [ { "endpointUrl": "http://localhost:8080/rest/Test%20API/0.0.1/order/123456", "name": "get-123456", "method": "GET", "queryParams": [{"key": "id", "value": "123456"}] } ] }'
```
It is important to note that when submitting multiple requests to this component, Postman will end treating requests as it encounters a failure. So you may specify many requests into the interface but have less returns as a result.
