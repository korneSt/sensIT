/**
 * funckje podstrony do edycji sensora
 */
$(document).ready(function () {
    console.log('zaladowano podstrone sensor')
    console.log('sensorID: ' + sensorID)

    // $(document).on('click', 'div#sensorListGroup a', function (e) {
    //     e.preventDefault();
    //     $selectedItem = $(this);
    //     $(this).addClass('list-group-item active').siblings()
    //         .removeClass('list-group-item active')
    //         .addClass('list-group-item');
        
    //     //ustaw wartosc sensorID na wybrana po kliknieciu
    //     sensorID = $(this).attr('data-sensid');
        
    //     //wyswietl zakladke do edycji sensora
    //     $('#editSensorTab').show();

    //     getSensorByID(sensorID, function (result) {
    //         //ustaw objekt sensora
    //         selectedSensor = result
        
    //         //ustaw opis sensora w polu tekstowym
    //         $('#inpuDescEditSens').val(selectedSensor.desc)
        
    //         //ustaw wartosc checkboxa favourite
    //         if (selectedSensor.favourite === 1) {
    //             $('#editSensor fieldset input#favCheckBox').prop('checked', true)
    //         } else {
    //             $('#editSensor fieldset input#favCheckBox').prop('checked', false)
    //         }
    //         //ustaw wartosc checkboxa stan
    //         if (selectedSensor.state === 1) {
    //             $('#editSensor fieldset input#stateCheckBox').prop('checked', true)
    //         } else {
    //             $('#editSensor fieldset input#stateCheckBox').prop('checked', false)
    //         }
    //     })
    // })
    
    //usun tekst z pola tekstowego po kliknieciu
    $('#inpuDescEditSens').click(function () {
        $(this).val('');
    });

    $('#editSensor fieldset input#favCheckBox').click(checkFavourite);
    $('#editSensor fieldset input#stateCheckBox').click(checkState);
    $('#editSensorButton').on('click', editSensor);
});
    

var sensorID;
var selectedSensor = {}
var $selectedItem;

function getSensorByID(id, callback) {
    console.log('/api/sensor/' + id)
    $.getJSON('/api/sensor/' + id).then(function (result) {
        callback(result.data)
    })
}
//sprawdz stan przelacznika stan i aktualizuj obiekt selectedSensor
var checkState = function () {
    var $stateCheckbox = $('input#stateCheckBox:checked');
    selectedSensor.state = $stateCheckbox.length;
    console.log('stan state: ' + $stateCheckbox.length);
}

//sprawdz stan przelacznika ulubiony i aktualizuj obiekt selectedSensor
var checkFavourite = function () {
    var $favCheckbox = $('input#favCheckBox:checked');
    selectedSensor.favourite = $favCheckbox.length;
    console.log('stan fav: ' + $favCheckbox.length);
}



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
                $selectedItem.text(selectedSensor.sensorID + ' ' + selectedSensor.desc);
                //alert('Zmieniono ustawienia');
            } else {
                console.log('Blad: ' + response.message);
                alert('Blad serwera');
            }
        });
    } else {
        alert('Wypelnij wszyskie pola');
        return false;
    }
}


