$(document).ready(function(){

    $.each( $(".nav_left").children(), function(i, val){
        if($(this).attr("href")==window.location.pathname) {
            $(this).attr("class","activeTab");
        }
        else {
            $(this).attr("class",""); 
        }
    });

    // for (i in $("nav_left").children())
    // {
    //     console.log(i);
    //     if($(this).attr("href")==window.location.pathname) {
    //         $(this).attr("class","activeTab");
    //     }
    //     else {
    //         $(this).attr("class",""); 
    //     }
    // }

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
        $.post("validateLogin",{email:email,password:password},function(data){
            if(data==="valid") {
                toHome();
            } else{
                $("#errorMsg").text("Invalid Username or Password.");
            }
        });
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
    } else if(password != confirmPassword){
        $("#errorMsg").text("passwords do not match.");
        valid = false;
    }
    
    if(valid){
        var newUser = {
            email:email,
            img: img,
            username:username,
            password:password,
        }    
        $.post("validateRegister", newUser,function(data){
            if(data==='valid') {
                toHome();
            } else{
                $("#errorMsg").text("User already exists");
            }
        });
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