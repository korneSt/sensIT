'use strict'

var selectedHub = {}
var state = 0;
var hubID;
var $selectedItemHub;

$(document).ready(function () {
    console.log('zaladowano podstrone hub')
    
    //rejestruj klikniecia w liscie hubow
    $(document).on('click', 'div#hubListGroup a.clickOK', function (e) {
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

        $(document).on('click', '.showAllSensorsButton', function () {
            console.log('h' + hubID);
            window.location.hash = 'h' + hubID;
        })
    })
    
    //usun tekst z pola tekstowego po kliknieciu
    $(document).on('click', '.inpuDescEditHub', function () {
        $(this).val('');
    });
    
    //rejestruj klikniecia checkbox'ow i przycisku zmiany edycji
    $(document).on('click', '.editHubButton', editHub);
    
    //rejestruj klikniecie przycisku i wykonaj funkcje addHub
    $('#addHubButton').on('click', addHub);
    $('#addSensorButton').on('click', addSenosr);

    $(document).on('click', 'div#hubListGroup a.deleteHub', deleteHub);

})

function getHubByID(id, callback) {
    console.log('/api/hub/' + id)
    $.getJSON('/api/hub/' + id).then(function (result) {
        callback(result.data)
    })
}

//edytuj hub
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
            selectedHub.desc = $(this).val()
        }
    });
    console.log(errorCount)

    if (errorCount === 0) {
        console.log('zmieniony hub: ' + selectedHub);
        $.ajax({
            type: 'PUT',
            data: selectedHub,
            url: '/api/hub',
            dataType: 'JSON'
        }).done(function (response) {
            console.log(response)
            if (response.error === false) {
                //populateTableSensors();
                $selectedItemHub.text(selectedHub.hubID + ' ' + selectedHub.desc);
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


//dodaj nowy hub
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
                populateTableHubs();
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



//dodaj nowy sensor
function addSenosr(event) {
    event.preventDefault();
    var errorCount = 0;
    var $masterParent = $(this).parents(':eq(3)');
    $('#addSensor input[type=text]').each(function (index, val) {
        console.log(val);
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log('ile bledow' + errorCount)
    if (errorCount === 0) {
        var newSensor = {
            //wartosci z pol tekstowych, ktore wprowadza user
            'sensorid': $('#addSensor fieldset input#inputSensorIDNew').val(),
            'desc': $('#addSensor fieldset input#inputDescNew').val(),
            'address': $('#addSensor fieldset input#inputAddressNew').val(),
            'hubid': selectedHub.hubID
        }
        console.log(newSensor)
        $.ajax({
            type: 'POST',
            data: newSensor,
            url: '/api/sensor',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.error === false) {
                $('#addSensorModal').modal('hide')
                populateTableHubs();
                $masterParent.collapse('hide');
            } else {
                console.log(response);
                alert('Niepoprawne ID Sensora');
            }
        }).fail(function () {
            alert('Niepoprawne ID Sensora')
        });
    } else {
        alert('Wypelnij wszyskie pola');
        return false;
    }
}

function deleteHub(event) {
    console.log($('#sensorListGroup').find("[data-sensID='" + 1836541 + "']").parents(':eq(3)'));
    event.preventDefault();
    var $hubToDelete = $(this).attr('data-hubID');
    var $parentDelete = $(this).parents(':eq(3)');

    $.getJSON('/api/sensorsHub/' + $hubToDelete, function (data) {
        console.log('data ' + data);
        console.log('dlugosc ' + data.data.length)
        if (data.data.length === 0) {
            $.ajax({
                type: 'DELETE',
                url: '/api/hub/' + $hubToDelete
            }).done(function (response) {
                console.log('id z /api/hub/1 ' + this.sensorID)
                if (response.error === false) {
                    $parentDelete.remove();
                    //callback;
                }
                else {
                    console.log(response.data.message)
                    alert('Blad serwera');
                }
            });
            return;
        } else {
            $.each(data.data, function () {
                $('#sensorListGroup').find("[data-sensID='" + this.sensorID + "']").parents(':eq(3)').remove()
                console.log('id z this ' + this.sensorID)
                var idSensDelete = this.sensorID
                $.ajax({
                    type: 'DELETE',
                    url: '/api/measure/' + idSensDelete
                }).done(function (response) {
                    console.log('id z /api/measure ' + this.sensorID)
                    if (response.error === false) {
                        $.ajax({
                            type: 'DELETE',
                            url: '/api/sensor/' + idSensDelete
                        }).done(function (response) {
                            console.log('id z /api/sensor ' + this.sensorID)
                            $.ajax({
                                type: 'DELETE',
                                url: '/api/hub/' + $hubToDelete
                            }).done(function (response) {
                                console.log('id z delete /api/hub ' + this.sensorID)
                                if (response.error === false) {
                                    $parentDelete.remove();
                                    //callback;
                                }
                                else {
                                    console.log('blad serwera');
                                    console.log(response.data.message)
                                    alert('Blad serwera');
                                }
                                //populateTableSensors();
                            }).fail(function () {
                                return;
                            });
                        });
                    }
                    else {
                        console.log(response.data.message)
                        alert('Blad serwera');
                    }
                });
            });
        }
    });

}