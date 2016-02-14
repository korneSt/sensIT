$(document).ready(function () {
    console.log(sensorID)
    //$('#inpuDescEditSens').val(selectedHub.desc)

    // getSensorByID(selectedHub, sensorID) // pierwsza wersja wywolanie
    $('#inpuDescEditSens').click(function () {
        $(this).val('');
    });
    getSensorByIDTest(sensorID, function (result) {
    console.log('resultat: ' + result)
    selectedSensor = result
    $('#inpuDescEditSens').val(selectedSensor.desc)
})
    // if (($('#inpuDescEditSens').is(":focus"))) {
    //     $(this).val('');
    // } else {
    //     $(this).val(selectedHub.desc);
    // }

})
$('#editSensorButton').on('click', editSensor);
var url = window.location.pathname.split('/')
var sensorID = url[3]
var selectedSensor = {}

console.log('zaladowano podstrone edit sensor')

//DRUGA WERSJA + callback


function getSensorByIDTest(id, callback) {
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
        // var editedSensor = {
        //     'hubid': $('#addHub fieldset input#inputHubID').val(),
        //     'desc': $('#addHub fieldset input#inputDesc').val(),
        //     'userid': $('#addHub fieldset input#inputUserID').val()
        // }
        console.log(selectedSensor);
        console.log('sensor id: ' + sensorID);
        $.ajax({
            type: 'PUT',
            data: selectedSensor,
            url: '/api/sensor/'+sensorID,
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
