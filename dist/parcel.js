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


var $fe485ef4b9064f7a$export$2e2bcd8739ae039 = /*#__PURE__*/ function() {
    "use strict";
    function $fe485ef4b9064f7a$export$2e2bcd8739ae039() {
        var _this = this;
        $jlTwC$swchelpers.classCallCheck(this, $fe485ef4b9064f7a$export$2e2bcd8739ae039);
        this.cache = new Map();
        this.parser = new DOMParser();
        var frames = new Map();
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = document.querySelectorAll('ga-frame')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var frame = _step.value;
                frames.set(frame.getAttribute('name'), frame.innerHTML);
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
        window.addEventListener('popstate', function() {
            window.dispatchEvent(new Event('ga-router:loading', {
                bubbles: true,
                cancelable: false
            }));
            window.dispatchEvent(new Event('onDestroy'));
            var last_page_visited = $jlTwC$swchelpers.toConsumableArray(_this.cache.entries()).sort(function(a, b) {
                if (a[1].last_loaded_time < b[1].last_loaded_time) return 1;
                if (a[1].last_loaded_time > b[1].last_loaded_time) return -1;
                return 0;
            });
            _this.clean(last_page_visited);
            _this.handle_url(location.href);
        });
    }
    $jlTwC$swchelpers.createClass($fe485ef4b9064f7a$export$2e2bcd8739ae039, [
        {
            key: "caching",
            value: function caching(url, title, frames, scripts, links) {
                this.cache.set(url, {
                    frames: frames,
                    title: title,
                    last_loaded_time: Date.now(),
                    scripts: scripts,
                    links: links
                });
            }
        },
        {
            key: "handle_url",
            value: function handle_url(url, param, param1) {
                var add_to_cache = param === void 0 ? true : param, do_rendering = param1 === void 0 ? true : param1;
                return $jlTwC$swchelpers.asyncToGenerator($parcel$interopDefault($jlTwC$regeneratorruntime).mark(function _callee() {
                    var page, headers, res, parsed_fragment, parsed_fragment1;
                    return $parcel$interopDefault($jlTwC$regeneratorruntime).wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                page = this.cache.get(url);
                                if (!page) {
                                    _ctx.next = 5;
                                    break;
                                }
                                page.last_loaded_time = Date.now();
                                if (do_rendering) this.render(page);
                                return _ctx.abrupt("return");
                            case 5:
                                headers = new Headers();
                                headers.append('GAR-LOG', null);
                                _ctx.next = 9;
                                return fetch(url, {
                                    headers: headers
                                });
                            case 9:
                                res = _ctx.sent;
                                if (!res.ok) {
                                    _ctx.next = 21;
                                    break;
                                }
                                _ctx.next = 13;
                                return res.text();
                            case 13:
                                res = _ctx.sent;
                                parsed_fragment = this.parse(res);
                                if (add_to_cache) this.caching(url, parsed_fragment.title, parsed_fragment.frames, parsed_fragment.scripts, parsed_fragment.links);
                                page = parsed_fragment;
                                page.last_loaded_time = Date.now();
                                if (do_rendering) this.render(page);
                                _ctx.next = 26;
                                break;
                            case 21:
                                if (!(res.status === 404)) {
                                    _ctx.next = 26;
                                    break;
                                }
                                _ctx.next = 24;
                                return res.text();
                            case 24:
                                parsed_fragment1 = this.parse.call(this, _ctx.sent);
                                this.render(parsed_fragment1);
                            case 26:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this);
                }).bind(this))();
            }
        },
        {
            key: "parse",
            value: function parse(content) {
                var doc = this.parser.parseFromString(content, 'text/html');
                var frames = new Map();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = doc.querySelector('ga-frame')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var frame = _step.value;
                        frames.set(frame.getAttribute('name'), frame.innerHTML);
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
                return {
                    title: doc.title,
                    frames: frames,
                    scripts: $jlTwC$swchelpers.toConsumableArray(doc.querySelectorAll('script')).filter(function(script) {
                        return script.getAttribute('o-no-load') === null && script.getAttribute('src') !== null;
                    }).map(function(script) {
                        return script.attributes.src.nodeValue;
                    }),
                    links: $jlTwC$swchelpers.toConsumableArray(doc.querySelectorAll('head > link[rel=stylesheet')).filter(function(link) {
                        return link.getAttribute('o-no-load') === null;
                    }).map(function(link) {
                        return link.attributes.href.nodeValue;
                    })
                };
            }
        }
    ]);
    return $fe485ef4b9064f7a$export$2e2bcd8739ae039;
} // export default class Router {
 //     constructor() {
 //         this.cache = {};
 //         this.onMountEvent = new Event('onMount');
 //         this.onDestroyEvent = new Event('onDestroy');
 //         this.parser = new DOMParser();
 //         const frames = {};
 //         for (const frame of document.querySelectorAll('ga-frame')) {
 //             frames[frame.getAttribute('name')] = frame.innerHTML;
 //         }
 //         // Cache page on which the router has been initialized
 //         // TODO : handle case when script has no src attribute
 //         this.caching(
 //             location.href,
 //             document.title,
 //             frames,
 //             [...document.querySelectorAll('script')]
 //                 .filter(script => script.getAttribute('o-no-load') === null && script.getAttribute('src') !== null)
 //                 .map(script => script.attributes.src.nodeValue),
 //             [...document.querySelectorAll('head > link[rel=stylesheet]')]
 //                 .filter(link => link.getAttribute('o-no-load') === null)
 //                 .map(link => link.attributes.href.nodeValue)
 //         );
 //         window.dispatchEvent(this.onMountEvent);
 //         window.addEventListener('popstate', e => {
 //             window.dispatchEvent(new Event('router:loading', { bubbles: true, cancelable: false }))
 //             window.dispatchEvent(this.onDestroyEvent)
 //             const last_page_visited = Object.entries(this.cache).sort((a, b) => {
 //                 if (a[1].last_loaded_time < b[1].last_loaded_time)
 //                     return 1
 //                 if (a[1].last_loaded_time > b[1].last_loaded_time)
 //                     return -1;
 //                 return 0
 //             })[0][0];
 //             this.clean(last_page_visited)
 //             this.handle_url(location.href)
 //         })
 //         document.body.addEventListener('click', e => {
 //             const link = e.target instanceof HTMLAnchorElement
 //                 ? e.target
 //                 : e.target.parentElement instanceof HTMLAnchorElement
 //                     ? e.target.parentElement
 //                     : e.target.parentElement instanceof HTMLPictureElement
 //                         ? e.target.parentElement.parentElement
 //                         : null;
 //             if (link && link.href === window.location.href) {
 //                 e.preventDefault();
 //                 return;
 //             }
 //             if (link && link.matches('[o-follow]')) {
 //                 e.preventDefault();
 //                 window.dispatchEvent(new Event('router:loading', { bubbles: true, cancelable: false }))
 //                 window.dispatchEvent(this.onDestroyEvent)
 //                 // console.info('Remove old hooks', this.cache[location.href])
 //                 // window.removeEventListener('onMount', this.cache[location.href].onMount)
 //                 // window.removeEventListener('onDestroy', this.cache[location.href].onDestroy)
 //                 // const cached = this.cache[location.href]
 //                 // if (cached) {
 //                 //     // console.info('Remove old hooks', this.cache[location.href])
 //                 //     const onMount = this.cache[location.href].onMount;
 //                 //     if (onMount) window.removeEventListener('onMount', onMount);
 //                 //     const onDestroy = this.cache[location.href].onDestroy;
 //                 //     if (onDestroy) window.removeEventListener('onDestroy', onDestroy);
 //                 // }
 //                 history.pushState({ prevUrl: location.href }, null, link.href)
 //                 this.clean(window.history.state.prevUrl)
 //                 this.handle_url(link.href, true, true)
 //             }
 //         })
 //         const links_preload = document.querySelectorAll('[o-preload]')
 //         const links_preload_once = document.querySelectorAll('[o-preload-once]')
 //         // Warn developer an unintended behavior may occur
 //         for (const link_preload_once of links_preload_once) {
 //             for (const link_preload of links_preload) {
 //                 if (link_preload_once == link_preload) {
 //                     console.warn('A link has [o-preload-once] and [o-preload] tags at the same time')
 //                 }
 //             }
 //         }
 //         for (const link of links_preload) {
 //             link.addEventListener('mouseover', () => {
 //                 this.handle_url(link.href, true, false)
 //             })
 //             link.addEventListener('mouseleave', e => {
 //                 // delete pages[e.target.href]
 //             })
 //         }
 //         for (const link of links_preload_once) {
 //             link.addEventListener('mouseover', () => {
 //                 if (!this.cache[link.href])
 //                     this.handle_url(link.href, true, false)
 //             })
 //         }
 //     }
 //     onMount(callback) {
 //         this.cache[location.href].onMount = callback
 //         // console.log('CREATE ONMOUNT', this.cache[location.href])
 //         window.addEventListener('onMount', this.cache[location.href].onMount)
 //     }
 //     onDestroy(callback) {
 //         this.cache[location.href].onDestroy = callback
 //         window.addEventListener('onDestroy', this.cache[location.href].onDestroy)
 //     }
 //     caching(url, title, frames, scripts, links) {
 //         this.cache[url] = {
 //             frames,
 //             title,
 //             last_loaded_time: Date.now(),
 //             scripts,
 //             links
 //         }
 //     }
 //     async handle_url(url, add_in_cache = true, do_rendering = true) {
 //         let page = this.cache[url];
 //         if (!page) {
 //             let headers = new Headers();
 //             headers.append('GAR-Log', false);
 //             let res = await fetch(url, {
 //                 headers
 //             });
 //             if (res.ok) {
 //                 res = await res.text()
 //                 let parsed_fragment = this.parse(res)
 //                 if (add_in_cache) {
 //                     this.caching(
 //                         url,
 //                         parsed_fragment.title,
 //                         parsed_fragment.frames,
 //                         parsed_fragment.scripts,
 //                         parsed_fragment.links
 //                     )
 //                 }
 //                 page = parsed_fragment;
 //                 page.last_loaded_time = Date.now();
 //                 if (do_rendering === true)
 //                     this.render(page);
 //             } else if(res.status === 404) {
 //                 let parsed_fragment = this.parse(await res.text());
 //                 this.render(parsed_fragment);
 //             }
 //         } else {
 //             page.last_loaded_time = Date.now();
 //             if (do_rendering === true)
 //                 this.render(page);
 //         }
 //     }
 //     parse(content) {
 //         const doc = this.parser.parseFromString(content, 'text/html');
 //         const frames = {};
 //         for (const frame of doc.querySelectorAll('ga-frame')) {
 //             frames[frame.getAttribute('name')] = frame.innerHTML;
 //         }
 //         return {
 //             title: doc.title,
 //             frames,
 //             scripts: [...doc.querySelectorAll('script')]
 //                 .filter(script => script.getAttribute('o-no-load') === null && script.getAttribute('src') !== null)
 //                 .map(script => script.attributes.src.nodeValue),
 //             links: [...doc.querySelectorAll('head > link[rel=stylesheet]')]
 //                 .filter(link => link.getAttribute('o-no-load') === null)
 //                 .map(link => link.attributes.href.nodeValue)
 //         }
 //     }
 //     render(page) {
 //         let loadings = []
 //         // window.dispatchEvent(new Event('router:loading'))
 //         page.scripts.forEach(newScript => {
 //             loadings.push(
 //                 new Promise((resolve, reject) => {
 //                     let script = document.createElement('script')
 //                     script.type = 'text/javascript'
 //                     script.src = newScript
 //                     script.onload = resolve
 //                     document.head.appendChild(script)
 //                 })
 //             )
 //         })
 //         document.title = page.title
 //         window.scrollTo(0, 0);
 //         page.links.forEach(link => {
 //             loadings.push(
 //                 new Promise((resolve, reject) => {
 //                     let link_el = document.createElement('link');
 //                     link_el.rel = 'stylesheet';
 //                     link_el.href = link;
 //                     link_el.onload = resolve;
 //                     document.head.appendChild(link_el);
 //                 })
 //             )
 //         })
 //         Promise.all(loadings)
 //             .then(() => {
 //                 for (let frame of document.querySelectorAll('ga-frame')) {
 //                     const page_frame = page.frames[frame.getAttribute('name')];
 //                     if (page_frame !== undefined) {
 //                         frame.innerHTML = page_frame;
 //                     }
 //                 }
 //                 window.dispatchEvent(this.onMountEvent)
 //                 if (page.onMount) {
 //                     window.addEventListener('onMount', page.onMount)
 //                     // window.dispatchEvent(this.onMountEvent)
 //                 }
 //                 if (page.onDestroy) window.addEventListener('onDestroy', page.onDestroy)
 //                 window.dispatchEvent(new Event('router:change'))
 //             })
 //     }
 //     clean(url) {
 //         const page_to_clear = this.cache[url]
 //         if (page_to_clear) {
 //             // Remove old CSS files
 //             page_to_clear.links.forEach(link => {
 //                 const link_el = document.head.querySelector(`link[href="${link}"]`);
 //                 link_el.remove()
 //             })
 //             // Remove old JS files
 //             page_to_clear.scripts.forEach(script => {
 //                 const script_el = document.head.querySelector(`script[src="${script}"]`)
 //                 script_el.remove()
 //             })
 //         } else { // Page not in cache, maybe 404 page?
 //             // Remove old CSS files
 //             [...document.querySelectorAll('script')]
 //                 .filter(script => script.getAttribute('o-no-load') === null)
 //                 .forEach(script => script.remove());
 //             [...document.querySelectorAll('head > link[rel=stylesheet]')]
 //                 .filter(link => link.getAttribute('o-no-load') === null)
 //                 .forEach(link => link.remove());
 //         }
 //     }
 // }
();


//# sourceMappingURL=parcel.js.map
