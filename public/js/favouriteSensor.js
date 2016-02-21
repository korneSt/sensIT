'use strict';
$(document).ready(function () {
    $('#returnButton').on('click', function () {
        $('#favouriteSensorContent').hide();
        $('#favouriteListTab').show();
    });
});
Chart.defaults.global.responsive = true;

var dataToChart = {
    labels: [],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(41,140,226,0.2)",
            strokeColor: "rgba(41,140,226,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }
    ]
};