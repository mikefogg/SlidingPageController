var sliding_page_controller = function(opts){

  //
  // Create some defaults 
  //

  var options = {
    height: (opts.height || Ti.Platform.displayCaps.platformHeight),
    width: (opts.width || Ti.Platform.displayCaps.platformWidth),
    speed: (opts.speed || 2),
    slides: (opts.slides || []),
    initialPage: (opts.initialPage || 0),
    disableBounce: (opts.disableBounce || false),
    showPagingControl: (opts.showPagingControl || false),
    pagingControlColor: (opts.pagingControlColor || "#fff"),
    pagingControlBottom: (opts.pagingControlBottom || 20),
    pagingControlOpacity: (opts.pagingControlOpacity || 1.0)
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

  var backgroundViews = [];
  var mainViews = [];

  //
  // Background Scroll View
  //

  var background_scroll_view = Ti.UI.createScrollView({
    height: options.height,
    width: options.width,
    contentWidth: 'auto',
    contentHeight: 'auto',
    // layout: "horizontal",
    scrollType: "horizontal",
    showVerticalScrollIndicator: true,
    showHorizontalScrollIndicator: true,
    scrollingEnabled: false
  });

  //
  // Content Body
  //

  var main_scroll_view = Ti.UI.createScrollableView({
    views: [],
    showPagingControl: false,
    disableBounce: options.disableBounce
  });

  //
  // Dot area
  //
  var dots = [];

  var dot_view = Ti.UI.createView({
    bottom: options.pagingControlBottom,
    width: Ti.UI.SIZE,
    layout: "horizontal",
    height: 12,
    opacity: options.pagingControlOpacity,
    currentPage: 0
  });

  //
  // Add the views to the controller
  //

  self.add(background_scroll_view);
  self.add(main_scroll_view);

  if(options.showPagingControl){
    self.add(dot_view);
  };

  //
  //  controller.addSlide(opts);
  //
  //  Example: 
  //  
  //  controller.addSlide({
  //    title: "Page Title",  // Required
  //    page: view,           // Required
  //    scrollTo: true        // Optional (Default: false)
  //  });

  self.addSlide = function(params){
    // How many views exist currently?
    var i = main_scroll_view.views.length;

    // Create the page header
    var left = (i==0 ? 0 : (options.speed*(options.width*i)));

    var background_view_container = Ti.UI.createView({
      left: left,
      width: options.width
    });

    background_view_container.add(params.backgroundView);

    // Create the slide background
    background_scroll_view.add(background_view_container);

    // Create the page body
    main_scroll_view.addView(params.mainView);

    // Add this to lists to track later
    backgroundViews.push(background_view_container);
    mainViews.push(params.page);

    // Scroll to it if we want
    if(params.scrollTo){
      setTimeout(function(){
        self.setPage(i, {animated: true});
      }, 300);
    };
  };

  //
  //  controller.scrollToNextPage(params);
  //
  //  Example: 
  //  
  //  controller.scrollToNextPage({animated: true});

  self.setNextPage = function(params){
    if((self.currentPage+1) == mainViews.length){ return; };

    self.setPage((self.currentPage+1), params);
  };

  //
  //  setPage(index, params, callback);
  //
  //  Example: 
  //  
  //  controller.setPage(0, {animated: false}, function(){ alert("Page Set!"); });

  self.setPage = function(index, params, callback){
    if(index == self.currentPage){ return; };

    var params = (params || {animated: false});

    if(!params.animated){
      self.setNavInset(index);
      main_scroll_view.setCurrentPage(index);
    } else {
      var left = ((options.width*options.speed)*index);
      if(index == 0){ left = 0 };
      background_scroll_view.scrollTo(left, 0);
      main_scroll_view.scrollToView(index);
    };

    self.currentPage = index;

    // Change the dots
    for(var i=0;i<dots.length;i++){
      if(i != index){
        dots[i].opacity = .25;
      } else {
        dots[i].opacity = 1.0;
      };
    };

    setTimeout(function(){
      backgroundViews[index].animate({
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
    var left = ((options.width*options.speed)*index);
    if(index == 0){ left = 0 };

    background_scroll_view.setContentOffset({x:left, y:0}, {animated:false});
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

    for(var i=0;i<options.slides.length;i++){
      self.addSlide({
        caption: options.slides[i].caption,
        backgroundView: options.slides[i].backgroundView,
        mainView: options.slides[i].mainView
      });

      // Add the dots!
      var dot = Ti.UI.createView({
        height: 8,
        width: 8,
        left: 3,
        backgroundColor: options.pagingControlColor,
        opacity: 0.25,
        borderRadius: 4,
        right: 1
      });

      dots.push(dot);
      dot_view.add(dots[i]);
    };

    // Set the initial page :)
    self.setPage(options.initialPage, {animated: false}, function(){

      self.setNavInset(options.initialPage);

      background_scroll_view.animate({
        opacity: 1.0,
        duration: 200
      });

      main_scroll_view.addEventListener("scroll", function(e){
        var left = ((options.width*options.speed)*e.currentPageAsFloat);
        background_scroll_view.setContentOffset({x:left, y:0}, {animated:false});

        var opacity = (1-(2*(e.currentPage - e.currentPageAsFloat)));

        if((e.currentPage - e.currentPageAsFloat) <= 0){
          opacity = (1+(2*(e.currentPage - e.currentPageAsFloat)))
        };

        backgroundViews[e.currentPage].opacity = Math.max(opacity, 0);
      });

      main_scroll_view.addEventListener("scrollend", function(e){
        self.setPage(e.currentPage, {animated: true});
      });

    });
  };

  self.initialize();

  return self;
};

module.exports = sliding_page_controller;