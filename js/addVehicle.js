
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
