<p align="center">
  <img src="https://github.com/benchlab/benchx-media/raw/master/benos-logo.png" width="300px" alt="benOS Logo"/>
</p> <br>


# KeplerKeys
Kepler's Key Generation Library

[![build status](https://secure.travis-ci.org/benchlab/KeplerKeys
.svg)](https://travis-ci.org/benchlab/KeplerKeys
)

Javascript Library for generating Kepler IDs and Ed25519-based Kepler keys to use with [Kepler](https://github.com/benchlab/Kepler).


## Install

```sh
$ npm i kepler-keys
```


## Example

```js
var kKey = require("keplercrypto");

var goKepler = keplerKey.gen();

console.log(goKepler);
```
output:
```js
{ kID: 'S7evWWTSbaXELyE9w53sFr',
  kVKey: 'EgvhZsLKSsqsbNBfJ2wfR9FFWo9YqkpxpfXeT4ifR1Cq',
  kUniKey: '5UAXeov4Gi7ioSTLDoMPtdvqX6RRmJcQAWagVgdaxUej',
  secret:
   { kSeed: '36a572a7e43956784b517c57b26720a8ef838d114c0619f1d8c7801c37fa4f6a',
     kSigKey: '4gKLe7Qq2WX249NBfymQySZbAzXboq2emMig6wBR82Bj',
     kSecretKey: '7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR'} }
```

## KeplerKeys API


### goKep()

Generates a new KeplerID, Kepler VKey, Kepler SigKey, and also gives you the Kepler Seed used to generate them. It also includes the public and private key used for encryption.

```js
{
    kID: "<base58 did>",
    kVKey: "<base58 publicKey>",
    kUniKey: "<base58 publicKey>",

    secret: {
        kSeed: "<hex encoded 32-byte seed>",
        kSigKey: "<base58 secretKey>",
        kSecKey: "<base58 privateKey>"
    }
}
```


### fromKSeed(seed)

Same as `.goKep()` except you supply the Kepler seed. The seed should be a 32-byte Uint8Array (i.e. Buffer).

Example:
```
var seed = Buffer.from("36a572a7e43956784b517c57b26720a8ef838d114c0619f1d8c7801c37fa4f6a", "hex");

var goKepler = kKey.fromKSeed(seed);

console.log(d);
```

The output is the same as the `.goKep()` example.


### signMessage(message, kSigKey, kVKey)

Signs a message with the given kSigKey and kVKey.

* The message should be a string.
* Both the kSigKey and kVKey should be the kSigKey and kVKey given from the `goKep()` or `fromKSeed(seed)` methods

Returns a signed message as a Uint8Array (i.e. Buffer).

Example:
```js
  var kKey = kID.goKep();
 
  var kSigKey = kKey.secret.kSigKey;
  var kVKey = kKey.kVKey;
  var message = "One giant step.";
 
  var signedMessage = kID.signMessage(message, sigKey, vKey);
```


### verifySignedMessage(signedMessage, kVKey)

Verifies that the given message  has been signed by the possessor of the given keplerVKey.

* The signedMessage should be what is returned from `signMessage(message, keplerSigKey, keplerVKey)`
* The keplerVKey should be the keplerVKey given from the `goKep()` or `fromKeplerSeed(seed)` methods

Returns the original message if the message was signed by the owner of the keplerVKey `false` otherwise.

Example:
```js
  var kKey = kID.goKep();
  var kKey2 = kID.goKep();
 
  var kSigKey = kKey.secret.kSigKey;
  var kVKey = kKey.kVKey;
  var kVKey = kKey2.kVKey;
 
  var message = "One giant step.";
 
  var signedMessage = kID.signMessage(message, kSigKey, kVKey);
 
  console.log(kID.verifySignedMessage(signedMessage, kVKey));
  console.log(kID.verifySignedMessage(signedMessage, kVKey2));
```

Output:
```
  One giant step.
  false
```


### getKeyPairFromSignKey(keplerSigKey)

Returns a key pair that is valid to use for encrypting. 
* The keplerSigKey should be the keplerSigKey given from the object given from `goKep()` or `fromKeplerSeed()`

Example:
```js
var kKeys = kID.goKep();
var kSigKey = kKeys.secret.kSigKey;
var kKeyPair = kID.getKeplerKeyPairFromSigKey(kSigKey);
console.log(kKeyPair);
```

Output:
```js
{
   universalKey: ...   // Uint8Array with 32-byte Kepler public key
   secretKey: ...   // Uint8Array with 32-byte Kepler secret key
}
```


### getNonce()

Returns a random nonce as a Uint8Array that can be used for encrypting.

Example:
```js
var kepNonce = kID.getKNonce();
```


### getSharedSecret(theirKVKey, myKSigKey)

Computes a sharedSecret to be used for encryption.

* theirKVKey should be the publicKey given from the `getKeyPairFromSigKey(kSigKey)` method or the uniKey string given from the `goKep()` method.
* myKSigKey should be the secretKey given from the `getKeyPairFromSigKey(kSigKey)` method or the secKey given from the `goKep()` method.

Example:
```js
var k1 = kID.gen();
var k2 = kID.gen();

// Using the strings given via the gen() method
var sharedSecret1 = kID.getSharedSecret(k2.UniKey, k1.secret.SecKey);
var sharedSecret2 = kID.getSharedSecret(k1.UniKey, k2.secret.SecKey);

var kSigKey1 = k1.secret.kSigKey;
var kSigKey2 = k2.secret.kSigKey;

var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);

// Using the buffer given from the getKeyPairFromSignKey(signKey2) method
var sharedSecret3 = kID.getSharedSecret(keyPair2.uniKey, keyPair1.secKey);
var sharedSecret4 = kID.getSharedSecret(keyPair1.uniKey, keyPair2.secKey);

// All the secrets generated are equivalent
```


### encryptMessage(message, nonce, sharedSecret)

Encrypts a the given message using a precomputed sharedSecret.
* message should be given as a string
* nonce should be a nonce from the `getNonce()` method 
    * Note: The nonce used for encrypting and decrypting need to be the same
* sharedSecret should be computed using the `getSharedSecret(theirVerifyKey, mySigningKey)` method

Example:

```js
var k1 = kID.gen();
var k2 = kID.gen();

var signKey1 = sovrin1.secret.signKey;
var signKey2 = sovrin2.secret.signKey;

var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);
var sharedSecret1To2 = kID.getSharedSecret(keyPair2.uniKey, keyPair1.secKey);

var message = "One giant step.";
var kNonce = kID.getKNonce();
var encryptedMessage = kID.encryptMessage(message, kNonce, sharedSecret1To2);
```


### decryptMessage(encryptedMessage, nonce, sharedSecret)

Verifies and decrypts a previously encrypted message.
* encryptedMessage should be what is returned from the `encryptMessage(message, nonce, sharedSecret)` method
* nonce should be a nonce given from the `getNonce()` method
    * Note: The nonce used for encrypting and decrypting need to be the same
* sharedSecret should be computed using the `getSharedSecret(theirVerifyKey, mySigningKey)` method

Example:
```js
var kSigKey1 = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
var kSigKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";
var kSigKey3 = "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR";

var keyPair1 = kID.getKeyPairFromSignKey(kSigKey1);
var keyPair2 = kID.getKeyPairFromSignKey(kSigKey2);
var keyPair3 = kID.getKeyPairFromSignKey(kSigKey3);

var sharedSecret1To2 = kID.getSharedSecret(keyPair2.uniKey, keyPair1.secKey);
var sharedSecret2To1 = kID.getSharedSecret(keyPair1.uniKey, keyPair2.secKey);
var sharedSecret3To1 = kID.getSharedSecret(keyPair3.uniKey, keyPair1.secKey);

var message = "One giant step.";
var kNonce = kID.getKNonce();

var encryptedMessage = kID.encryptMessage(message, kNonce, sharedSecret1To2);
var decryptedMessage = kID.decryptMessage(encryptedMessage, kNonce, sharedSecret2To1);
var attemptedDecryption = kID.decryptMessage(encryptedMessage, kNonce, sharedSecret3To1);

console.log(decryptedMessage);
console.log(attemptedDecryption);
```

Output:
```
One giant step.
false
```

# What Is benOS
[benOS](https://github.com/benchlab/benos) is a decentralized operating system, originally based on Linux, uses some design strategies from [RedoxOS](https://github.com/redox-os) and even some design concepts from [OpenStack](https://github.com/openstack), [Ethereum](https://github.com/ethereum/go-ethereum) and [EOS](https://github.com/eosio). Although we utilize some of their design strategies, benOS is completely custom from a codebase perspective. 

benOS has many components that make the wheels turn. Below are a list of those components:

## Other benOS Network Components
[Nova](https://github.com/benchlab/nova) - Global Decentralized Hypervisor For The Bench Network <br>
[Kepler](https://github.com/benchlab/kepler) - Global Decentralized Identity Management For The Bench Network <br>
  - [Kepler-CLI](https://github.com/benchlab/Kepler-CLI) - Kepler's Official Command Line Client <br>
  - [KeplerUUID](https://github.com/benchlab/KeplerUUID) - Kepler's UUID Javascript Library <br>
  - [KeplerKeys](https://github.com/benchlab/KeplerKeys) - Key Generation Javascript Library For Kepler <br>

[Designate](https://github.com/benchlab/designate) - Global Decentralized Naming Service For The Bench Network <br>
[Flutter](https://github.com/benchlab/flutter) - Global Decentralized Image Service For The Bench Network <br>
[Neutron](https://github.com/benchlab/neutron) - Global Network Creation & Management For The Bench Network <br>
  - [BenchCore](https://github.com/benchlab/BenchCore) - Core Decentralized Network Component For The Bench Network <br>
  - [BenchChain](https://github.com/benchlab/BenchChain) - Neutron's RootChain On The Bench Network <br>

[Aero](https://github.com/benchlab/aero) - Global Object Storage Distributor & Manager For The Bench Network <br>
[Explorer](https://github.com/benchlab/explorer) - Global dApp Distributor, Manager and Viewer For The Bench Network <br>
[benFS](https://github.com/benchlab/benFS) - benOS FileSystem <br>
[dappJS](https://github.com/benchlab/dappjs) - dApp Development Kit For The Bench Network <br>
[Mercury](https://github.com/benchlab/mercury) - benOS Graphical User Interface <br>
[Asteroid](https://github.com/benchlab/go-asteroid) - benOS Native Programming Language <br>
[Meteor](https://github.com/benchlab/meteor) - benOS Native IDE for dApp Development <br>
<br>

## benOS Core Components
[benOS-Microkernel](https://github.com/benOS-Microkernel) - benOS Microkernel <br>
[benOS-Bootloader](https://github.com/benchlab/benOS-Bootloader) - benOS Bootloader <br>
[ParseArgs](https://github.com/benchlab/parseargs) - benOS-based Argument Parsing  <br>
[X](https://github.com/benchlab/X) - benOS Graphical User Interface <br>

**NOTE:** ***There are other pieces under development as well, as our development team grows.*** 

## CREDITS AND ATTRIBUTES
benOS may use software from other open source libraries. For a full list of software credits and acknowledgements, please visit [https://github.com/benchlab/benOS/blob/master/ATTRIBUTES.md](https://github.com/benchlab/benOS/blob/master/ATTRIBUTES.md). The original LICENSE or LICENSES for the originating software(s) and library or libraries that were used to create `KeplerKeys` are still active, although, considering this Bench software and the softwares and/or libraries/packages it is `imported` into may be used to issue illegal securities, the BENCH LICENSE is activated for this purpose. This does not take away the credits, disable the originating LICENSE or in any way disown the original creation, creators, developers or organizations that originally developed many of the libaries used throughout Bench's large array of software libraries packaged together for the purposes of building a decentralized operating system (benOS)

## VERSION
1.0.0

## LICENSE
BENCH LICENSE<br>
For KeplerKeys
<br><br>
Copyright (c) 2018 Bench Computer, Inc. <legal@benchx.io>
<br><br>
Permission to use, copy, modify, and distribute this blockchain-related
software or blockchain-based software for any purpose with or without 
fee is hereby granted, provided that the above copyright notice and this 
permission notice appear in all copies.

THE USAGE OF THIS BLOCKCHAIN-RELATED OR BLOCKCHAIN-BASED SOFTWARE WITH THE
PURPOSE OF CREATING ICOS OR "INITIAL COIN OFFERINGS", UNREGISTERED SECURITIES 
SPECIFICALLY IN THE UNITED STATES OR IN OTHER COUNTRIES THAT HAVE A LEGAL 
FRAMEWORK FOR SECURITIES, IS PROHIBITED. BENCH FOUNDATION, LLC RESERVES THE 
RIGHT TO TAKE LEGAL ACTION AGAINST ANY AND ALL COMPANIES OR INDIVIDUALS WHO
USE THIS BLOCKCHAIN-RELATED OR BLOCKCHAIN-BASED SOFTWARE FOR THE PURPOSE OF 
DISTRIBUTING CRYPTOCURRENCIES WHERE THOSE CRYPTOCURRENCIES AND THEIR METHOD
OF DISTRIBUTION ARE IN DIRECT VIOLATION OF UNITED STATES SECURITIES LAWS. 
IF A GOVERNMENT BODY TAKES ACTION AGAINST ANY USERS, DEVELOPERS, MARKETERS,
ORGANIZATIONS, FOUNDATIONS OR ANY PROFESSIONAL ENTITY WHO CHOOSES TO UTILIZE
THIS SOFTWARE FOR THE DISTRIBUTION OF ILLEGAL SECURITIES, BENCH COMPUTER INC.
WILL NOT BE HELD LIABLE FOR ANY ACTIONS TAKEN BY THE USERS, DEVELOPERS, MARKETERS,
ORGANIZATIONS, FOUNDATIONS OR ANY PROFESSIONAL ENTITIES WHO CHOOSE TO DO SO.

UNITED STATES SECURITIES VIOLATIONS SPECIFICALLY REFER TO ANY VIOLATIONS OF
SECTION 10(b) OF THE SECURITIES EXCHANGE ACT OF 1934 [15 U.S.C. § 78j(b)] AND
RULE 10b-5(b) PROMULGATED THEREUNDER [17 C.F.R. § 240.10b-5(b)], AND
SECTIONS 5(a), 5(c), and 17(a)(2) OF THE SECURITIES ACT OF 1933 [15 U.S.C.
§§ 77e(a), 77e(c), and 77q(a)(2)]; BY MAKING USE OF ANY MEANS OR INSTRUMENTS
OF TRANSPORTATION OR COMMUNICATION IN INTERSTATE COMMERCE OR OF THE MAILS TO
SELL THROUGH THE USE OR MEDIUM OF ANY WRITTEN CONTRACT, OFFERING DOCUMENT,
PROSPECTUS, WHITEPAPER, OR OTHERWISE, ANY SECURITY AS TO WHICH NO REGISTRATION
STATEMENT WAS IN EFFECT. OR FOR THE PURPOSE OF SALE OR DELIVERY AFTER SALE,
CARRYING OR CAUSING TO BE CARRIED THROUGH THE MAILS OR IN INTERSTATE COMMERCE,
BY MEANS OR INSTRUMENTS OF TRANSPORTATION OR COMMUNICATION IN INTERSTATE
COMMERCE OR OF THE MAILS TO OFFER TO SELL OR OFFER TO BUY THROUGH THE USE OR 
MEDIUM OF ANY WRITTEN CONTRACT, OFFERING DOCUMENT, PROSPECTUS, WHITEPAPER,
OR OTHERWISE, SECURITIES AS TO WHICH NO REGISTRATION STATEMENT HAS BEEN FILED.

OUTSIDE OF THESE LEGAL REQUIREMENTS, THIS SOFTWARE IS PROVIDED "AS IS" AND 
THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING 
ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL 
THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL 
DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, 
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
