var nacl = require("tweetnacl");
var bs58 = require("bs58");


var fromSeed = function (kSeed) {

    var KepX = nacl.sign.keyPair.fromSeed(kSeed);
    var secKey = KepX.secretKey.subarray(0, 32);
    var kSigKey = bs58.encode(secKey);
    var keyPair = nacl.box.keyPair.fromSecretKey(secKey);

    return {

        kID: bs58.encode(KepX.publicKey.subarray(0, 16)),
        kVKey: bs58.encode(KepX.publicKey),
        uniKey: bs58.encode(keyPair.publicKey),

        secret: {
            kSeed: Buffer.from(kSeed).toString("hex"),
            kSigKey: kSigKey,
            secKey: bs58.encode(keyPair.secretKey),
        },
    };
};

var verifySignedMessage = function (signedMessage, kVKey) {
    var decodedKey = bs58.decode(kVKey);
    var signed = nacl.sign.open(signedMessage, decodedKey);
    return signed !== null ? new Buffer(signed).toString("utf8") : false;
};

var signMessage = function (message, kSigKey, kVKey) {
    kVKey = bs58.decode(kVKey);
    kSigKey = bs58.decode(kSigKey);
    var fullSignKey = Buffer.concat([kSigKey, kVKey]);
    var arrayMessage = Buffer.from(message, "utf8");
    return nacl.sign(arrayMessage, fullSignKey);
};

function getArrayFromKey(key) {
    return Uint8Array.from(bs58.decode(key));
}

var getKNonce = function () {
    return nacl.randomBytes(nacl.box.nonceLength);
};

var getKeyPairFromSignKey = function (kSigKey) {
    return nacl.box.keyPair.fromSecretKey(getArrayFromKey(kSigKey));
};

var getSharedSecret = function (theirKVKey, myKSigKey) {
    theirKVKey = typeof theirKVKey === "string" ? bs58.decode(theirKVKey) : theirKVKey;
    myKSigKey = typeof myKSigKey === "string" ? bs58.decode(myKSigKey) : myKSigKey;
    return nacl.box.before(theirKVKey, myKSigKey)
};

var decryptMessage = function (encryptedMessage, kNonce, sharedSecret) {
    var verifiedEncrypTion = nacl.box.open.after(encryptedMessage, kNonce, sharedSecret);
    return verifiedEncrypTion !== null ? new Buffer(verifiedEncrypTion).toString("utf8") : false;
};

var encryptMessage = function (message, kNonce, sharedSecret) {
    return nacl.box.after(Buffer.from(message, "utf8"), kNonce, sharedSecret);
};

module.exports = {
    goKep: function () {
        var kSeed = nacl.randomBytes(nacl.sign.seedLength);
        return fromSeed(kSeed);
    },
    fromSeed: fromSeed,
    signMessage: signMessage,
    verifySignedMessage: verifySignedMessage,
    getKeyPairFromSignKey: getKeyPairFromSignKey,
    getSharedSecret: getSharedSecret,
    decryptMessage: decryptMessage,
    encryptMessage: encryptMessage,
    getKNonce: getKNonce,
};
