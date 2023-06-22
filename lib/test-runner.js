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
var runtime = require('postman-runtime');
var sdk = require('postman-collection');

var runTests = function (collection, callbacks) {
  var runner = new runtime.Runner();
  runner.run(collection, {
    // Iteration Data
    data: [],

    // Timeouts (in ms)
    timeout: {
      request: 30000,
    },

    // Number of iterations
    iterationCount: 1,

    // Control flags (you can only specify one of these):

    // - gracefully halts on errors (errors in request scripts or while sending the request)
    //   calls the `item` and `iteration` callbacks and does not run any further items (requests)
    stopOnError: true,

    // - abruptly halts the run on errors, and directly calls the `done` callback
    abortOnError: true,

    // - gracefully halts on errors _or_ test failures.
    //   calls the `item` and `iteration` callbacks and does not run any further items (requests)
    stopOnFailure: true,

    // - abruptly halts the run on errors or test failures, and directly calls the `done` callback
    abortOnFailure: true,

    // Environment (a "VariableScope" from the SDK)
    environment: new sdk.VariableScope(),

    // Globals (a "VariableScope" from the SDK)
    globals: new sdk.VariableScope(),

    // Configure delays (in ms)
    delay: {
      // between each request
      item: 500,
      // between iterations
      iteration: 500
    },

    // Used to fetch contents of files, certificates wherever needed
    fileResolver: require('fs'),

    // Options specific to the requester
    requester: {
      // An object compatible with the cookieJar provided by the 'postman-request' module
      //cookieJar: jar,
      // Controls redirect behavior (only supported on Node, ignored in the browser)
      followRedirects: true,
      // Enable or disable certificate verification (only supported on Node, ignored in the browser)
      strictSSL: false,
      // Enable sending of bodies with GET requests (only supported on Node, ignored in the browser)
      sendBodyWithGetRequests: true,
    },

    // authorizer
    authorizer: {
      // Enables advanced mode only in these auths
      interactive: {
        ntlm: true,
        basic: true
      },
      // Enables advanced mode for all auths
      interactive: true
    },

    // A ProxyConfigList, from the SDK
    proxies: new sdk.ProxyConfigList(),

    // A function that fetches the system proxy for a given URL.
    //systemProxy: function (url, callback) { return callback(null, {/* ProxyConfig object */}) },
    // Return null for forcing no-proxy setup. Thanks @nmasse-itix
    systemProxy: null,

    // A CertificateList from the SDK
    certificates: new sdk.CertificateList(),

    // *note* Not implemented yet.
    // In the future, this will be used to read certificates from the OS keychain.
    systemCertificate: function() {}
  }, function (err, run) {
      // Check the section below for detailed documentation on what callbacks should be.
      winston.info('Starting Postman test runner...');
      run.start(callbacks);
  });
}

module.exports.runTests = runTests;
