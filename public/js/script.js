/* VARIABLES */
var tomorrow;
var date;

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

    $("#file").change(function() {
        var file = $("#file");

        if (file.prop('files') && file.prop('files')[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#imgPreview").attr("src", e.target.result);
            }
            reader.readAsDataURL(file.prop('files')[0]);
        }
    });

    tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours()+24);
    var day = ("0" + tomorrow.getDate()).slice(-2);
    var month = ("0" + (tomorrow.getMonth() + 1)).slice(-2);
    date = tomorrow.getFullYear()+"-"+(month)+"-"+(day);
    $("#expiryDate").attr('min', date);

    $("#expiryDate").change(function(){
        if($("#expiryDate").val() == date){
            var hour = tomorrow.getHours();
            var min = tomorrow.getMinutes();
            $("#expiryTime").attr('min', hour+":"+min);
        } else {
            $("#expiryTime").attr('min', "00:00");
        }
    })

    $("#expiryDate").timepicker

    // $("#startingBid").keypress(function (evt) {
    //     evt.preventDefault();
    // });


    //Default for Login
    $(".registerDiv").hide();
    $(".loginDiv").show();
});

/* VALIDATION FUNCTIONS */
var validateLogin = function(){

    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();
    var valid = true;

    if(email == "" || password == ""){
        $("#loginError").text("some required input fields are empty.");
        valid = false;
    }

    // validate if exists
    // validate if password match

    if(valid){
        $.post("validateLogin",{email:email,password:password},function(data){
            if(data==="valid") {
                toHome();
            } else{
                $("#loginError").text("Invalid Username or Password.");
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
        $("#registerError").text("some required input fields are empty.");
        valid = false;
    } else if(password != confirmPassword){
        $("#registerError").text("passwords do not match.");
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
                $("#registerError").text("User already exists");
            }
        });
    }
}

var createAuction = function(){
    var productName = $("#productName").val();
    var description = $("#productDescription").val();
    var delivery = $("#delivery").val();
    var contactNum = $("#contactNum").val();
    var expiryDate = $("#expiryDate").val();
    var expiryTime = $("#expiryTime").val();
    var startingBid = $("#startingBid").val();
    var increments = $("#increments").val();
    var productImg = $("#imgPreview").attr("src");

    if(productName == "" || description == "" ||
        delivery == "" || contactNum == "" || expiryDate == "" || 
        expiryTime == "" || startingBid == "" || increments == ""){
        $("#errorMsg").text("some required input fields are empty.");
    } else if($("#expiryDate").val() == date && 
    $("#expiryTime").val() < (tomorrow.getHours()+":"+tomorrow.getMinutes())){
        $("#errorMsg").text("minimum due time is 24 hours from current time.");
    } else{
        var newAuction = {
            productName:productName,
            description:description,
            delivery:delivery,
            contactNum:contactNum,
            expiryDate:expiryDate,
            expiryTime:expiryTime,
            startingBid:startingBid,
            increments:increments,
            productImg:productImg,
            dateCreated: new Date()
        }
        $.post("createAuction", newAuction, function(data){
            toHome();
        });
    }
}


/* TAB FUNCTIONS */
var logregSwitchTab = function (event, tabName){

    $(".tablinks").removeClass(" active");

    if(tabName == "Register"){
        $(".loginDiv").hide();
        $(".registerDiv").show();
    } else {
        $(".registerDiv").hide();
        $(".loginDiv").show();
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