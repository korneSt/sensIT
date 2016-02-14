$(document).ready(function () {
  
    //$('#inpuDescEditSens').val(selectedHub.desc)

    getSensorByID(selectedHub, sensorID)
    $("#inpuDescEditSens").click(function () {
        $(this).val("");
    });



})
$('#editSensorButton').on('click', editSensor);
var url = window.location.pathname.split('/')
var sensorID = url[3]
var selectedHub = { desc: 'brak opisu' }

console.log('zaladowano podstrone edit sensor')


function getSensorByID(dest, id) {
    console.log('/api/sensor/' + id)
    $.getJSON('/api/sensor/' + id).then(function (result) {
        console.log(result.data.desc)
        dest.desc = result.data.desc
        $('#inpuDescEditSens').val(dest.desc)
        //dest = result.data.desc
        //return result.data.desc
        //$('#inputDescEditSens').val(result.data.desc)
    })
}



function editSensor(event) {
    event.preventDefault();
    var url = window.location.pathname.split('/')
    var sensorID = url[3]
    console.log(sensorID)
    var errorCount = 0;
    $('#editSensor input').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount === 0) {
        var editedSensor = {
            'hubid': $('#addHub fieldset input#inputHubID').val(),
            'desc': $('#addHub fieldset input#inputDesc').val(),
            'userid': $('#addHub fieldset input#inputUserID').val()
        }

        $.ajax({
            type: 'PUT',
            data: editedSensor,
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
