/**
 * 
 * funckje podstrony do edycji sensora
 * 
 */
$(document).ready(function () {
    console.log(sensorID)

    $('#inpuDescEditSens').click(function () {
        $(this).val('');
    });


    $('ul.list-group li').click(function (e) {
        console.log($(this).attr('data-sensid'));
        sensorID = $(this).attr('data-sensid');
        $('#editSensorTab').load('editSensor.jade');

        getSensorByID(sensorID, function (result) {
            console.log('resultat: ' + result)
            selectedSensor = result
        
            //ustawia opis sensora w polu tekstowym
            $('#inpuDescEditSens').val(selectedSensor.desc)
        
            //ustawia wartosc checkboxa favourite
            if (selectedSensor.favourite === 1) {
                $('#editSensor fieldset input#favCheckBox').prop('checked', true)
            }
            //ustawia wartosc checkboxa stan
            if (selectedSensor.state === 1) {
                $('#editSensor fieldset input#stateCheckBox').prop('checked', true)
            }
        })

    }).css("cursor", "pointer");


    console.log(this.checked)
    $('#editSensor fieldset input#favCheckBox').click(checkFavourite);
    $('#editSensor fieldset input#stateCheckBox').click(checkState);
    $('#editSensorButton').on('click', editSensor);
});
//test
//$("#myCheckbox").prop("checked", false);
// if (($('#inpuDescEditSens').is(":focus"))) {
//     $(this).val('');
// } else {
//     $(this).val(selectedHub.desc);
// }
    
//var url = window.location.pathname.split('/')
var sensorID;
var selectedSensor = {}

console.log('zaladowano podstrone edit sensor')



//DRUGA WERSJA + callback
function getSensorByID(id, callback) {
    console.log('/api/sensor/' + id)
    $.getJSON('/api/sensor/' + id).then(function (result) {
        callback(result.data)
    })
}

var checkState = function () {
    //$('#editSensor fieldset input#favCheckBox').is(':checked')
    selectedSensor.state = $('input#stateCheckBox:checked').length;
    console.log($('input#stateCheckBox:checked').length);
}

var checkFavourite = function () {
    //$('#editSensor fieldset input#favCheckBox').is(':checked')
    selectedSensor.favourite = $('input#favCheckBox:checked').length;
    console.log($('input#favCheckBox:checked').length);
}


//PIERWSZA WERSJA
// function getSensorByID(dest, id) {
//     console.log('/api/sensor/' + id)
//     $.getJSON('/api/sensor/' + id).then(function (result) {
//         console.log(result.data)
//         console.log(result.data.desc)
//         dest.desc = result.data.desc
//         $('#inpuDescEditSens').val(dest.desc)

//     })
// }

//akcja przyciska zatwierdzajacego edycje
function editSensor(event) {
    event.preventDefault();
    var errorCount = 0;

    $('#editSensor input').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log(errorCount)

    if (errorCount === 0) {
        selectedSensor.desc = $('#editSensor fieldset input#inpuDescEditSens').val()

        console.log(selectedSensor);
        console.log('sensor id: ' + sensorID);

        $.ajax({
            type: 'PUT',
            data: selectedSensor,
            url: '/api/sensor/' + sensorID,
            dataType: 'JSON'
        }).done(function (response) {
            console.log(response)

            if (response.error === false) {
                // $('#addHub fieldset input').val('');
                // populateTableHubs();
                alert('Zmieniono ustawienia');
            } else {
                console.log(response.message);
                alert('Blad serwera');
            }
        });
    } else {
        alert('Wypelnij wszyskie pola');
        return false;
    }
}


