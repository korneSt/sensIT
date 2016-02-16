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

    getSensorByID(sensorID, function (result) {
        console.log('resultat: ' + result)
        selectedSensor = result
        
        //ustawia opis sensora w polu tekstowym
        $('#inpuDescEditSens').val(selectedSensor.desc)
        
        //ustawia wartosc checkboxa 
        if (selectedSensor.favourite === 1) {
            $('#editSensor fieldset input#favCheckBox').prop('checked', true)
        }
    })

    console.log(this.checked)
    $('#editSensor fieldset input#favCheckBox').click(checkFavourite);
    $('#editSensorButton').on('click', editSensor);
});
//test
//$("#myCheckbox").prop("checked", false);
// if (($('#inpuDescEditSens').is(":focus"))) {
//     $(this).val('');
// } else {
//     $(this).val(selectedHub.desc);
// }
    





var url = window.location.pathname.split('/')
var sensorID = url[3]
var selectedSensor = {}

console.log('zaladowano podstrone edit sensor')

//DRUGA WERSJA + callback

var checkFavourite = function () {
    //$('#editSensor fieldset input#favCheckBox').is(':checked')
    selectedSensor.favourite = $('input:checked').length;
    console.log($('input:checked').length);
}

function getSensorByID(id, callback) {
    console.log('/api/sensor/' + id)
    $.getJSON('/api/sensor/' + id).then(function (result) {
        callback(result.data)
    })
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


