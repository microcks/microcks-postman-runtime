'use strict';

const winston = require('winston');
var Collection = require('postman-collection').Collection;

var buildCollection = function(testScript, requests) {
  var collectionJson = {
    "variables": [],
  	"info": {
  		"name": "Test API " + new Date().getTime(),
  		//"_postman_id": "48430400-3a9b-28dc-4f16-c1c404eee237",
      "_postman_id": new Date().getTime(),
  		"description": "Description of Test API for fake collection",
  		"schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json"
  	},
  	"item": [
    ]
  }

  for (var i=0; i<requests.length; i++) {
    var request = requests[i];
    // Inject queryParams as global variables using pre-request script.
    var prerequestScript = [];
    if (request.queryParams != undefined) {
      for (var p=0; p<request.queryParams.length; p++) {
        var param = request.queryParams[p];
        prerequestScript.push("postman.setGlobalVariable(\"" + param.key + "\", \"" + param.value + "\");");
      }
    }
    // Add a new item for request.
    collectionJson.item.push({
      "name": "Request " + i,
			"event": [
				testScript,
				{
					"listen": "prerequest",
					"script": {
						"type": "text/javascript",
						"exec": prerequestScript
					}
				}
			],
      "request": {
				"url": request.endpointUrl,
				},
				"method": request.method,
				"header": [],
				"body": "",
				"description": "Request description for " + i,
  		}
    )
  }
  winston.info('Got ' + requests.length + ' requests added to collection');
  return new Collection(collectionJson);
}

module.exports.buildCollection = buildCollection;
