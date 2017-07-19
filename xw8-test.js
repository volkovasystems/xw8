
const assert = require( "assert" );
const xw8 = require( "./xw8.js" );

//: Run selenium-standalone start before testing.
assert.equal( xw8( "curl --output /dev/null --silent --fail http://localhost:4444/wd/hub/status", true, true ), false, "should be true" );

assert.equal( xw8( "curl --output /dev/null --silent --fail http://localhost:4444/wd/hub/status", false, true ), true, "should be true" );

console.log( "ok" );
