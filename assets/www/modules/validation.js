function checked(name,id, errorArray)
{
	var number;
	var number_as_string;
	
	// Checked
	errorArray.pop();
	// You found a checked element so it's no longer an error
	choice_selected = name;
	number_as_string = choice_selected.match(/\d+/);
	number = parseInt(number_as_string[0], 10);
	if ($("#error" + number).length > 0)
	{
		$("#error" + number).remove();
	}
	return choice_selected;
}

function unchecked(name,id, errorArray, choice_selected)
{
	var number;
	var number_as_string;
	
	if (errorArray.indexOf(id) === -1) {
		// We check every individual element to see if it's not checked.
		// If it's not, we list it as an error.
		if (choice_selected !== name)
		{
			if (errorArray.indexOf(name) === -1)
			{
				errorArray.push(name);
				number_as_string = name.match(/\d+/);
				// Don't add 'Invalid answer' twice if it's already there
				number = parseInt(number_as_string[0], 10);
				
				// Add the span saying Required question if it doesn't already exist
				// Change the label to red
				if ($("#error" + number).length <= 0)
				{
					$("#" + name + "_fieldcontain .ui-controlgroup-label")
					.after("<span id=error" + number+ " style='color:red'>Required question</span>").trigger('create');
				}
			}
		}
	}
}