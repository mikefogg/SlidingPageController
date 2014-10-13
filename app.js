//
// Groupon-esk Sliding Pages w/Navbar animation
//

var SlidingPageController = require('com_mfogg_sliding_page_controller');

//
// These are the initial pages that are loaded in
//
// "title" = Nav area text
// "page" = The view container that will act as that page in the slider
//

var pages = [
  { title: "Page One",
    page: Ti.UI.createView({ backgroundColor:'#eee', top: 0, left: 0, right: 0, bottom: 0 })
  },
  { title: "Page Two",
    page: Ti.UI.createView({ backgroundColor:'#ddd', top: 0, left: 0, right: 0, bottom: 0 })
  },
  { title: "Page Three",
    page: Ti.UI.createView({ backgroundColor:'#ccc', top: 0, left: 0, right: 0, bottom: 0 })
  }
];

//
// Initialize the controller
//
// "initialPage" = Where we are starting :)
// "disableBounce" = Incase you want to allow bounce to scroll past the edges on the left/right side
// "nav" = Some optional params for the navigation bar. NOTE: I plan on adding more here
// "pages" = Initial pages
//

var sliding_page_controller = new SlidingPageController({
  initialPage: 1,
  disableBounce: true,
  nav: {
    backgroundColor: "#82B548",
    color: "#fff",
    height: 70
  },
  pages: pages
});

//
// Callback that is fired ("pagechange") after successfully switching pages
//

sliding_page_controller.addEventListener("pagechange", function(e){
  Ti.API.info("Scrolled to page: "+e.currentPage);
});

//
// A button that allows you to add a custom page after initialization
// NOTE: There is no "removePage" function yet... in due time :)
// If you need this ASAP, let me know and I'll add it in (I haven't needed it yet)
//

var button = Ti.UI.createView({
  height: 60,
  width: 60,
  bottom: 10,
  borderRadius: 30,
  backgroundColor: "#82B548"
});

button.addEventListener('click', function(e){

  //
  // Add the new page!
  //
  // Set "scrollTo" to false if you don't want it to slide to this cool new page
  //

  sliding_page_controller.addPage({
    title: "Page",
    page: Ti.UI.createView({ backgroundColor:'#bbb', top: 0, left: 0, right: 0, bottom: 0 }),
    scrollTo: true
  });
});

//
// Now create the actual page :)
//

var win = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});

win.add(sliding_page_controller);
win.add(button);

win.open();