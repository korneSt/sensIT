
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Populate the user table on initial page load
    populateTableHubs();
    populateTableSensors();
    getCurrentTemp();
    $('#addHubButton').click(addHub);
    // var ctx = document.getElementById("canvas").getContext("2d");
    // document.myBar = new Chart(ctx).Bar(barChartData, {
    //     responsive: true
    // });
    //TODO: remove kebab
    $('.grid').masonry({
        // options
        columnWidth: 150,
        itemSelector: '.grid-item',
        gutter: 10
    });
    
    $('.draggable').draggabilly({
        grid: [ 20, 20 ]


})

});

// $( "#addHubForm" ).submit(function( event ) {
//   alert( "Handler for .submit() called." );
//  // console.log(event);
//   event.preventDefault();
// });

/**
 * Add HUB button click
 */


// Functions =============================================================

// Fill table with data
function populateTableHubs() {

    // Empty content string
    var tableContent = '';
    var temps;

    // jQuery AJAX call for JSON

    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (result) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(result.data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#' + this.hubID + '" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#hubList table tbody').html(tableContent);
    });
};

function populateTableSensors() {

    var wholeContent = '';
    var hubList = [];

    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (result) {
        $.each(result.data, function () {
            //alert(this.hubID);
            hubList.push(this.hubID);
        });
    }).done(function () {
        $.each(hubList, function () {

            $.getJSON('/api/sensorsHub/' + this, function (data) {
                // For each item in our JSON, add a table row and cells to the content stringt
                var tableContent = ''
                $.each(data.data, function () {
                    tableContent += '<tr>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.sensorID + '">' + this.sensorID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.state + '">' + this.state + '</a></td>';
                    tableContent += '</tr>';
                });
                wholeContent += tableContent;
                $('#sensorList table tbody').html(wholeContent);
            });
        });

    });
};

function getCurrentTemp() {
    $.getJSON('/api/measures').then(function (result) {
        var totalItems = result.data.length;
        //alert(result.data[totalItems - 1].hubID);
        $('.currentTemp').html(result.data[totalItems - 1].value1);

    }).then(function () {
        setTimeout(getCurrentTemp, 10000);
    })
}

function getTemperatures() {
    var temps = [];
    $.getJSON('/api/measures').then(function (result) {

        $.each(result.data, function () {
            //alert(result.data.value1);
            temps.push(this.value1);
        });

    }).then(function () {
        alert(temps);
        return temps;
    });
}

function addHub(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addHub input').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount === 0) {

        var newHub = {
            'hubid': $('#addHub fieldset input#inputHubID').val(),
            'desc': $('#addHub fieldset input#inputDesc').val(),
            'userid': $('#addHub fieldset input#inputUserID').val()
        }

        $.ajax({
            type: 'POST',
            data: newHub,
            url: '/api/hub',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.msg === '') {
                $('#addHub fieldset input').val('');
                populateTableHubs();
            } else {
                console.log(response);
                alert('Niepoprawne ID huba');
            }
        });
    } else {
        alert('Wypelnij wszyskie pola');

        return false;
    }
}

// var randomScalingFactor = function () { return Math.round(Math.random() * 100) };
// var barChartData = {
//     labels: "Temperatury",
//     datasets: [
//         {
//             fillColor: "rgba(220,220,220,0.5)",
//             strokeColor: "rgba(220,220,220,0.8)",
//             highlightFill: "rgba(220,220,220,0.75)",
//             highlightStroke: "rgba(220,220,220,1)",
//             data: getTemperatures
//         },
//         {
//             fillColor: "rgba(151,187,205,0.5)",
//             strokeColor: "rgba(151,187,205,0.8)",
//             highlightFill: "rgba(151,187,205,0.75)",
//             highlightStroke: "rgba(151,187,205,1)",
//             data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
//         }
//     ]
// }



