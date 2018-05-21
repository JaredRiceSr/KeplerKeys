var test = require("tape");
var nacl = require("tweetnacl");
var kID = require("./");

test("kID.fromSeed(kSeed)", function(t){

    var tst = function(seed_hex, expected){
        var kSeed = Buffer.from(seed_hex, "hex");
        var r = kID.fromSeed(kSeed);
        t.deepEquals(r, expected);
    };

    tst("a95e58d4b13ae0904f216d7b6c88dbfd786d7c860476769fccc78a56b7168711", {

        kID: "4jifBtJ25m8jizVRzoAGS2",
        kVKey: "337tgZ21yZDNCW2iYkDH53fFM7twpZxJEw677eu1VFRA",
        uniKey: "AuHAYMqugn1oq6YKcpAMcuY3pguz8imt6bZMeSDkeBKt",

        secret: {
            kSeed: "a95e58d4b13ae0904f216d7b6c88dbfd786d7c860476769fccc78a56b7168711",
            kSigKey: "CQ9Lq6R4iFVzKnjTSJUivBFtvyE7JXTKQKdDJVVN5HXN",
            secKey: "CQ9Lq6R4iFVzKnjTSJUivBFtvyE7JXTKQKdDJVVN5HXN",
        },
    });

    tst("8fab3b922700b431ddc41216a1abc98ab666b77da36d95ed70d7f78ce7229dc1", {

        kID: "6KqxGE5L3nSjgXZdgwY6si",
        kVKey: "3uLAkanKNzXGhz22juSiKJVEs1MbcdHuRELV9rnaRjwb",
        uniKey: "Dm5KMsm79RHiGKJAZhnyW1B8fE6cz92dFAWgowZ3UJ8v",

        secret: {
            kSeed: "8fab3b922700b431ddc41216a1abc98ab666b77da36d95ed70d7f78ce7229dc1",
            kSigKey: "Afpjuqz38PjtbusCsZvkRJdSbByZnvV26EbKKQPfbF84",
            secKey: "Afpjuqz38PjtbusCsZvkRJdSbByZnvV26EbKKQPfbF84",
        },
    });

    tst("95ccb459d36317f64611319b4b202e3d862214ac010f5a2cd86ff9b48acd1d80", {

        kID: "V6sM3cECR2YHGALtv7E8uf",
        kVKey: "GKLLoefDxVEK6UKpmKMJ9UwNALFEBhaA4JcSPM3vRosm",
        uniKey: "HENTdXzShzPGMgaukyNhgqtvGJgoFQS9phZy9Y5CLFBg",

        secret: {
            kSeed: "95ccb459d36317f64611319b4b202e3d862214ac010f5a2cd86ff9b48acd1d80",
            kSigKey: "B5knk43jCGberzaUwkn5PJ7jY8XRpPk5BZHhuBMdprzT",
            secKey: "B5knk43jCGberzaUwkn5PJ7jY8XRpPk5BZHhuBMdprzT",
        },
    });

    tst("337765fd4629cd4955f13605851fd2faaca57a3c4da0051da3ca3fbe06f5125a", {

        kID: "PVCYTeW3mecQsfNcNFFjPv",
        kVKey: "DFqJVtSdMtAJP29LQ9vPjZbbt1Z2if71H7nMAMcKkmHs",
        uniKey: "Eivy5nCEe9BZqd8a9yidBGDLAvrvdMJSUYKU5SWCmC4X",

        secret: {
            kSeed: "337765fd4629cd4955f13605851fd2faaca57a3c4da0051da3ca3fbe06f5125a",
            kSigKey: "4TuPa3QgeKmChACiQYWv6JkQWD9HDu78BFqirGaVt3iq",
            secKey: "4TuPa3QgeKmChACiQYWv6JkQWD9HDu78BFqirGaVt3iq",
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

    var kSigKey = "8F6Ub3U7a7sG14mGftYXcwAYU1h7x3KEaxjwLRTpwhp9";
    var kVKey = "CAvg8J3mR73uYMbwzxmsvHwBPfEDXqBMWhnLZ9fhBNWx";
    var message = "One Major Step.";

    var signedMessage = kID.signMessage(message, kSigKey, kVKey);
    t.notEqual(message, signedMessage);
    t.end();
});

test("kID.verifySignedMessage(signedMessage, kVKey)", function(t) {

    var kSigKey = "6i3CZj7MHrfuCJ3T1twdvWaKEkThAdFDxq6Tia1HCvWc";
    var kVKey = "4AfKzGmumQhA87VuGmftJrsJVzFGutKRoWQsoxVmpLRY";
    var kVKey2 = "34Nj6TtcUjknrBH2vuBeNdsrngm8PqHp2x336otsya2r";
    var kSigKey2 = "8dchV2pWzR4g3SwYiaQyYbHN5qCFgQNLuMdSUwcPpGop";
    var message = "One small step.";
    var message2 = "For mankind.";

    var signedMessage = kID.signMessage(message, kSigKey, kVKey);
    var signedMessage2 = kID.signMessage(message2, kSigKey2, kVKey2);

    t.equal(kID.verifySignedMessage(signedMessage, kVKey), message);
    t.equal(kID.verifySignedMessage(signedMessage, kVKey2), false);

    t.equal(kID.verifySignedMessage(signedMessage2, kVKey2), message2);
    t.equal(kID.verifySignedMessage(signedMessage2, kVKey), false);

    t.end();
});

test("kID.getKeyPairFromSignKey(kSigKey)", function(t) {
    var kSigKey = "Dsc4doSuoqTBUTuJuWGDSMeD2cG6fcSBNwwMRL6hHghi";
    var keyPair = kID.getKeyPairFromSignKey(kSigKey);

    t.equal(keyPair.publicKey.length, 32);
    t.equal(keyPair.secretKey.length, 32);

    t.end();
});

test("kID.getSharedSecret(theirKVKey, myKSigKey)", function(t) {
    var kSigKey1 = "NfwG9qyKa4VEaf3ZXrsjTv7wBReoibWEPkMXhSkc1CX";
    var kSigKey2 = "DM5Kp4RdmDCP5Gj9cEsdb79wDoQGr3ZaFTxtLXF97t26";
    var kSigKey3 = "7LYwAW3HmZaB2ATsvYh2cxfwMQfsp9FcyCiy8p56KVCu";

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
    var kSigKey1 = "3cXULEbf8eeVqnzHTACY7HaV1irxo5fdMVXUjgEcbcS8";
    var kSigKey2 = "CHrWt1DVXqCNxJWWP7RhQBvcsp6MMLavaEmpC7aVFp1D";

    var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
    var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);

    var sharedSecret1To2 = kID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);

    var message = "Hello World!!";
    var kNonce = kID.getKNonce();
    var encryptedMessage = kID.encryptMessage(message, kNonce, sharedSecret1To2);

    t.notEqual(message, encryptedMessage);

    t.end();
});

test("kID.decryptMessage(theirKVKey, myKSigKey", function(t) {
    var kSigKey1 = "6Z6cHSL6Y7TmaBHfQWVCiaLkN1EH9podPGfjT8wv7mEh";
    var kSigKey2 = "1KfYMpmNMFMTWxT1NZFrTbrxQoyBEM4WGcD8Ha7V9K7";
    var kSigKey3 = "ENQB8LowXPk1X3MNyLPDC98b6bd4BQ5Q3nwpWmTQ5gcE";

    var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
    var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);
    var keyPair3 = kID.getKeyPairFromSignKey(kSigKey3);

    var sharedSecret1To2 = kID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);
    var sharedSecret2To1 = kID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey);
    var sharedSecret3To1 = kID.getSharedSecret(keyPair3.publicKey, keyPair1.secretKey);

    var message = "One small step.";
    var kNonce = kID.getKNonce();

    var encryptedMessage = kID.encryptMessage(message, kNonce, sharedSecret1To2);
    var decryptedMessage = kID.decryptMessage(encryptedMessage, kNonce, sharedSecret2To1);
    var attemptedDecryption = kID.decryptMessage(encryptedMessage, kNonce, sharedSecret3To1);

    t.equal(decryptedMessage, message);
    t.notEqual(message, attemptedDecryption);
    t.equal(attemptedDecryption, false);

    t.end();
});
