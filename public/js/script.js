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
    console.log(date);
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
    }
    
    if(valid){
        var newUser = {
            email:email,
            img: img,
            username:username,
            password:password,
        }    
        $.post("/login/register", newUser,function(data){
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

    var formattedDate = new Date(expiryDate + " " + expiryTime);
    console.log(formattedDate);

    console.log($("#expiryTime").val());
    var curTime = (("0" + tomorrow.getHours()).slice(-2)+":"+("0" + tomorrow.getMinutes()).slice(-2));
    console.log(curTime);

    if(productName == "" || description == "" ||
        delivery == "" || contactNum == "" || expiryDate == "" || 
        expiryTime == "" || startingBid == "" || increments == ""){
        $("#errorMsg").text("some required input fields are empty.");
    } else if(productImg == '/images/icons/productFiller.png'){
        $("#errorMsg").text("please provide a product image.");
    } else if($("#expiryDate").val() == date && 
    $("#expiryTime").val() < curTime){
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
            dateCreated: new Date()
        }
        $.post("auction/create", newAuction, function(data){
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

var watchToggle = function(key){

    console.log("watchToggle:"+key);
    if($("#watchBtn").text() == "WATCH"){
        $.post("/auction/watch",{_id: key}, function(data){
            if(data == "success"){
                console.log("Now watching current auction");
                $("#watchBtn").text("UNWATCH");
                $("#watchers").text(parseInt($("#watchers").text())+1);
            } else {
                console.log("Cannot watch auction");
            }
        });
    } else {
        $.post("/auction/unwatch",{_id: key}, function(data){
            if(data == "success"){
                console.log("Unwatched current auction");
                $("#watchBtn").text("WATCH");
                $("#watchers").text(parseInt($("#watchers").text())-1);
            } else {
                console.log("Unwatch failed");
            }
        });
    }
}

var bid = function(key){
    console.log("Bidding");

    var bidPrice =  $("#amount").val();
    if(bidPrice){
        $.post("/auction/bid", {_id: key, bidPrice: bidPrice}, function(data){
            console.log("bid successful");
            alert("Bid Successful! You are now the highest bidder");
        });
        toAuction(key);
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
    console.log("toAuction: " + key);
    window.location.href = '/auction/'+key;
}

var toProfile = function(key){
    console.log("toProfile: "+key);
    window.location.href = '/profile/'+key;
}