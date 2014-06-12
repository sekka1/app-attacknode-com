/**
 * Success and failure circles function to control it
 *
 */
function tempStatCircles(id, number){

    if($('#'+id)) {

        $('#'+id).each(function(){

            var temp = number;

            $(this).html(temp + '');

            if (temp < 20) {

                $(this).animate({
                    borderColor: "#67c2ef"
                }, 'fast');

            } else if (temp > 19 && temp < 40) {

                $(this).animate({
                    borderColor: "#CBE968"
                }, 'slow');

            } else if (temp > 39 && temp < 60) {

                $(this).animate({
                    borderColor: "#eae874"
                }, 'slow');

            } else if (temp > 59 && temp < 80) {

                $(this).animate({
                    borderColor: "#fabb3d"
                }, 'slow');

            } else if (temp > 79 && temp < 100) {

                $(this).animate({
                    borderColor: "#fa603d"
                }, 'slow');

            } else {

                $(this).animate({
                    borderColor: "#ff5454"
                }, 'slow');
            }
        });
    }
};

/*
 Retrieving data file for the summary temperature charts
 */
$.get( "http://dashboard.autodevbot.com/data/SumoLogic/TotalSummaries24hours.json", function( data ) {

    console.log(data);

    tempStatCircles('statTotalMonitored', data.total);
    tempStatCircles('statTotalFailures', data.failures);
    tempStatCircles('statTotalSuccess', data.success);
});

/*
 Retrieve the data for the failures over one week chart
*/
$.get( "http://dashboard.autodevbot.com/data/SumoLogic/FailuresOverAWeek.json", function( data ) {

    //console.log(data);

    /**
     * Time Series Line Chart
     *
     *
     */
    (function () {

        var chartData = {
            "xScale": "time",
            "yScale": "linear",
            "type": "line",
            "main": [
                {
                    "className": ".pizza"
                }
            ]
        };

        // Put retrieved data into the chart's data
        chartData.main[0].data = data;

        var opts = {
            "dataFormatX": function (x) { return d3.time.format('%Y-%m-%d').parse(x); },
            "tickFormatX": function (x) { return d3.time.format('%A')(x); }
        };

        var myChart = new xChart('line', chartData, '#example3', opts);

    }());

});

/*
var data = {
    "xScale": "time",
    "yScale": "linear",
    "type": "line",
    "main": [
        {
            "className": ".pizza",
            "data": [
                {
                    "x": "2013-11-05",
                    "y": 2
                },
                {
                    "x": "2013-11-06",
                    "y": 0
                },
                {
                    "x": "2013-11-07",
                    "y": 0
                },
                {
                    "x": "2013-11-08",
                    "y": 0
                },
                {
                    "x": "2013-11-09",
                    "y": 0
                },
                {
                    "x": "2013-11-10",
                    "y": 9
                },
                {
                    "x": "2013-11-11",
                    "y": 6
                }
            ]
        }
    ]
};
*/


