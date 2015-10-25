!function($, Foundation){
  'use strict';

  function Drilldown(element){
    this.$element = element;
    this.options = $.extend({}, Drilldown.defaults, this.$element.data());
    this._init();
  }
  Drilldown.defaults = {
    backButton: '<li class="js-drilldown-back"><a>Back</a></li>',
    wrapper: '<div></div>',
    closeOnClick: true,
    holdOpen: false,
    maxWidth: 200
  };
  Drilldown.prototype._init = function(){
    this.$submenuAnchors = this.$element.find('li.has-submenu');
    this.$submenus = this.$submenuAnchors.children('[data-submenu]').addClass('is-drilldown-sub')/*.wrap($(this.options.wrapper).addClass('is-drilldown-sub'))*/;
    // this.$rootElems = this.$element.children('[data-submenu]')/*.addClass('first-sub')*/;
    this.$menuItems = this.$element.find('li').not('.js-drilldown-back').attr('role', 'menuitem');
    // this.$submenus;

    // console.log(this.$wrapper.outerHeight(), this.$wrapper.css());
    this._prepareMenu();
    // this.getMaxHeight();
  };
  Drilldown.prototype._prepareMenu = function(){
    var _this = this;
    if(!this.options.holdOpen){
      this._menuLinkEvents();
    }
    // console.log(this.$submenuAnchors);
    this.$submenuAnchors.each(function(){
      // this.removeAttribute('href');
      var $sub = $(this);
      $sub.find('a')[0];//.removeAttribute('href');
      $sub.children('[data-submenu]')
          .attr({
            'aria-hidden': true,
            'tabindex': 0,
            'role': 'menu'
          });
      _this._events($sub);
    });
    this.$submenus.each(function(){
      var $menu = $(this);
      $menu.prepend(_this.options.backButton);
      _this._back($menu);
    });
    this.$wrapper = $(this.options.wrapper).addClass('is-drilldown').css(this.getMaxHeight());
    this.$element.wrap(this.$wrapper);

  };
  Drilldown.prototype._events = function($elem){
    var _this = this;

    $elem/*.off('mouseup.zf.drilldown tap.zf.drilldown touchend.zf.drilldown')*/
    .on('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown', function(e){
      // console.log('mouse event', $elem);
      e.preventDefault();
      e.stopPropagation();

      if(e.target !== e.currentTarget.firstElementChild){
        return false;
      }
      _this._show($elem);

      if(_this.options.closeOnClick){
        var $body = $('body').not(_this.$wrapper);
        $body.off('.zf.drilldown').on('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown', function(e){
          // console.log('body mouseup');
          e.preventDefault();
          _this._hideAll();
          $body.off('.zf.drilldown');
        });
      }
    }).on('focus.zf.drilldown', function(){
      // console.log('something');
      _this._show($elem);
    });
    $elem.find('.js-drilldown-back').eq(0).on('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown', function(e){
      //do stuff
      // console.log('back button');
    });
  };
  Drilldown.prototype._hideAll = function(){
    this.$element.find('.is-drilldown-sub.is-active').addClass('is-closing')
        .on('transitionend.zf.drilldown', function(e){
          // console.log('transitionend');
          $(this).removeClass('is-active is-closing').off('transitionend.zf.drilldown');
        });
  };
  Drilldown.prototype._back = function($elem){
    $elem.off('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown');
    $elem.children('.js-drilldown-back')
        .on('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown', function(e){
          // console.log('mouseup on back');
          $elem.addClass('is-closing').on('transitionend.zf.drilldown', function(e){
            // e.stopImmediatePropagation();
            // console.log('different transitionend');
            $elem.removeClass('is-active is-closing').off('transitionend.zf.drilldown');
          });
        });
  }
  Drilldown.prototype._menuLinkEvents = function(){
    var _this = this;
	var linkRelativityTest = new RegExp('^(?:[a-z]+:)?//', 'i');
    this.$menuItems.not('.has-submenu')
        .off('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown')
        .on('mousedown.zf.drilldown tap.zf.drilldown touchend.zf.drilldown', function(e){
          // console.log('random link mouse event');
		// Can place an if statement here to see if the element has a link to somewhere that is either relative or not and link to it if needed (could be an added feature)  
        e.preventDefault();
         if(linkRelativityTest.test($(this).children('a').attr('href'))) {
          //  window.location.href = $(this).children('a').attr('href');
            console.log($(this).children('a').attr('href') + " - not relative link");
        } else {
            console.log($(this).children('a').attr('href') + " - relative link");
        }
          e.stopImmediatePropagation();
          setTimeout(function(){
            _this._hideAll();
          }, 0)
      });
  };
  Drilldown.prototype._show = function($elem){
    $elem.children('[data-submenu]').addClass('is-active');
  };
  Drilldown.prototype.getMaxHeight = function(){
    var max = 0, result = {};
    this.$submenus.each(function(){
      var numOfElems = $(this).children('li').length;
      max = numOfElems > max ? numOfElems : max;
    });
    // console.log('1',this.$menuItems[0].getBoundingClientRect().height);
    result.height = max * this.$menuItems[0].getBoundingClientRect().height + 'px';
    // result.width = this.$menuItems[0].getBoundingClientRect().width + 'px';
    result.width = this.options.maxWidth;

    return result;
  };
  Drilldown.prototype.destroy = function(){
    this._hideAll();
    this.$element.unwrap()
                 .find('.js-drilldown-back').remove()
                 .end().find('.is-active, .is-closing, .is-drilldown-sub').removeClass('is-active is-closing is-drilldown-sub')
                 .end().find('[data-submenu]').removeAttr('aria-hidden tabindex role')
                 .off('.zf.drilldown').end().off('zf.drilldown');

    this.$element.trigger('destroyed.zf.drilldown');
  };
  Foundation.plugin(Drilldown);
}(jQuery, window.Foundation);


