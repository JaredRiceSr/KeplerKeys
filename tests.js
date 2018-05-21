var test = require("tape");
var nacl = require("tweetnacl");
var kID = require("./");

test("kID.fromSeed(kSeed)", function(t){

    var tst = function(seed_hex, expected){
        var kSeed = Buffer.from(seed_hex, "hex");
        var r = kID.fromSeed(kSeed);
        t.deepEquals(r, expected);
    };

    tst("3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff", {

        kID: "jbJWZXeXSsD5o1iWhYGFc",
        kVKey: "QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS",
        uniKey: "C2CLejK2c3SC9Rz4JLFuNtWJM8WDRq2CEMJuRqaJvr35",

        secret: {
            kSeed: "3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff",
            kSigKey: "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8",
            secKey: "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8",
        },
    });

    tst("5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e", {

        kID: "E7cwAzuB9kSU3mj2n9p97P",
        kVKey: "89ZgeKmTktxWg9UrGFzL2PbcHrToKNMPpLQtjbh17pfT",
        uniKey: "5UAXeov4Gi7ioSTLDoMPtdvqX6RRmJcQAWagVgdaxUej",

        secret: {
            kSeed: "5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e",
            kSigKey: "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR",
            secKey: "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR",
        },
    });

    tst("7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f", {

        kID: "TvqM6vQHEZb4EDYkfUVVUp",
        kVKey: "FgFdznhQTymQEBKNoboDLKDGWB7eezrhvKKQK2uKUSU5",
        uniKey: "3mosoLnk91yNrGga3vJtLaFNXf9yi85gSNisMT643HyH",

        secret: {
            kSeed: "7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f",
            kSigKey: "9Po5sqUto67MYFyfXXgV3PwvXoRxCfEXpSoMKn1eFtcv",
            secKey: "9Po5sqUto67MYFyfXXgV3PwvXoRxCfEXpSoMKn1eFtcv",
        },
    });

    tst("35604fb84e67d18a76b956d1cbf9ba7384994c3fba1e140ba95928cc98823058", {

        kID: "MAF6ioWmybYvjYU2HD9oBE",
        kVKey: "BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN",
        uniKey: "7QhcMiFkfZLf6TScAucX2kw3A9561MHMukWUhnsSzba8",

        secret: {
            kSeed: "35604fb84e67d18a76b956d1cbf9ba7384994c3fba1e140ba95928cc98823058",
            kSigKey: "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium",
            secKey: "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium",
        },
    });

    t.end();
});

test("kID.goKep()", function(t){

    var g1 = kID.goKep();
    var kSeed = Buffer.from(g1.secret.kSeed, "hex");

    t.deepEquals(kID.fromSeed(kSeed), g1, "goKep should just wrap .fromSeed(kSeed)");

    t.notEquals(g1.secret.kSeed, kID.goKep().secret.kSeed);
    t.notEquals(g1.secret.kSeed, kID.goKep().secret.kSeed);
    t.notEquals(g1.secret.kSeed, kID.goKep().secret.kSeed);

    t.end();
});

test("kID.signMessage(message, kSigKey, kVKey)", function(t) {

    var kSigKey = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var kVKey = "BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN";
    var message = "Hello World!!";

    var signedMessage = kID.signMessage(message, kSigKey, kVKey);
    t.notEqual(message, signedMessage);
    t.end();
});

test("kID.verifySignedMessage(signedMessage, kVKey)", function(t) {

    var kSigKey = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var kVKey = "BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN";
    var verifyKey2 = "QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS";
    var kSigKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";
    var message = "Hello World!!";
    var message2 = "I want to take over the world!!";

    var signedMessage = kID.signMessage(message, kSigKey, kVKey);
    var signedMessage2 = kID.signMessage(message2, kSigKey2, verifyKey2);

    t.equal(kID.verifySignedMessage(signedMessage, kVKey), message);
    t.equal(kID.verifySignedMessage(signedMessage, verifyKey2), false);

    t.equal(kID.verifySignedMessage(signedMessage2, verifyKey2), message2);
    t.equal(kID.verifySignedMessage(signedMessage2, kVKey), false);

    t.end();
});

test("kID.getKeyPairFromSignKey(kSigKey)", function(t) {
    var kSigKey = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var keyPair = kID.getKeyPairFromSignKey(kSigKey);

    t.equal(keyPair.publicKey.length, 32);
    t.equal(keyPair.secretKey.length, 32);

    t.end();
});

test("kID.getSharedSecret(theirKVKey, myKSigKey)", function(t) {
    var kSigKey1 = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var kSigKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";
    var kSigKey3 = "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR";

    var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
    var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);
    var keyPair3 = kID.getKeyPairFromSignKey(kSigKey3);

    var k1 = kID.goKep();
    var k2 = kID.goKep();

    // Create shared secrets from the string version of the keys
    var sharedSecret1 = kID.getSharedSecret(k2.uniKey, k1.secret.secKey);
    var sharedSecret2 = kID.getSharedSecret(k1.uniKey, k2.secret.secKey);
    t.equal(nacl.verify(sharedSecret1, sharedSecret2), true);


    var sharedSecret1To2 = kID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);
    var sharedSecret2To1 = kID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey);
    var sharedSecret3To1 = kID.getSharedSecret(keyPair3.publicKey, keyPair1.secretKey);

    t.equal(nacl.verify(sharedSecret1To2, sharedSecret2To1), true);
    t.equal(nacl.verify(sharedSecret3To1, sharedSecret2To1), false);

    t.end();
});

test("kID.encryptMessage(message, kNonce, sharedSecret)", function (t) {
    var kSigKey1 = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var kSigKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";

    var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
    var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);

    var sharedSecret1To2 = kID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);

    var message = "Hello World!!";
    var kNonce = kID.getNonce();
    var encryptedMessage = kID.encryptMessage(message, kNonce, sharedSecret1To2);

    t.notEqual(message, encryptedMessage);

    t.end();
});

test("kID.decryptMessage(theirKVKey, myKSigKey", function(t) {
    var kSigKey1 = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var kSigKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";
    var kSigKey3 = "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR";

    var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
    var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);
    var keyPair3 = kID.getKeyPairFromSignKey(kSigKey3);

    var sharedSecret1To2 = kID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);
    var sharedSecret2To1 = kID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey);
    var sharedSecret3To1 = kID.getSharedSecret(keyPair3.publicKey, keyPair1.secretKey);

    var message = "Hello World!!";
    var kNonce = kID.getNonce();

    var encryptedMessage = kID.encryptMessage(message, kNonce, sharedSecret1To2);
    var decryptedMessage = kID.decryptMessage(encryptedMessage, kNonce, sharedSecret2To1);
    var attemptedDecryption = kID.decryptMessage(encryptedMessage, kNonce, sharedSecret3To1);

    t.equal(decryptedMessage, message);
    t.notEqual(message, attemptedDecryption);
    t.equal(attemptedDecryption, false);

    t.end();
});
