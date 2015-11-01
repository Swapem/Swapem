var RNDBModel = require('react-native-db-models');

var DB = {
    "contacts": new RNDBModel.create_db('contacts'),
    "addressbook": new RNDBModel.create_db('contacts')
}

module.exports = DB