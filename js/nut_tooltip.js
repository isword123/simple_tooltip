/*
 * This plugin is just used to show some kind of tips
 * This should be light weight and easy to use
 * Initial Date: 2013-09-16
 * Author: Zhijian Xia
 */


//This plugin is based on jQuery(mainly for 1.9.1 and above), this should be confirmed later

(function ($) {
    /*
     * define functions first
     */

    var counter = (function () {
        var count =  -1;

        return function () {
            return count++;
        };
    })();

    var nutUniqueID = function () {
        return 'nut-tooltip-' + counter();
    };

    var createElement = function () {
        var $outer = $('<div>').addClass('nut-tooltip-tip');
        var $inner = $('<div>').addClass('nut-tooltip-text');
        var $indicator = $('<div>').addClass('nut-tooltip-indicator');
        
        $outer.append($inner).append($indicator);

        return $outer;
    };

    var setText = function ($tip, text) {
        $tip.find('.nut-tooltip-text').text(text);
    };

    var setPosition = function ($tip, position) {
        $tip.removeClass('top bottom left right').addClass(position);
    };

    var setTextFromTarget = function ($tip, $target) {
        var tipText = $target.attr('data-nut-tip');
        tipText = tipText || '';

        setText($tip, tipText);
    };

    var clearTitle = function ($target) {
        var title = $target.attr('title');
        $target.attr('title', '');

        $target.attr('data-nut-old-title', title);
    };

    var resetTitle = function ($target) {
        var oldTitle = $target.attr('data-nut-old-title');

        $target.attr('data-nut-old-title', '');
        $target.attr('title', oldTitle);
    };

    var adjustPosition = function ($tip, $target, position) {
        var positionOfTarget = $target.offset(),
            widthOfTarget = $target.outerWidth(),
            heightOfTarget = $target.outerHeight(),
            widthOfTip = $tip.outerWidth(),
            heightOfTip = $tip.outerHeight(),
            styles = {};
        
        switch (position) {
            case 'top':
                styles.left = positionOfTarget.left + widthOfTarget / 2;
                styles.top = positionOfTarget.top - heightOfTip;
                break;
            case 'bottom':
                styles.left = positionOfTarget.left + widthOfTarget / 2;
                styles.top = positionOfTarget.top + heightOfTarget;
                break;
            case 'left':
                styles.left = positionOfTarget.left - widthOfTip;
                styles.top = positionOfTarget.top + heightOfTarget / 2;
                break;
            case 'right':
                styles.left = positionOfTarget.left + widthOfTarget;
                styles.top = positionOfTarget.top + heightOfTarget / 2;
                break;
            default:
                break;
        }

        $tip.css(styles);
    };

    var NutTooltip = (function (){
        var defaultOptions = {
            position: 'top',
            tip: '',
            trigger: 'now'//hover, click
        };

        // target can be anything that can be selected by jQuery to be a jQuery DOM object
        var tip = function (target, options) {
            this._options = $.extend({}, defaultOptions, options);
            this._$target = $(target);

            this._setupEvents();
        };

        tip.prototype._setupEvents = function () {
            //trigger: 'move'//for mouseover and mouse leave, we can add 'click' later
            if (this._options.trigger === 'hover') {
                this._bindHoverEvents();
            } else if (this._options.trigger === 'now') {
                this._initialElement();
            } else if (this._options.trigger === 'click') {

            }
        };

        tip.prototype._initialElement = function () {

            clearTitle(this._$target);

            $tip = createElement(); 
            setPosition($tip, this._options.position);
            setText($tip, this._options.tip);
            
            $(document.body).append($tip);
            adjustPosition($tip, this._$target, this._options.position);

            this._$tip = $tip;
        };

        tip.prototype._bindHoverEvents = function () {
            var self = this;

            this._$target.on('mouseenter', function (e) {
                self._initialElement();

                return false;
            });

            this._$target.on('mouseleave', function (e) {
                resetTitle(self._$target);

                if (self._$tip) {
                    self._$tip.remove();
                    self._$tip = undefined;
                }

                return false;
            });
        };

        tip.prototype.clearTip = function () {
            //TODO, hide tip element, unbind all events
        };

        return tip;
    })();

    $.fn.nuttip = function () {
        var $this = $(this);
        var originTipObject = $this.data('nut-tip-object');
        if (originTipObject) {
            originTipObject.clearTip();
        }

        var parsedOptions = {};
        parsedOptions.position = $this.attr('data-nut-position');
        parsedOptions.tip = $this.attr('data-nut-tip');
        parsedOptions.trigger = $this.attr('data-nut-trigger');

        var tipObject = new NutTooltip($this, parsedOptions);
        $this.data('nut-tip-object', tipObject);
    };

    $.nuttip = function ($target) {
        $($target).nuttip();
    };

    /*
     * For every dom element that will show with the nut_tooltip plugin, it should:
     * (required) contains a 'rel' attribute that is 'nut-tooltip'
     * (required) contains a 'data-nut-tip' attribute that contains the info to show among tooltip
     * (optional) contains a 'data-nut-position' attribute that indicate where the arrow indicator is shown
       There are four values for now, 'top', 'right', 'bottom' and 'left', the default is 'top'
     */

    /*
     * Add initial part when document loaded
     */

    $(function () {
        $('[rel="nut-tooltip"]').nuttip();
    });

})(jQuery);
