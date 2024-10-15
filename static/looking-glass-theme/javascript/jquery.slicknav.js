;(function ($lg, document, window) {
    var
    // default settings object.
        defaults = {
            label: 'MENU',
            duplicate: true,
            duration: 200,
            easingOpen: 'swing',
            easingClose: 'swing',
            closedSymbol: '&#9658;',
            openedSymbol: '&#9660;',
            prependTo: 'body',
            appendTo: '',
            parentTag: 'a',
            closeOnClick: false,
            allowParentLinks: true,
            nestedParentLinks: true,
            showChildren: false,
            removeIds: false,
            removeClasses: false,
			brand: '',
            init: function () {},
            beforeOpen: function () {},
            beforeClose: function () {},
            afterOpen: function () {},
            afterClose: function () {}
        },
        mobileMenu = 'slicknav',
        prefix = 'slicknav';

    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $lg.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = mobileMenu;

        this.init();
    }

    Plugin.prototype.init = function () {
        var $lgthis = this,
            menu = $lg(this.element),
            settings = this.settings,
            iconClass,
            menuBar;

        // clone menu if needed
        if (settings.duplicate) {
            $lgthis.mobileNav = menu.clone();
            //remove ids from clone to prevent css issues
            $lgthis.mobileNav.removeAttr('id');
            $lgthis.mobileNav.find('*').each(function (i, e) {
                $lg(e).removeAttr('id');
            });
        } else {
            $lgthis.mobileNav = menu;

            // remove ids if set
            $lgthis.mobileNav.removeAttr('id');
            $lgthis.mobileNav.find('*').each(function (i, e) {
                $lg(e).removeAttr('id');
            });
        }

        // remove classes if set
        if (settings.removeClasses) {
            $lgthis.mobileNav.removeAttr('class');
            $lgthis.mobileNav.find('*').each(function (i, e) {
                $lg(e).removeAttr('class');
            });
        }

        // styling class for the button
        iconClass = prefix + '_icon';

        if (settings.label === '') {
            iconClass += ' ' + prefix + '_no-text';
        }

        if (settings.parentTag == 'a') {
            settings.parentTag = 'a href="#"';
        }

        // create menu bar
        $lgthis.mobileNav.attr('class', prefix + '_nav');
        menuBar = $lg('<div class="' + prefix + '_menu"></div>');
		if (settings.brand !== '') {
			var brand = $lg('<div class="' + prefix + '_brand">'+settings.brand+'</div>');
			$lg(menuBar).append(brand);
		}
        $lgthis.btn = $lg(
            ['<' + settings.parentTag + ' aria-haspopup="true" tabindex="0" class="' + prefix + '_btn ' + prefix + '_collapsed">',
                '<span class="' + prefix + '_menutxt">' + settings.label + '</span>',
                '<span class="' + iconClass + '">',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                '</span>',
            '</' + settings.parentTag + '>'
            ].join('')
        );
        $lg(menuBar).append($lgthis.btn);
        if(settings.appendTo !== '') {
            $lg(settings.appendTo).append(menuBar);
        } else {
            $lg(settings.prependTo).prepend(menuBar);
        }
        menuBar.append($lgthis.mobileNav);

        // iterate over structure adding additional structure
        var items = $lgthis.mobileNav.find('li');
        $lg(items).each(function () {
            var item = $lg(this),
                data = {};
            data.children = item.children('ul').attr('role', 'menu');
            item.data('menu', data);

            // if a list item has a nested menu
            if (data.children.length > 0) {

                // select all text before the child menu
                // check for anchors

                var a = item.contents(),
                    containsAnchor = false,
                    nodes = [];

                $lg(a).each(function () {
                    if (!$lg(this).is('ul')) {
                        nodes.push(this);
                    } else {
                        return false;
                    }

                    if($lg(this).is("a")) {
                        containsAnchor = true;
                    }
                });

                var wrapElement = $lg(
                    '<' + settings.parentTag + ' role="menuitem" aria-haspopup="true" tabindex="-1" class="' + prefix + '_item"/>'
                );

                // wrap item text with tag and add classes unless we are separating parent links
                if ((!settings.allowParentLinks || settings.nestedParentLinks) || !containsAnchor) {
                    var $lgwrap = $lg(nodes).wrapAll(wrapElement).parent();
                    $lgwrap.addClass(prefix+'_row');
                } else
                    $lg(nodes).wrapAll('<span class="'+prefix+'_parent-link '+prefix+'_row"/>').parent();

                if (!settings.showChildren) {
                    item.addClass(prefix+'_collapsed');
                } else {
                    item.addClass(prefix+'_open');
                }

                item.addClass(prefix+'_parent');

                // create parent arrow. wrap with link if parent links and separating
                var arrowElement = $lg('<span class="'+prefix+'_arrow">'+(settings.showChildren?settings.openedSymbol:settings.closedSymbol)+'</span>');

                if (settings.allowParentLinks && !settings.nestedParentLinks && containsAnchor)
                    arrowElement = arrowElement.wrap(wrapElement).parent();

                //append arrow
                $lg(nodes).last().after(arrowElement);


            } else if ( item.children().length === 0) {
                 item.addClass(prefix+'_txtnode');
            }

            // accessibility for links
            item.children('a').attr('role', 'menuitem').click(function(event){
                //Ensure that it's not a parent
                if (settings.closeOnClick && !$lg(event.target).parent().closest('li').hasClass(prefix+'_parent')) {
                        //Emulate menu close if set
                        $lg($lgthis.btn).click();
                    }
            });

            //also close on click if parent links are set
            if (settings.closeOnClick && settings.allowParentLinks) {
                item.children('a').children('a').click(function (event) {
                    //Emulate menu close
                    $lg($lgthis.btn).click();
                });

                item.find('.'+prefix+'_parent-link a:not(.'+prefix+'_item)').click(function(event){
                    //Emulate menu close
                        $lg($lgthis.btn).click();
                });
            }
        });

        // structure is in place, now hide appropriate items
        $lg(items).each(function () {
            var data = $lg(this).data('menu');
            if (!settings.showChildren){
                $lgthis._visibilityToggle(data.children, null, false, null, true);
            }
        });

        // finally toggle entire menu
        $lgthis._visibilityToggle($lgthis.mobileNav, null, false, 'init', true);

        // accessibility for menu button
        $lgthis.mobileNav.attr('role','menu');

        // outline prevention when using mouse
        $lg(document).mousedown(function(){
            $lgthis._outlines(false);
        });

        $lg(document).keyup(function(){
            $lgthis._outlines(true);
        });

        // menu button click
        $lg($lgthis.btn).click(function (e) {
            e.preventDefault();
            $lgthis._menuToggle();
        });

        // click on menu parent
        $lgthis.mobileNav.on('click', '.' + prefix + '_item', function (e) {
            e.preventDefault();
            $lgthis._itemClick($lg(this));
        });

        // check for enter key on menu button and menu parents
        $lg($lgthis.btn).keydown(function (e) {
            var ev = e || event;
            if(ev.keyCode == 13) {
                e.preventDefault();
                $lgthis._menuToggle();
            }
        });

        $lgthis.mobileNav.on('keydown', '.'+prefix+'_item', function(e) {
            var ev = e || event;
            if(ev.keyCode == 13) {
                e.preventDefault();
                $lgthis._itemClick($lg(e.target));
            }
        });

        // allow links clickable within parent tags if set
        if (settings.allowParentLinks && settings.nestedParentLinks) {
            $lg('.'+prefix+'_item a').click(function(e){
                    e.stopImmediatePropagation();
            });
        }
    };

    //toggle menu
    Plugin.prototype._menuToggle = function (el) {
        var $lgthis = this;
        var btn = $lgthis.btn;
        var mobileNav = $lgthis.mobileNav;

        if (btn.hasClass(prefix+'_collapsed')) {
            btn.removeClass(prefix+'_collapsed');
            btn.addClass(prefix+'_open');
        } else {
            btn.removeClass(prefix+'_open');
            btn.addClass(prefix+'_collapsed');
        }
        btn.addClass(prefix+'_animating');
        $lgthis._visibilityToggle(mobileNav, btn.parent(), true, btn);
    };

    // toggle clicked items
    Plugin.prototype._itemClick = function (el) {
        var $lgthis = this;
        var settings = $lgthis.settings;
        var data = el.data('menu');
        if (!data) {
            data = {};
            data.arrow = el.children('.'+prefix+'_arrow');
            data.ul = el.next('ul');
            data.parent = el.parent();
            //Separated parent link structure
            if (data.parent.hasClass(prefix+'_parent-link')) {
                data.parent = el.parent().parent();
                data.ul = el.parent().next('ul');
            }
            el.data('menu', data);
        }
        if (data.parent.hasClass(prefix+'_collapsed')) {
            data.arrow.html(settings.openedSymbol);
            data.parent.removeClass(prefix+'_collapsed');
            data.parent.addClass(prefix+'_open');
            data.parent.addClass(prefix+'_animating');
            $lgthis._visibilityToggle(data.ul, data.parent, true, el);
        } else {
            data.arrow.html(settings.closedSymbol);
            data.parent.addClass(prefix+'_collapsed');
            data.parent.removeClass(prefix+'_open');
            data.parent.addClass(prefix+'_animating');
            $lgthis._visibilityToggle(data.ul, data.parent, true, el);
        }
    };

    // toggle actual visibility and accessibility tags
    Plugin.prototype._visibilityToggle = function(el, parent, animate, trigger, init) {
        var $lgthis = this;
        var settings = $lgthis.settings;
        var items = $lgthis._getActionItems(el);
        var duration = 0;
        if (animate) {
            duration = settings.duration;
        }

        if (el.hasClass(prefix+'_hidden')) {
            el.removeClass(prefix+'_hidden');
             //Fire beforeOpen callback
                if (!init) {
                    settings.beforeOpen(trigger);
                }
            el.slideDown(duration, settings.easingOpen, function(){

                $lg(trigger).removeClass(prefix+'_animating');
                $lg(parent).removeClass(prefix+'_animating');

                //Fire afterOpen callback
                if (!init) {
                    settings.afterOpen(trigger);
                }
            });
            el.attr('aria-hidden','false');
            items.attr('tabindex', '0');
            $lgthis._setVisAttr(el, false);
        } else {
            el.addClass(prefix+'_hidden');

            //Fire init or beforeClose callback
            if (!init){
                settings.beforeClose(trigger);
            }

            el.slideUp(duration, this.settings.easingClose, function() {
                el.attr('aria-hidden','true');
                items.attr('tabindex', '-1');
                $lgthis._setVisAttr(el, true);
                el.hide(); //jQuery 1.7 bug fix

                $lg(trigger).removeClass(prefix+'_animating');
                $lg(parent).removeClass(prefix+'_animating');

                //Fire init or afterClose callback
                if (!init){
                    settings.afterClose(trigger);
                } else if (trigger == 'init'){
                    settings.init();
                }
            });
        }
    };

    // set attributes of element and children based on visibility
    Plugin.prototype._setVisAttr = function(el, hidden) {
        var $lgthis = this;

        // select all parents that aren't hidden
        var nonHidden = el.children('li').children('ul').not('.'+prefix+'_hidden');

        // iterate over all items setting appropriate tags
        if (!hidden) {
            nonHidden.each(function(){
                var ul = $lg(this);
                ul.attr('aria-hidden','false');
                var items = $lgthis._getActionItems(ul);
                items.attr('tabindex', '0');
                $lgthis._setVisAttr(ul, hidden);
            });
        } else {
            nonHidden.each(function(){
                var ul = $lg(this);
                ul.attr('aria-hidden','true');
                var items = $lgthis._getActionItems(ul);
                items.attr('tabindex', '-1');
                $lgthis._setVisAttr(ul, hidden);
            });
        }
    };

    // get all 1st level items that are clickable
    Plugin.prototype._getActionItems = function(el) {
        var data = el.data("menu");
        if (!data) {
            data = {};
            var items = el.children('li');
            var anchors = items.find('a');
            data.links = anchors.add(items.find('.'+prefix+'_item'));
            el.data('menu', data);
        }
        return data.links;
    };

    Plugin.prototype._outlines = function(state) {
        if (!state) {
            $lg('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
        } else {
            $lg('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
        }
    };

    Plugin.prototype.toggle = function(){
        var $lgthis = this;
        $lgthis._menuToggle();
    };

    Plugin.prototype.open = function(){
        var $lgthis = this;
        if ($lgthis.btn.hasClass(prefix+'_collapsed')) {
            $lgthis._menuToggle();
        }
    };

    Plugin.prototype.close = function(){
        var $lgthis = this;
        if ($lgthis.btn.hasClass(prefix+'_open')) {
            $lgthis._menuToggle();
        }
    };

    $lg.fn[mobileMenu] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted, instantiate a new instance
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once due to methods
                if (!$lg.data(this, 'plugin_' + mobileMenu)) {

                    // if it has no instance, create a new one, pass options to our plugin constructor,
                    // and store the plugin instance in the elements jQuery data object.
                    $lg.data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
                }
            });

        // If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call to make it possible to return a value
            var returns;

            this.each(function () {
                var instance = $lg.data(this, 'plugin_' + mobileMenu);

                // Tests that there's already a plugin-instance and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance, and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });

            // If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };
}($lg, document, window));
