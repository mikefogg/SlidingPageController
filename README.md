Appcelerator Titanium :: Sliding Page Controller
=============

An Appcelerator Titanium commonjs module that allows for Groupon-esk Navigation. The navigation area will slide alongside the body content when scrolled left/right. Pretty simple for now, but more will be added

*__NOTE:__ If there are specific features you'd like to see, please let me know! I'll get them in there :)

<h2>Supports</h2>

<h3>Devices</h3>
  - iPhone (Tested with 5s, and 6)

  *__NOTE:__ May/should work great on other devices but, I've only tested on these ones so far (and many simulators)

<h3>iOS Versions</h3>
  - 7.0+ (up to the latest iOS 8)

<h3>Titanium SDK Versions</h3>
  - 3.3.X
  - 3.4.0

  * __Note:__ I am sure it works on many more versions than this, but these are just the one's I've used

<h2>Usage</h2>

<pre><code>
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

</code></pre>

<h2>Known Issues and Future Improvements</h2>

1. Adding the ability to remove pages ("removePage" function)

... anything else :)

<h2>Please let me know if you'd like any additions or something isn't working!</h2>

<h3>License</h3>
Do whatever you want, however you want, whenever you want. And if you find a problem on your way, let me know so I can fix it for my own apps too :)