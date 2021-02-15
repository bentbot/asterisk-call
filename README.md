# asterisk-call
Easily make asterisk calls from Node.js applications.

````
let phone = require('asterisk-call');


// Call an internal phone number...
phone.call(100, 300, '"NodeJS" <6131231234>');
console.log('Calling Ext. 100 ==> 300');


// Call an external land line through a voip provider...
phone.setup('IAX2','voipms','from-internal');
phone.call(16130000000, 300, '"NodeJS" <6131231234>');
console.log('External Number Called Ext. 1800 => 300');
````

Calls are redirected to an extention number of your choice where one will setup a phone, an IVR, a recording that plays, etc.
