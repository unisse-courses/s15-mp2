$(document).ready(function(){

});


/* VALIDATION FUNCTIONS */
var validateLogin = function(){
    toHome();
}

/* NAVIGATION FUNCTIONS */

var toHome = function(){
    window.location.href = '/explore';
}

var toAuction = function(key){
    window.location.href = '/auction/'+key;
}