'use strict';

/**
* A data access layer for inserting data and querying the database.
*/
var Parse = require('parse/react-native');

Parse.initialize(
  "8ejr07x24pTYlxz76vCnQS1srDLuLH3mXTbPGJKh", 
  "4aUKjPF9Pl39GkIv1d7UcpNQU4LeRpu2kYdnZ6dk"
);

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

/**
* Updates Geolocation is given User
* Args: UserInfo: contains user's uuid, name, and searching params
* 
* Example: var userInfo = {
*  uuid: "hello",
*  name: "hello",
*  searching: false
* }
* DataAccessManager.updateGeoLocation(userInfo);
*/
var updateGeoLocation = function(userInfo) {
	var DeviceLocations = Parse.Object.extend("DeviceLocations");

	// Data Instance of DeviceLocations table
	var deviceLocation = new DeviceLocations();

	// User's current location  
	var userGeoPoint = new Parse.GeoPoint.current({
		success: function(userGeoPoint) {
			console.log(userGeoPoint);

			// If User's current location is successfully accessed then insert into db
			deviceLocation.save({
				uuid: userInfo.uuid,
				name: userInfo.name,
				searching: userInfo.searching,
				location: userGeoPoint
			},{
				success: function(deviceLocation) {
					alert('Geolocation updated for device: ' + deviceLocation.id);
				},
				error: function(deviceLocation, error) {
					alert('Failed to update Geolocation, with error code: ' + error.message);
				}
			});
		}
	})
}

/**
* Query for nearby users who are actively scanning and within 100m
*/
var queryForUsersNearby = function(uuid) {
	// Parse Object
	var DeviceLocations = Parse.Object.extend("DeviceLocations");

	// Query Instance of DeviceLocations table
	var query = new Parse.Query(DeviceLocations);

	// Build Up the Query
	query.notEqualTo("uuid", uuid);
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

/**
* Perform a scan for users.
* This involves (a) updating geolocation/searching flag
*				(b) waiting 9s
*				(c) query for users nearby
* Note that the 9s wait allows other users nearby to start scanning and persist their data
*/
var scan = function(userInfo) {
	updateGeoLocation(userInfo);
	setTimeout(queryForUsersNearby, 9000);
}

module.exports = {
	checkForRecentContactsSent: checkForRecentContactsSent,
	updateGeoLocation: updateGeoLocation,
	scan: scan
}