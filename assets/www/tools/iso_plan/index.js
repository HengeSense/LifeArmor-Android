$('#iso-plan-page').bind('pageshow', function (event, ui) {
	console.log('iso plan pageshow');
	
	
	$('#contacts ul').empty();
	$('#contacts').append('<div class="message">Loading...</div>');	
	
	var options = new ContactFindOptions();
	options.multiple = true;
	//TODO: be aware of iOS quirks with displayName.  see phonegap docs.
	var fields = ["id", "displayName"];
	console.log(navigator.contacts);
	if (navigator.contacts == null) {
		//contacts are not available, which means we're on the web or on a non-phone (e.g. tablet) device.
		console.log('contacts not supported on this device');
		//$('#contacts').html('<div class="error">Your device does not support contact retrieval.</div>');
		
		//this is to help test on the web... makes a fake entry.
		if (device.indexOf("FAKE") >= 0) {
			$('#contacts .message').remove();
			var c = new Contact();
			c.displayName = "Test Contact";
			var phoneNumbers = [3];
			phoneNumbers[0] = new ContactField('work', '212-555-1234', false);
			phoneNumbers[1] = new ContactField('mobile', '917-555-5432', true); // preferred number
			phoneNumbers[2] = new ContactField('home', '203-555-7890', false);
			c.phoneNumbers = phoneNumbers;
		}
		$('#contacts ul').append('<li><a href="activity.html?' +  encodeURIComponent(JSON.stringify(c)) + '"  id="iso-plan-contact-32">Test Contact</a></li>').listview('refresh');
		$('#contacts ul').bind('tap', function(event) {
		});		
		//$('#contacts').button('disable');  //TODO: would actually like to hide, but can't find jqm method to do so easily.  more investigation.
	}
	else {
		console.log ('retrieving contacts');
		navigator.contacts.find(fields, onIsoPlanContactsFindSuccess, onIsoPlanContactsFindError, options);
	}
});

function onIsoPlanContactsFindSuccess(contacts) {
	console.log('Contracts retrieved: ' + contacts.length);
	if (contacts.length == 0) {
		alert('You do not have any contacts in your phone book, or your device does not support contact retrieval.');
	}
	else {
		//$('#contacts').empty().append('<ul data-role="listview" data-theme="z" data-filter="true" data-filter-theme="z">');
		$('#contacts .message').remove();
		
		$.each(contacts, function(index, contact) {
			console.log('contact.id: ' + contact.id + ", name: " + contact.displayName);
			//TODO: right now, it pulls all contacts.  Only with phone or email?
			if (contact.displayName != null)	{
				console.log('x= ' + JSON.stringify(contact));
				var contactIdNum = parseInt(contact.id);
				var nodeBase = 'iso-plan-contact-';  // if you change this, change the substring line, far below
				var nodeName = nodeBase + contactIdNum;
				var nodeHtml = '<li><a id="' + nodeName + '">' + contact.displayName + '</a></li>';
				$('#contacts ul').append(nodeHtml);
				//( $.inArray(contactIdNum, selectedContacts) > 0 ? "selected" : "" )
			}
		});
		console.log($('#contacts').html() );
		//$('#contacts').trigger('create');
		$('#contacts ul').listview('refresh');
		$('#contacts ul').bind('tap', function(event) {
			
			console.log('event.target= ' + event.target);
		});
	}
}

function onIsoPlanContactsFindError(err) {
	//TODO: probably don't need to give technical error back to user without addl niceness
	alert('Error: ' + err);
}
