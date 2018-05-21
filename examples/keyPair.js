var kID = require("kepler-keys");

var kKeys = kID.goKep();
var kSigKey = kKeys.secret.kSigKey;
var kKeyPair = kID.getKeyPairFromSignKey(kSigKey);
console.log(kKeyPair);
