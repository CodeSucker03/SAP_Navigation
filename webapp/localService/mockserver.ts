import MockServer from "sap/ui/core/util/MockServer";

export default {
  init: function () {
    // create
    const mockServer = new MockServer({
      rootUri: "/here/goes/your/serviceUrl/"  // must match manifest.json
    });

    const urlParams = new URLSearchParams(window.location.search);

    // configure mock server with a delay
    MockServer.config({
      autoRespond: true,
      autoRespondAfter: parseInt(urlParams.get("serverDelay") || "1000")
    });

    // simulate with local metadata + mockdata
    const path = sap.ui.require.toUrl("sap/ui/demo/nav/localService");
    mockServer.simulate(path + "/metadata.xml", {
      sMockdataBaseUrl: path + "/mockdata",
      bGenerateMissingMockData: true
    });

    console.log("MockServer initialized at " + mockServer.getRootUri());

    // start
    mockServer.start();
  }
};




// sap.ui.define([
// 	"sap/ui/core/util/MockServer",
// 	"sap/ui/model/json/JSONModel",
// 	"sap/base/Log"
// ], function (MockServer, JSONModel, Log) {
// 	"use strict";

// 	var _sAppPath = "sap/ui/demo/nav/",
// 		_sJsonFilesPath = _sAppPath + "localService/mockdata";

// 	return {

// 		init: function () {

// 			return new Promise(function(fnResolve, fnReject) {
// 				var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
// 					oManifestModel = new JSONModel(sManifestUrl);

// 				oManifestModel.attachRequestCompleted(function () {
// 					var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
// 						oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/employeeRemote"),
// 						sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

// 					// create
// 					var oMockServer = new MockServer({
// 						rootUri: oMainDataSource.uri
// 					});

// 					// configure
// 					MockServer.config({
// 						autoRespond: true,
// 						autoRespondAfter: 500
// 					});

// 					// simulate
// 					oMockServer.simulate(sMetadataUrl, {
// 						sMockdataBaseUrl: sJsonFilesUrl
// 					});

// 					// start
// 					oMockServer.start();

// 					Log.info("Running the app with mock data");
// 					fnResolve();
// 				});

// 				oManifestModel.attachRequestFailed(function () {
// 					var sError = "Failed to load application manifest";

// 					Log.error(sError);
// 					fnReject(new Error(sError));
// 				});
// 			});
// 		}
// 	};
// });
