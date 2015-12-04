'use strict';

var React = require('react-native');
/**
* A data access layer for inserting data and querying the database.
*/
var Parse = require('parse/react-native');
var DeviceUUID = require("react-native-device-uuid");

var {
	AsyncStorage
} = React;

// Device specific UUID
var uniqueIdentifier;
DeviceUUID.getUUID().then((uuid) => {
	uniqueIdentifier = uuid;
});

/*
* Class Definition
*/
function RemoteDataAccessManager (applicationKey, jsKey) {
	
	/*
	* Initiatilize connection with the db with the given keys
	*/
	Parse.initialize(
  		applicationKey, 
  		jsKey
	);

	this.getRequestedContacts = function(to, callback) {
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
	};

	this.getAcceptedContacts = function(to, callback) {
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
	};

	this.updateContactToAccepted = function(to, name, callback) {
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
	};

	this.initializeGPSLocation = function(uuid, callback) {
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
								callback(null, deviceLocation)
								console.log('Geolocation updated for device: ' + deviceLocation.id);
							},
							error: function(error) {
								//alert("Error: " + error.code + " " + error.message);
								callback(error, null);
							   }
							})
					},
					error: function(error) {
					   //alert("Error: " + error.code + " " + error.message);
						callback(error, null)
					}
				})
			},
			error: function(error) {
				//alert("Error: " + error.code + " " + error.message);
				callback(error, null)
				}
			})
	};
	
	/**
	* Send contact information to selected users nearby
	* Args: profileDetails - name, phone, email, facebook, profile picture to send
	*       selectedUsers - user(s) to send the information to
	* Note that accepted is set to false by default. 
	* Destination is set using selectedUsers uuid value
	* Current geolocation is found and also sent.
	*/
	this.sendContactInfoToSelectedUsers = function(profileDetails, selectedUsers) {
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
			var name, phone, email, facebook, pic, location, notes, linkedIn;
			name = profileDetails.name;
			phone = profileDetails.phone;
			email = profileDetails.email;
			facebook = profileDetails.facebook;
			notes = profileDetails.notes;
			linkedIn = profileDetails.linkedIn;
			location = geolocation;

			if(profileDetails.pic){
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
				if (typeof notes !== "undefined") {
					tempSentContact.set("notes", notes);
				}
				if (typeof linkedIn !== "undefined") {
					tempSentContact.set("linkedIn", linkedIn);
				}
				if (typeof pic !== "undefined") {
					tempSentContact.set("pic", pic);
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
	};
	/**
	* Set searching to false 30seconds after calling
	*/
	this.stopSearching = function(userName) {
		var DeviceLocations = Parse.Object.extend("DeviceLocations");
		var query = new Parse.Query(DeviceLocations);
		query.equalTo("uuid", uniqueIdentifier);
		var deviceLocation;
		var scanPromise = new Parse.Promise();

		return query.find()
			.then(function(results) {
				return checkForExistingEntry(results);
			})
			.then(function() {
				return delay(30000);
			}).then(function() {
				return setSearchingToFalse();
			}).then(function() {
				scanPromise.resolve();
				return scanPromise;
			}, function(error) {
				callback(error, null)
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

		function setSearchingToFalse() {
			deviceLocation.set("searching", false);
			// If User's current location is successfully accessed then insert into db
			return deviceLocation.save();
		}

		function delay(millis) {
			var promise = new Parse.Promise();

			setTimeout(function() {
			  promise.resolve();
			}, millis);

			return promise;
		}
	}

	/**
	* Perform a scan for nearby users.
	* This involves (a) Prepare User for search: update geolocation/searching flag
	*				(b) waiting 9s
	*				(c) query for users nearby
	* Note that the 9s wait allows other users nearby to start scanning and persist their data
	*/
	this.scanForNearbyUsers = function(userName, callback) {
		alert("Searching for Nearby Users...");
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
				callback(null, results)
				return saveLocallyUsersNearbyResults(results);
			}).then(function() {
				scanPromise.resolve();
				return scanPromise;
			}, function(error) {
				callback(error, null)
				alert('An error occured while scanning for nearby users: '+ error.message);
			});

		function delay(millis) {
			var promise = new Parse.Promise();
			setTimeout(function() {
			  promise.resolve();
			}, millis);

			return promise;
		}

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
			query.withinKilometers("location", currentGeolocation, 100);

			return query.find();
		}

		function saveLocallyUsersNearbyResults(results) {
			var jsonArray = [];
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
	};
}

module.exports = RemoteDataAccessManager;
