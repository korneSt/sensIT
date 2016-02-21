
'use strict'
var selectedHub = {}
var state = 0;
var hubID;
var $selectedItemHub;
$(document).ready(function () {
    console.log('zaladowano podstrone hub')
    
    //rejestruj klikniecia w liscie sensorow
    $(document).on('click', 'div#hubListGroup a', function (e) {
        e.preventDefault();
        
        //wybrany objekt DOM 
        $selectedItemHub = $(this);
        
        //ustaw wartosc hubID na wybrana po kliknieciu
        hubID = $(this).attr('data-hubID');
        console.log('hubID: ' + hubID);

        getHubByID(hubID, function (result) {
            //ustaw objekt huba
            selectedHub = result
        
            //ustaw opis huba w polu tekstowym
            $('.inpuDescEditHub').val(selectedHub.desc)

            //ustaw wartosc checkboxa stan
            if (selectedHub.state === 1) {
                $('fieldset input.stateCheckBox').prop('checked', true)
            } else {
                $(' fieldset input.stateCheckBox').prop('checked', false)
            }
        })
    })
    
    //usun tekst z pola tekstowego po kliknieciu
    $(document).on('click', '.inpuDescEditHub', function () {
        $(this).val('');
    });
    
    //rejestruj klikniecia checkbox'ow i przycisku zmiany edycji
    $(document).on('click', '.editHubButton', editHub);
    $('#addHubButton').on('click', addHub);

})

function getHubByID(id, callback) {
    console.log('/api/hub/' + id)
    $.getJSON('/api/hub/' + id).then(function (result) {
        callback(result.data)
    })
}

function editHub(event) {
    event.preventDefault();
    var errorCount = 0;
    //znajduje trzeciego rodzica dla przycisku
    var $masterParent = $(this).parents(':eq(3)');

    //znajdz rodzica przycisku a dla niego znajdz wszystkie pola tekstowe
    var $parent = $(this).parent().find('input[type=text]');
    
    //walidacja wszystkich pol tekstowych
    $parent.each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        } else {
           selectedHub.desc =  $(this).val()
        }
    });
    console.log(errorCount)

    if (errorCount === 0) {
        console.log('zmieniony hub: ' + selectedHub);
        $.ajax({
            type: 'PUT',
            data: selectedHub,
            url: '/api/hub/' + hubID,
            dataType: 'JSON'
        }).done(function (response) {
            console.log(response)
            if (response.error === false) {
                //populateTableSensors();
                $selectedItemHub.text(selectedHub.hubID + ' ' + selectedHub.desc);
                alert('Zmieniono ustawienia');
                $masterParent.collapse('hide');
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


//dodaje nowy hub
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
                //populateTableHubs();
                $('#hubModal').modal('hide')
            } else {
                console.log(response);
                alert('Niepoprawne ID huba');
            }
        }).fail(function () {
            alert('Niepoprawne ID huba')
        });
    } else {
        alert('Wypelnij wszyskie pola');
        return false;
    }
}