// !function(Foundation, $) {
//   'use strict';
//
//   /**
//    * Creates a new instance of Drilldown.
//    * @class
//    * @fires Drilldown#init
//    * @param {jQuery} element - jQuery object to make into a drilldown menu.
//    * @param {Object} options - Overrides to the default plugin settings.
//    */
//   function Drilldown(element) {
//     this.$element = element;
//     this.options = $.extend({}, Drilldown.defaults, this.$element.data());
//     // this.$container = $();
//     // this.$currentMenu = this.$element;
//
//     this._init();
//
//     /**
//      * Fires when the plugin has been successfuly initialized.
//      * @event Drilldown#init
//      */
//     this.$element.trigger('init.zf.drilldown');
//   }
//
//   Drilldown.defaults = {
//     /**
//      * HTML to use for the back button at the top of each sub-menu.
//      * @option
//      * @sample '<li class="js-drilldown-back"><a>Back</a></li>'
//      */
//     backButton: '<li class="js-drilldown-back"><a>Back</a></li>'
//   };
//
//   Drilldown.prototype = {
//     /**
//      * Initializes the Drilldown by creating a container to wrap the Menu in, and initializing all submenus.
//      * @private
//      */
//     _init: function() {
//       console.log('yo');
//       this.$container = $('<div class="is-drilldown"></div>');
//       this.$container.css('width', this.$element.css('width'));
//       this.$element.wrap(this.$container);
//       this._prepareMenu(this.$element, true);
//     },
//
//     /**
//      * Scans a Menu for any sub Menus inside of it. This is a recursive function, so when a sub menu is found, this method will be called on that sub menu.
//      * @private
//      * @param {jQuery} $elem - Menu to scan for sub menus.
//      * @param {Boolean} root - If true, the menu being scanned is at the root level.
//      */
//     _prepareMenu: function($elem, root) {
//       var _this = this;
//
//       // Create a trigger to move up the menu. This is not used on the root-level menu, because it doesn't need a back button.
//       if (!root) {
//         var $backButton = $(_this.options.backButton);
//         $backButton.mouseup(function() {
//           _this.backward();
//         });
//         // console.log(_this.options.backButton);
//         $elem.prepend($backButton);
//       }
//
//       // Look for sub-menus inside the current one
//       $elem.children('li').each(function() {
//         var $submenu = $(this).children('[data-submenu]');
//
//         // If it exists...
//         if ($submenu.length) {
//           $submenu.addClass('is-drilldown-sub');
//
//           // Create a trigger to move down the menu
//           $(this).children('a').mouseup(function() {
//             _this.forward($submenu);
//             return false;
//           });
//
//           // We have to go deeper
//           _this._prepareMenu($submenu, false);
//         }
//       });
//     },
//
//     /**
//      * Moves down the drilldown by activating the menu specified in `$target`.
//      * @fires Drilldown#forward
//      * @param {jQuery} $target - Sub menu to activate.
//      */
//     forward: function($target) {
//       var _this = this;
//
//       Foundation.requestAnimationFrame(function() {
//         $target.addClass('is-active');
//         _this.$currentMenu = $target;
//
//         /**
//          * Fires when the menu is done moving forwards.
//          * @event Drilldown#forward
//          */
//         _this.$element.trigger('forward.zf.drilldown', [_this.$currentMenu]);
//       });
//     },
//
//     /**
//      * Moves up the drilldown by deactivating the current menu.
//      * @fires Drilldown#backward
//      */
//     backward: function() {
//       var _this = this;
//
//       Foundation.requestAnimationFrame(function() {
//         _this.$currentMenu.removeClass('is-active');
//         _this.$currentMenu = _this.$currentMenu.parents('[data-drilldown], [data-submenu]');
//
//         /**
//          * Fires when the menu is done moving backwards.
//          * @event Drilldown#backward
//          */
//         _this.$element.trigger('backward.zf.drilldown', [_this.$currentMenu]);
//       });
//     },
//
//     /**
//      * Destroys an instance of a drilldown. A callback can optionally be run when the process is finished.
//      * @param {Function} cb - Callback to run when the plugin is done being destroyed.
//      */
//     destroy: function(cb) {
//       this.$element.find('[data-submenu]').removeClass('is-drilldown-sub');
//       this.$currentMenu.removeClass('is-active');
//       this.$element.find('.is-drilldown-back').remove();
//       this.$element.removeData('zf-plugin');
//       this.$element.unwrap();
//
//       if (typeof cb === 'function') cb();
//     }
//   };
//
//   Foundation.plugin(Drilldown);
// }(window.Foundation, jQuery);
