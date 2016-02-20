'use strict'

// DOM READY
$(document).ready(function () {

    console.log('zaladowano global.js');
   
    //.css("cursor", "pointer");
    

    //grid dla ulubionych sensorow
    $('.grid').masonry({
        columnWidth: 150,
        itemSelector: '.grid-item',
        gutter: 10  //padding
    });
    populateTableSensors();
    populateTableHubs();

    //getCurrentTemp();

    $('#addHubButton').on('click', addHub);
    //$('#favPanel').on('click', function(){alert('a')});
    $('#sensorList table tbody').on('click', 'td a.linkdeletesensor', deleteSensor);


    //$('#sensor2323').click(function () { console.log('a') }).css("cursor", "pointer");

    $('#editSensorTab').hide();
    $('#favouriteSensorContent').hide();

    
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
    // window.setTimeout(updateSensorTemp, 10000);
  //  window.setInterval(updateSensorTemp, 10000);

    $(document).on('click', 'div#favouriteListTab a', function (e) {
        e.preventDefault();
        $selectedFavSensor = $(this);
        // $(this).addClass('list-group-item active').siblings()
        //     .removeClass('list-group-item active')
        //     .addClass('list-group-item');
        
        //ustaw wartosc sensorID na wybrana po kliknieciu
        sensorID = $(this).attr('data-favID');
        $('#favouriteListTab').hide();
        //wyswietl zakladke do edycji sensora
        $('#favouriteSensorContent').show();
    });


});

var myArray

var $selectedFavSensor;
var userListData = [];
var favSensors = [];

// Functions 

function setCookie(nazwa, wartosc, dni) {
    if (dni) {
        var data = new Date();
        data.setTime(data.getTime() + (dni * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + data.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = nazwa + "=" + wartosc + expires + "; path=/";
}


var tab = []

function createGrid() {

    //var $gridItem = $("<div>", { id: "favGrid", class: "grid-item" });
    var $grid = $("<div>", { class: "grid" });
    var $gridItem = $("<div>", { class: "grid-item" });
    var $panel = $("<div>", { class: "panel panel-info" });


    $panel.appendTo($gridItem)
    $gridItem.appendTo($grid)
    //$gridItem.append($panel)
    //$("#myContent").appendTo($gridItem)
    $grid.appendTo(".row")
}

function populateTableSensors() {
    var theTemplateScript = $("#header").html();
    var theTemplate = Handlebars.compile(theTemplateScript);

    $.getJSON('/api/sensorsUser/' + document.getElementById("txt").innerHTML, function (data) {
        // For each item in our JSON, add a table row and cells to the content stringt
        var tableContent = ''


        //$('#myContent').append(theTemplate(data));

        $('#sensorsListTab').append(theTemplate(data));


        $.each(data.data, function () {

            // tableContent += '<tr>';
            // tableContent += '<td><a href="profile/sensor/' + this.sensorID + '" class="linkshowuser" rel="' + this.sensorID + '">' + this.sensorID + '</a></td>';
            // tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
            // tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
            // tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.state + '">' + this.state + '</a></td>';
            // tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.favourite + '">' + this.favourite + '</a></td>';
            // tableContent += '<td><a href="#" class="linkdeletesensor" rel="' + this.sensorID + '">delete</a></td>';

            // tableContent += '</tr>';
            //dodaje do tablicy wszystkie ulubione sensory
            if (this.favourite === 1) {
                console.log('this z populate ' + this.desc)
                favSensors.push(this)
                //dodaj sesnor do grida z ulubionymi sensorami - NIE DZIALA NA RAZIE 
                populateFavourite(this);
            }
        });
        // wholeContent += tableContent;
        // $('#sensorList table tbody').html(wholeContent);
    });
};

function populateTableHubs(callback) {
    var test = ''
    var tableContent = '';

    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (result) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(result.data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="profile/hub/' + this.hubID + '" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
            tableContent += '</tr>';
        });
        // (function resultat(callback) {
        //     tab.push(result)
        // })();
        // console.log(test);
        // setCookie('huby', JSON.stringify(tab),2 )
        // Inject the whole content string into our existing HTML table
        $('#hubList table tbody').html(tableContent);

    });

};
function updateSensorTemp() {
    if (favSensors.length > 0) {
        $.each(favSensors, function () {
            console.log('update: ' + this.sensorID)
            var sensorSelected = this;
            //populateFavourite(this)
            getCurrentTemp(sensorSelected, function (lastTemp) {
                $('#sensor' + sensorSelected.sensorID).html(lastTemp)
            })
        })
    }
}
var favScript = $("#favTabScript").html();
var favTemplate = Handlebars.compile(favScript);

function populateFavourite(loadedSensor) {
    //favSensors.forEach(function(data) {
    // console.log(this.data.sensorID);
   
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

        // var content = '<div class="grid-item"><a style ="display:block" href="/profile/favouriteSensor/' + sensor.sensorID + '"><div class="panel panel-info "><div class="panel-heading"><panel-title>';
        // content += 'Aktualna temperatura' + '</panel-title></div><div class="panel-body"><div id="sensor'
        // + sensor.sensorID + '" class="';
        // content += 'currentTemp' + '">' + lastTemp
        // + '</div>' + sensor.desc + '</div></div></a></div>';
        // $('.grid').append(content)
        console.log('ile ulubionych: ' + favSensors.length);
        //updateSensorTemp();
    });

    // })
    //$('.grid').html(content);
}

// function getSensorByID(id) {
//     console.log('/api/sensor/' + id)
//     $.getJSON('/api/sensor/' + id).then(function (result) {
//         console.log(result.data)
//         //return result.data.desc
//         //$('#inputDescEditSens').val(result.data.desc)
//     })
// }

//zwraca ostatnia temp dla wszystkich sensorow co 10s
function getCurrentTemp(sensor, callback) {
    $.getJSON('/api/measuresSensor/' + sensor.sensorID).then(function (result) {
        var totalItems = result.data.length;
        var lastTemp;
        if (result.data[totalItems - 1] !== undefined) {
            lastTemp = result.data[totalItems - 1].value1
        } else {
            lastTemp = 'Brak'
        }
        //alert(result.data[totalItems - 1].hubID);
        callback(lastTemp);
    })
    // .then(function () {
    //     setTimeout(callback, 10000);
    // })
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
