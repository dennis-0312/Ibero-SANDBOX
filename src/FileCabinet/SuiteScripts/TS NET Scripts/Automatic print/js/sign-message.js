/*
 * JavaScript client-side example using jsrsasign
 */

// #########################################################
// #             WARNING   WARNING   WARNING               #
// #########################################################
// #                                                       #
// # This file is intended for demonstration purposes      #
// # only.                                                 #
// #                                                       #
// # It is the SOLE responsibility of YOU, the programmer  #
// # to prevent against unauthorized access to any signing #
// # functions.                                            #
// #                                                       #
// # Organizations that do not protect against un-         #
// # authorized signing will be black-listed to prevent    #
// # software piracy.                                      #
// #                                                       #
// # -QZ Industries, LLC                                   #
// #                                                       #
// #########################################################

/**
 * Depends:
 *     - jsrsasign-latest-all-min.js
 *     - qz-tray.js
 *
 * Steps:
 *
 *     1. Include jsrsasign 8.0.4 into your web page
 *        <script src="https://cdn.rawgit.com/kjur/jsrsasign/c057d3447b194fa0a3fdcea110579454898e093d/jsrsasign-all-min.js"></script>
 *
 *     2. Update the privateKey below with contents from private-key.pem
 *
 *     3. Include this script into your web page
 *        <script src="path/to/sign-message.js"></script>
 *
 *     4. Remove or comment out any other references to "setSignaturePromise"
 */
var privateKey = "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPGOIsyor6WZvJ\n" +
    "JbR22LMXHYoDUhgpzaBCTOxa1h/tKMqknepLjk3m7Ot8AYIZRnwZK7bJAAtH4cJq\n" +
    "P+KhCgmrn0G2UjZOoNKQ4kB2We9EREDunjkDa7gSVijPfd3Zj2lhPrCzbp0bebWF\n" +
    "31NcEnnShOK7V4Iz49OasR9paka8YfX58zM/ZgT6t/PpT9lv+gIGGy8A9+Ytt1TU\n" +
    "g4jZEZEmMXElMWFYbEe0oYkHOUBvq1+llt4l2G7uPfMfWd9YBsWaLEVeCO80m2d4\n" +
    "SD5cgtGdGNqe8Zk6fLBWQgOTgrLDPV7OzxEZXBQ71h4OMbcEtt5NbjmWCnP+7/Hi\n" +
    "JsmpKsd3AgMBAAECggEAOmcxiI5yApOoHYSiDw+KqJiJx6kt64HdMrIqlThnd2f6\n" +
    "rQ02nvfJm8J+qfIDo0U9SRiqVYcLE590teC1InzyTXWGYF9VgunohvGQ1b0HBpnE\n" +
    "1p8FLfw8+F7p8SWx8iWyINpxTAqNXLVj/OuVHjL8PYu27jddEMifiLdZ1rBlhmTo\n" +
    "vY5W1FbSbNy+miMjTi81y7917dINvJAhpLsKIeFrM+UMSWVIOFV3fO6f9rwVEMCg\n" +
    "/Zi6apPYW02UlnahyX3AkHwb9yYgz10S3kLgLE62h607QkdDrT9Sef58awOkO8G9\n" +
    "eX5fCo6IcaHjpH4E8yXYAIRDqhbcgWoRU9eEmj/EgQKBgQDBaTTr8kycBU5GpMgm\n" +
    "uOsUxMz6/yhzBMa/sVF6mJCJNEBDCXW4ahyTVHPlwTUyVUJa5ve77I+Y9r4+PP+2\n" +
    "EsIyY0bj6NZ1AJjzHuiZBun7PbDNYeEb1BhAj4GKJRPAjL6BsghpGLhCKCemUUng\n" +
    "I8AtMUwJooQkXKAh0LMgEt130QKBgQC9Z4VizRpDmOPhzZFBTrZgujEhUAXuXl2D\n" +
    "+nSkHz19Ma5pk7xo+4C/Q3IUYy/t+b0IlwUyWP/qnA9YqNHopbUvRhaINSEY33ZR\n" +
    "BSJBJ6r03I5/jpVj+ZnYKYNtgsyrs27jSIkD35Yf8YKyog2ccocuT9A4nnkxgKLc\n" +
    "dCNNOyVkxwKBgAzTZzkGVmI6T9iLcOJwfNZhvp4ecZY/CNcJcTfKCjuvBVvssqvK\n" +
    "DZ8PiKgByf9OfBn/GwqRQ2yHYFJMRUDTuaERyE+wzxfvNDVbJV2Qgc+xZZoZFY58\n" +
    "4CbX3WVF1Ct+qdt77ObbRszMUOTMmzOL62CT1lEFP/IRWmUjq91CowEhAoGADJ7s\n" +
    "TXQbTuvOK4q2JiLnljRx96VMb+DL3HKA+Tq3rzLzS0ez4072+ke1P1SIqhPdG8hs\n" +
    "aTly/CAgCaleK2F3XEoQUE0yAmVJjgaIjMzm4GAeArPuknXcYYIKpu5zUvGm7vAz\n" +
    "aRWp/EDsk5imzYj4JwbcehldPAY1U/lNLOVHDZsCgYEAq1ZwZUwZE4lJ3z4krp5F\n" +
    "wlUMaDphAmAsCAzS4U4IvSbudUvM5t9qlA3wuihICla4ETH5P2VP/tgg9e6rzMBy\n" +
    "NmqvUyRHsSUKBx8dwiiG00qwpFbkp5BZCQWivySL7A2FoO5VBTxS5OzWI1mMNdQ3\n" +
    "4Bg3Ki+r+jDSgpE7+a04TzY=\n" +
    "-----END PRIVATE KEY-----";

qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
qz.security.setSignaturePromise(function (toSign) {
    return function (resolve, reject) {
        try {
            var pk = KEYUTIL.getKey(privateKey);
            var sig = new KJUR.crypto.Signature({ "alg": "SHA512withRSA" });  // Use "SHA1withRSA" for QZ Tray 2.0 and older
            sig.init(pk);
            sig.updateString(toSign);
            var hex = sig.sign();
            console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
            resolve(stob64(hextorstr(hex)));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    };
});
