/**
 * funckje podstrony do edycji sensora
 */
'use strict'

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
    var $favCheckbox = $('input.favCheckBox:checked');
    selectedSensor.favourite = $favCheckbox.length;
    console.log('stan fav: ' + $favCheckbox.length);
}

//akcja przyciska zatwierdzajacego edycje
function editSensor(event) {
    event.preventDefault();
    var errorCount = 0;
    
    //znajdz rodzica przycisku a dla niego znajdz wszystkie pola tekstowe
    var $parent = $(this).parent().find('input[type=text]');
    
    //walidacja wszystkich pol tekstowych
    $parent.each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        } else {
           selectedSensor.desc =  $(this).val()
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
                alert('Zmieniono ustawienia');
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


