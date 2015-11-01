'use strict';

/**
* A data access layer for inserting data and querying the database.
*/
var Parse = require('parse/react-native');
var DeviceUUID = require('react-native-device-uuid');

Parse.initialize(
  "8ejr07x24pTYlxz76vCnQS1srDLuLH3mXTbPGJKh", 
  "4aUKjPF9Pl39GkIv1d7UcpNQU4LeRpu2kYdnZ6dk"
);

// Device specific UUID
var uniqueIdentifier;
DeviceUUID.getUUID().then((uuid) => {
	uniqueIdentifier = uuid;
});

/**
* Checks if contact information was recently sent.
* Args: to - The receiver's UUID.
*/
var checkForRecentContactsSent = function(to) {
	var TempSentContact = Parse.Object.extend("TempSentContact");
	// Query instance of TempSentContact table
	var query = new Parse.Query(TempSentContact);

	// Query for instance where contact information was sent to the user
	query.equalTo("to", to);

	// Initiate the query
	query.find({
	success: function(results) {
	   alert("Successfully retrieved " + results.length + " instances of contact information");
	   // Do something with the returned Parse.Object values
	     for (var i = 0; i < results.length; i++) {
	         var object = results[i];
	         alert(object.id + ' - ' + object.get('name'));
	       }
	   },
	error: function(error) {
	   alert("Error: " + error.code + " " + error.message);
	   }
	})
}

var getRequestedContacts = function(to, callback) {
	var TempSentContact = Parse.Object.extend("TempSentContact");
	// Query instance of TempSentContact table
	var query = new Parse.Query(TempSentContact);

	// Query for instance where contact information was sent to the user and hasn't been accepted
	query.equalTo("to", to);
	query.equalTo("accepted", false);

	// Initiate the query
	query.find({
	success: function(results) {
	   //alert("Successfully retrieved " + results.length + " instances of contact information");
	       callback(null, results)
	   },
	error: function(error) {
	   alert("Error: " + error.code + " " + error.message);
	   callback(error, null)
	   }
	})
}

var getAcceptedContacts = function(to, callback) {
	var TempSentContact = Parse.Object.extend("TempSentContact");
	// Query instance of TempSentContact table
	var query = new Parse.Query(TempSentContact);

	// Query for instance where contact information has been accepted
	query.equalTo("to", to);
	query.equalTo("accepted", true)

	// Initiate the query
	query.find({
	success: function(results) {
	   //alert("Successfully retrieved " + results.length + " instances of contact information");
	       callback(null, results)
	   },
	error: function(error) {
	   alert("Error: " + error.code + " " + error.message);
	   callback(error, null)
	   }
	})
}

var updateContactToAccepted = function(to, name, callback) {
	var TempSentContact = Parse.Object.extend("TempSentContact");
	// Query instance of TempSentContact table
	var query = new Parse.Query(TempSentContact);

	// Query for instance where contact information is accepted by user
	query.equalTo("to", to);
	query.equalTo("name", name)

	// Initiate the query
	query.first({
	success: function(result) {
	   alert("Successfully retrieved " + result.length + " instances of contact information");
	   // update accepted to true
	    	result.set("accepted", true)
	    	result.save()
	       	callback(null, result)
	   },
	error: function(error) {
	   alert("Error: " + error.code + " " + error.message);
	   callback(error, null)
	   }
	})
}

