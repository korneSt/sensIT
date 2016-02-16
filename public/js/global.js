// DOM READY
$(document).ready(function () {
    console.log('zaladowano /profile');

    //grid dla ulubionych sensorow
    $('.grid').masonry({
        columnWidth: 150,
        itemSelector: '.grid-item',
        gutter: 10  //padding
    });
    
    populateTableHubs();
    populateTableSensors();
    getCurrentTemp();

    $('#addHubButton').on('click', addHub);
    $('#sensorList table tbody').on('click', 'td a.linkdeletesensor', deleteSensor);
    //$('#addHubButton').click(addHub);
    
    //do wykresu
    // var ctx = document.getElementById("canvas").getContext("2d");
    // document.myBar = new Chart(ctx).Bar(barChartData, {
    //     responsive: true
    // });
    
    //ulubione sensory mozna przemieszczac
    // $('.draggable').draggabilly({
    //     grid: [20, 20]
    // })
    
    // if ($('#editSensor').is(":visible")) {
    //     console.log("podstrona widoczna");
    // }
    
});

var userListData = [];
var favSensors = [];

// Functions 

function populateTableHubs() {

    var tableContent = '';
    var temps;

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
    }).then(function () {
        $.each(hubList, function () {

            $.getJSON('/api/sensorsHub/' + this, function (data) {
                // For each item in our JSON, add a table row and cells to the content stringt
                var tableContent = ''
                $.each(data.data, function () {

                    tableContent += '<tr>';
                    tableContent += '<td><a href="profile/sensor/' + this.sensorID + '" class="linkshowuser" rel="' + this.sensorID + '">' + this.sensorID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.state + '">' + this.state + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.favourite + '">' + this.favourite + '</a></td>';
                    tableContent += '<td><a href="#" class="linkdeletesensor" rel="' + this.sensorID + '">delete</a></td>';

                    tableContent += '</tr>';
                    //dodaje do tablicy wszystkie ulubione sensory
                    if (this.favourite === 1) {
                        favSensors.push(this)
                        //dodaj sesnor do grida z ulubionymi sensorami - NIE DZIALA NA RAZIE 
                        //populateFavourite();
                    }
                });
                wholeContent += tableContent;
                $('#sensorList table tbody').html(wholeContent);
            });
        });

    })
};

function populateFavourite() {
    var content = '<div class="grid-item"><div class="panel panel-info"><div class="panel-heading"><panel-title>';
    content += 'Aktualna temperatura' + '</panel-title></div><div class="panel-body"><div class="';
    content += 'currentTemp' + '"></div></div></div></div>';
    console.log('ile ulubionych: ' + favSensors.length);
    //favSensors.forEach(function(data) {
    // console.log(this.data.sensorID);
    $('.grid').html(content)
    // })
    //$('.grid').html(content);
}

function getSensorByID(id) {
    console.log('/api/sensor/' + id)
    $.getJSON('/api/sensor/' + id).then(function (result) {
        console.log(result.data)
        //return result.data.desc
        //$('#inputDescEditSens').val(result.data.desc)
    })
}

//zwraca ostatnia temp dla wszystkich sensorow co 10s
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

//dodaje nowego huba
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
            //wartosci z pol tekstowych, ktore wprowadza user
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

    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/api/sensor/' + $(this).attr('rel')
        }).done(function (response) {

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

//DO WYKRESU
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
