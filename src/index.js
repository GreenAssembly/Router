class Event {
    #events = new Map();

    on(event_name, callback) {
        this.#events.set(event_name, callback);
    }

    fire(event_name, args = []) {
        if (this.#events.has(event_name)) {
            this.#events.get(event_name)(...args);
        }
    }
}

class Route extends Event {
    constructor(title, frames, scripts, links) {
        super();

        this.title = title;
        this.last_loaded_time = new Date();
        this.frames = frames;
        this.scripts = scripts;
        this.links = links;
    }

    render(router) {
        this.last_loaded_time = new Date();

        document.title = this.title;
        window.scrollTo(0, 0);

        // Load all scripts and stylesheets
        let loadings = [];

        this.links.forEach(href => {
            loadings.push(
                new Promise((resolve, _) => {
                    let link = document.createElement('link');
                    link.setAttribute('rel', 'stylesheet');
                    link.setAttribute('href', href);
                    link.onload = resolve;
                    document.head.appendChild(link);
                })
            );
        });

        this.scripts.forEach(src => {
            loadings.push(
                new Promise((resolve, _) => {
                    let script = document.createElement('script');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', src);
                    script.onload = resolve;
                    document.head.appendChild(script);
                })
            );
        });

        // When all scrips and stylesheets are loaded then render frames
        Promise.all(loadings)
            .then(() => {
                for (const frame of document.querySelectorAll('ga-frame')) {
                    const frame_name = frame.getAttribute('name');

                    if (this.frames.has(frame_name)) {
                        const page_frame = this.frames.get(frame_name);

                        frame.innerHTML = page_frame;
                        // TODO : bind follow behavior to frame links
                        Route.init_links(frame, router);
                    }
                }

                this.fire('mount');
                // TODO : router.fire('change');
            });
    }

    clean() {
        this.links.forEach(href => document.head.querySelector(`link[href="${href}"]`).remove());
        // TODO : see to add a flag to css and js files handled by the router
        this.scripts.forEach(src => {
            document.head.querySelector(`script[src="${src}"]`).remove()
        });
    }

    static init_links(frame, router) {
        frame
            .querySelectorAll('[o-follow]')
            .forEach(link => {
                const o_follow = link.getAttribute('o-follow');
                const href = link.getAttribute('href').substr(1);
        
                link.addEventListener('click', e => {
                    e.preventDefault();
        
                    // Cannot click on link which target the same location as the current
                    if (href === router.current_path) {
                        return;
                    }
        
                    router.fire('loading');
                    const prev_url = router.current_path;
        
                    history.pushState({}, null, href);
        
                    router.pages.get(prev_url).clean();
                    router.push(href);
                });
        
                // Only bind event on follow link which have preload-once or preload value
                if (['preload-once', 'preload'].includes(o_follow)) {
                    link.addEventListener('mouseover', () => {
                        if (o_follow === 'preload-once') {
                            if (!router.pages.has(href)) {
                                router.handle_url(href, true, false);
                            }
                        } else if (o_follow === 'preload') {
                            router.handle_url(href, false, false);
                        }
                    });
                }
            });
    }
}

const extract_scripts = doc => [...doc.querySelectorAll('script')]
    .filter(script => script.getAttribute('o-no-load') === null && script.getAttribute('src') !== null)
    .map(script => script.attributes.src.nodeValue);

const extract_stylesheets = doc => [...doc.querySelectorAll('head > link[rel=stylesheet]')]
    .filter(link => link.getAttribute('o-no-load') === null)
    .map(link => link.attributes.href.nodeValue);

const extract_frames = doc => new Map([...doc.querySelectorAll('ga-frame')].map(frame => {
        return [frame.getAttribute('name'), frame.innerHTML]
    }));

export default class Router extends Event {
    #cache = new Map();
    #parser = new DOMParser();
    #init = false;

    get pages() {
        return new Proxy(this.#cache, {
            get(target, name) {
                let res = Reflect.get(target, name);

                if (typeof res === 'function' && (name === 'get' || name === 'has')) {
                    res = res.bind(target);
                }

                return res
            }
        });
    }

    constructor() {
        super();
        // Init current page now to allow to link some events
        const current_page = new Route(null, null, null, null);
        this.#cache.set(this.current_path, current_page);

        // Init behavior when DOM is mounted
        document.addEventListener('readystatechange', e => {
            // e.target.readyState === 'interactive' || 
            if ((e.target.readyState === 'complete') && !this.#init) {
                // Prevent to execute each time the readyState change
                this.#init = true;

                current_page.title = document.title;
                current_page.frames = extract_frames(document);
                current_page.scripts = extract_scripts(document);;
                current_page.links = extract_stylesheets(document);

                Route.init_links(document, this);
                // this.#init_links(document);
                current_page.fire('mount');
        
                window.addEventListener('popstate', () => {
                    // Find previous page and clean it
                    const last_page_visited = [...this.#cache.entries()].sort((a, b) => {
                        if (a[1].last_loaded_time < b[1].last_loaded_time)
                            return 1
                        if (a[1].last_loaded_time > b[1].last_loaded_time)
                            return -1;
        
                        return 0
                    })[0][1];
            
                    last_page_visited.fire('destroy');
                    last_page_visited.clean();
        
                    // Render new route
                    if (this.#cache.has(this.current_path)) {
                        this.#cache.get(this.current_path).render(this);
                    }
                });
            }
        })
    }

    push(location, from_cache = true) {
        if (from_cache && this.#cache.has(this.current_path)) {
            this.#cache.get(this.current_path).render(this);
        } else {
            this.handle_url(location, true, true);
        }
    }

    get current_path() {
        return location.pathname.substr(1);
    }

    async handle_url(url, add_to_cache = true, do_rendering = true) {
        let page = null;
        let res = await fetch(url, {
            headers: new Headers({
                'GAR-LOG': null
            })
        });
        const text = await res.text();

        if (res.ok) {
            const parsed_fragment = this.#parse(text);

            if (add_to_cache) {
                this.#cache.set(url, parsed_fragment);
            }

            if (!do_rendering) {
                return;
            }

            page = parsed_fragment;
        } else if (res.status === 404) {
            if (!res) {
                return;
            }

            page = this.#parse(text);
        }

        page.render(this);
    }

    #parse(content) {
        const doc = this.#parser.parseFromString(content, 'text/html');

        return new Route(
            doc.title,
            extract_frames(doc),
            extract_scripts(doc),
            extract_stylesheets(doc)
        )
    }

    on(event_name, callback) {
        switch (event_name) {
            case 'mount':
            case 'destroy':
                this.#cache.get(this.current_path).on(event_name, callback);
            break;

            case 'loading':
            case 'change':
                this.on(event_name, callback);
            break;
            default:
                throw new TypeError('Unrecognized event')
        }
    }
}

if (window.router === undefined) {
    window.router = new Router();
}