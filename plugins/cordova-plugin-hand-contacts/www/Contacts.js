var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

/**
 * @constructor
 */
function Contacts() {

}

/**
 * 获取联系人
 * @param successCallback
 * @param errorCallback
 */

Contacts.prototype.pickContact = function (successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'Contacts.pickContact', arguments);
    
    exec(successCallback, errorCallback, "ContactsCordova", "pickContact", []);
};



module.exports = new Contacts();

