'use strict';

var React = require('react-native');
/**
* A data access layer for inserting data and querying the database.
*/
var Parse = require('parse/react-native');
var DeviceUUID = require("react-native-device-uuid");

Parse.initialize(
  "8ejr07x24pTYlxz76vCnQS1srDLuLH3mXTbPGJKh", 
  "4aUKjPF9Pl39GkIv1d7UcpNQU4LeRpu2kYdnZ6dk"
);

var {
	AsyncStorage
} = React;

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
	   // alert("Successfully retrieved " + results.length + " instances of contact information");
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

var initializeGPSLocation = function(uuid) {
	var DeviceLocations = Parse.Object.extend("DeviceLocations");
	var query = new Parse.Query(DeviceLocations);
	query.equalTo("uuid", uuid);
	// Search for previous entries under the same UUID
	query.find({
	success: function(results) {
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
				deviceLocation.set("uuid", uuid);
				deviceLocation.set("location", userGeoPoint);
				deviceLocation.set("name", "default");

				// If User's current location is successfully accessed then insert into db
				deviceLocation.save(null, {
					success: function(deviceLocation) {
						console.log('Geolocation updated for device: ' + deviceLocation.id);
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					   }
					})
			},
			error: function(error) {
			   alert("Error: " + error.code + " " + error.message);
			}
		})
	},
	error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	}
})
}

/**
* Send contact information to selected users nearby
* Args: profileDetails - name, phone, email, facebook, profile picture to send
*       selectedUsers - user(s) to send the information to
* Note that accepted is set to false by default. 
* Destination is set using selectedUsers uuid value
* Current geolocation is found and also sent.
*/
var sendContactInfoToSelectedUsers = function(profileDetails, selectedUsers) {
	var TempSentContact = Parse.Object.extend("TempSentContact");

	// (a) Get current geolocation
	// (b) Send information
	new Parse.GeoPoint.current()
		.then(function(geolocation) {
			return sendInformation(geolocation, profileDetails, selectedUsers);
		}, function(error) {
			alert('An error occured while sending your information. Please try again.');
		});

	function sendInformation(geolocation, profileDetails, selectedUsers) {
		var name, phone, email, facebook, pic, location;
		name = profileDetails.name;
		phone = profileDetails.phone;
		email = profileDetails.email;
		facebook = profileDetails.facebook;
		location = geolocation;

		if(!profileDetails.pic){
			pic = new Parse.File("profilePic.png", { base64: profileDetails.pic.uri});
		}

		var arrayUUID = [];

		var nearbyUsers = JSON.parse(selectedUsers);
		// Grab uuid of all users to send information to
		for (var i=0; i<nearbyUsers.length; i++) {
			var user = nearbyUsers[i];
			arrayUUID.push(user.uuid);
		}
		
		// Generate parse entry for each destination
		for (var i=0; i<arrayUUID.length; i++) {
			var tempSentContact = new TempSentContact();

			if (typeof location !== "undefined") {
				tempSentContact.set("location", location);
			}
			if (typeof name !== "undefined") {
				tempSentContact.set("name", name);
			}
			if (typeof phone !== "undefined") {
				tempSentContact.set("phone", phone);
			}
			if (typeof email !== "undefined") {
				tempSentContact.set("email", email);
			}
			if (typeof facebook !== "undefined") {
				tempSentContact.set("facebook", facebook);
			}
			if (typeof pic !== "undefined") {
				tempSentContact.set("pic", pic)
			}
			// set accepted = false by default when first sending information
			tempSentContact.set("accepted", false);
			// set sender uuid
			tempSentContact.set("from", uniqueIdentifier);
			tempSentContact.set("to", arrayUUID[i]);

			tempSentContact.save(null, {
			  success: function(tempSentContact) {
			    // Execute any logic that should take place after the object is saved.
			  },
			  error: function(tempSentContact, error) {
			    alert('Failed to publish intent to send contact in Parse ' + error.message);
			  }
			});
		}
		alert('Contact information sent successfully');
	}
}

