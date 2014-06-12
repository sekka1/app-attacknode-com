$( document ).ready(function() {

    /**
     * Returns query string parameters
     */
    var QueryString = function () {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]], pair[1] ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
        return query_string;
    } ();

    /**
     * Set Cookies
     */
    $.cookie('user_id', QueryString.user_id, { expires: 7, path: '/' });
    $.cookie('token', QueryString.token, { expires: 7, path: '/' });

    // Setting vars
    var token = QueryString.token;
    var user_id = QueryString.user_id;

    if($.cookie('user_id') !== undefined)
        user_id = $.cookie('user_id');
    if($.cookie('token') !== undefined)
        token = $.cookie('token');

    console.log(user_id);


    // Set users github repo
    $('#githubRepo').prepend('Your GitHub Repository: <a target="_blank" href="https://github.com/AutoDevBot/'+user_id+'">https://github.com/AutoDevBot/'+user_id+'</a>');

    // Connect to the socket.io interface
    var socket = io.connect('https://api.autodevbot.com');

    // Subscribe to the event stream with the user's id and authToken
    socket.emit('subscribe-event-stream', {user_id: user_id, authToken: token});

    socket.on('subscribe-event-stream', function (data) {
        //console.log(data);
        var event = JSON.parse(data);

        console.log(event);

        console.log('user_id: '+event.user_id);

        if(event.eventType.toLowerCase() == 'monitoring_frisbyjs'){

            if(event.testStatus.toLowerCase() == 'success'){
                // Success row
                $('#tableEvents').prepend('<tr><td>'+event.queue_event_id.substring(0,5)+'...'+event.queue_event_id.substring(event.queue_event_id.length-3,event.queue_event_id.length)+'</td><td>'+event.eventType+'</td><td>'+event.createdOn+'</td><td><span class="label label-success">'+event.testStatus+'</span></td><td>'+event.testResultJSON.testsuites.testsuite[0].$.name+'</td><td>-</td></tr>');
            }
            if(event.testStatus.toLowerCase() == 'failure'){
                // Failure row
                $('#tableEvents').prepend('<tr><td>'+event.queue_event_id.substring(0,5)+'...'+event.queue_event_id.substring(event.queue_event_id.length-3,event.queue_event_id.length)+'</td><td>'+event.eventType+'</td><td>'+event.createdOn+'</td><td><span class="label label-danger">'+event.testStatus+'</span></td><td>'+event.testResultJSON.testsuites.testsuite[0].$.name+'</td><td>'+event.testResultJSON.testsuites.testsuite[0].testcase[0].failure+'</td></tr>');
            }
        }else if(event.eventType.toLowerCase() == 'system_provisioning'){
            $('#tableEvents').prepend('<tr><td>-</td><td>'+event.eventType+'</td><td>'+event.createdOn+'</td><td><span class="label label-default">'+event.status+'</span></td><td>'+event.item+'</td><td>'+event.description+'</td></tr>');
        }

        // Prune table
        var rowCount = $('#tableEvents tr').length;
        console.log('rowCount: '+rowCount);
        $("#tableEvents tr:eq(20)").remove();
    });

    // Get user object and store it
    $.ajax({
        url: 'https://api.autodevbot.com/v1.0/user',
        type: 'get',
        headers:{
            "Content-type": "application/json",
            "X-Auth-Token": $.cookie('token')
        },
        success: function(response) {
            console.log(response);

            // Set the users object cookies
            $.cookie('userObj', response, { expires: 7, path: '/' });
        },
        error: function (request, status, error) {
            //console.log('There was an error with authentication');
            console.log('status code: '+status);
            console.log(error);
            console.log(request);


        }
    });

});