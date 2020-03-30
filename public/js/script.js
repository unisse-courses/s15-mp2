$(document).ready(function(){

    $("#uploadImgBtn").click(function() {
        var file = $("#file");

        if (file.prop('files') && file.prop('files')[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#imgPreview").attr("src", e.target.result);
                console.log($("#imgPreview").attr("src"));
            }
            reader.readAsDataURL(file.prop('files')[0]);
        }
    });
});


/* VALIDATION FUNCTIONS */
var validateLogin = function(){

    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();
    var valid = true;

    if(email == "" || password == ""){
        $("#errorMsg").text("some required input fields are empty.");
        valid = false;
    }

    // validate if exists
    // validate if password match

    if(valid){
        toHome();
    }
}

var validateRegister = function(){

    var img = $("#imgPreview").attr("src");
    var email = $("#registerEmail").val();
    var username = $("#username").val();
    var password = $("#registerPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    var valid = true;

    if(email == "" || username == "" || password == "" || confirmPassword == ""){
        $("#errorMsg").text("some required input fields are empty.");
        valid = false;
    }

    if(password != confirmPassword){
        $("#errorMsg").text("passwords do not match.");
        valid = false;
    }
    
    // validate if exists

    if(valid){
        toHome();
    }
}


/* TAB FUNCTIONS */
var logregSwitchTab = function (event, tabName){

    $(".tablinks").removeClass(" active");

    if(tabName == "Register"){
        $("#loginDiv").hide();
        $("#registerDiv").show();
    } else {
        $("#registerDiv").hide();
        $("#loginDiv").show();
    }

    event.currentTarget.className += " active";
}

/* NAVIGATION FUNCTIONS */

var toHome = function(){
    window.location.href = '/explore';
}

var toAuction = function(key){
    window.location.href = '/auction/'+key;
}