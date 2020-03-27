$(document).ready(function(){

});


/* VALIDATION FUNCTIONS */
var validateLogin = function(){
    toHome();
}

/* NAVIGATION FUNCTIONS */

var toHome = function(){
    window.location.href = '/home';
}

var toAuction = function(key){
    window.location.href = '/auction/'+key;
}