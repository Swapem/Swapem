 'use strict';

var React = require('react-native');
var RemoteDataAccessManager = require('./../RemoteDataAccessManager');
var Keys = require('./../Keys');
var Parse = require('parse/react-native');
var DeviceUUID = require("react-native-device-uuid");

var {
  AsyncStorage,
  Text,
  View,
} = React;

var { TestModule } = React.NativeModules;
var deepDiffer = require('deepDiffer');

//Initialize connection with test database
var parseDB = new RemoteDataAccessManager(Keys.testParseAppKey, Keys.testParseJsKey);

// Device specific UUID
var uniqueIdentifier;
DeviceUUID.getUUID().then((uuid) => {
	uniqueIdentifier = uuid;
});

//Parse tables
var DeviceLocations = Parse.Object.extend("DeviceLocations");
var TempSentContact = Parse.Object.extend("TempSentContact");

var DEBUG = false;

// setup in componentDidMount
var done = (result : ?boolean) => {};
var updateMessage = (message : string ) => {};

// -------------------------------------------------------Helpers-------------------------------------------------------------
function runTestCase(description : string, fn) {
  updateMessage(description);
  fn();
}

function expectTrue(condition : boolean, message : string) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectEqual(received, expected, testname : string) {
  expectTrue(
    !deepDiffer(received, expected),
    'Error in test ' + testname + ': expected\n' + JSON.stringify(expected) +
      '\ngot\n' + JSON.stringify(received)
  );
}

function expectAsyncNoError(place, err) {
  if (err instanceof Error) {
    err = err.message;
  }
  expectTrue(err === null, 'Unexpected error in ' + place + ': ' + JSON.stringify(err));
}

/*
* Construct random 5 letter string
*/
function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeEntryInTempSentContact(from, to, accepted, callback) {
	var tempSentContact = new TempSentContact();

	// set sender uuid
	tempSentContact.set("from", from);
	tempSentContact.set("to", to);
	tempSentContact.set("accepted", accepted);

	tempSentContact.save(null, {
		success: function(results) {
			callback(null, results)
		// Execute any logic that should take place after the object is saved.
		},
		error: function(error) {
			callback(error, null)
		}
	});
}

/**
* Retrieves a device from DeviceLocations with th supplied uuid.
*/
function retrieveDeviceWithUUID(uuid, callback) {
	var query = new Parse.Query(DeviceLocations);
	query.equalTo("uuid", uuid);

	query.find({
		success: function(results) {
			callback(null, results)
		},
		error: function(error) {
			callback(error, null)
		}
	})
}

/**
* Post entries to DeviceLocations table with the given uuid, geolocation, and searching status
*/
function postGPSLocation(uuid, geolocation, searching, callback) {
	var deviceLocation = new DeviceLocations();

	deviceLocation.set("uuid", uuid);
	deviceLocation.set("location", geolocation);
	deviceLocation.set("searching", searching);
	deviceLocation.set("name", "default");

	// If User's current location is successfully accessed then insert into db
	deviceLocation.save(null, {
		success: function(results) {
			callback(null, results)
		},
		error: function(error) {
			callback(error, null)
		}
	})
}

// -------------------------------------------------------Test Cases--------------------------------------------------------

/**
* Scenario: (a) User1 publishes gps location to the DeviceLocation table with uuid, geolocation, and name set to default.
*           (b) Retrieve published location from table.
*			(c) Get entry from (a)
*/
function testInitializeGpsLocation() {
	var user1 = "User1" + makeId();

	parseDB.initializeGPSLocation(user1, (err1, results) => {
	    expectAsyncNoError('testInitializeGpsLocation/initializeGPSLocation', err1);
	    retrieveDeviceWithUUID(user1, (err2, results) => {
	    	expectAsyncNoError('testInitializeGpsLocation/retrieveGPSLocation', err2);
	    	expectEqual(results[0].get('uuid'), user1, 'testInitializeGpsLocation/checkValues');
	    	updateMessage('GPS location currectly retrieved' + results[0].get('uuid'));
	    	runTestCase('should be able to retrieve requested contacts', testGetRequestedContacts);
	    });
	});
}
/**
* Scenario: (a) Initialize entry to TempSentContacts table from User1 to User2, "accepted" = false
*           (b) User2 searches for requested contacts
*			(c) Retrieves entry with "from" = User1
*/
function testGetRequestedContacts() {
	var user1 = "User1" + makeId();
	var user2 = "User2" + makeId();

	makeEntryInTempSentContact(user1, user2, false, (err1, results) => {
		expectAsyncNoError('testGetRequestedContacts/initializeTempSentContactEntry', err1);
		parseDB.getRequestedContacts(user2, (err2, results) => {
			expectAsyncNoError('testGetRequestedContacts/getRequestedContacts', err2);
			expectEqual(results[0].get('from'), user1, 'testGetRequestedContacts/checkValues');
	      	updateMessage('Requested contacts correctly retrived' + results[0].get('from'));
	      	runTestCase('should be able to retrieve requested contacts', testGetAcceptedContacts);
		});
	});
}

