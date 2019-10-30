////////////////////////////////////////////////////////////////////////////////
//
//  Currently this implementation expects the HTML to have both .indicator(s) &
//  a .previous-controller and .next-controller
//  If one does not include indicators it will break the slider.
//  If one does not include the controllers, it will cause a TypeError,
//  but not break the slider.
//
//  A future implementation will wrap all related code in conditionals to avoid errors
//  and make the Slider more flexible.
//
//  Additional features to be added later are optional automation, automation speed,
//  and play/pause (maybe a stop, which reset the slider);
//
////////////////////////////////////////////////////////////////////////////////


class Slider {
  constructor(sliderId, currentSlideNumber = 1) {
    this.slider               = document.getElementById(sliderId);
    this.currentSlideNumber   = currentSlideNumber;
    this.isChanging           = false;
    this.init();
  }


  /* ===========================================================================
                                init()
  =========================================================================== */


  init(){
    const self         = this;
    const initialSlide = self.slider.querySelector(`[data-slide="${self.currentSlideNumber}"]`);
    const indicators   = self.slider.getElementsByClassName('indicator');


    /* ==============================
       setInitialSlideandIndicator
    ============================== */


    (function setInitialSlideandIndicator(){
      initialSlide.classList.add('new-slide');
      indicators[self.currentSlideNumber-1].classList.add('active');
    })();


    /* ==============================
       addIndicatorEventListeners
    ============================== */


    (function addIndicatorEventListeners() {
      for (let i = 0; i < indicators.length; i++){
        let indicator = indicators[i];

        indicator.addEventListener('click', function(e){
          e.preventDefault(); //For <a>'s
          self.indicateSlide(e);
        });//End of event listener.
      }//End of our for loop
    })();//End of IIFE


    /* ==============================
       addControllerEventListeners
    ============================== */


    (function addControllerEventListeners() {
      const previousController = self.slider.getElementsByClassName('previous-controller')[0];
      const nextController     = self.slider.getElementsByClassName('next-controller')[0];


      previousController.addEventListener('click', function(e){
        e.preventDefault();
        self.getPreviousSlide();
      });


      nextController.addEventListener('click', function(e){
        e.preventDefault();
        self.getNextSlide();
      });
    })();//End of IIFE
  }//End of init(){ ... }


  //This method is used within getPreviousSlide, getNextSlide, and indicateSlide.
  updateIndicator(newIndicator, indicators){
    for (let i = 0; i < indicators.length; i++){
      let indicator = indicators[i];
      if (indicator.classList.contains('active')){
        indicator.classList.remove('active');
        break;
      }
    }
    newIndicator.classList.add('active');
  }


  /* ===========================================================================
                         controlSlide (& Helpers)
  =========================================================================== */


  /* ==============================
          getPreviousSlide
  ============================== */


  getPreviousSlide(e){
    const self = this;

    //Return early if a slide change is already underway.
    if (self.isChanging) {
      //console.log("Hey button-masher, the slide is currently changing...");
      return;
    }


    self.isChanging    = true;
    const slides       = self.slider.getElementsByClassName('slide');
    const currentSlide = self.slider.querySelector(`[data-slide="${self.currentSlideNumber}"]`);
    const indicators   = self.slider.getElementsByClassName('indicator');
    let newSlideIndex;
    let newSlideNumber;


    if (slides.length <= 1){
      //console.log("Hey dopenheimer, there's not enough slides.");
      return;
    }


    //Set newSlideIndex and newSlideNumber:
    if (self.currentSlideNumber === 1) {
      newSlideIndex  = slides.length - 1;
      newSlideNumber = slides.length;
    } else {
      newSlideIndex  = self.currentSlideNumber - 2;
      newSlideNumber = self.currentSlideNumber - 1;
    }


    //Set currentSlideNumber & newSlide
    self.currentSlideNumber = newSlideNumber; //Do this immediately.
    const newSlide          = slides[newSlideIndex];


    //Update the indicator
    self.updateIndicator(indicators[newSlideIndex], indicators);


    //Execute animation classes
    currentSlide.classList.add('moveToRight');
    newSlide.classList.add('moveFromLeft', 'new-slide');


    //Wait before resetting things.
    currentSlide.addEventListener('animationend', function(){
      this.classList.remove('moveToRight', 'new-slide');
    }, {once: true});


    //Wait before resetting things.
    newSlide.addEventListener('animationend', function(){
      this.classList.remove('moveFromLeft');
      self.isChanging = false;
    });
  };


  /* ==============================
          getNextSlide
  ============================== */


