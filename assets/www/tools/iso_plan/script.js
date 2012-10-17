// work in progress... not functional 


$('#iso-plan-contacts').bind( 'tap', function () {
	displayContacts();
} );



function displayContacts() {
	var options = new ContactFindOptions();
	var fields = ["displayName", "name"];
	navigator.contacts.find(fields, contactsFindSuccess, contactsFindError, options);
}


function contactsFindSuccess(contacts) {
	console.log('success');
}

function contactsFindError(err) {
	//TODO: probably don't need to give technical error back to user without addl niceness
	alert('Error: ' + err);
}