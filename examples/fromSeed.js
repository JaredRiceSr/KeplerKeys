var kKey = require("kepler-keys");

var seed = Buffer.from("0e238e4f6589893e32ac1b84e17e32acd4c510f5c5587462d40b0702b638f4ec", "hex");

var goKepler = kKey.fromSeed(seed);

console.log(goKepler);
