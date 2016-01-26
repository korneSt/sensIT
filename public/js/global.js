
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Populate the user table on initial page load
    populateTableHubs();
    populateTableSensors();
    getCurrentTemp();

});

// Functions =============================================================

// Fill table with data
function populateTableHubs() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON

    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (result) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(result.data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#' + this.hubID + '" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#hubList table tbody').html(tableContent);
    });
};

function populateTableSensors() {

    var wholeContent = '';
    var hubList = [];

    $.getJSON('/api/hubsUser/' + document.getElementById("txt").innerHTML, function (result) {
        $.each(result.data, function () {
            //alert(this.hubID);
            hubList.push(this.hubID);
        });
    }).done(function () {
        $.each(hubList, function () {

            $.getJSON('/api/sensorsHub/' + this, function (data) {
                // For each item in our JSON, add a table row and cells to the content stringt
                var tableContent = ''
                $.each(data.data, function () {
                    tableContent += '<tr>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.sensorID + '">' + this.sensorID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.hubID + '">' + this.hubID + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.desc + '">' + this.desc + '</a></td>';
                    tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.state + '">' + this.state + '</a></td>';
                    tableContent += '</tr>';
                });
                wholeContent += tableContent;
                $('#sensorList table tbody').html(wholeContent);
            });
        });

    });
};

function getCurrentTemp() {
    $.getJSON('/api/measures').then(function (result) {
        var totalItems = result.data.length;
        //alert(result.data[totalItems - 1].hubID);
        $('.currentTemp').html(result.data[totalItems - 1].value1);

    }).then(function () {
        setTimeout(getCurrentTemp, 10000);
    })


}

