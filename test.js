'use strict';

var runtime = require('postman-runtime');
var sdk = require('postman-collection');
var Collection = require('postman-collection').Collection,
	myCollection;

var collectionJson = {
	"variables": [],
	"info": {
		"name": "Test API",
		"_postman_id": "48430400-3a9b-28dc-4f16-c1c404eee237",
		"description": "version=0.0.1 - Description for Test API",
		"schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json"
	},
	"item": [
    {
      "name": "http:///order?status={{status}}&page={{page}}",
			"event": [
				{
					"listen": "test",
					"script": {
						"type": "text/javascript",
						"exec": [
							"var jsonData = JSON.parse(responseBody);",
              "console.log(\"jsonData: \" +JSON.stringify(jsonData));",
						]
					}
				},
				{
					"listen": "prerequest",
					"script": {
						"type": "text/javascript",
						"exec": [
							"",
						]
					}
				}
			],
      "request": {
				"url": {
					"raw": "https://httpbin.org/get",
					"protocol": "https",
					"host": [
						"httpbin.org"
					],
					"port": "80",
					"path": [
						"get"
					],
					"query": [],
					"variable": []
				},
				"method": "GET",
				"header": [],
				"body": {},
				"description": "Simple get to httpbin.org"
  		}
    }
  ]
}
myCollection = new Collection(collectionJson);

console.log('Collection is now created !')

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
  },

  // Called before starting a new iteration
  beforeIteration: function (err, cursor) {
      /* Same as arguments for "start" */
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
      console.log('prerequest: ' + JSON.stringify(err));
  },

  // Called before running test script(s)
  beforeTest: function (err, cursor, events, item) {
      // err, cursor: Same as arguments for "start"
      // events: Array of sdk.Event objects
      // item: sdk.Item
      console.log('beforeTest: ' + JSON.stringify(err));
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
      //
      //          -- Updated environment
      //          environment: <VariableScope>
      //
      //          -- Updated globals
      //          globals: <VariableScope>
      //
      //          response: <sdk.Response>
      //          request: <sdk.Request>
      //          data: <Object of data variables>
      //          cookies: <Array of "sdk.Cookie" objects>
      //          tests: <Object>
      //          return: <Object, contains set next request params, etc>
      //      }
      //  }
      console.log('test: ' + JSON.stringify(err));
  },

  // Called just before sending a request
  beforeRequest: function (err, cursor, request, item) {
      // err, cursor: Same as arguments for "start"
      // item: sdk.Item
      // request: sdk.request
      console.log('beforeRequest: ' + JSON.stringify(err));
  },

  // Called just after sending a request
  request: function (err, cursor, response, request, item, cookies) {
      // err, cursor: Same as arguments for "start"
      // item: sdk.Item
      // response: sdk.Response
      // request: sdk.request
      console.log('request: ' + JSON.stringify(err));
  },

  // Called at the end of a run
  done: function (err) {
      // err: null or Error
      console.log('done');
  },

  // Called any time a console.* function is called in test/pre-request scripts
  console: function (cursor, level, ...logs) {
    console.log('console: "' + logs + '"');
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
      console.log('io: ' + JSON.stringify(err) + ' || ' + JSON.stringify(trace));
  }

}

console.log('Callbacks are now ready !')

var runner = new runtime.Runner();
runner.run(myCollection, {
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
    systemProxy: function (url, callback) { return callback(null, {/* ProxyConfig object */}) },

    // A CertificateList from the SDK
    certificates: new sdk.CertificateList(),

    // *note* Not implemented yet.
    // In the future, this will be used to read certificates from the OS keychain.
    systemCertificate: function() {}
}, function (err, run) {
    console.log('Creating a new Run !');
    console.log('======================')
    // Check the section below for detailed documentation on what callbacks should be.
    run.start(callbacks);
});
