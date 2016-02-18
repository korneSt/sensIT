$(document).ready(function () {
    console.log(hubID)
    //$('#inpuDescEditSens').val(selectedHub.desc)

    // getSensorByID(selectedHub, sensorID) // pierwsza wersja wywolanie
    $('#inpuDescEditHub').click(function () {
        $(this).val('');
    });
    getHubByID(hubID, function (result) {
        console.log('resultat: ' + result)
        selectedHub = result

        $('#inpuDescEditHub').val(selectedHub.desc)
    })
    $('#editHubButton').on('click', editHub);
    $('#addSensorButton').on('click', addSensor);



    $('#stateCheckBox').click(function () {
        if (this.checked) {
            state = 1;
        } else {
            state = 0;
        }
    });
    // if (($('#inpuDescEditSens').is(":focus"))) {
    //     $(this).val('');
    // } else {
    //     $(this).val(selectedHub.desc);
    // }    

})

var url = window.location.pathname.split('/')
var hubID = url[3]
var selectedHub = {}
var state = 0;

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
        selectedHub.desc = $('#editHub fieldset input#inpuDescEditHub').val()
        // var editedSensor = {
        //     'hubid': $('#addHub fieldset input#inputHubID').val(),
        //     'desc': $('#addHub fieldset input#inputDesc').val(),
        //     'userid': $('#addHub fieldset input#inputUserID').val()
        // }
        console.log('wybrany hub' + selectedHub);
        $.ajax({
            type: 'PUT',
            data: selectedHub,
            url: '/api/hub/' + hubID,
            dataType: 'JSON'
        }).done(function (response) {
            console.log(response)
            if (response.error === false) {
                // $('#addHub fieldset input').val('');

                alert('Zmieniono ustawienia');
            } else {
                console.log(response.message);
                alert('Blad serwera');
            }
        }).fail(function name(params) {
            console.log('blad')
        });
    } else {
        alert('Wypelnij wszyskie pola');
        return false;
    }
}


//dodaje nowy sensor
function addSensor(event) {
    event.preventDefault();
    var errorCount = 0;


    $('#addSensor input[type=text]').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log(errorCount)
    if (errorCount === 0) {
        var newSensor = {
            
            //wartosci z pol tekstowych, ktore wprowadza user
            'sensorid': $('#addSensor fieldset input#inputSensorID').val(),
            'desc': $('#addSensor fieldset input#inputDesc').val(),
            'hubID': selectedHub.hubID,
            'state': state
        }
        console.log(newSensor)
        $.ajax({
            type: 'POST',
            data: newSensor,
            url: '/api/sensor',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.error === false) {
                $('#addSensor fieldset input[type=text]').val('');
                //populateTableHubs();
            } else {
                console.log(response);
                alert('Niepoprawne ID sensora');
            }
        }).fail(function () {
            alert('Niepoprawne ID sensora')
        });
    } else {
        alert('Wypelnij wszyskie pola');
        return false;
    }
}
