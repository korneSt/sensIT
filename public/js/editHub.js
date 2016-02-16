$(document).ready(function () {
    console.log(hubID)
    //$('#inpuDescEditSens').val(selectedHub.desc)

    // getSensorByID(selectedHub, sensorID) // pierwsza wersja wywolanie
    $('#inpuDescEditHub').click(function () {
        $(this).val('');
    });
    getHubByID(hubID, function (result) {
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
$('#editHubButton').on('click', editSensor);
var url = window.location.pathname.split('/')
var hubID = url[3]
var selectedHub = {}

console.log('zaladowano podstrone edit hub')

//DRUGA WERSJA + callback


function getHubByID(id, callback) {
    console.log('/api/hub/' + id)
    $.getJSON('/api/hub/' + id).then(function (result) {
        callback(result.data)
    })
}

function editHub(event) {
    event.preventDefault();
    var errorCount = 0;
    $('#editHub input').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log(errorCount)
    if (errorCount === 0) {
        selectedSensor.desc = $('#editHub fieldset input#inpuDescEditHub').val()
        // var editedSensor = {
        //     'hubid': $('#addHub fieldset input#inputHubID').val(),
        //     'desc': $('#addHub fieldset input#inputDesc').val(),
        //     'userid': $('#addHub fieldset input#inputUserID').val()
        // }
        console.log(selectedSensor);
        console.log('hub id: ' + sensorID);
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