  getNextSlide(e){
    const self = this;

    //Return early if a slide change is already underway.
    if (self.isChanging) {
      //console.log("Hey button-masher, the slide is currently changing...");
      return;
    }


    self.isChanging    = true;
    const slides       = self.slider.getElementsByClassName('slide');
    const currentSlide = self.slider.querySelector(`[data-slide="${self.currentSlideNumber}"]`);
    const indicators   = self.slider.getElementsByClassName('indicator');
    let newSlideIndex;
    let newSlideNumber;


    if (slides.length <= 1){
      //console.log("Hey dopenheimer, there's not enough slides.");
      return;
    }


    //Set newSlideIndex and newSlideNumber:
    if (self.currentSlideNumber === slides.length) {
      newSlideIndex  = 0;
      newSlideNumber = 1;
    } else {
      //This can be confusing because currentSlideNumber is not 0-based.
      //Thus the index of newSlide is actually the value of currentSlideNumber,
      //unless the initial condition evaluated to true;
      newSlideIndex  = self.currentSlideNumber;
      newSlideNumber = self.currentSlideNumber + 1;
    }


    //Set currentSlideNumber & newSlide
    self.currentSlideNumber = newSlideNumber; //Do this immediately.
    const newSlide          = slides[newSlideIndex];


    //Update the indicator
    self.updateIndicator(indicators[newSlideIndex], indicators);


    //Execute animation classes
    currentSlide.classList.add('moveToLeft');
    newSlide.classList.add('moveFromRight', 'new-slide');


    //Wait before resetting things.
    currentSlide.addEventListener('animationend', function(){
      this.classList.remove('moveToLeft', 'new-slide');
    }, {once: true});


    //Wait before resetting things.
    newSlide.addEventListener('animationend', function(){
      this.classList.remove('moveFromRight');
      self.isChanging = false;
    });
  };


  /* ===========================================================================
                              indicateSlide
  =========================================================================== */


  indicateSlide(e){
    const self       = this;
    const indicators = self.slider.getElementsByClassName('indicator');


    //Return early if a slide change is already underway.
    if (self.isChanging) {
      //console.log("Hey button-masher, the slide is currently changing...");
      return;
    }


    self.isChanging           = true;
    const slideIndicatorValue = parseInt(e.target.dataset.slideIndicator, 10);
    const newSlideIndex       = slideIndicatorValue - 1;
    const currentSlide        = self.slider.querySelector(`[data-slide="${self.currentSlideNumber}"]`);
    const newSlide            = self.slider.querySelector(`[data-slide="${slideIndicatorValue}"]`);


    //Return early if the user selected the indicator for the current slide.
    if (slideIndicatorValue === self.currentSlideNumber) {
      //console.log("Hey dummy! You're already on that slide.");
      self.isChanging = false;
      return;
    }


    /* ============================

    ============================ */


    if (slideIndicatorValue > self.currentSlideNumber){
      //Update the indicator
      self.updateIndicator(indicators[newSlideIndex], indicators);


      //Set currentSlideNumber
      const newSlideNumber    = parseInt(newSlide.dataset.slide, 10);
      self.currentSlideNumber = newSlideNumber;


      //Execute animation classes
      currentSlide.classList.add('moveToLeft');
      newSlide.classList.add('moveFromRight', 'new-slide');


      //Wait before resetting things.
      currentSlide.addEventListener('animationend', function(){
        this.classList.remove('moveToLeft', 'new-slide');
      }, {once: true});


      //Wait before resetting things.
      newSlide.addEventListener('animationend', function(){
        this.classList.remove('moveFromRight');
        // const newSlideNumber    = newSlide.dataset.slide;
        // self.currentSlideNumber = newSlideNumber;
        self.isChanging         = false;
      });
    }


    /* ============================

    ============================ */


    else {
      //Update the indicator
      self.updateIndicator(indicators[newSlideIndex], indicators);


      //Set currentSlideNumber
      const newSlideNumber    = parseInt(newSlide.dataset.slide, 10);
      self.currentSlideNumber = newSlideNumber;


      //Execute animation classes
      currentSlide.classList.add('moveToRight');
      newSlide.classList.add('moveFromLeft', 'new-slide');


      //Wait before resetting things.
      currentSlide.addEventListener('animationend', function(){
        this.classList.remove('moveToRight', 'new-slide');
      }, {once: true});


      //Wait before resetting things.
      newSlide.addEventListener('animationend', function(){
        this.classList.remove('moveFromLeft');
        // const newSlideNumber    = newSlide.dataset.slide;
        // self.currentSlideNumber = newSlideNumber;
        self.isChanging         = false;
      });
    }
  }
}//End of class Slider


/* =============================================================================
                                window.onload
============================================================================= */


window.onload = function(){
  const slider1 = new Slider('slider1');
  const slider2 = new Slider('slider2', 1);
};
