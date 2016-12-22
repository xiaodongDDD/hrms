var exec = require('cordova/exec');

exports.startRecorerRecognize = function(arg0, success, error) {
    exec(success, error, "VoiceToTextPlugin", "startRecorerRecognize", [arg0]);
};

exports.stopRecorderRecognize = function(arg0, success, error) {
    exec(success, error, "VoiceToTextPlugin", "stopRecorderRecognize", [arg0]);
};
