var fs=require('fs'), ch=require('child_process'), channel_technology='SIP', channel_resource, callerid, channel_context='from-internal', supress_errors=true;

/**
* Setup
* t: string		Channel Technology to use in Asterisk (default: 'SIP') (alternative: 'IAX2')
* r: string 		Channel Resource name in Asterisk (default: 'external') (example: 'mysip_provider')
* c: string 		Channel Context name in Asterisk (default: 'from-internal') (example: 'my-asterisk-context')
* cb: function 		Callback function ran after setup is complete.
* errs: boolean		Optionally supress some system errors / requirements and try generating the call file anyways.
**/
exports.setup = function(t,r,c,cb,errs=true) {
	if (t) channel_technology = t;
	if (r) channel_resource = r;
	if (c) channel_context = c;
	if (errs) { check_setup_errors(); } else { supress_errors = false }
	if (cb) cb();
}

/**
* Call 
* Call a telephone and direct them to an extention.
***
* t: number	Phone number to call.
* f: number	Ext. to direct the call when the caller picks up.
* c: string     CallerID String: "Caller Name <##########>"
* w: number     Time to ring the phone (in seconds).
* r: number	Number of retries if caller does not answer.
* rw: number	Wait time before retrying (in seconds).
* p: number     The priority of the specified extension; (numeric or label)
* a: number	The account code for the call assigned to CDR(accountcode).
* v: string     Like Set(var=value) to set dialplan variables. ex. "var=value"
* cb: function  Callback function.
***/
exports.call = function(t,x,c=false,w=45,r=0,rw=300,p=1,a=false,v="var=value",cb=false,se=false) {
	if (!c) c = callerid;
	if (supress_errors) { se=true; } else { check_setup_errors(); }
	if ((!t||!x)&&!se) throw('No phone number / extension was provided to asterisk-call. Try: asteriskcall.call(18555614405, 101) to dial [1-855] from ext. [101]');
	let f = `Channel: ${channel_technology}/`;
	if (channel_resource) f=f+`${channel_resource}/`;
	f=f+`${t} \n`;
	if (c) f=f+`CallerID: ${c} \n`;
	if (p) f=f+`Priority: ${p} \n`;
	if (r) f=f+`MaxRetries: ${r} \n`;
	if (w) f=f+`WaitTime: ${w} \n`;
	if (rw)f=f+`RetryTime: ${rw} \n`;
	if (a) f=f+`Account: ${a} \n`;
	if (channel_context) f=f+`Context: ${channel_context} \n`;
	if (x) f=f+`Extension: ${x} \n`
	var br = Math.random().toString(36).substring(2);
	fs.writeFile(`${__dirname}/${br}.call`, f, function(err) { 
		if (err&&!se) throw (err); 
		var arand = Math.random().toString(36).substring(7);
		if (!err) ch.exec(`cp ${__dirname}/${br}.call /tmp/${arand}.call; mv /tmp/*.call /var/spool/asterisk/outgoing/;`, (err) => {
			if (err&&!se) throw (err);
			fs.unlinkSync(`${__dirname}/${br}.call`);
			if (cb) cb();
			return true;
		});
	});
}

function check_setup_errors() {
	if (supress_errors) return;
        if (!channel_technology) throw('A Channel Technology has not been specified in asterisk-call. Please use asteriskcall.setup({ technology: "SIP" / "IAX2" }); function to select.');
        if (!channel_resource) throw('A Channel Technology has not been specified in asterisk-call. Please use asteriskcall.setup({ resource: "sipserver" }); function to select.');
        if (!channel_context) throw('A Channel Context has not been specified in asterisk-call. Please use asteriskcall.setup({ context: "mycontext" }); function to select.');
}

