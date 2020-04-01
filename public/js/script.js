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