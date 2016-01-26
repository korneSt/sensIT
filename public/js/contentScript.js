
$(document).ready(function () {
    $("#myContent").hide();
    // $("#myLogin").click(function () {
    //     $("#myContent").show();
    //     $("#myContent").load("content/login.html");
    //     $(".carousel-caption").hide();
    // });
    $("#myAbout").click(function () {
        $("#myContent").show();
        $("#myContent").load("content/about.html");
        $(".carousel-caption").hide();
    });
    $("#myContact").click(function () {
        $("#myContent").show();
        // $("#myContent").load("content/contact.html");
        $(".carousel-caption").hide();
    });
    $("#myBrand").click(function () {
        $("#myContent").hide();
        $(".carousel-caption").show();
    });

});

// $(document).on('click', '.navbar-collapse.in', function (e) {
//     if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
//         $(this).collapse('hide');
//     }
// });