var startDate = new Date(2018,1,8,18,30,0,0,0); // beware: month 0 = january, 11 = december
var endDate = new Date(2018,30,8,19,30,0,0,0);
var myCalendarName="MyCalendarApp";
var myCalendarId = "";

var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        myCalendarId = window.localStorage.getItem("MyCalendarId");
        if (myCalendarId == undefined) {
            var createCalOptions = window.plugins.calendar.getCreateCalendarOptions();
            createCalOptions.calendarName = myCalendarName;
            createCalOptions.calendarColor = "#FF0000";
            window.plugins.calendar.createCalendar(createCalOptions,app.successCalendarCreated,app.error);
        } else {
            var calOptions = window.plugins.calendar.getCalendarOptions();
            calOptions.calendarName = myCalendarName;
            window.plugins.calendar.findEventWithOptions("","","",startDate,endDate,calOptions,app.eventsSuccess,app.error);
        }

        $( "#btnAddEvent" ).bind( "click", function(event, ui) {
           event.preventDefault();
           $.mobile.navigate( "#page-event");
        });

        $( "#btnCreateEvent" ).bind( "click", function(event, ui) {
            event.preventDefault();
            var title = $('#title_event').val();
            var location = $('#location_event').val();
            var notes = "";
            var start = $('#event_start').val();
            var end = $('#event_end').val();
            app.submitEvent(title, location, "", new Date(start), new Date(end));
        });


        $(document).delegate('#page-home', 'pageshow', function () {
            var calOptions = window.plugins.calendar.getCalendarOptions();
            calOptions.calendarName = myCalendarName;
            window.plugins.calendar.findEventWithOptions("","","",startDate,endDate,calOptions,app.eventsSuccess,app.error);
        });

    },
    eventsSuccess: function(events) {
        console.log("Events: " + JSON.stringify(events));
        $('#eventsList').empty();

        var _events = [];
        var _event = "";
        for (var i = 0; i <events.length; i++) {
            var _eventData = events[i];
            _event = '<li><a href="#">';
            _event = _event + '<h2>'+_eventData.title+'</h2>';
            _event = _event + '<p><strong>'+_eventData.location+'</strong></p>';
            _event = _event + '<p><strong>'+_eventData.startDate+ " -- " +_eventData.endDate+'</strong></p>';
            _event = _event + '</a></li>';
            _events.push(_event);
        }

        $('#eventsList').append(_events);

        $("#eventsList").listview("refresh");

    },
    successCalendarCreated: function(calendarId) {
        console.log("Calendar Created : " + JSON.stringify(calendarId));
        myCalendarId = calendarId;
        window.localStorage.setItem("MyCalendarId", calendarId);

    },
    successEventCreated: function(eventId) {
        console.log("Event Created : " + JSON.stringify(eventId));
        $.mobile.back();
    },
    success: function(message) {
        console.log("Events: " + JSON.stringify(message));
        alert("Success: " + JSON.stringify(message));
    },

    error: function(err) {
        alert("Error: " + JSON.stringify(err));
    },
    submitEvent: function(_title, _location, _notes, _start, _end) {

        var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
        calOptions.calendarName = myCalendarName;
        calOptions.calendarId = myCalendarId;

        window.plugins.calendar.createEventWithOptions(_title,_location,_notes,_start,_end,calOptions,app.successEventCreated,app.error);


    }
};

