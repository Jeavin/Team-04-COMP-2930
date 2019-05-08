// To remain highlighted
var div = document.getElementById("buttons");
var btns = div.getElementsByClassName("button");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    });
}

// Close collapse whenever you click outside of the box
$(document).click(function(e) {
    if (!($(e.target).is('.card') || $(e.target).is('.input-group') || $(e.target).is('#carYear') || $(e.target).is('#carMake')
    || $(e.target).is('#carModel') || $(e.target).is('.custom-select') || $(e.target).is('.input-group-prepend')
    || $(e.target).is('.input-group-text'))) {
    	$('.collapse').collapse('hide');	    
    }
});