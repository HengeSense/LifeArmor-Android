
var options = new ContactFindOptions();
var fields = ["displayName", "name"];
navigator.contacts.find(fields, onSuccess, onError, options);


function contactsFindSuccess(contacts) {
	console.log('success');
	//log.debug('#contacts' + contacts.length);
}

function contactsFindError(err) {
	//TODO: probably don't need to give technical error back to user without addl niceness
	alert('Error: ' + err);
}