/*
 * Copyright The Microcks Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const winston = require('winston');
var http = require('http');
var https = require('https');
var url = require('url');

var generateCallbacks = function (testResultId, operation, requests, callbackUrl) {
  var records = [];

  /**
   * ArrayBuffer to String
   * @param {ArrayBuffer} buffer
   * @returns {String}
   */
  var arrayBufferToString = function (buffer) {
    var str = '',
      uArrayVal = new Uint8Array(buffer),
      i, ii;

    for (i = 0, ii = uArrayVal.length; i < ii; i++) {
      str += String.fromCharCode(uArrayVal[i]);
    }
    return str;
  };

  var callbacks = {
    // Called any time we see a new assertion in the test scripts
    // *note* Not used yet.
    assertion: function (name, result) {
      // name: string
      // result: Boolean
    },

    // Called when the run begins
    start: function (err, cursor) {
      // err: null or Error
      // cursor = {
      //     position: Number,
      //     iteration: Number,
      //     length: Number,
      //     cycles: Number,
      //     eof: Boolean,
      //     empty: Boolean,
      //     bof: Boolean,
      //     cr: Boolean,
      //     ref: String
      // }
      winston.debug('start: ' + JSON.stringify(err));
    },

    // Called before starting a new iteration
    beforeIteration: function (err, cursor) {
      /* Same as arguments for "start" */
      winston.debug('beforeIteration: ' + JSON.stringify(err));
    },

    // Called when an iteration is completed
    iteration: function (err, cursor) {
      /* Same as arguments for "start" */
    },

    // Called before running a new Item (check the postman collection v2 format for what Item means)
    beforeItem: function (err, cursor, item) {
      // err, cursor: Same as arguments for "start"
      // item: sdk.Item
    },

    // Called after completion of an Item
    item: function (err, cursor, item) {
      /* Same as arguments for "beforeItem" */
    },

    // Called before running pre-request script(s) (Yes, Runtime supports multiple pre-request scripts!)
    beforePrerequest: function (err, cursor, events, item) {
      // err, cursor: Same as arguments for "start"
      // events: Array of sdk.Event objects
      // item: sdk.Item
      winston.debug('beforePrerequest: ' + JSON.stringify(err));
    },

    // Called after running pre-request script(s)
    prerequest: function (err, cursor, results, item) {
      // err, cursor: Same as arguments for "start"
      // item: sdk.Item
      // results: Array of objects. Each object looks like this:
      //  {
      //      error: Error,
      //      event: sdk.Event,
      //      script: sdk.Script,
      //      result: {
      //          target: 'prerequest'
      //
      //          -- Updated environment
      //          environment: <VariableScope>
      //
      //          -- Updated globals
      //          globals: <VariableScope>
      //
      //          data: <Object of data variables>
      //          return: <Object, contains set next request params, etc>
      //      }
      //  }
      winston.debug('prerequest: ' + JSON.stringify(err));
    },

    // Called before running test script(s)
    beforeTest: function (err, cursor, events, item) {
      // err, cursor: Same as arguments for "start"
      // events: Array of sdk.Event objects
      // item: sdk.Item
      winston.debug('beforeTest: ' + JSON.stringify(err));
    },

    // Called just after running test script (s)
    test: function (err, cursor, results, item) {
      // results: Array of objects. Each object looks like this:
      //  {
      //      error: Error,
      //      event: sdk.Event,
      //      script: sdk.Script,
      //      result: {
      //          target: 'test'
      //          -- Updated environment
      //          environment: <VariableScope>
      //          -- Updated globals
      //          globals: <VariableScope>
      //          response: <sdk.Response>
      //          request: <sdk.Request>
      //          data: <Object of data variables>
      //          cookies: <Array of "sdk.Cookie" objects>
      //          tests: <Object>
      //          return: <Object, contains set next request params, etc>
      //      }
      //  }
      winston.debug('test: ' + JSON.stringify(err));
      records.push(results);
      //for (var i=0; i<results.length; i++) {
      //  var result = results[i];
      //  console.log('Tests: ' + JSON.stringify(result.result.tests));
      //  if (result.error != undefined) {
      //    console.log('Errors: ' + JSON.stringify(result.error.message));
      //  }
      //}
    },

    // Called just before sending a request
    beforeRequest: function (err, cursor, request, item) {
      // err, cursor: Same as arguments for "start"
      // item: sdk.Item
      // request: sdk.request
      winston.debug('beforeRequest: ' + JSON.stringify(err));
    },

    // Called just after sending a request
    request: function (err, cursor, response, request, item, cookies) {
      // err, cursor: Same as arguments for "start"
      // item: sdk.Item
      // response: sdk.Response
      // request: sdk.request
      winston.debug('request: ' + JSON.stringify(err));
    },

    // Called at the end of a run
    done: function (err) {
      // err: null or Error
      //console.log('============================');
      winston.debug('Got ' + records.length + ' records to process for ' + testResultId + ' - ' + operation);

      var testReturns = [];

      for (var i = 0; i < records.length; i++) {
        if (records[i][0] != undefined) {
          var record = records[i][0];

          // Prepare a testReturn with default being a failure.
          var testReturn = {
            "code": 1
          };

          if (record.result != undefined) {
            winston.silly('response: ' + JSON.stringify(record.result.response));
            winston.silly('stream: ' + record.result.response.stream);
            winston.silly('data: ' + arrayBufferToString(record.result.response.stream.values()));
            winston.silly('code: ' + JSON.stringify(record.result.response.code));
            winston.silly('headers: ' + JSON.stringify(record.result.response.headers));
            testReturn.elapsedTime = record.result.response.responseTime;

            // Build corresponding request sent.
            testReturn.request = {
              "headers": record.result.request.headers.map(function (header) {
                  return { "name": header.key, "values": [header.value] };
              })
            };
            if (record.result.request.body.raw != undefined) {
              testReturn.request.content = record.result.request.body.raw;
            }
            // Request name is actually stored only as legacy._itemName.
            testReturn.request.name = record.result.legacy._itemName
            // Build response objects as expected by Microcks.
            testReturn.response = {
              "headers": record.result.response.headers.map(function (header) {
                  return { "name": header.key, "values": [header.value] };
              }),
              "content": arrayBufferToString(record.result.response.stream.values()),
              "status": record.result.response.code
            };
          }
          // Complete error code and message if any.
          if (record.error == undefined) {
            testReturn.code = 0;
          } else {
            testReturn.message = record.error.message;
          }
          testReturns.push(testReturn);
        }
      }
      //console.log('Prepared returns: ' + JSON.stringify(testReturns));
      winston.info('Find ' + testReturns.length + ' returns to send for ' + testResultId + ' - ' + operation);

      var req;
      var callbackURL = url.parse(callbackUrl);
      var data = JSON.stringify({ "operationName": operation, "testReturns": testReturns });

      if (callbackURL.protocol === "http:") {
        req = http.request({
          hostname: callbackURL.hostname,
          port: callbackURL.port,
          path: callbackURL.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          }
        }, function (response) {
          response.on('data', function (data) {
            //console.log('Got data as response !');
            //console.log(arrayBufferToString(data.values()));
          });
          response.on('error', function (e) {
            winston.error('Error received from callback endpoint: ' + JSON.stringify(e));
          });
        });
      }
      else {
        req = https.request({
          hostname: callbackURL.hostname,
          port: callbackURL.port,
          path: callbackURL.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          }
        }, function (response) {
          response.on('data', function (data) {
            //console.log('Got data as response !');
            //console.log(arrayBufferToString(data.values()));
          });
          response.on('error', function (e) {
            winston.error('Error received from callback endpoint: ' + JSON.stringify(e));
          });
        });
      }
      req.on('error', function (err) {
        winston.error('Problem with callback request: ' + err.message);
      });
      req.write(data);
      req.end();

      winston.info('Done with requests for ' + testResultId + ' - ' + operation);
    },

    // Called any time a console.* function is called in test/pre-request scripts
    console: function (cursor, level, ...logs) {
      winston.silly('console called with "' + logs + '"');
    },

    io: function (err, cursor, trace, ...otherArgs) {
      // err, cursor: Same as arguments for "start"
      // trace: An object which looks like this:
      // {
      //     -- Indicates the type of IO event, may be HTTP, File, etc. Any requests sent out as a part of
      //     -- auth flows, replays, etc will show up here.
      //     type: 'http',
      //
      //     -- Indicates what this IO event originated from, (collection, auth flows, etc)
      //     source: 'collection'
      // }
      // otherArgs: Variable number of arguments, specific to the type of the IO event.

      // For http type, the otherArgs are:
      // response: sdk.Response()
      // request: sdk.Request()
      // cookies: Array of sdk.Cookie()
      winston.debug('io: ' + JSON.stringify(err) + ' || ' + JSON.stringify(trace));
    }
  }
  return callbacks;
}

module.exports.generateCallbacks = generateCallbacks;
