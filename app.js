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

/**
 * Main application file.
 */
'use strict';

// Set default server port to 3000
var port = process.env.PORT || 3000;

const express = require('express');
const winston = require('winston');
var bodyParser = require('body-parser');
var cbManager = require('./lib').CallbacksManager;
var builder = require('./lib').CollectionBuilder;
var runner = require('./lib').TestRunner;

var isArray = function(a) {
  return (!!a) && (a.constructor === Array);
};

const app = express()
winston.level = process.env.LOG_LEVEL || 'info';

// Console logging should have timestamps which are off by default
winston.remove(winston.transports.Console);
winston.add(new winston.transports.Console({timestamp: true}));

app.use(bodyParser.json()); // for parsing application/json

app.get('/health', function (req, res) {
  res.status(200).send('Microcks postman-runtime is alive');
})

app.post('/tests/:testResultId', function (req, res) {
  winston.debug("Body: " + JSON.stringify(req.body));
  // Retrieve test parameters and check they are valid.
  var testResultId = req.params.testResultId;
  var operation = req.body.operation;
  var testScript = req.body.testScript;
  var callbackUrl = req.body.callbackUrl;
  var requests = req.body.requests;

  // Check validity and warn if missing.
  if (operation == undefined) {
    return res.status(400).send('operation field is missing into request body');
  }
  if (testScript == undefined) {
    return res.status(400).send('testScript field is missing into request body');
  }
  if (callbackUrl == undefined) {
    return res.status(400).send('callbackUrl field is missing into request body');
  }
  if (requests == undefined || !isArray(requests)) {
    return res.status(400).send('requests array is missing into request body');
  }

  winston.info('Got a test launch request for id ' + req.params.testResultId + ' - ' + operation);

  // Each request then contain specific endpointUrl that should have been prepared before
  // and queryParams that will be injected using a prerequest script.
  var collection = builder.buildCollection(testScript, requests);
  winston.debug("Collection: " + JSON.stringify(collection));
  var callbacks = cbManager.generateCallbacks(testResultId, operation, requests, callbackUrl);
  runner.runTests(collection, callbacks);

  res.status(201).send('New Postman collection test launched');
})

app.listen(port, function () {
  console.log('Microcks postman-runtime wrapper listening on port: ' + port);
})