/**
* Custom Asynchronous Delay Method to set timeouts
*/
var delay = function(millis) {
  var promise = new Parse.Promise();

  setTimeout(function() {
    promise.resolve();
  }, millis);

  return promise;
};

/**
* Perform a scan for nearby users.
* This involves (a) Prepare User for search: update geolocation/searching flag
*				(b) waiting 9s
*				(c) query for users nearby
* Note that the 9s wait allows other users nearby to start scanning and persist their data
*/
var scanForNearbyUsers = function(userName) {
	var DeviceLocations = Parse.Object.extend("DeviceLocations");
	var query = new Parse.Query(DeviceLocations);
	query.equalTo("uuid", uniqueIdentifier);
	var deviceLocation;
	var currentGeolocation;
	var scanPromise = new Parse.Promise();

	return query.find()
		.then(function(results) {
			return checkForExistingEntry(results)
		})
		.then(function() {
			return new Parse.GeoPoint.current();
		})
		.then(function(geolocation) {
			return updateToSearchStatus(geolocation);
		})			
		.then(function() {
			return delay(9000);
		}).then(function() {
			return queryForUsersNearby();
		}).then(function(results) {
			alert("Number of Users Found Nearby: " + results.length);
			return saveLocallyUsersNearbyResults(results);
		}).then(function() {
			return stopSearching();
		}).then(function() {
			scanPromise.resolve();
			return scanPromise;
		}, function(error) {
			alert('An error occured while scanning for nearby users: '+ error.message);
		});

	function checkForExistingEntry(existingEntry) {
		var promise = new Parse.Promise();
		// If no previous entries, instantiate new Parse object
		if (existingEntry.length == 0) {
			deviceLocation = new DeviceLocations();
		}
		// If previous entry exists, resuse the same object
		else {
			deviceLocation = existingEntry[0];
		}
		promise.resolve();
		return promise;
	}

	function updateToSearchStatus(geolocation) {
		currentGeolocation = geolocation;
		deviceLocation.set("uuid", uniqueIdentifier);
		deviceLocation.set("name", userName);
		deviceLocation.set("searching", true);
		deviceLocation.set("location", geolocation);
		// If User's current location is successfully accessed then insert into db
		return deviceLocation.save();
	}

	function queryForUsersNearby() {
		var query = new Parse.Query(DeviceLocations);
		// Build Up the Query
		query.notEqualTo("uuid", uniqueIdentifier);
		query.equalTo("searching", true);
		query.select("name", "uuid");
		query.withinKilometers("location", currentGeolocation, 0.1)
		return query.find();
	}

	function saveLocallyUsersNearbyResults(results) {
		var jsonArray = [];

		// alert("Results: " + JSON.stringify(results));

		// Construct a jsonArray with the users who were found nearby.
		for (var i = 0; i < results.length; i++) {
			var user = results[i];
			jsonArray.push({
				name: user.get('name'),
				uuid: user.get('uuid'),
			});
		}
		// Make sure that local temp storage is cleared (from previous scans)
		return AsyncStorage.removeItem('nearbyDevices').then(AsyncStorage.setItem('nearbyDevices', JSON.stringify(jsonArray)));
	}

	function stopSearching() {
		deviceLocation.set("searching", false);
		alert("Device is no longer searching");
		// If User's current location is successfully accessed then insert into db
		return deviceLocation.save();
	}
}

module.exports = {
	checkForRecentContactsSent: checkForRecentContactsSent,
	scanForNearbyUsers: scanForNearbyUsers,
	getRequestedContacts: getRequestedContacts,
	getAcceptedContacts: getAcceptedContacts,
	updateContactToAccepted: updateContactToAccepted,
	sendContactInfoToSelectedUsers: sendContactInfoToSelectedUsers,
	initializeGPSLocation: initializeGPSLocation,
	delay: delay
}
