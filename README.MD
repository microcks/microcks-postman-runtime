# Microcks Postman Runtime

`microcks-postman-runtime` is a thin HTTP wrapper around [`postman-runtime`](https://github.com/postmanlabs/postman-runtime/) lib. It allows running tests for Microcks and then sending results on a `callbackUrl`

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/microcks/microcks-postman-runtime/build-package.yml?logo=github&style=for-the-badge)](https://github.com/microcks/microcks-postman-runtime/actions)
[![Container](https://img.shields.io/badge/dynamic/json?color=blueviolet&logo=docker&style=for-the-badge&label=Quay.io&query=tags[1].name&url=https://quay.io/api/v1/repository/microcks/microcks-postman-runtime/tag/?limit=10&page=1&onlyActiveTags=true)](https://quay.io/repository/microcks/microcks-postman-runtime?tab=tags)
[![License](https://img.shields.io/github/license/microcks/microcks-postman-runtime?style=for-the-badge&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)
[![Project Chat](https://img.shields.io/badge/discord-microcks-pink.svg?color=7289da&style=for-the-badge&logo=discord)](https://microcks.io/discord-invite/)
[![Artifact HUB](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/microcks-postman-runtime-image&style=for-the-badge)](https://artifacthub.io/packages/search?repo=microcks-postman-runtime-image)
[![CNCF Landscape](https://img.shields.io/badge/CNCF%20Landscape-5699C6?style=for-the-badge&logo=cncf)](https://landscape.cncf.io/?item=app-definition-and-development--application-definition-image-build--microcks)

## Build Status

Latest released version is `0.7.1`.

Current development version is `0.7.2-SNAPSHOT`.

#### Fossa license and security scans

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-postman-runtime.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-postman-runtime?ref=badge_shield&issueType=license)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-postman-runtime.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-postman-runtime?ref=badge_shield&issueType=security)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-postman-runtime.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-postman-runtime?ref=badge_small)

#### Signature, Provenance, SBOM

[![Static Badge](https://img.shields.io/badge/supply_chain-documentation-blue?logo=securityscorecard&label=Supply%20Chain&link=https%3A%2F%2Fmicrocks.io%2Fdocumentation%2Freferences%2Fcontainer-images%23software-supply-chain-security)](https://microcks.io/documentation/references/container-images#software-supply-chain-security)

#### OpenSSF best practices on Microcks core

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/7513/badge)](https://bestpractices.coreinfrastructure.org/projects/7513)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/microcks/microcks/badge)](https://securityscorecards.dev/viewer/?uri=github.com/microcks/microcks)

## Community

* [Documentation](https://microcks.io/documentation/tutorials/getting-started/)
* [Microcks Community](https://github.com/microcks/community) and community meeting
* Join us on [Discord](https://microcks.io/discord-invite/), on [GitHub Discussions](https://github.com/orgs/microcks/discussions) or [CNCF Slack #microcks channel](https://cloud-native.slack.com/archives/C05BYHW1TNJ)

To get involved with our community, please make sure you are familiar with the project's [Code of Conduct](./CODE_OF_CONDUCT.md).

## How to use it?

This is a simple sample of the interface for calling this component:

```sh
curl -X POST http://localhost:3000/tests/598850b8b2799dac88a33cd5 -H "Content-Type: application/json" -d '{"operation": "GET /order/:id", "callbackUrl": "http://localhost:9090/api/tests/598850b8b2799dac88a33cd5/testCaseResult", "testScript": { "listen": "test", "script": { "type": "text/javascript", "exec": [ "var jsonData = JSON.parse(responseBody);", "var expectedId = globals[\"id\"]", "tests[\"Check id value\"] = jsonData.id === expectedId;", "tests[\"Check id value again\"] = jsonData.id === expectedId;" ] } }, "requests": [ { "endpointUrl": "http://localhost:8080/rest/Test%20API/0.0.1/order/123456", "name": "get-123456", "method": "GET", "queryParams": [{"key": "id", "value": "123456"}] } ] }'
```
It is important to note that when submitting multiple requests to this component, Postman will end treating requests as it encounters a failure. So you may specify many requests into the interface but have less returns as a result.
