'use strict'
/**
 * funckje podstrony do edycji sensora
 */

var sensorID;
var selectedSensor = {}
var $selectedItem;

$(document).ready(function () {
    console.log('zaladowano podstrone sensor')
    
    //rejestruj klikniecia w liscie sensorow
    $(document).on('click', 'div#sensorListGroup a', function (e) {
        e.preventDefault();
        
        //wybrany objekt DOM 
        $selectedItem = $(this);
        
        //ustaw wartosc sensorID na wybrana po kliknieciu
        sensorID = $(this).attr('data-sensid');
        console.log('sensorID: ' + sensorID);

        getSensorByID(sensorID, function (result) {
            //ustaw objekt sensora
            selectedSensor = result
        
            //ustaw opis sensora w polu tekstowym
            $('.inpuDescEditSens').val(selectedSensor.desc)
        
            //ustaw wartosc checkboxa favourite
            if (selectedSensor.favourite === 1) {
                $('fieldset input.favCheckBox').prop('checked', true)

            } else {
                $('fieldset input.favCheckBox').prop('checked', false)
            }
            //ustaw wartosc checkboxa stan
            if (selectedSensor.state === 1) {
                $('fieldset input.stateCheckBox').prop('checked', true)
            } else {
                $(' fieldset input.stateCheckBox').prop('checked', false)
            }
        })
    })
    
    //usun tekst z pola tekstowego po kliknieciu
    $(document).on('click', '.inpuDescEditSens', function () {
        $(this).val('');
    });
    
    //rejestruj klikniecia checkbox'ow i przycisku zmiany edycji
    $(document).on('click', 'input.favCheckBox', checkFavourite);
    $(document).on('click', 'input.stateCheckBox', checkState);
    $(document).on('click', '.editSensorButton', editSensor);

    $(document).on('click', 'div#sensorListGroup a.deleteSensor', deleteSensor);
});

function getSensorByID(id, callback) {
    console.log('/api/sensor/' + id)
    $.getJSON('/api/sensor/' + id).then(function (result) {
        callback(result.data)
    })
}
//sprawdz stan przelacznika stan i aktualizuj obiekt selectedSensor
var checkState = function () {
    var $stateCheckbox = $('input.stateCheckBox:checked');
    selectedSensor.state = $stateCheckbox.length;
    console.log('stan state: ' + $stateCheckbox.length);

}

//sprawdz stan przelacznika ulubiony i aktualizuj obiekt selectedSensor
var checkFavourite = function () {
    var $favCheckbox = $(this).is(':checked') === true ? 1 : 0;
    selectedSensor.favourite = $favCheckbox;
    console.log('stan fav: ' + $favCheckbox);
    
    if (selectedSensor.favourite === 1) {
        console.log(selectedSensor.sensorID);
        populateFavourite(selectedSensor)
        //$('#favouriteListTab').find("[data-favID='" + selectedSensor.sensorID + "']").show()
    } else {
        $('#favouriteListTab').find("[data-favID='" + selectedSensor.sensorID + "']").remove()
    }
}

//akcja przyciska zatwierdzajacego edycje
function editSensor(event) {
    event.preventDefault();
    var errorCount = 0;
    var $parentSensor = $(this).parents(':eq(3)');
    
    //znajdz rodzica przycisku a dla niego znajdz wszystkie pola tekstowe
    var $parent = $(this).parent().find('input[type=text]');
    
    //walidacja wszystkich pol tekstowych
    $parent.each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        } else {
            selectedSensor.desc = $(this).val()
        }
    });
    console.log(errorCount)

    if (errorCount === 0) {
        console.log('zmieniony senosr: ' + selectedSensor);
        $.ajax({
            type: 'PUT',
            data: selectedSensor,
            url: '/api/sensor/' + sensorID,
            dataType: 'JSON'
        }).done(function (response) {
            console.log(response)
            if (response.error === false) {
                //populateTableSensors();
                $selectedItem.text(selectedSensor.sensorID + ' ' + selectedSensor.desc);
                $('#favouriteListTab').find("[data-favID='" + selectedSensor.sensorID + "']");
                //alert('Zmieniono ustawienia');
                $parentSensor.collapse('hide');
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

function deleteSensor(event, callback) {
    event.preventDefault();
    var $sensorToDelete = $(this).attr('data-sensID');
    var $parentDelete = $(this).parents(':eq(3)');
    // Pop up a confirmation dialog
    var confirmation = confirm('Czy na pewno chcesz usunąć ten sensor?');

    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/api/measure/' + $sensorToDelete
        }).done(function (response) {

            if (response.error === false) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/sensor/' + $sensorToDelete
                }).done(function (response) {

                    if (response.error === false) {
                        $parentDelete.remove();
                        $('#favouriteListTab').find("[data-favID='" + $sensorToDelete + "']").remove()
                        callback;
                    }
                    else {
                        console.log(response.data.message)
                        alert('Blad serwera');
                    }

                    // Update the table
                    //populateTableSensors();
                });
            }
            else {
                console.log(response.data.message)
                alert('Blad serwera');
            }
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};