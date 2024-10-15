/*=======================
Author @mitKumarSinha
Last modified by : @mitKumarSinha
Date : Jan/08/2015
=======================*/
if (typeof jQuery === "undefined") {
    throw new Error("Please add jQuery")
}
winWidth = jQuery(window).width();
var wWid = jQuery(window).width() - 300;
var $lg = jQuery.noConflict(true);
(function($, l) { //Start
    $lg.fn.lgDropdown = function() {
        var getDropdownInstance = this;
        this.each(function() {
            $lg(this).append('<div class="down-arrow" />');
            $lg(this).on('click', function(e) {
                $lg('.child-menu').css('top', '-999em');
                $lg('.up-arrow').removeClass('up-arrow').addClass('down-arrow');
                var getLinkPositionFromTop = $lg(this).outerHeight();
                var getChildUlWidth = $lg('> ul', this).outerWidth();
                var getChildUlDistanceFromLeft = $lg('> ul', this).offset().left + getChildUlWidth;
                if (wWid > 300) {
                    if (getChildUlDistanceFromLeft >= wWid) {
                        $lg(this).addClass('near-to-edge');
                    }
                } else {
                    $lg(this).addClass('small-screen');
                }
                $lg('.down-arrow', this).removeClass('down-arrow').addClass('up-arrow');
                $lg('ul:first', this).css({
                    top: getLinkPositionFromTop,
                    display: 'block'
                });

                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgMultiDropdown = function() {
        $lg(this).append('<div class="right-arrow" />');
        $lg(this).click(function(e) {
            $lg(this).css({
                position: 'relative'
            });
            var getUlPositionFromLeft = $lg('ul:first', this).offset().left;
            if (getUlPositionFromLeft >= wWid) {
                $lg('ul:first', this).css({
                    top: '0px'
                });
            } else {
                $lg('ul:first', this).css({
                    top: '0px',
                    left: '160px',
                    display: 'block'
                });
            }
            e.stopPropagation();
        });
    }
    $lg.fn.lgBtnDropdown = function() {
        var getBtnDropdownInstance = this;
        this.each(function() {
            $lg(this).append('<div class="down-arrow" />');
            $lg(this).click(function(e) {
                var getMenuPositionFromTop = $lg(this).outerHeight() + 1;
                var getMenuParentPositionFromleft = $lg(this).parent().offset().left;
                var getMenuPositionFromleft = $lg(this).offset().left - getMenuParentPositionFromleft;
                e.preventDefault();
                $lg('html').trigger('click');
                $lg('.down-arrow', this).removeClass('down-arrow').addClass('up-arrow');
                $lg(this).next('ul').css({
                    top: getMenuPositionFromTop,
                    left: getMenuPositionFromleft
                });
                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgTabs = function() {
        var getTabInstance = this;
        this.each(function() {
            $lg('.tab-content-container .tab-content', this).not(":first").hide();
            $lg('ul.tabs li:first', this).addClass("current").show();
            $lg('ul.tabs li', this).click(function(e) {
                if ($lg(this).attr('class') != 'link') {
                    e.preventDefault();
                }
                $lg('html').trigger('click');
                $lg(this).parent('ul').children('li').removeClass("current");
                $lg(this).addClass("current");
                if ($lg(this).hasClass("tab-menu")) {
                    return;
                } else {
                    $lg(this).parents().children('.tab-content-container').children('.tab-content').hide();
                    $lg($lg('a', this).attr("href")).fadeIn('slow');
                }
                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgTabMenu = function() {
        var getTabMenuInstance = this;
        this.each(function() {
            $lg(this).append('<div class="down-arrow" />');
            $lg(this).click(function(e) {
                e.preventDefault();
                $lg('.up-arrow').removeClass('up-arrow').addClass('down-arrow');
                $lg('.down-arrow', this).removeClass('down-arrow').addClass('up-arrow');
                $lg(this).css({
                    position: 'relative'
                });
                $lg('ul:first', this).css({
                    top: '30px'
                });
                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgAccordion = function() {
        var getAccordionInstance = this;
        this.each(function() {
            $lg('.accordion-content', this).not(":first").hide();
            $lg('.accordion-header a', this).click(function(e) {
                e.preventDefault();
                $lg(this).parents().children('.accordion-content').slideUp(300);
                $lg(this).parent().next('.accordion-content').slideToggle(300);
                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgShowHide = function() {
        var getShowHideInstance = this;
        this.each(function() {
            var getOpenAllClass = $lg(this).attr('class');
            if (getOpenAllClass.indexOf("open-all") != -1) {} else {
                $lg('.show-hide-content', this).not(":first").hide();
            }
            $lg('.show-hide-header a', this).click(function(e) {
                e.preventDefault();
                $lg(this).parent().next('.show-hide-content').slideToggle(300);
                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgTooltip = function() {
        var getlgTooltipInstance = this;
        this.each(function() {
            $lg(this).hover(function(e) {
                var getTipPositionFromTop = $lg(this).offset().top - 40;
                var getTipOuterPositionFromLeft = $lg(this).outerWidth() / 2;
                var getTipPositionFromLeft = $lg(this).offset().left + getTipOuterPositionFromLeft;
                var getToolTip = $lg(this).attr('data-tooltip-content');
                $lg('body').append('<div class="tooltip-message" style="top:' + getTipPositionFromTop + 'px; left:' + getTipPositionFromLeft + 'px;">' + getToolTip + '<b class="down-tip-arrow" /></div>');
                e.stopPropagation();
            }, function() {
                $lg('.tooltip-message').fadeOut();
            });
        });
    }
    $lg.fn.lgPopUp = function() {
        var getPopUpInstance = this;
        this.each(function() {
            $lg(this).click(function(e) {
                e.preventDefault();
                var getPopUpId = $lg(this).attr('href');
                var getDataType = $lg(this).attr('data-popup-type');
                if (getDataType == 'modal') {
                    $lg('body').append('<div class="overlay" />').css('overflow', 'hidden');
                }
                $lg(getPopUpId).addClass('show-popup');
                $lg(getPopUpId).animate({
                    opacity: "1"
                }, 800);
                e.stopPropagation();
            });
        });
        $lg(".close-popup a").click(function(e) {
            e.preventDefault();
            $lg('.popup').animate({
                opacity: "0"
            }, 800, function() {
                $lg(this).removeClass('show-popup');
                $lg('.overlay').remove();
            });
            e.stopPropagation();
        });
        $lg('.overlay').on("click", function() {
            $lg(".close-popup a").trigger('click');
        });
    }
    $lg.fn.lgSmartNav = function() {
        var getSmartNavInstance = this;
        this.each(function() {
            var navFirstChild = $lg('> li:first-child', this);
            var navLastChild = $lg('> li:last-child', this);
            var getUlOuterWidth = $lg(this).outerWidth();
            var getLastChildDistance = navLastChild.offset().top;
            var getFirstChildDistance = navFirstChild.offset().top;
            var myArray = [];
            var i;
            for (i = getLastChildDistance; i > getFirstChildDistance; i--) {
                if (i > getFirstChildDistance) {
                    navLastChild = $lg('> li:last-child', this);
                    var getLastChild = navLastChild.html();
                    myArray.push(getLastChild);
                    getLastChildDistance = navLastChild.offset().top;
                    $lg(navLastChild).remove();
                    if (getLastChildDistance <= getFirstChildDistance) {
                        $lg(this).append('<li class="dropdown last-menu"><a href="javascript:void(0)"><span class="line">more</span><span class="line">more</span><span class="line">more</span></a><ul class="child-menu open-left smenu"> </ul></li>');
                        $lg('.smenu', this).append(myArray.reverse().join('<li>'));
                        $lg('.smenu > a:first-child', this).wrap('<li>');
                        $lg('.smenu li a.dropdown_menu', this).parent().addClass('multi-dropdown');
                        $lg('.dropdown', this).lgDropdown();
                        $lg('.multi-dropdown', this).lgMultiDropdown();
                        break;
                    }
                }
            }
        });
    }
    $lg.fn.lgResponsiveTabs = function() {
        var getResponsivetabs = this;
        this.each(function() {
            $lg(this).click(function(e) {
                e.preventDefault();
                $lg('.rpe-tabs').removeAttr('style')
                $lg(this).parent('.rpe-tabs').css('zIndex', '100');
                $lg(this).next('ul').toggle();
                e.stopPropagation();
            });
        });
    }
    $lg.fn.lgTopBar = function() {
        var getTopBar = this;
        this.each(function() {
            $lg(this).click(function(e) {
                e.preventDefault();
                var getTargetContainer = $lg(this).attr('href');
                var getInnerTabId = $lg(this).attr('data-target-tab');
                $lg(getTargetContainer).animate({
                    top: "0px"
                }, 800);
                $lg('#' + getInnerTabId + ' a').trigger('click');
            });
        });
    }
    $lg.fn.closePanel = function() {
        var getClosePanel = this;
        this.each(function() {
            $lg(this).click(function(e) {
                e.preventDefault();
                $lg(this).parent().animate({
                    top: "-360px"
                }, 800);
            });
        });
    }
    $lg.fn.lgToggle = function() {
        var getlgToggleInstance = this;
        this.each(function() {
            $lg(this).click(function(e) {
                e.preventDefault();
                var getToggleBlock = $lg(this).attr('href');
                var getToggleLinkOuterHeight = $lg(this).outerHeight() + 10;
                var getToggleLinkPositionFromTop = $lg(this).offset().top + getToggleLinkOuterHeight;
                var getToggleOuterPositionFromLeft = $lg(this).outerWidth() / 2;
                var getToggleLinkPositionFromLeft = $lg(this).offset().left + getToggleOuterPositionFromLeft;
                $lg(this).toggleClass('show-block');
                $lg('.toggle-up-arrow').css({
                    left: getToggleLinkPositionFromLeft - getToggleLinkOuterHeight
                })
                $lg(getToggleBlock).css({
                    top: getToggleLinkPositionFromTop,
                    left: getToggleLinkPositionFromLeft
                });
                $lg(getToggleBlock).toggle();
                e.stopPropagation();
            });
        });
    }
    $lg.fn.closeAll = function() {
        $lg(this).click(function() {
            //e.preventDefault();        
            $lg('.dropdown ul, .multi-dropdown ul, .tab-menu ul, .btn-grp ul').css({
                top: '-999em',
                display: 'none'
            });
            $lg('.up-arrow').removeClass('up-arrow').addClass('down-arrow');
            $lg('.show-block').trigger('click');
            //  $lg('.rpe-tabs ul').hide();

            //e.stopPropagation();
        });
    }
    var lgSlider = function() { // Slider function start
        //  Set up our elements
        this.el = l;
        this.items = l;

        //  Dimensions
        this.sizes = [];
        this.max = [0, 0];

        //  Current inded
        this.current = 0;

        //  Start/stop timer
        this.interval = l;

        //  Set some options
        this.opts = {
            speed: 700,
            delay: 5000, // f for no autoplay
            complete: l, // when a slide's finished
            keys: true, // keyboard shortcuts - disable if it breaks things
            dots: true,
            arrows: true, // display <- -> pagination
            fluid: true // is it a percentage width?,
        };

        var _ = this;

        this.init = function(el, opts) {
            this.el = el;
            this.ul = el.children('ul');
            this.max = [el.outerWidth(), el.outerHeight()];
            this.items = this.ul.children('li').each(this.calculate);

            this.opts = $lg.extend(this.opts, opts);

            this.setup();

            return this;
        };


        this.calculate = function(index) {
            var me = $lg(this),
                width = me.outerWidth(),
                height = me.outerHeight();

            _.sizes[index] = [width, height];

            //  Set the max values
            if (width > _.max[0]) _.max[0] = width;
            if (height > _.max[1]) _.max[1] = height;
        };

        this.setup = function() {
            this.el.css({
                overflow: 'hidden',
                width: _.max[0],
                height: this.items.first().outerHeight()
            });

            this.ul.css({
                width: (this.items.length * 100) + '%',
                position: 'relative'
            });
            this.items.css('width', (100 / this.items.length) + '%');

            if (this.opts.delay !== l) {
                this.start();
                this.el.hover(this.stop, this.start);
            }

            this.opts.keys && $lg(document).keydown(this.keys);

            this.opts.dots && this.dots();

            if (this.opts.fluid) {
                var resize = function() {
                    _.el.css('width', Math.min(Math.round((_.el.outerWidth() / _.el.parent().outerWidth()) * 100), 100) + '%');

                };

                resize();
                $lg(window).resize(resize);
            }

            if (this.opts.arrows) {
                this.el.append('<a class="prev" href="javascript:void(0)"> <em class="fa fa-chevron-left"></em></a> <a href="javascript:void(0)" class="next"> <em class="fa fa-chevron-right"></em> </a>').find('a.prev, a.next').click(function() {
                    $lg.isFunction(_[this.className]) && _[this.className]();
                });
            };

            if ($lg.event.special.swipe || $lg.event.special.swipe) {
                this.el.on('swipeleft', _.prev).on('swiperight', _.next);
            }
        };

        this.move = function(index, cb) {
            if (!this.items.eq(index).length) index = 0;
            if (index < 0) index = (this.items.length - 1);

            var target = this.items.eq(index);
            var obj = {
                height: target.outerHeight()
            };
            var speed = cb ? 5 : this.opts.speed;

            if (!this.ul.is(':animated')) {
                _.el.find('.lg-slide-dot:eq(' + index + ')').addClass('active').siblings().removeClass('active');

                this.el.animate(obj, speed) && this.ul.animate($lg.extend({
                    left: '-' + index + '00%'
                }, obj), speed, function(data) {
                    _.current = index;
                    $lg.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
                });
            }
        };

        this.start = function() {
            _.interval = setInterval(function() {
                _.move(_.current + 1);
            }, _.opts.delay);
        };

        this.stop = function() {
            _.interval = clearInterval(_.interval);
            return _;
        };

        this.keys = function(e) {
            var key = e.which;
            var map = {
                //  Prev/next
                37: _.prev,
                39: _.next,

                //  Esc
                27: _.stop
            };

            if ($lg.isFunction(map[key])) {
                map[key]();
            }
        };

        this.next = function() {
            return _.stop().move(_.current + 1)
        };
        this.prev = function() {
            return _.stop().move(_.current - 1)
        };

        this.dots = function() {
            var html = '<ol class="lg-slide-dots">';
            $lg.each(this.items, function(index) {
                html += '<li class="lg-slide-dot' + (index < 1 ? ' active' : '') + '">' + (index + 1) + '</li>';
            });
            html += '</ol>';

            this.el.addClass('has-dots').append(html).find('.lg-slide-dot').click(function() {
                _.move($lg(this).index());
            });
        };
    };

    $lg.fn.lgSlider = function(o) {
        var len = this.length;

        return this.each(function(index) {
            var me = $lg(this);
            var instance = (new lgSlider).init(me, o);

            me.data('lgSlider' + (len > 1 ? '-' + (index + 1) : ''), instance);
        });
    };
}(jQuery, false)); //End

$lg(document).on('click', ".hide-lg-menu", function() {
    //	alert("Clicked");
    $lg('ul:first', this).css({
        display: 'none'
    });
    $lg(this).attr('id', 'show-lg-menu');
});