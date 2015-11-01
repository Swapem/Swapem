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
var checkForRecentContactsSent = function(to, callback) {
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
	         //alert(object.id + ' - ' + object.get('name'));
	       }
	       callback(null, results)

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
var prepareUserForScan = function(userName) {
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
						alert('Geolocation updated for device: ' + deviceLocation.id);
						deviceLocation.set()
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
	prepareUserForScan(userName);
	var results;
	setTimeout(function() { 
		results = queryForUsersNearby();
	}, 9000);
	setTimeout(function() { 
		stopSearching(userName);
	}, 10000);
	return results;
}

module.exports = {
	checkForRecentContactsSent: checkForRecentContactsSent,
	scanForNearbyUsers: scanForNearbyUsers
}
