var sliding_page_controller = function(opts){

  //
  // Create some defaults 
  //

  var options = {
    height: (opts.height || Ti.Platform.displayCaps.platformHeight),
    width: (opts.width || Ti.Platform.displayCaps.platformWidth),
    pages: (opts.pages || []),
    initialPage: (opts.initialPage || 0),
    disableBounce: (opts.disableBounce || false),
    nav: {
      height: (opts.nav.height || 70),
      backgroundColor: (opts.nav.backgroundColor || "#000"),
      color: (opts.nav.color || "#fff")
    }
  };

  //
  // Create a base view to put these in
  //

  var self = Ti.UI.createView({
    height: options.height,
    width: options.width,
    currentPage: -1
  });

  //
  // Store these for access later!
  //

  var navigationViews = [];
  var contentViews = [];

  //
  // Navigation Header
  //

  var nav = Ti.UI.createView({
    backgroundColor: options.nav.backgroundColor,
    top: 0,
    height: options.nav.height,
    opacity: 0.0,
    left: 0,
    right: 0
  });

    var nav_scroll_view = Ti.UI.createScrollView({
      height: (options.nav.height-30),
      bottom: 5,
      left: 0,
      right: 0,
      contentWidth: 'auto',
      contentHeight: 'auto',
      layout: "horizontal",
      scrollType: "horizontal",
      showVerticalScrollIndicator: true,
      showHorizontalScrollIndicator: true,
      scrollingEnabled: false
    });

    nav_scroll_view.addEventListener("click", function(e){
      if(e.source && e.source.viewIndex != null){
        navigationViews[self.currentPage].animate({
          opacity: 0.25,
          duration: 350
        });

        self.scrollToPage(e.source.viewIndex);
      };
    });

    nav.add(nav_scroll_view);

  //
  // Content Body
  //

  var scrollable_view = Ti.UI.createScrollableView({
    views:[],
    top: options.nav.height,
    bottom: 0,
    showPagingControl:false,
    disableBounce: options.disableBounce
  });

  //
  // Add the views to the controller
  //

  self.add(scrollable_view);
  self.add(nav);

  //
  //  controller.addPage(opts);
  //
  //  Example: 
  //  
  //  controller.addPage({
  //    title: "Page Title",  // Required
  //    page: view,           // Required
  //    scrollTo: true        // Optional (Default: false)
  //  });

  self.addPage = function(params){
    if(!params.page || !params.title){
      Ti.API.error("Attempted to add a view to the sliding page controller with no title or view... ignoring");
      return;
    };

    // How many views exist currently?
    var i = scrollable_view.views.length;

    // Create the page header
    var left = (i==0 ? (options.width/4) : 0);

    var nav_page_view = Ti.UI.createView({
      height: (options.nav.height-30),
      bottom: 5,
      left: left,
      right: 0,
      width: (options.width/2),
      opacity: 0.25,
      viewIndex: i
    });

      nav_page_view.nav_page_title_view = Ti.UI.createView({
        height: (options.nav.height-30),
        left: 10,
        right: 10,
        touchEnabled: false
      });

        nav_page_view.nav_page_title = Ti.UI.createLabel({
          text: params.title,
          font: { fontSize: 16, fontWeight: "bold" },
          color: options.nav.color,
          textAlign: "center",
          touchEnabled: false
        });

        nav_page_view.nav_page_title_view.add(nav_page_view.nav_page_title);

      nav_page_view.add(nav_page_view.nav_page_title_view);

    nav_scroll_view.add(nav_page_view);

    // Create the page body
    scrollable_view.addView(params.page);

    // Add this to lists to track later
    navigationViews.push(nav_page_view);
    contentViews.push(params.page);

    // Scroll to it if we want
    if(params.scrollTo){
      setTimeout(function(){
        self.scrollToPage(i);
      }, 300);
    };
  };

  //
  //  controller.scrollToPage(index);
  //
  //  Example: 
  //  
  //  controller.scrollToPage(0);

  self.scrollToPage = function(index){
    if(index == self.currentPage){ return; };

    var left = ((options.width/2)*index);
    if(index == 0){ left = 0 };

    nav_scroll_view.scrollTo(left, 0);

    scrollable_view.scrollToView(index);

    self.currentPage = index;

    setTimeout(function(){
      navigationViews[index].animate({
        opacity: 1.0,
        duration: 200
      }, function(){
        self.fireEvent("pagechange", { currentPage: index });
      });
    }, 100);
  };

  //
  //  setPage(index, callback);
  //
  //  Example: 
  //  
  //  controller.setPage(0, function(){ alert("Page Set!"); });

  self.setPage = function(index, callback){
    if(index == self.currentPage){ return; };

    self.setNavInset(index);

    scrollable_view.setCurrentPage(index);
    self.currentPage = index;

    setTimeout(function(){
      navigationViews[index].animate({
        opacity: 1.0,
        duration: 200
      }, function(){
        self.fireEvent("pagechange", { currentPage: index });

        if(callback){
          callback();
        };
      });
    }, 100);
  };

  //
  //  setNavInset(index);
  //
  //  Example: 
  //  
  //  controller.setNavInset(1);

  self.setNavInset = function(index){
    var left = ((options.width/2)*index);
    if(index == 0){ left = 0 };

    nav_scroll_view.setContentOffset({x:left, y:0}, {animated:false});
  };

  //
  //  initialize();
  //
  //  Example: 
  //  
  //  controller.initialize();

  self.initialize = function(){

    //
    // Initialize the current views you're adding
    //

    for(var i=0;i<options.pages.length;i++){
      self.addPage({
        title: options.pages[i].title,
        page: options.pages[i].page
      });
    };

    // Set the initial page :)
    self.setPage(options.initialPage, function(){

      self.setNavInset(options.initialPage);

      nav.animate({
        opacity: 1.0,
        duration: 200
      });

      scrollable_view.addEventListener("scroll", function(e){
        var left = ((options.width/2)*e.currentPageAsFloat);
        nav_scroll_view.setContentOffset({x:left, y:0}, {animated:false});

        var opacity = (1-(2*(e.currentPage - e.currentPageAsFloat)));

        if((e.currentPage - e.currentPageAsFloat) <= 0){
          opacity = (1+(2*(e.currentPage - e.currentPageAsFloat)))
        };

        navigationViews[e.currentPage].opacity = Math.max(opacity, .25);
      });

      scrollable_view.addEventListener("scrollend", function(e){
        self.scrollToPage(e.currentPage);
      });

    });
  };

  self.initialize();

  return self;
};

module.exports = sliding_page_controller;