/**
* Scenario: (a) Initialize entry to TempSentContacts table from User1 to User2, "accepted" = true
*           (b) User2 searches for requested contacts
*			(c) Retrieves entry with "from" = User1
*/
function testGetAcceptedContacts() {
	var user1 = "User1" + makeId();
	var user2 = "User2" + makeId();

	makeEntryInTempSentContact(user1, user2, true, (err1, results) => {
		expectAsyncNoError('testGetAcceptedContacts/initializeTempSentContactEntry', err1);
		parseDB.getAcceptedContacts(user2, (err2, results) => {
			expectAsyncNoError('testGetAcceptedContacts/getAcceptedContacts', err2);
	      	expectEqual(results[0].get('from'), user1, 'testGetAcceptedContacts/checkValues');
	      	updateMessage('Accepted contacts correctly retrived' + results[0].get('from'));
	      	runTestCase('should be able to scan for Nearby Users', testScanForNearbyUsers);
		});
	});
}

/**
* Scenario: (a) Publish User1 current Geolocation to the DeviceLocation table
*           (b) Publish User2 with identical Geolocation to the DeviceLocation table
*			(c) User1 Scans for nearby users
*			(d) User1 sees User2 as a result
*/
function testScanForNearbyUsers() {
	var user1 = uniqueIdentifier;
	var user1Name = "User1Name" + makeId(); 
	var user2 = "User2" + makeId();
	var geolocation = new Parse.GeoPoint({latitude: 40.785834, longitude: -30.406417});

	parseDB.initializeGPSLocation(user1, (err1, results) => {
		expectAsyncNoError('testScanForNearbyUsers/postGPSUser1', err1);
		new Parse.GeoPoint.current().then(function(currentLocation) {
			postGPSLocation(user2, currentLocation, true, (err2, results) => { 
				expectAsyncNoError('testScanForNearbyUsers/postGPSUser2', err2);
				parseDB.scanForNearbyUsers(user1Name, (err3, results) => {
					expectAsyncNoError('testScanForNearbyUsers/scanForNearbyUsers', err3);
					expectEqual(results[0].get('uuid'), user2, 'testScanForNearbyUsers/checkValues');
					updateMessage('Scan for nearby users correctly retrived' + results[0].get('uuid'));
					done();
				});
			});
		})	
	});
}

/**
* Scenario: (a) User 1 send contact information to User2
*           (b) User 2 checks for newly sent contacts
*			(c) User2 finds an entry from User1
* TODO: Create test for sending contact information. There are some difficulties with sendContactInfo.. 
* that needs investigation.
*/ 
// function testSendContactInfoToSelectedUsers() {
// }


//TODO: Write functionality to clear tables after each test run.
// Note that the Parse js API doesn't support a clear() function
// We will need to retrieve all the results, iterate through and delete each entry.
// function clearTables() {
// }

var RemoteDataAccessManagerIT = React.createClass({
  getInitialState() {
    return {
      messages: 'Initializing...',
      done: false,
    };
  },

  componentDidMount() {
    done = () => this.setState({done: true}, TestModule.markTestCompleted);
    updateMessage = (msg) => {
      this.setState({messages: this.state.messages.concat('\n' + msg)});
      DEBUG && console.log(msg);
    };
    testInitializeGpsLocation();
  },

  render() {
    return (
      <View style={{backgroundColor: 'white', padding: 40}}>
        <Text>
          {this.constructor.displayName + ': '}
          {this.state.done ? 'Done' : 'Testing...'}
          {'\n\n' + this.state.messages}
        </Text>
      </View>
    );
  }
});

RemoteDataAccessManagerIT.displayName = 'RemoteDataAccessManagerIT';

module.exports = RemoteDataAccessManagerIT;