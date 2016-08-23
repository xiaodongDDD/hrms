var exec = require('cordova/exec');

exports.startLocation = function(success, error) {
    exec(success, error, "GaoDeLocationPlugin", "startLocation", []);
};
