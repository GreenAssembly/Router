var $jlTwC$swchelpers = require("@swc/helpers");
var $jlTwC$regeneratorruntime = require("regenerator-runtime");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", function () { return $fe485ef4b9064f7a$export$2e2bcd8739ae039; });


var $fe485ef4b9064f7a$var$Event = /*#__PURE__*/ function() {
    "use strict";
    function $fe485ef4b9064f7a$var$Event() {
        $jlTwC$swchelpers.classCallCheck(this, $fe485ef4b9064f7a$var$Event);
        _events.set(this, {
            writable: true,
            value: new Map()
        });
    }
    $jlTwC$swchelpers.createClass($fe485ef4b9064f7a$var$Event, [
        {
            key: "on",
            value: function on(event_name, callback) {
                $jlTwC$swchelpers.classPrivateFieldGet(this, _events).set(event_name, callback);
            }
        },
        {
            key: "fire",
            value: function fire(event_name) {
                var args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
                if ($jlTwC$swchelpers.classPrivateFieldGet(this, _events).has(event_name)) $jlTwC$swchelpers.classPrivateFieldGet(this, _events).get(event_name).apply(this, $jlTwC$swchelpers.toConsumableArray(args));
            }
        }
    ]);
    return $fe485ef4b9064f7a$var$Event;
}();
var _events = new WeakMap();
var $fe485ef4b9064f7a$var$Route = /*#__PURE__*/ function(Event) {
    "use strict";
    $jlTwC$swchelpers.inherits($fe485ef4b9064f7a$var$Route, Event);
    var _super = $jlTwC$swchelpers.createSuper($fe485ef4b9064f7a$var$Route);
    function $fe485ef4b9064f7a$var$Route(title, frames, scripts, links) {
        $jlTwC$swchelpers.classCallCheck(this, $fe485ef4b9064f7a$var$Route);
        var _this;
        _this = _super.call(this);
        _this.title = title;
        _this.last_loaded_time = new Date();
        _this.frames = frames;
        _this.scripts = scripts;
        _this.links = links;
        return _this;
    }
    $jlTwC$swchelpers.createClass($fe485ef4b9064f7a$var$Route, [
        {
            key: "render",
            value: function render(router) {
                var _this = this;
                this.last_loaded_time = new Date();
                document.title = this.title;
                window.scrollTo(0, 0);
                // Load all scripts and stylesheets
                var loadings = [];
                this.links.forEach(function(href) {
                    loadings.push(new Promise(function(resolve, _) {
                        var link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('href', href);
                        link.onload = resolve;
                        document.head.appendChild(link);
                    }));
                });
                this.scripts.forEach(function(src) {
                    loadings.push(new Promise(function(resolve, _) {
                        var script = document.createElement('script');
                        script.setAttribute('type', 'text/javascript');
                        script.setAttribute('src', src);
                        script.onload = resolve;
                        document.head.appendChild(script);
                    }));
                });
                // When all scrips and stylesheets are loaded then render frames
                Promise.all(loadings).then(function() {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = document.querySelectorAll('ga-frame')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var frame = _step.value;
                            var frame_name = frame.getAttribute('name');
                            if (_this.frames.has(frame_name)) {
                                var page_frame = _this.frames.get(frame_name);
                                frame.innerHTML = page_frame;
                                // TODO : bind follow behavior to frame links
                                $fe485ef4b9064f7a$var$Route.init_links(frame, router);
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    _this.fire('mount');
                    // TODO : router.fire('change');
                    router.fire('change');
                });
            }
        },
        {
            key: "clean",
            value: function clean() {
                this.links.forEach(function(href) {
                    return document.head.querySelector("link[href=\"".concat(href, "\"]")).remove();
                });
                this.scripts.forEach(function(src) {
                    document.head.querySelector("script[src=\"".concat(src, "\"]")).remove();
                });
            }
        }
    ], [
        {
            key: "init_links",
            value: function init_links(frame, router) {
                frame.querySelectorAll('[o-follow]').forEach(function(link) {
                    var o_follow = link.getAttribute('o-follow');
                    var href = link.getAttribute('href').substr(1);
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        // Cannot click on link which target the same location as the current
                        if (href === router.current_path) return;
                        router.fire('loading');
                        var prev_url = router.current_path;
                        history.pushState({
                        }, null, href);
                        router.pages.get(prev_url).clean();
                        router.push(href);
                    });
                    // Only bind event on follow link which have preload-once or preload value
                    if ([
                        'preload-once',
                        'preload'
                    ].includes(o_follow)) link.addEventListener('mouseover', function() {
                        if (o_follow === 'preload-once') {
                            if (!router.pages.has(href)) router.handle_url(href, true, false);
                        } else if (o_follow === 'preload') router.handle_url(href, false, false);
                    });
                });
            }
        }
    ]);
    return $fe485ef4b9064f7a$var$Route;
}($jlTwC$swchelpers.wrapNativeSuper($fe485ef4b9064f7a$var$Event));
var $fe485ef4b9064f7a$var$extract_scripts = function(doc) {
    return $jlTwC$swchelpers.toConsumableArray(doc.querySelectorAll('script')).filter(function(script) {
        return script.getAttribute('o-no-load') === null && script.getAttribute('src') !== null;
    }).map(function(script) {
        return script.attributes.src.nodeValue;
    });
};
var $fe485ef4b9064f7a$var$extract_stylesheets = function(doc) {
    return $jlTwC$swchelpers.toConsumableArray(doc.querySelectorAll('head > link[rel=stylesheet]')).filter(function(link) {
        return link.getAttribute('o-no-load') === null;
    }).map(function(link) {
        return link.attributes.href.nodeValue;
    });
};
var $fe485ef4b9064f7a$var$extract_frames = function(doc) {
    return new Map($jlTwC$swchelpers.toConsumableArray(doc.querySelectorAll('ga-frame')).map(function(frame) {
        return [
            frame.getAttribute('name'),
            frame.innerHTML
        ];
    }));
};
var _parse = new WeakSet();
var $fe485ef4b9064f7a$export$2e2bcd8739ae039 = /*#__PURE__*/ function(Event) {
    "use strict";
    $jlTwC$swchelpers.inherits($fe485ef4b9064f7a$export$2e2bcd8739ae039, Event);
    var _super = $jlTwC$swchelpers.createSuper($fe485ef4b9064f7a$export$2e2bcd8739ae039);
    function $fe485ef4b9064f7a$export$2e2bcd8739ae039() {
        $jlTwC$swchelpers.classCallCheck(this, $fe485ef4b9064f7a$export$2e2bcd8739ae039);
        var _this;
        _this = _super.call(this);
        _cache.set($jlTwC$swchelpers.assertThisInitialized(_this), {
            writable: true,
            value: new Map()
        });
        _parser.set($jlTwC$swchelpers.assertThisInitialized(_this), {
            writable: true,
            value: new DOMParser()
        });
        _init.set($jlTwC$swchelpers.assertThisInitialized(_this), {
            writable: true,
            value: false
        });
        _parse.add($jlTwC$swchelpers.assertThisInitialized(_this));
        // Init current page now to allow to link some events
        var current_page = new $fe485ef4b9064f7a$var$Route(null, null, null, null);
        $jlTwC$swchelpers.classPrivateFieldGet(_this, _cache).set(_this.current_path, current_page);
        // Init behavior when DOM is mounted
        document.addEventListener('readystatechange', function(e) {
            // e.target.readyState === 'interactive' || 
            if (e.target.readyState === 'complete' && !$jlTwC$swchelpers.classPrivateFieldGet($jlTwC$swchelpers.assertThisInitialized(_this), _init)) {
                $jlTwC$swchelpers.classPrivateFieldSet($jlTwC$swchelpers.assertThisInitialized(_this), _init, true);
                current_page.title = document.title;
                current_page.frames = $fe485ef4b9064f7a$var$extract_frames(document);
                current_page.scripts = $fe485ef4b9064f7a$var$extract_scripts(document);
                current_page.links = $fe485ef4b9064f7a$var$extract_stylesheets(document);
                $fe485ef4b9064f7a$var$Route.init_links(document, $jlTwC$swchelpers.assertThisInitialized(_this));
                // this.#init_links(document);
                current_page.fire('mount');
                window.addEventListener('popstate', function() {
                    // Find previous page and clean it
                    var last_page_visited = $jlTwC$swchelpers.toConsumableArray($jlTwC$swchelpers.classPrivateFieldGet(_this, _cache).entries()).sort(function(a, b) {
                        if (a[1].last_loaded_time < b[1].last_loaded_time) return 1;
                        if (a[1].last_loaded_time > b[1].last_loaded_time) return -1;
                        return 0;
                    })[0][1];
                    last_page_visited.fire('destroy');
                    last_page_visited.clean();
                    // Render new route
                    if ($jlTwC$swchelpers.classPrivateFieldGet(_this, _cache).has(_this.current_path)) $jlTwC$swchelpers.classPrivateFieldGet(_this, _cache).get(_this.current_path).render($jlTwC$swchelpers.assertThisInitialized(_this));
                });
            }
        });
        return _this;
    }
    $jlTwC$swchelpers.createClass($fe485ef4b9064f7a$export$2e2bcd8739ae039, [
        {
            key: "pages",
            get: function get() {
                return new Proxy($jlTwC$swchelpers.classPrivateFieldGet(this, _cache), {
                    get: function(target, name) {
                        var res = Reflect.get(target, name);
                        if (typeof res === 'function' && (name === 'get' || name === 'has')) res = res.bind(target);
                        return res;
                    }
                });
            }
        },
        {
            key: "push",
            value: function push(location) {
                var from_cache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                if (from_cache && $jlTwC$swchelpers.classPrivateFieldGet(this, _cache).has(this.current_path)) $jlTwC$swchelpers.classPrivateFieldGet(this, _cache).get(this.current_path).render(this);
                else this.handle_url(location, true, true);
            }
        },
        {
            key: "current_path",
            get: function get() {
                return location.pathname.substr(1);
            }
        },
        {
            key: "handle_url",
            value: function handle_url(url) {
                var add_to_cache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, do_rendering = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
                return $jlTwC$swchelpers.asyncToGenerator(($parcel$interopDefault($jlTwC$regeneratorruntime)).mark(function _callee() {
                    var page, res, text, parsed_fragment;
                    return ($parcel$interopDefault($jlTwC$regeneratorruntime)).wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                page = null;
                                _ctx.next = 3;
                                return fetch(url, {
                                    headers: new Headers({
                                        'GAR-LOG': null
                                    })
                                });
                            case 3:
                                res = _ctx.sent;
                                _ctx.next = 6;
                                return res.text();
                            case 6:
                                text = _ctx.sent;
                                if (!res.ok) {
                                    _ctx.next = 15;
                                    break;
                                }
                                parsed_fragment = $jlTwC$swchelpers.classPrivateMethodGet(this, _parse, parse).call(this, text);
                                if (add_to_cache) $jlTwC$swchelpers.classPrivateFieldGet(this, _cache).set(url, parsed_fragment);
                                if (do_rendering) {
                                    _ctx.next = 12;
                                    break;
                                }
                                return _ctx.abrupt("return");
                            case 12:
                                page = parsed_fragment;
                                _ctx.next = 19;
                                break;
                            case 15:
                                if (!(res.status === 404)) {
                                    _ctx.next = 19;
                                    break;
                                }
                                if (res) {
                                    _ctx.next = 18;
                                    break;
                                }
                                return _ctx.abrupt("return");
                            case 18:
                                page = $jlTwC$swchelpers.classPrivateMethodGet(this, _parse, parse).call(this, text);
                            case 19:
                                page.render(this);
                            case 20:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this);
                }).bind(this))();
            }
        },
        {
            key: "on",
            value: function on(event_name, callback) {
                switch(event_name){
                    case 'mount':
                    case 'destroy':
                        $jlTwC$swchelpers.classPrivateFieldGet(this, _cache).get(this.current_path).on(event_name, callback);
                        break;
                    case 'loading':
                    case 'change':
                        $jlTwC$swchelpers.get($jlTwC$swchelpers.getPrototypeOf($fe485ef4b9064f7a$export$2e2bcd8739ae039.prototype), "on", this).call(this, 'change', callback);
                        break;
                    default:
                        throw new TypeError('Unrecognized event');
                }
            }
        }
    ]);
    return $fe485ef4b9064f7a$export$2e2bcd8739ae039;
}($jlTwC$swchelpers.wrapNativeSuper($fe485ef4b9064f7a$var$Event));
var _cache = new WeakMap();
var _parser = new WeakMap();
var _init = new WeakMap();
function parse(content) {
    var doc = $jlTwC$swchelpers.classPrivateFieldGet(this, _parser).parseFromString(content, 'text/html');
    return new $fe485ef4b9064f7a$var$Route(doc.title, $fe485ef4b9064f7a$var$extract_frames(doc), $fe485ef4b9064f7a$var$extract_scripts(doc), $fe485ef4b9064f7a$var$extract_stylesheets(doc));
}
if (window.router === undefined) window.router = new $fe485ef4b9064f7a$export$2e2bcd8739ae039();


//# sourceMappingURL=main.js.map
