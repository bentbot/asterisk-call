let phone = require('../index.js');



// Call an internal phone number.

phone.call(100, 300, '"NodeJS" <6134217726>');
console.log('Calling Ext. 100 ==> 300');




// Call an external land line through a voip provider.

phone.setup('IAX2','voipms','from-internal');
phone.call(16132629810, 300, '"NodeJS" <6134217726>');
console.log('External Number Called Ext. 1800 => 300');

