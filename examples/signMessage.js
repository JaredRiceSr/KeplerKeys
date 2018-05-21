  var kID = require("kepler-keys"); 

  var kKey = kID.goKep();
 
  var kSigKey = kKey.secret.kSigKey;
  var kVKey = kKey.kVKey;
  var message = "One giant step.";
 
  var signedMessage = kID.signMessage(message, kSigKey, kVKey);
  
  console.log(signedMessage);
