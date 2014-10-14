//
// Groupon-esk Sliding Pages w/Navbar animation
//

var SlidingPageController = require('com_mfogg_sliding_page_controller');

//
// Slide 1
//

  // Background

  var slide_1_background_view = Ti.UI.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });

    var slide_1_background_image = Ti.UI.createView({
      backgroundColor: "#eee",
      height: 240,
      width: 300
    });

    slide_1_background_view.add(slide_1_background_image);

  // Main

  var slide_1_main_view = Ti.UI.createView({
    backgroundColor:'#fff',
    height: 200,
    width: 200,
    borderRadius: 3
  });

//
// Slide 3
//

  // Background

  var slide_2_background_view = Ti.UI.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });

    var slide_2_background_image = Ti.UI.createView({
      backgroundColor: "#eee",
      height: 240,
      width: 300
    });

    slide_2_background_view.add(slide_2_background_image);

  // Main

  var slide_2_main_view = Ti.UI.createView({
    backgroundColor:'#fff',
    height: 200,
    width: 200,
    borderRadius: 3
  });

//
// Slide 3
//

  // Background

  var slide_3_background_view = Ti.UI.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });

    var slide_3_background_image = Ti.UI.createView({
      backgroundColor: "#eee",
      height: 240,
      width: 300
    });

    slide_3_background_view.add(slide_3_background_image);

  // Main

  var slide_3_main_view = Ti.UI.createView({
    backgroundColor:'#fff',
    height: 200,
    width: 200,
    borderRadius: 3
  });

var slides = [
  { caption: "Page One",
    backgroundView: slide_1_background_view,
    mainView: slide_1_main_view
  },
  { caption: "Page Two",
    backgroundView: slide_2_background_view,
    mainView: slide_2_main_view
  },
  { caption: "Page Three",
    backgroundView: slide_3_background_view,
    mainView: slide_3_main_view
  }
];

//
// Initialize the controller
//
// "initialPage" = Where we are starting :)
// "disableBounce" = Incase you want to allow bounce to scroll past the edges on the left/right side
// "slides" = Initial slides to display
//

var sliding_page_controller = new SlidingPageController({
  initialPage: 0,
  disableBounce: false,
  showPagingControl: true,
  pagingControlBottom: 180,
  pagingControlColor: "#fff",
  pagingControlOpacity: 0.85,
  slides: slides
});

//
// Callback that is fired ("pagechange") after successfully switching pages
//

sliding_page_controller.addEventListener("pagechange", function(e){
  Ti.API.info("Scrolled to page: "+e.currentPage);
});

var get_started_button = Ti.UI.createView({
  height: 50,
  bottom: 60,
  left: 40,
  right: 40,
  borderRadius: 3,
  opacity: 0.5,
  backgroundColor: "#000"
});

get_started_button.addEventListener("click", function(){
  sliding_page_controller.setPage((slides.length-1), {animated: false});
});

var win = Titanium.UI.createWindow({  
  title:'Tab 1',
  backgroundColor:'#ddd'
});

win.add(sliding_page_controller);
win.add(get_started_button);

win.open();