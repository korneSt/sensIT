
// Userlist data array for filling in info box
var userListData = [];
var favSensors = [];

// DOM Ready =============================================================
$(document).ready(function () {
    console.log('zaladowano /profile');
    // Populate the user table on initial page load
    populateTableHubs();
    populateTableSensors(function(sensorList) {
        console.log(sensorList.length)
        populateFavourite()
    })
    getCurrentTemp();

    //$('#addHubButton').click(addHub);
    //$('#editSensorButton').click(editSensor);
    $('#addHubButton').on('click', addHub);
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
        grid: [20, 20]
    })
    //console.log($("#myCheckbox").prop( "checked" ))
    $("#myCheckbox").prop( "checked", false );
    //sprawdza czy strona edycji sensora jest uruchomiona
    
    if($('#editSensor').is(":visible")) {
        console.log("a");
    }
    //delete sensor
    $('#sensorList table tbody').on('click', 'td a.linkdeletesensor', deleteSensor);

    //$('.linkshowuser').click(getSensorByID(4));
    //$('#favCheckBox' ).prop( "checked", true );
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
//TODO: asd
function populateTableHubs() {

    // Empty content string
    var tableContent = '';
    var temps;

    // jQuery AJAX call for JSONp

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

function populateTableSensors(callback) {

    var wholeContent = '';
    var hubList = [];

    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (result) {
        $.each(result.data, function () {
            //alert(this.hubID);
            hubList.push(this.hubID);
        });
    }).then(function () {
        $.each(hubList, function () {

            $.getJSON('/api/sensorsHub/' + this, function (data) {
                // For each item in our JSON, add a table row and cells to the content stringt
                var tableContent = ''
                $.each(data.data, function () {
                    if(this.favourite === 1) {
                        favSensors.push(this)
                    }
                    tableContent += '<tr>';
                    tableContent += '<td><a href="profile/sensor/' + this.sensorID + '" class="linkshowuser" rel="' + this.sensorID + '">' + this.sensorID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.state + '">' + this.state + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.favourite + '">' + this.favourite + '</a></td>';
                    tableContent += '<td><a href="#" class="linkdeletesensor" rel="' + this.sensorID + '">delete</a></td>';

                    tableContent += '</tr>';
                });
                wholeContent += tableContent;
                $('#sensorList table tbody').html(wholeContent);
            });
        });

    })
    return callback(favSensors);
};

var populateFavourite = function() {
    //favSensors=[{},{}]
    var content = '<div class="grid-item"><div class="panel panel-info"><div class="panel-heading"><panel-title>';
    content+='Aktualna temperatura' + '</panel-title></div><div class="panel-body"><div class="';
    content+='currentTemp' + '"></div></div></div></div>';
    console.log('ile ulubionych: ' + favSensors.length);
    favSensors.forEach(function(data) {
        console.log(data.sensorID);
        $('.grid').append(content)
    })

    //$('.grid').html(content);
}

function getSensorByID(id) {
    console.log('/api/sensor/'+id)
    $.getJSON('/api/sensor/'+id).then( function(result){
        console.log(result.data)
        //return result.data.desc
        //$('#inputDescEditSens').val(result.data.desc)
    })
}

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

    $('#addHub input[type=text]').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log(errorCount)
    if (errorCount === 0) {

        var newHub = {
            'hubid': $('#addHub fieldset input#inputHubID').val(),
            'desc': $('#addHub fieldset input#inputDesc').val(),
            'userid': $('#addHub fieldset input#inputUserID').val()
        }
        console.log(newHub)
        $.ajax({
            type: 'POST',
            data: newHub,
            url: '/api/hub',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.msg === '') {
                $('#addHub fieldset input[type=text]').val('');
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



function deleteSensor(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this sensor?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/api/sensor/' + $(this).attr('rel')
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.error === false) {
                console.log(response.data.message)
            }
            else {
                console.log(response.data.message)
                alert('Blad serwera');
            }

            // Update the table
            populateTableSensors();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


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