/**
* Prepares the given user for scanning of nearby users:
* (a) Updates/Saves Geolocation
* (b) Set "searching" to true
* Args: UserName: Contains name of the user's profile chosen: i.e. "John Doe"
*/
var prepareUserForScan = function(userName, callback) {
	var DeviceLocations = Parse.Object.extend("DeviceLocations");
	var query = new Parse.Query(DeviceLocations);
	var nearbyUsers;
	query.equalTo("uuid", uniqueIdentifier);
	// Search for previous entries under the same UUID
	query.find({
	success: function(results) {
		console.log("Number of previous entries: " + results.length);

		var deviceLocation;
		// If no previous entries, instantiate new Parse object
		if (results.length == 0) {
			deviceLocation = new DeviceLocations();
		}
		// If previous entry exists, resuse the same object
		else {
			deviceLocation = results[0];
		}
		// Update user's current geolocation 
		var userGeoPoint = new Parse.GeoPoint.current({
			success: function(userGeoPoint) {
				deviceLocation.set("uuid", uniqueIdentifier);
				deviceLocation.set("name", userName);
				deviceLocation.set("searching", true);
				deviceLocation.set("location", userGeoPoint);

				// If User's current location is successfully accessed then insert into db
				deviceLocation.save(null, {
					success: function(deviceLocation) {
						console.log('Geolocation updated for device: ' + deviceLocation.id);
						// FUNCTION 2 Combined::: QueryForUsersNearby()
						// TODO- Separate into several functions ********************************
						// Query Instance of DeviceLocations table
						query = new Parse.Query(DeviceLocations);

						// Build Up the Query
						// TODO- Separate into several functions ********************************
						// query.equalTo("searching", true);
						query.notEqualTo("uuid", uniqueIdentifier);
						query.select("name", "uuid");

						// User's location  
						var userGeoPoint = new Parse.GeoPoint.current({
						    success: function(userGeoPoint){
						        console.log(userGeoPoint); 
						        // If User's current location is successfully accessed, then set query to within
						        // 100m of this location
						        query.withinKilometers("location", userGeoPoint, 0.1)
						        // Initiate the query
						        query.find({
						            success: function(results) {
						            	callback(results);
						              query = new Parse.Query(DeviceLocations);
										query.equalTo("uuid", uniqueIdentifier);
										// Search for previous entries under the same UUID
										query.find({
										success: function(results) {
											console.log("Number of previous entries: " + results.length);
											var deviceLocation;
											// If no previous entries, instantiate new Parse object
											if (results.length == 0) {
												deviceLocation = new DeviceLocations();
											}
											// If previous entry exists, resuse the same object
											else {
												deviceLocation = results[0];
											}
											deviceLocation.set("searching", false);

												// If User's current location is successfully accessed then insert into db
												deviceLocation.save(null, {
													success: function(result) {
														console.log('Device is no longer searching :' + deviceLocation.id);
													},
													error: function(deviceLocation, error) {
														alert('Failed to stop device from searching ' + error.message);
													}
												});
											},
										error: function(error) {
										   alert("Error finding previous deviceLocation entry to update: " + error.code + " " + error.message);
										   }
										})
						            },
						             error: function(error) {
						              alert("Error: " + error.code + " " + error.message);
						            }
						        });
						    }
						});
					},
					error: function(deviceLocation, error) {
						alert('Failed to update Geolocation, with error code: ' + error.message);
					}
				});
			}
		})
	},
	error: function(error) {
	   alert("Error checking if deviceLocation entry exists: " + error.code + " " + error.message);
	   }
	})
}

/**
* Query for nearby users who are actively scanning and within 100m
*/
var queryForUsersNearby = function() {
	// Parse Object
	var DeviceLocations = Parse.Object.extend("DeviceLocations");

	// Query Instance of DeviceLocations table
	var query = new Parse.Query(DeviceLocations);

	// Build Up the Query
	query.equalTo("searching", true);
	query.notEqualTo("uuid", uniqueIdentifier);
	query.select("name", "uuid");

	// User's location  
	var userGeoPoint = new Parse.GeoPoint.current({
	    success: function(userGeoPoint){
	        console.log(userGeoPoint); 

	        // If User's current location is successfully accessed, then set query to within
	        // 100m of this location
	        query.withinKilometers("location", userGeoPoint, 0.1)

	        // Initiate the query
	        query.find({
	            success: function(results) {
	              alert("Successfully retrieved " + results.length + " users nearby.");
	              return results;
	            },
	             error: function(error) {
	              alert("Error: " + error.code + " " + error.message);
	            }
	        });
	    }
	});
}

var stopSearching = function(userName) {
	var DeviceLocations = Parse.Object.extend("DeviceLocations");
	var query = new Parse.Query(DeviceLocations);

	query.equalTo("uuid", uniqueIdentifier);
	// Search for previous entries under the same UUID
	query.find({
	success: function(results) {
		console.log("Number of previous entries: " + results.length);

		var deviceLocation;
		// If no previous entries, instantiate new Parse object
		if (results.length == 0) {
			deviceLocation = new DeviceLocations();
		}
		// If previous entry exists, resuse the same object
		else {
			deviceLocation = results[0];
		}
		deviceLocation.set("searching", false);

			// If User's current location is successfully accessed then insert into db
			deviceLocation.save(null, {
				success: function(result) {
					alert('Device is no longer searching :' + deviceLocation.id);
				},
				error: function(deviceLocation, error) {
					alert('Failed to stop device from searching ' + error.message);
				}
			});
		},
	error: function(error) {
	   alert("Error finding previous deviceLocation entry to update: " + error.code + " " + error.message);
	   }
	})
}

/**
* Perform a scan for nearby users.
* This involves (a) Prepare User for search: update geolocation/searching flag
*				(b) waiting 9s
*				(c) query for users nearby
* Note that the 9s wait allows other users nearby to start scanning and persist their data
*/
var scanForNearbyUsers = function(userName) {
	//var callback = function(results) {
	//	resultsOfScan = results;
	//	alert("original callback " + resultsOfScan)
	//	alert("resultsOfScan: "+ resultsOfScan)
	//}

	prepareUserForScan(userName, function(ln) {
		alert('do I have the actual value of callback in here?: ' + ln);
	});
	
	//prepareUserForScan(userName);
	//setTimeout(function() { 
	//	usersNearby = queryForUsersNearby();
	//}, 9000);
	//setTimeout(function() { 
	//	stopSearching(userName);
	//}, 10000);
	//return usersNearby;
}

module.exports = {
	checkForRecentContactsSent: checkForRecentContactsSent,
	scanForNearbyUsers: scanForNearbyUsers,
	prepareUserForScan: prepareUserForScan
	getRequestedContacts: getRequestedContacts,
	getAcceptedContacts: getAcceptedContacts,
	updateContactToAccepted: updateContactToAccepted
}
