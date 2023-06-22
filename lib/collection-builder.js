/*
 * Licensed to Laurent Broudoux (the "Author") under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. Author licenses this
 * file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
				"method": request.method,
				"header": request.headers || [],
				"body": request.body || "",
				"description": "Request description for " + i
  		}
		})
		winston.debug('collectionJson.item['+i+']: ' + JSON.stringify(collectionJson.item[i]));
  }
	winston.info('Got ' + requests.length + ' requests added to collection');
	winston.info('collectionJson before building Collection: ' + JSON.stringify(collectionJson));
  return new Collection(collectionJson);
}

module.exports.buildCollection = buildCollection;
