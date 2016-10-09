//

// Frontend script for rendering mongoose model concert events in fullcalendar

// Start script when the DOM is ready
$(document).ready(function(){

	// The site has en exposed REST-like API for getting the concert events
	// This seems to be the best way to cleanly get the information from the database and to frontend scripts
	// This method uses jQuerys HTTP(S) GET request method to get and parse the concert information from the API
    $.get("/api/concerts", function(data){

    	// Each event needs to be parsed to the right format for the calendar
    	var events = []

    	for(var i = 0; i<data.length; i++){

    		// Stored dates are in YY-MM-DD format, but the calendar takes it in YY-DD-MM format
    		// Therefore we must split the date and puzzle it back together later
    		var date = data[i].date.split('-')

    		// Create the JSON-object for the calendar event
    		var d = {
    			// To keep concistency, the event uses the same id as the database object
    			id:data[i]._id,
    			// Show each stage and the name of the concert in the calendar
    			// We should maybe give each stage its own dedicated color to keep the calendar both interesting and easier to read
    			title:data[i].stage + ' : ' + data[i].name,
    			// We put the date back together in the YY-DD-MM format and add the time of day for event-start with added second precision
    			start:date[0] + date[2] + date[1] + 'T' + data[i].time + ':00',
    			// The URL represents what page you get pushed to when you click the event in the calendar, redirects to event page
    			url: '/concerts/' + data[i]._id
    		}
    		// For each event, push to events array which is piped into the calendar
    		events.push(d)
    	}

    	// Render fullcalendar
    	$('#calendar').fullCalendar({

    		// Add parsed events to the calendar
			events:events
    	})
    })
})

