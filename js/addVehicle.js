

    
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
