"use strict";

// DOM READY
$(document).ready(function () {

    console.log('zaladowano global.js');

    populateTableSensors();
    populateTableHubs();

    $('#editSensorTab').hide();
    $('#favouriteSensorContent').hide();

    //  window.setInterval(updateSensorTemp, 10000);

    $(document).on('click', 'div#favouriteListTab a', function (e) {
        e.preventDefault();
        $selectedFavSensor = $(this);

        //ustaw wartosc sensorID na wybrana po kliknieciu
        sensorID = $(this).attr('data-favID');
        createGraph();
    });
});

var $selectedFavSensor; //kliknięty kafelek (obiekt DOM)
var favSensors = [];    //tablica obiektów ulubionych sensorów
var sensorChart;    //sensor z którego powstanie wykres


//FUNKCJE

function createGraph() {
    dataToChart.datasets[0].data = []
    dataToChart.labels = []
        
    //usuwa stary i tworzy nowy element canvas w DOM
    //po to aby wykresy się nie nakładały
    $('#myChart').remove();
    $('#chart').append('<canvas id="myChart" width="700" height="400"><canvas>');

    getTemperatures(sensorID, function (result) {
        sensorChart = result;
        console.log(sensorChart);

        sensorChart.data.forEach(function (v, i) {

            dataToChart.labels.push(v.mTime.substring(0, 10))
            dataToChart.datasets[0].data.push(parseFloat(v.value1))

            console.log(dataToChart.datasets[0].data)
            console.log(dataToChart.labels);
        });

        var ctx = document.getElementById("myChart").getContext("2d");
        var myLineChart = new Chart(ctx).Line(dataToChart);
        console.log('a ' + sensorChart.data.filter(selectDay))
    })
    $('#favouriteListTab').hide();
    //wyswietl zakladke do edycji sensora
    $('#favouriteSensorContent').show();

}

function populateTableSensors() {
    //szablon listy sensorow
    var theTemplateScript = $("#sensorListScript").html();
    var theTemplate = Handlebars.compile(theTemplateScript);

    $.getJSON('/api/sensorsUser/' + document.getElementById("txt").innerHTML, function (data) {
        //$('#sensorsListTab').append(theTemplate(data));

        $.each(data.data, function () {
            if (this.favourite === 1) {
                favSensors.push(this)
                populateFavourite(this);
            }
        });
    });
};

function populateTableHubs(callback) {
    var hubScript = $("#hubListScript").html();
    var hubTemplate = Handlebars.compile(hubScript);

    var sensorScript = $("#sensorListScript").html();
    var sensorTemplate = Handlebars.compile(sensorScript);

    $('#sensorsListTab').children().remove();

    //zwraca wszystkie huby użytkownika
    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (data) {

        $('#hubsListTab').html(hubTemplate(data));
        //$('#sensorsListTab').append(theTemplate(hubIDHeader)); 

        $.each(data.data, function () {
            var thisHub = this.hubID;
            console.log('populate hubid: ' + this.hubID)
            $.getJSON('/api/sensorsHub/' + this.hubID, function (data) {
                if (data.data.length > 0) {
                    data.hubID = thisHub;
                    $('#sensorsListTab').append(sensorTemplate(data));
                }
            });
        });
    });
};

function updateSensorTemp() {
    if (favSensors.length > 0) {
        $.each(favSensors, function () {
            console.log('update: ' + this.sensorID)
            var sensorSelected = this;

            getCurrentTemp(sensorSelected, function (lastTemp) {
                $('#sensor' + sensorSelected.sensorID).html(lastTemp)
            })
        })
    }
}

function populateFavourite(loadedSensor) {
    var favScript = $("#favTabScript").html();
    var favTemplate = Handlebars.compile(favScript);

    console.log('loaded sensor: ' + loadedSensor.sensorID);
    var favTabObj = {
        sensorID: loadedSensor.sensorID,
        desc: loadedSensor.desc,
    }
    console.log('favTabTemplate ' + favTabObj.sensorID + ' ' + favTabObj.desc);

    getCurrentTemp(favTabObj, function (lastTemp) {
        favTabObj.lastTemp = lastTemp;
        console.log('currnet Temp fun ' + favTabObj.sensorID + ' ' + favTabObj.lastTemp)

        $('#favouriteListTab').append(favTemplate(favTabObj));

        console.log('ile ulubionych: ' + favSensors.length);
    });
}

// function getSensorByID(id) {
//     console.log('/api/sensor/' + id)
//     $.getJSON('/api/sensor/' + id).then(function (result) {
//         console.log(result.data)
//         //return result.data.desc
//         //$('#inputDescEditSens').val(result.data.desc)
//     })
// }

//zwraca ostatnia temp dla podanego sensora
function getCurrentTemp(sensor, callback) {
    $.getJSON('/api/measuresSensor/' + sensor.sensorID).then(function (result) {
        var totalItems = result.data.length;
        var lastTemp;
        if (result.data[totalItems - 1] !== undefined) {
            lastTemp = result.data[totalItems - 1].value1
        } else {
            lastTemp = 'Brak'
        }
        callback(lastTemp);
    })
}
var measures = [];

function getTemperatures(sensorID, callback) {
    $.getJSON('/api/measuresSensor/' + sensorID).then(function (result) {
        callback(result);
    })
}
