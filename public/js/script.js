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

    var now = new Date();
    var tomorrow = ("0" + (now.getDate()+1)).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var date = now.getFullYear()+"-"+(month)+"-"+(tomorrow);
    console.log(date);
    $("#expiryDate").attr('min', date);

    // $("#startingBid").keypress(function (evt) {
    //     evt.preventDefault();
    // });
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
        console.log("error");
    }else{
        var newAuction = {
            productName:productName,
            description:description,
            delivery:delivery,
            contactNum:contactNum,
            expiryDate:expiryDate,
            expiryTime:expiryTime,
            startingBid:startingBid,
            increments:increments,
            productImg:productImg
        }
        $.post("createAuction", newAuction, function(data){
            console.log("Auction Created");
            toHome();
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