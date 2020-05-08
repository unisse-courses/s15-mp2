/* VARIABLES */
var tomorrow;
var date;

$(document).ready(function(){

    $.each( $(".nav_left").children(), function(i, val){
        if($(this).attr("href")==window.location.pathname || window.location.pathname.match(new RegExp($(this).attr("href") + "(\/.*)?"))) {
            $(this).attr("class","activeTab");
        }
        else {
            $(this).attr("class",""); 
        }
    });

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

    $("#amount").keypress(function (evt) {
        evt.preventDefault();
    });
    
    if((window.location.href).includes('/auction/') && !(window.location.href).endsWith('/auction/')){

        var newTime = new Date()
        var timestamp = ("0"+newTime.getHours()).slice(-2)+":"+("0"+newTime.getMinutes()).slice(-2);

        if((window.location.href).endsWith('#refresh=success')){
            $(".auction_message").text("Bid Successful! You are now the highest bidder "+timestamp);
        } else if((window.location.href).endsWith('#refresh=failed')){
            $(".auction_message").text("Bid Failed."+timestamp);
        } else {
            $(".auction_message").text("Last updated "+timestamp);
        }
    }

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

    if(valid){
        $.post("/login/validate",{email:email,password:password},function(data){
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

    if(img == '/images/icons/profileFiller.png'){
        img = '/images/defaultProfile.png'
    }

    if(email == "" || username == "" || password == "" || confirmPassword == ""){
        $("#registerError").text("some required input fields are empty.");
        valid = false;
    } else if(password != confirmPassword){
        $("#registerError").text("passwords do not match.");
        valid = false;
    } else if(!email.endsWith("@dlsu.edu.ph")){
        $("#registerError").text("DLSU Email is required");
        valid = false;
    }
    
    if(valid){
        var newUser = {
            email:email,
            img: img,
            username:username,
            password:password,
        }
        $("#registerError").text("Verifying email...");

        $.get("https://isitarealemail.com/api/email/validate?email=" + email, function responseHandler(data) {
            if (data.status === 'valid') {
                // the email is valid and the mail box is active
                $.post("/login/register", newUser,function(data){
                    if(data==='valid') {
                        toHome();
                    } else {
                        $("#registerError").text("User already exists");
                    }
                });
            } else {
                $("#registerError").text("Email does not exist");
            }
        })

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

    var formattedDate = new Date(expiryDate + " " + expiryTime);
    var curTime = (("0" + tomorrow.getHours()).slice(-2)+":"+("0" + tomorrow.getMinutes()).slice(-2));

    if(productName == "" || description == "" ||
        delivery == "" || contactNum == "" || expiryDate == "" || 
        expiryTime == "" || startingBid == "" || increments == ""){
        $("#errorMsg").text("some required input fields are empty.");
    } else if(productImg == '/images/icons/productFiller.png'){
        $("#errorMsg").text("please provide a product image.");
    } else if(formattedDate <= new Date(date)){
        $("#errorMsg").text("minimum due time is 24 hours from current time.");
    } else if(formattedDate == new Date(date) && expiryTime < curTime){
        $("#errorMsg").text("minimum due time is 24 hours from current time.");
    } else{
        $("#errorMsg").text("");
        var newAuction = {
            productName:productName,
            description:description,
            delivery:delivery,
            contactNum:contactNum,
            expiryDate:formattedDate,
            startingBid:startingBid,
            increments:increments,
            productImg:productImg,
        }
        $.post("auction/create", newAuction, function(data){
            toAuction(data);
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

var watchToggle = function(key){

    if($("#watchBtn").text() == "WATCH"){
        $.post("/auction/watch",{_id: key}, function(data){
            if(data == "success"){
                $("#watchBtn").text("UNWATCH");
                $("#watchBtn").toggleClass("watch");
                $("#watchBtn").toggleClass("unwatch");
                $("#watchers").text(parseInt($("#watchers").text())+1);
            } 
            // else {
            //     console.log("Cannot watch auction");
            // }
        });
    } else {
        $.post("/auction/unwatch",{_id: key}, function(data){
            if(data == "success"){
                $("#watchBtn").text("WATCH");
                $("#watchBtn").toggleClass("watch");
                $("#watchBtn").toggleClass("unwatch");
                $("#watchers").text(parseInt($("#watchers").text())-1);
            } 
            // else {
            //     console.log("Unwatch failed");
            // }
        });
    }
}

var bid = function(key){

    $(".auction_message").text("Processing bid... ");
    var bidPrice =  $("#amount").val();

    if(bidPrice){
        $.post("/auction/bid", {_id: key, bidPrice: bidPrice}, function(data){
            if(data == "success"){
                refreshAuction(key, "success");
            } else {
                refreshAuction(key, "failed");
            }
        });
    }
    else{
        alert("please input an amount");
    }
};

/* NAVIGATION FUNCTIONS */

var toHome = function(){
    window.location.href = '/explore';
}

var toAuction = function(key){
    window.location.href = '/auction/'+key;
}

var refreshAuction = function(key, status){
    location.replace('/auction/'+key+"#refresh="+status);
    window.location.reload();
}

var toProfile = function(key){
    window.location.href = '/profile/'+key;
}