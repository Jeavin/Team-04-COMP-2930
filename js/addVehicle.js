$(document).ready(function () {
    let db = firebase.database().ref().child("vehicleDatasets");
    db.on("value", snap => {
        snap.forEach(function(childSnap) {
            year = childSnap.key;
            let option = $("<option></option>");
            option.attr("value", year);
            option.attr("class", "data");
            option.html(year);
            $("#box1").append(option);
        });
    });
    
});

function selectYear() {
    let bds = firebase.database().ref().child("vehicleDatasets/"+$('#box1').val());
    $("#box2").empty();
    $("#box3").empty();
    // let default = $("<option disabled selected value> -- select an option -- </option>");
    $("#box2").append($("<option disabled selected value> -- select an option -- </option>"));
    $("#box3").append($("<option disabled selected value> -- select an option -- </option>"));
    bds.on("value", snap => {
        snap.forEach(function(childSnap) {
            make = childSnap.key;
            let option = $("<option></option>");
            option.attr("value", make);
            option.html(make);
            $("#box2").append(option);
        });
    });
}

function selectMake() {
    let bd = firebase.database().ref().child("vehicleDatasets/"+$('#box1').val()+"/"+$('#box2').val());
    $("#box3").empty();
    // let default = $("<option disabled selected value> -- select an option -- </option>");
    $("#box3").append($("<option disabled selected value> -- select an option -- </option>"));
    bd.on("value", snap => {
        snap.forEach(function(childSnap) {
            make = childSnap.key;
            let option = $("<option></option>");
            option.attr("value", make);
            option.html(make);
            $("#box3").append(option);
        });
    });
}
    
    var slice = [].slice;
    var tabs = document.querySelector('.tabs');
    var tabItems = slice.call(tabs.querySelectorAll('.tabs-nav-item'));
    var tabContents = slice.call(tabs.querySelectorAll('.tabs-content-item'));
    var currentIndex = 0;
    
    function onClick(e){
        e.preventDefault();
        var tab = this;
        var index = tabItems.indexOf(this);
        if(index !== currentIndex){
            tabItems[currentIndex].classList.remove('active-tab-nav-item');
            tabContents[currentIndex].classList.remove('active-tab-content-item');
            tab.classList.add('active-tab-nav-item');
            tabContents[index].classList.add('active-tab-content-item');
            currentIndex = index;
        }
    }
    
    tabItems.forEach(function(item){
        item.addEventListener('click', onClick, false);
    });

    // var e = document.getElementById("box1");
    // var strUser = e.options[e.selectedIndex].innerHTML;
    
    function newPerson() {
        $('#why').append('<div class="not" id="not"><div class="carName"><label for="year" >'+$('#box3 option:selected').text()+'</label></div><div class="gray"><label for="year" >'+$('#box2 option:selected').text()+'</label><br><label for="year" >'+$('#box1 option:selected').text()+'</label><button class="button2" onclick="removeDummy()">X </button></div></div>')
        
      }

      function removeDummy() {
        var elem = document.getElementById('not');
        elem.parentNode.removeChild(elem);
        return false;
    }
