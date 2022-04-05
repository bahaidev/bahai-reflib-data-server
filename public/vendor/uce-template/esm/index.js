/*! (c) Andrea Giammarchi @webreflection ISC */
(function () {

  var Lie = typeof Promise === 'function' ? Promise : function (fn) {
    var queue = [],
        resolved = 0,
        value;
    fn(function ($) {
      value = $;
      resolved = 1;
      queue.splice(0).forEach(then);
    });
    return {
      then: then
    };

    function then(fn) {
      return resolved ? setTimeout(fn, 0, value) : queue.push(fn), this;
    }
  };

  var attributesObserver = (function (whenDefined, MutationObserver) {
    var attributeChanged = function attributeChanged(records) {
      for (var i = 0, length = records.length; i < length; i++) {
        dispatch(records[i]);
      }
    };

    var dispatch = function dispatch(_ref) {
      var target = _ref.target,
          attributeName = _ref.attributeName,
          oldValue = _ref.oldValue;
      target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
    };

    return function (target, is) {
      var attributeFilter = target.constructor.observedAttributes;

      if (attributeFilter) {
        whenDefined(is).then(function () {
          new MutationObserver(attributeChanged).observe(target, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: attributeFilter
          });

          for (var i = 0, length = attributeFilter.length; i < length; i++) {
            if (target.hasAttribute(attributeFilter[i])) dispatch({
              target: target,
              attributeName: attributeFilter[i],
              oldValue: null
            });
          }
        });
      }

      return target;
    };
  });

  var TRUE = true,
      FALSE = false;
  var QSA$1 = 'querySelectorAll';

  function add(node) {
    this.observe(node, {
      subtree: TRUE,
      childList: TRUE
    });
  }
  /**
   * Start observing a generic document or root element.
   * @param {Function} callback triggered per each dis/connected node
   * @param {Element?} root by default, the global document to observe
   * @param {Function?} MO by default, the global MutationObserver
   * @returns {MutationObserver}
   */


  var notify = function notify(callback, root, MO) {
    var loop = function loop(nodes, added, removed, connected, pass) {
      for (var i = 0, length = nodes.length; i < length; i++) {
        var node = nodes[i];

        if (pass || QSA$1 in node) {
          if (connected) {
            if (!added.has(node)) {
              added.add(node);
              removed["delete"](node);
              callback(node, connected);
            }
          } else if (!removed.has(node)) {
            removed.add(node);
            added["delete"](node);
            callback(node, connected);
          }

          if (!pass) loop(node[QSA$1]('*'), added, removed, connected, TRUE);
        }
      }
    };

    var observer = new (MO || MutationObserver)(function (records) {
      for (var added = new Set(), removed = new Set(), i = 0, length = records.length; i < length; i++) {
        var _records$i = records[i],
            addedNodes = _records$i.addedNodes,
            removedNodes = _records$i.removedNodes;
        loop(removedNodes, added, removed, FALSE, FALSE);
        loop(addedNodes, added, removed, TRUE, FALSE);
      }
    });
    observer.add = add;
    observer.add(root || document);
    return observer;
  };

  var QSA = 'querySelectorAll';
  var _self$1 = self,
      document$2 = _self$1.document,
      Element$1 = _self$1.Element,
      MutationObserver$2 = _self$1.MutationObserver,
      Set$2 = _self$1.Set,
      WeakMap$1 = _self$1.WeakMap;

  var elements = function elements(element) {
    return QSA in element;
  };

  var filter = [].filter;
  var qsaObserver = (function (options) {
    var live = new WeakMap$1();

    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) {
        live["delete"](elements[i]);
      }
    };

    var flush = function flush() {
      var records = observer.takeRecords();

      for (var i = 0, length = records.length; i < length; i++) {
        parse(filter.call(records[i].removedNodes, elements), false);
        parse(filter.call(records[i].addedNodes, elements), true);
      }
    };

    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };

    var notifier = function notifier(element, connected) {
      var selectors;

      if (connected) {
        for (var q, m = matches(element), i = 0, length = query.length; i < length; i++) {
          if (m.call(element, q = query[i])) {
            if (!live.has(element)) live.set(element, new Set$2());
            selectors = live.get(element);

            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function (q) {
          options.handle(element, connected, q);
        });
      }
    };

    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      for (var i = 0, length = elements.length; i < length; i++) {
        notifier(elements[i], connected);
      }
    };

    var query = options.query;
    var root = options.root || document$2;
    var observer = notify(notifier, root, MutationObserver$2);
    var attachShadow = Element$1.prototype.attachShadow;
    if (attachShadow) Element$1.prototype.attachShadow = function (init) {
      var shadowRoot = attachShadow.call(this, init);
      observer.add(shadowRoot);
      return shadowRoot;
    };
    if (query.length) parse(root[QSA](query));
    return {
      drop: drop,
      flush: flush,
      observer: observer,
      parse: parse
    };
  });

  var _self = self,
      document$1 = _self.document,
      Map = _self.Map,
      MutationObserver$1 = _self.MutationObserver,
      Object$1 = _self.Object,
      Set$1 = _self.Set,
      WeakMap = _self.WeakMap,
      Element = _self.Element,
      HTMLElement = _self.HTMLElement,
      Node = _self.Node,
      Error = _self.Error,
      TypeError = _self.TypeError,
      Reflect = _self.Reflect;
  var Promise$1 = self.Promise || Lie;
  var defineProperty = Object$1.defineProperty,
      keys = Object$1.keys,
      getOwnPropertyNames = Object$1.getOwnPropertyNames,
      setPrototypeOf = Object$1.setPrototypeOf;
  var legacy = !self.customElements;

  var expando = function expando(element) {
    var key = keys(element);
    var value = [];
    var length = key.length;

    for (var i = 0; i < length; i++) {
      value[i] = element[key[i]];
      delete element[key[i]];
    }

    return function () {
      for (var _i = 0; _i < length; _i++) {
        element[key[_i]] = value[_i];
      }
    };
  };

  if (legacy) {
    var HTMLBuiltIn = function HTMLBuiltIn() {
      var constructor = this.constructor;
      if (!classes.has(constructor)) throw new TypeError('Illegal constructor');
      var is = classes.get(constructor);
      if (override) return augment(override, is);
      var element = createElement.call(document$1, is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    };

    var createElement = document$1.createElement;
    var classes = new Map();
    var defined = new Map();
    var prototypes = new Map();
    var registry = new Map();
    var query = [];

    var handle = function handle(element, connected, selector) {
      var proto = prototypes.get(selector);

      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        override = setPrototypeOf(element, proto);

        try {
          new proto.constructor();
        } finally {
          override = null;
          redefine();
        }
      }

      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };

    var _qsaObserver = qsaObserver({
      query: query,
      handle: handle
    }),
        parse = _qsaObserver.parse;

    var override = null;

    var whenDefined = function whenDefined(name) {
      if (!defined.has(name)) {
        var _,
            $ = new Lie(function ($) {
          _ = $;
        });

        defined.set(name, {
          $: $,
          _: _
        });
      }

      return defined.get(name).$;
    };

    var augment = attributesObserver(whenDefined, MutationObserver$1);
    defineProperty(self, 'customElements', {
      configurable: true,
      value: {
        define: function define(is, Class) {
          if (registry.has(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
          classes.set(Class, is);
          prototypes.set(is, Class.prototype);
          registry.set(is, Class);
          query.push(is);
          whenDefined(is).then(function () {
            parse(document$1.querySelectorAll(is));
          });

          defined.get(is)._(Class);
        },
        get: function get(is) {
          return registry.get(is);
        },
        whenDefined: whenDefined
      }
    });
    defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
      value: HTMLBuiltIn
    });
    defineProperty(self, 'HTMLElement', {
      configurable: true,
      value: HTMLBuiltIn
    });
    defineProperty(document$1, 'createElement', {
      configurable: true,
      value: function value(name, options) {
        var is = options && options.is;
        var Class = is ? registry.get(is) : registry.get(name);
        return Class ? new Class() : createElement.call(document$1, name);
      }
    }); // in case ShadowDOM is used through a polyfill, to avoid issues
    // with builtin extends within shadow roots

    if (!('isConnected' in Node.prototype)) defineProperty(Node.prototype, 'isConnected', {
      configurable: true,
      get: function get() {
        return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
      }
    });
  } else {
    try {
      var LI = function LI() {
        return self.Reflect.construct(HTMLLIElement, [], LI);
      };

      LI.prototype = HTMLLIElement.prototype;
      var is = 'extends-li';
      self.customElements.define('extends-li', LI, {
        'extends': 'li'
      });
      legacy = document$1.createElement('li', {
        is: is
      }).outerHTML.indexOf(is) < 0;
      var _self$customElements = self.customElements,
          get = _self$customElements.get,
          _whenDefined = _self$customElements.whenDefined;
      defineProperty(self.customElements, 'whenDefined', {
        configurable: true,
        value: function value(is) {
          var _this = this;

          return _whenDefined.call(this, is).then(function (Class) {
            return Class || get.call(_this, is);
          });
        }
      });
    } catch (o_O) {
      legacy = !legacy;
    }
  }

  if (legacy) {
    var parseShadow = function parseShadow(element) {
      var root = shadowRoots.get(element);

      _parse(root.querySelectorAll(this), element.isConnected);
    };

    var customElements = self.customElements;
    var attachShadow = Element.prototype.attachShadow;
    var _createElement = document$1.createElement;
    var define = customElements.define,
        _get = customElements.get,
        upgrade = customElements.upgrade;

    var _ref = Reflect || {
      construct: function construct(HTMLElement) {
        return HTMLElement.call(this);
      }
    },
        construct = _ref.construct;

    var shadowRoots = new WeakMap();
    var shadows = new Set$1();

    var _classes = new Map();

    var _defined = new Map();

    var _prototypes = new Map();

    var _registry = new Map();

    var shadowed = [];
    var _query = [];

    var getCE = function getCE(is) {
      return _registry.get(is) || _get.call(customElements, is);
    };

    var _handle = function _handle(element, connected, selector) {
      var proto = _prototypes.get(selector);

      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        _override = setPrototypeOf(element, proto);

        try {
          new proto.constructor();
        } finally {
          _override = null;
          redefine();
        }
      }

      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };

    var _qsaObserver2 = qsaObserver({
      query: _query,
      handle: _handle
    }),
        _parse = _qsaObserver2.parse;

    var _qsaObserver3 = qsaObserver({
      query: shadowed,
      handle: function handle(element, connected) {
        if (shadowRoots.has(element)) {
          if (connected) shadows.add(element);else shadows["delete"](element);
          if (_query.length) parseShadow.call(_query, element);
        }
      }
    }),
        parseShadowed = _qsaObserver3.parse;

    var _whenDefined2 = function _whenDefined2(name) {
      if (!_defined.has(name)) {
        var _,
            $ = new Promise$1(function ($) {
          _ = $;
        });

        _defined.set(name, {
          $: $,
          _: _
        });
      }

      return _defined.get(name).$;
    };

    var _augment = attributesObserver(_whenDefined2, MutationObserver$1);

    var _override = null;
    getOwnPropertyNames(self).filter(function (k) {
      return /^HTML.*Element$/.test(k);
    }).forEach(function (k) {
      var HTMLElement = self[k];

      function HTMLBuiltIn() {
        var constructor = this.constructor;
        if (!_classes.has(constructor)) throw new TypeError('Illegal constructor');

        var _classes$get = _classes.get(constructor),
            is = _classes$get.is,
            tag = _classes$get.tag;

        if (is) {
          if (_override) return _augment(_override, is);

          var element = _createElement.call(document$1, tag);

          element.setAttribute('is', is);
          return _augment(setPrototypeOf(element, constructor.prototype), is);
        } else return construct.call(this, HTMLElement, [], constructor);
      }


      defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
        value: HTMLBuiltIn
      });
      defineProperty(self, k, {
        value: HTMLBuiltIn
      });
    });
    defineProperty(document$1, 'createElement', {
      configurable: true,
      value: function value(name, options) {
        var is = options && options.is;

        if (is) {
          var Class = _registry.get(is);

          if (Class && _classes.get(Class).tag === name) return new Class();
        }

        var element = _createElement.call(document$1, name);

        if (is) element.setAttribute('is', is);
        return element;
      }
    });
    if (attachShadow) Element.prototype.attachShadow = function (init) {
      var root = attachShadow.call(this, init);
      shadowRoots.set(this, root);
      return root;
    };
    defineProperty(customElements, 'get', {
      configurable: true,
      value: getCE
    });
    defineProperty(customElements, 'whenDefined', {
      configurable: true,
      value: _whenDefined2
    });
    defineProperty(customElements, 'upgrade', {
      configurable: true,
      value: function value(element) {
        var is = element.getAttribute('is');

        if (is) {
          var _constructor = _registry.get(is);

          if (_constructor) {
            _augment(setPrototypeOf(element, _constructor.prototype), is); // apparently unnecessary because this is handled by qsa observer
            // if (element.isConnected && element.connectedCallback)
            //   element.connectedCallback();


            return;
          }
        }

        upgrade.call(customElements, element);
      }
    });
    defineProperty(customElements, 'define', {
      configurable: true,
      value: function value(is, Class, options) {
        if (getCE(is)) throw new Error("'".concat(is, "' has already been defined as a custom element"));
        var selector;
        var tag = options && options["extends"];

        _classes.set(Class, tag ? {
          is: is,
          tag: tag
        } : {
          is: '',
          tag: is
        });

        if (tag) {
          selector = "".concat(tag, "[is=\"").concat(is, "\"]");

          _prototypes.set(selector, Class.prototype);

          _registry.set(is, Class);

          _query.push(selector);
        } else {
          define.apply(customElements, arguments);
          shadowed.push(selector = is);
        }

        _whenDefined2(is).then(function () {
          if (tag) {
            _parse(document$1.querySelectorAll(selector));

            shadows.forEach(parseShadow, [selector]);
          } else parseShadowed(document$1.querySelectorAll(selector));
        });

        _defined.get(is)._(Class);
      }
    });
  }

})();

var Lie = typeof Promise === 'function' ? Promise : function (fn) {
  let queue = [], resolved = 0, value;
  fn($ => {
    value = $;
    resolved = 1;
    queue.splice(0).forEach(then);
  });
  return {then};
  function then(fn) {
    return (resolved ? setTimeout(fn, 0, value) : queue.push(fn)), this;
  }
};

const queryHelper = (attr, arr) => element => [].reduce.call(
  element.querySelectorAll('[' + attr + ']'),
  (slot, node) => {
    let {parentNode} = node;
    do {
      if (parentNode === element) {
        const name = get(node, attr);
        slot[name] = arr ? [].concat(slot[name] || [], node) : node;
        break;
      }
      else if (/-/.test(parentNode.tagName) || get(parentNode, 'is'))
        break;
    } while (parentNode = parentNode.parentNode);
    return slot;
  },
  {}
);

const get = (child, name) => child.getAttribute(name);
const has = (child, name) => child.hasAttribute(name);
const ref$1 = queryHelper('ref', false);
const slot = queryHelper('slot', true);

let info$1 = null, schedule = new Set;

const invoke = effect => {
  const {$, r, h} = effect;
  if (isFunction(r)) {
    fx.get(h).delete(effect);
    r();
  }
  if (isFunction(effect.r = $()))
    fx.get(h).add(effect);
};

const runSchedule = () => {
  const previous = schedule;
  schedule = new Set;
  previous.forEach(({h, c, a, e}) => {
    // avoid running schedules when the hook is
    // re-executed before such schedule happens
    if (e)
      h.apply(c, a);
  });
};

const fx = new WeakMap;
const effects = [];
const layoutEffects = [];

function different(value, i) {
  return value !== this[i];
}
const dropEffect = hook => {
  const effects = fx.get(hook);
  if (effects)
    wait.then(() => {
      effects.forEach(effect => {
        effect.r();
        effect.r = null;
      });
      effects.clear();
    });
};

const getInfo = () => info$1;

const hasEffect = hook => fx.has(hook);

const isFunction = f => typeof f === 'function';

const hooked = callback => {
  const current = {h: hook, c: null, a: null, e: 0, i: 0, s: []};
  return hook;
  function hook() {
    const prev = info$1;
    info$1 = current;
    current.e = current.i = 0;
    try {
      return callback.apply(current.c = this, current.a = arguments);
    }
    finally {
      info$1 = prev;
      if (effects.length)
        wait.then(effects.forEach.bind(effects.splice(0), invoke));
      if (layoutEffects.length)
        layoutEffects.splice(0).forEach(invoke);
    }
  }
};

const reschedule = info => {
  if (!schedule.has(info)) {
    info.e = 1;
    schedule.add(info);
    wait.then(runSchedule);
  }
};

const wait = new Lie($ => $());

const createContext = value => ({
  _: new Set,
  provide,
  value
});

const useContext = ({_, value}) => {
  _.add(getInfo());
  return value;
};

function provide(newValue) {
  const {_, value} = this;
  if (value !== newValue) {
    this._ = new Set;
    this.value = newValue;
    _.forEach(({h, c, a}) => {
      h.apply(c, a);
    });
  }
}

const useCallback = (fn, guards) => useMemo(() => fn, guards);

const useMemo = (memo, guards) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length || !guards || guards.some(different, s[i]._))
    s[i] = {$: memo(), _: guards};
  return s[info.i++].$;
};

const createEffect = stack => (callback, guards) => {
  const info = getInfo();
  const {i, s, h} = info;
  const call = i === s.length;
  info.i++;
  if (call) {
    if (!fx.has(h))
      fx.set(h, new Set);
    s[i] = {$: callback, _: guards, r: null, h};
  }
  if (call || !guards || guards.some(different, s[i]._))
    stack.push(s[i]);
  s[i].$ = callback;
  s[i]._ = guards;
};

const useEffect = createEffect(effects);

const useLayoutEffect = createEffect(layoutEffects);

const getValue = (value, f) => isFunction(f) ? f(value) : f;

const useReducer = (reducer, value, init) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({
      $: isFunction(init) ?
          init(value) : getValue(void 0, value),
      set: value => {
        s[i].$ = reducer(s[i].$, value);
        reschedule(info);
      }
    });
  const {$, set} = s[info.i++];
  return [$, set];
};

const useState = value => useReducer(getValue, value);

const useRef = current => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({current});
  return s[info.i++];
};

var umap = _ => ({
  // About: get: _.get.bind(_)
  // It looks like WebKit/Safari didn't optimize bind at all,
  // so that using bind slows it down by 60%.
  // Firefox and Chrome are just fine in both cases,
  // so let's use the approach that works fast everywhere 👍
  get: key => _.get(key),
  set: (key, value) => (_.set(key, value), value)
});

const attr = /([^\s\\>"'=]+)\s*=\s*(['"]?)$/;
const empty = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const node = /<[a-z][^>]+$/i;
const notNode = />[^<>]*$/;
const selfClosing = /<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/ig;
const trimEnd = /\s+$/;

const isNode = (template, i) => (
    0 < i-- && (
    node.test(template[i]) || (
      !notNode.test(template[i]) && isNode(template, i)
    )
  )
);

const regular = (original, name, extra) => empty.test(name) ?
                  original : `<${name}${extra.replace(trimEnd,'')}></${name}>`;

var instrument = (template, prefix, svg) => {
  const text = [];
  const {length} = template;
  for (let i = 1; i < length; i++) {
    const chunk = template[i - 1];
    text.push(attr.test(chunk) && isNode(template, i) ?
      chunk.replace(
        attr,
        (_, $1, $2) => `${prefix}${i - 1}=${$2 || '"'}${$1}${$2 ? '' : '"'}`
      ) :
      `${chunk}<!--${prefix}${i - 1}-->`
    );
  }
  text.push(template[length - 1]);
  const output = text.join('').trim();
  return svg ? output : output.replace(selfClosing, regular);
};

const {isArray} = Array;
const {indexOf, slice} = [];

const ELEMENT_NODE = 1;
const nodeType = 111;

const remove = ({firstChild, lastChild}) => {
  const range = document.createRange();
  range.setStartAfter(firstChild);
  range.setEndAfter(lastChild);
  range.deleteContents();
  return firstChild;
};

const diffable = (node, operation) => node.nodeType === nodeType ?
  ((1 / operation) < 0 ?
    (operation ? remove(node) : node.lastChild) :
    (operation ? node.valueOf() : node.firstChild)) :
  node
;

const persistent = fragment => {
  const {childNodes} = fragment;
  const {length} = childNodes;
  if (length < 2)
    return length ? childNodes[0] : fragment;
  const nodes = slice.call(childNodes, 0);
  const firstChild = nodes[0];
  const lastChild = nodes[length - 1];
  return {
    ELEMENT_NODE,
    nodeType,
    firstChild,
    lastChild,
    valueOf() {
      if (childNodes.length !== length) {
        let i = 0;
        while (i < length)
          fragment.appendChild(nodes[i++]);
      }
      return fragment;
    }
  };
};

/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * @param {Node} parentNode The container where children live
 * @param {Node[]} a The list of current/live children
 * @param {Node[]} b The list of future children
 * @param {(entry: Node, action: number) => Node} get
 * The callback invoked per each entry related DOM operation.
 * @param {Node} [before] The optional node used as anchor to insert before.
 * @returns {Node[]} The same list of future children.
 */
var udomdiff = (parentNode, a, b, get, before) => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      // we could be in a situation where the rest of nodes that
      // need to be added are not at the end, and in such case
      // the node to `insertBefore`, if the index is more than 0
      // must be retrieved, otherwise it's gonna be the first item.
      const node = bEnd < bLength ?
        (bStart ?
          (get(b[bStart - 1], -0).nextSibling) :
          get(b[bEnd - bStart], 0)) :
        before;
      while (bStart < bEnd)
        parentNode.insertBefore(get(b[bStart++], 1), node);
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        // remove the node only if it's unknown or not live
        if (!map || !map.has(a[aStart]))
          parentNode.removeChild(get(a[aStart], -1));
        aStart++;
      }
    }
    // same node: fast path
    else if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    }
    // same tail: fast path
    else if (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    // The once here single last swap "fast path" has been removed in v1.1.0
    // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
    // reverse swap: also fast path
    else if (
      a[aStart] === b[bEnd - 1] &&
      b[bStart] === a[aEnd - 1]
    ) {
      // this is a "shrink" operation that could happen in these cases:
      // [1, 2, 3, 4, 5]
      // [1, 4, 3, 2, 5]
      // or asymmetric too
      // [1, 2, 3, 4, 5]
      // [1, 2, 3, 5, 6, 4]
      const node = get(a[--aEnd], -1).nextSibling;
      parentNode.insertBefore(
        get(b[bStart++], 1),
        get(a[aStart++], -1).nextSibling
      );
      parentNode.insertBefore(get(b[--bEnd], 1), node);
      // mark the future index as identical (yeah, it's dirty, but cheap 👍)
      // The main reason to do this, is that when a[aEnd] will be reached,
      // the loop will likely be on the fast path, as identical to b[bEnd].
      // In the best case scenario, the next loop will skip the tail,
      // but in the worst one, this node will be considered as already
      // processed, bailing out pretty quickly from the map index check
      a[aEnd] = b[bEnd];
    }
    // map based fallback, "slow" path
    else {
      // the map requires an O(bEnd - bStart) operation once
      // to store all future nodes indexes for later purposes.
      // In the worst case scenario, this is a full O(N) cost,
      // and such scenario happens at least when all nodes are different,
      // but also if both first and last items of the lists are different
      if (!map) {
        map = new Map;
        let i = bStart;
        while (i < bEnd)
          map.set(b[i], i++);
      }
      // if it's a future node, hence it needs some handling
      if (map.has(a[aStart])) {
        // grab the index of such node, 'cause it might have been processed
        const index = map.get(a[aStart]);
        // if it's not already processed, look on demand for the next LCS
        if (bStart < index && index < bEnd) {
          let i = aStart;
          // counts the amount of nodes that are the same in the future
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
            sequence++;
          // effort decision here: if the sequence is longer than replaces
          // needed to reach such sequence, which would brings again this loop
          // to the fast path, prepend the difference before a sequence,
          // and move only the future list index forward, so that aStart
          // and bStart will be aligned again, hence on the fast path.
          // An example considering aStart and bStart are both 0:
          // a: [1, 2, 3, 4]
          // b: [7, 1, 2, 3, 6]
          // this would place 7 before 1 and, from that time on, 1, 2, and 3
          // will be processed at zero cost
          if (sequence > (index - bStart)) {
            const node = get(a[aStart], 0);
            while (bStart < index)
              parentNode.insertBefore(get(b[bStart++], 1), node);
          }
          // if the effort wasn't good enough, fallback to a replace,
          // moving both source and target indexes forward, hoping that some
          // similar node will be found later on, to go back to the fast path
          else {
            parentNode.replaceChild(
              get(b[bStart++], 1),
              get(a[aStart++], -1)
            );
          }
        }
        // otherwise move the source forward, 'cause there's nothing to do
        else
          aStart++;
      }
      // this node has no meaning in the future list, so it's more than safe
      // to remove it, and check the next live node out instead, meaning
      // that only the live list index should be forwarded
      else
        parentNode.removeChild(get(a[aStart++], -1));
    }
  }
  return b;
};

const aria = node => values => {
  for (const key in values) {
    const name = key === 'role' ? key : `aria-${key}`;
    const value = values[key];
    if (value == null)
      node.removeAttribute(name);
    else
      node.setAttribute(name, value);
  }
};

const attribute = (node, name) => {
  let oldValue, orphan = true;
  const attributeNode = document.createAttributeNS(null, name);
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      if (oldValue == null) {
        if (!orphan) {
          node.removeAttributeNode(attributeNode);
          orphan = true;
        }
      }
      else {
        const value = newValue;
        if (value == null) {
          if (!orphan)
            node.removeAttributeNode(attributeNode);
            orphan = true;
        }
        else {
          attributeNode.value = value;
          if (orphan) {
            node.setAttributeNodeNS(attributeNode);
            orphan = false;
          }
        }
      }
    }
  };
};

const boolean = (node, key, oldValue) => newValue => {
  if (oldValue !== !!newValue) {
    // when IE won't be around anymore ...
    // node.toggleAttribute(key, oldValue = !!newValue);
    if ((oldValue = !!newValue))
      node.setAttribute(key, '');
    else
      node.removeAttribute(key);
  }
};

const data = ({dataset}) => values => {
  for (const key in values) {
    const value = values[key];
    if (value == null)
      delete dataset[key];
    else
      dataset[key] = value;
  }
};

const event = (node, name) => {
  let oldValue, lower, type = name.slice(2);
  if (!(name in node) && (lower = name.toLowerCase()) in node)
    type = lower.slice(2);
  return newValue => {
    const info = isArray(newValue) ? newValue : [newValue, false];
    if (oldValue !== info[0]) {
      if (oldValue)
        node.removeEventListener(type, oldValue, info[1]);
      if (oldValue = info[0])
        node.addEventListener(type, oldValue, info[1]);
    }
  };
};

const ref = node => {
  let oldValue;
  return value => {
    if (oldValue !== value) {
      oldValue = value;
      if (typeof value === 'function')
        value(node);
      else
        value.current = node;
    }
  };
};

const setter = (node, key) => key === 'dataset' ?
  data(node) :
  value => {
    node[key] = value;
  };

const text = node => {
  let oldValue;
  return newValue => {
    if (oldValue != newValue) {
      oldValue = newValue;
      node.textContent = newValue == null ? '' : newValue;
    }
  };
};

// from a generic path, retrieves the exact targeted node
const reducePath = ({childNodes}, i) => childNodes[i];

// this helper avoid code bloat around handleAnything() callback
const diff = (comment, oldNodes, newNodes) => udomdiff(
  comment.parentNode,
  // TODO: there is a possible edge case where a node has been
  //       removed manually, or it was a keyed one, attached
  //       to a shared reference between renders.
  //       In this case udomdiff might fail at removing such node
  //       as its parent won't be the expected one.
  //       The best way to avoid this issue is to filter oldNodes
  //       in search of those not live, or not in the current parent
  //       anymore, but this would require both a change to uwire,
  //       exposing a parentNode from the firstChild, as example,
  //       but also a filter per each diff that should exclude nodes
  //       that are not in there, penalizing performance quite a lot.
  //       As this has been also a potential issue with domdiff,
  //       and both lighterhtml and hyperHTML might fail with this
  //       very specific edge case, I might as well document this possible
  //       "diffing shenanigan" and call it a day.
  oldNodes,
  newNodes,
  diffable,
  comment
);

// if an interpolation represents a comment, the whole
// diffing will be related to such comment.
// This helper is in charge of understanding how the new
// content for such interpolation/hole should be updated
const handleAnything = comment => {
  let oldValue, text, nodes = [];
  const anyContent = newValue => {
    switch (typeof newValue) {
      // primitives are handled as text content
      case 'string':
      case 'number':
      case 'boolean':
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (!text)
            text = document.createTextNode('');
          text.data = newValue;
          nodes = diff(comment, nodes, [text]);
        }
        break;
      // null, and undefined are used to cleanup previous content
      case 'object':
      case 'undefined':
        if (newValue == null) {
          if (oldValue != newValue) {
            oldValue = newValue;
            nodes = diff(comment, nodes, []);
          }
          break;
        }
        // arrays and nodes have a special treatment
        if (isArray(newValue)) {
          oldValue = newValue;
          // arrays can be used to cleanup, if empty
          if (newValue.length === 0)
            nodes = diff(comment, nodes, []);
          // or diffed, if these contains nodes or "wires"
          else if (typeof newValue[0] === 'object')
            nodes = diff(comment, nodes, newValue);
          // in all other cases the content is stringified as is
          else
            anyContent(String(newValue));
          break;
        }
        // if the new value is a DOM node, or a wire, and it's
        // different from the one already live, then it's diffed.
        // if the node is a fragment, it's appended once via its childNodes
        // There is no `else` here, meaning if the content
        // is not expected one, nothing happens, as easy as that.
        if (oldValue !== newValue && 'ELEMENT_NODE' in newValue) {
          oldValue = newValue;
          nodes = diff(
            comment,
            nodes,
            newValue.nodeType === 11 ?
              slice.call(newValue.childNodes) :
              [newValue]
          );
        }
        break;
      case 'function':
        anyContent(newValue(comment));
        break;
    }
  };
  return anyContent;
};

// attributes can be:
//  * ref=${...}      for hooks and other purposes
//  * aria=${...}     for aria attributes
//  * ?boolean=${...} for boolean attributes
//  * .dataset=${...} for dataset related attributes
//  * .setter=${...}  for Custom Elements setters or nodes with setters
//                    such as buttons, details, options, select, etc
//  * @event=${...}   to explicitly handle event listeners
//  * onevent=${...}  to automatically handle event listeners
//  * generic=${...}  to handle an attribute just like an attribute
const handleAttribute = (node, name/*, svg*/) => {
  switch (name[0]) {
    case '?': return boolean(node, name.slice(1), false);
    case '.': return setter(node, name.slice(1));
    case '@': return event(node, 'on' + name.slice(1));
    case 'o': if (name[1] === 'n') return event(node, name);
  }

  switch (name) {
    case 'ref': return ref(node);
    case 'aria': return aria(node);
  }

  return attribute(node, name/*, svg*/);
};

// each mapped update carries the update type and its path
// the type is either node, attribute, or text, while
// the path is how to retrieve the related node to update.
// In the attribute case, the attribute name is also carried along.
function handlers(options) {
  const {type, path} = options;
  const node = path.reduceRight(reducePath, this);
  return type === 'node' ?
    handleAnything(node) :
    (type === 'attr' ?
      handleAttribute(node, options.name/*, options.svg*/) :
      text(node));
}

/*! (c) Andrea Giammarchi - ISC */
var createContent = (function (document) {  var FRAGMENT = 'fragment';
  var TEMPLATE = 'template';
  var HAS_CONTENT = 'content' in create(TEMPLATE);

  var createHTML = HAS_CONTENT ?
    function (html) {
      var template = create(TEMPLATE);
      template.innerHTML = html;
      return template.content;
    } :
    function (html) {
      var content = create(FRAGMENT);
      var template = create(TEMPLATE);
      var childNodes = null;
      if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
        var selector = RegExp.$1;
        template.innerHTML = '<table>' + html + '</table>';
        childNodes = template.querySelectorAll(selector);
      } else {
        template.innerHTML = html;
        childNodes = template.childNodes;
      }
      append(content, childNodes);
      return content;
    };

  return function createContent(markup, type) {
    return (type === 'svg' ? createSVG : createHTML)(markup);
  };

  function append(root, childNodes) {
    var length = childNodes.length;
    while (length--)
      root.appendChild(childNodes[0]);
  }

  function create(element) {
    return element === FRAGMENT ?
      document.createDocumentFragment() :
      document.createElementNS('http://www.w3.org/1999/xhtml', element);
  }

  // it could use createElementNS when hasNode is there
  // but this fallback is equally fast and easier to maintain
  // it is also battle tested already in all IE
  function createSVG(svg) {
    var content = create(FRAGMENT);
    var template = create('div');
    template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
    append(content, template.firstChild.childNodes);
    return content;
  }

}(document));

// this "hack" tells the library if the browser is IE11 or old Edge
const isImportNodeLengthWrong = document.importNode.length != 1;

// IE11 and old Edge discard empty nodes when cloning, potentially
// resulting in broken paths to find updates. The workaround here
// is to import once, upfront, the fragment that will be cloned
// later on, so that paths are retrieved from one already parsed,
// hence without missing child nodes once re-cloned.
const createFragment = isImportNodeLengthWrong ?
  (text, type, normalize) => document.importNode(
    createContent(text, type, normalize),
    true
  ) :
  createContent;

// IE11 and old Edge have a different createTreeWalker signature that
// has been deprecated in other browsers. This export is needed only
// to guarantee the TreeWalker doesn't show warnings and, ultimately, works
const createWalker = isImportNodeLengthWrong ?
  fragment => document.createTreeWalker(fragment, 1 | 128, null, false) :
  fragment => document.createTreeWalker(fragment, 1 | 128);

// from a fragment container, create an array of indexes
// related to its child nodes, so that it's possible
// to retrieve later on exact node via reducePath
const createPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};

// the prefix is used to identify either comments, attributes, or nodes
// that contain the related unique id. In the attribute cases
// isµX="attribute-name" will be used to map current X update to that
// attribute name, while comments will be like <!--isµX-->, to map
// the update to that specific comment node, hence its parent.
// style and textarea will have <!--isµX--> text content, and are handled
// directly through text-only updates.
const prefix = 'isµ';

// Template Literals are unique per scope and static, meaning a template
// should be parsed once, and once only, as it will always represent the same
// content, within the exact same amount of updates each time.
// This cache relates each template to its unique content and updates.
const cache$2 = umap(new WeakMap);

// a RegExp that helps checking nodes that cannot contain comments
const textOnly = /^(?:plaintext|script|style|textarea|title|xmp)$/i;

const createCache = () => ({
  stack: [],    // each template gets a stack for each interpolation "hole"

  entry: null,  // each entry contains details, such as:
                //  * the template that is representing
                //  * the type of node it represents (html or svg)
                //  * the content fragment with all nodes
                //  * the list of updates per each node (template holes)
                //  * the "wired" node or fragment that will get updates
                // if the template or type are different from the previous one
                // the entry gets re-created each time

  wire: null    // each rendered node represent some wired content and
                // this reference to the latest one. If different, the node
                // will be cleaned up and the new "wire" will be appended
});

// the entry stored in the rendered node cache, and per each "hole"
const createEntry = (type, template) => {
  const {content, updates} = mapUpdates(type, template);
  return {type, template, content, updates, wire: null};
};

// a template is instrumented to be able to retrieve where updates are needed.
// Each unique template becomes a fragment, cloned once per each other
// operation based on the same template, i.e. data => html`<p>${data}</p>`
const mapTemplate = (type, template) => {
  const text = instrument(template, prefix, type === 'svg');
  const content = createFragment(text, type);
  // once instrumented and reproduced as fragment, it's crawled
  // to find out where each update is in the fragment tree
  const tw = createWalker(content);
  const nodes = [];
  const length = template.length - 1;
  let i = 0;
  // updates are searched via unique names, linearly increased across the tree
  // <div isµ0="attr" isµ1="other"><!--isµ2--><style><!--isµ3--</style></div>
  let search = `${prefix}${i}`;
  while (i < length) {
    const node = tw.nextNode();
    // if not all updates are bound but there's nothing else to crawl
    // it means that there is something wrong with the template.
    if (!node)
      throw `bad template: ${text}`;
    // if the current node is a comment, and it contains isµX
    // it means the update should take care of any content
    if (node.nodeType === 8) {
      // The only comments to be considered are those
      // which content is exactly the same as the searched one.
      if (node.data === search) {
        nodes.push({type: 'node', path: createPath(node)});
        search = `${prefix}${++i}`;
      }
    }
    else {
      // if the node is not a comment, loop through all its attributes
      // named isµX and relate attribute updates to this node and the
      // attribute name, retrieved through node.getAttribute("isµX")
      // the isµX attribute will be removed as irrelevant for the layout
      // let svg = -1;
      while (node.hasAttribute(search)) {
        nodes.push({
          type: 'attr',
          path: createPath(node),
          name: node.getAttribute(search),
          //svg: svg < 0 ? (svg = ('ownerSVGElement' in node ? 1 : 0)) : svg
        });
        node.removeAttribute(search);
        search = `${prefix}${++i}`;
      }
      // if the node was a style, textarea, or others, check its content
      // and if it is <!--isµX--> then update tex-only this node
      if (
        textOnly.test(node.tagName) &&
        node.textContent.trim() === `<!--${search}-->`
      ){
        node.textContent = '';
        nodes.push({type: 'text', path: createPath(node)});
        search = `${prefix}${++i}`;
      }
    }
  }
  // once all nodes to update, or their attributes, are known, the content
  // will be cloned in the future to represent the template, and all updates
  // related to such content retrieved right away without needing to re-crawl
  // the exact same template, and its content, more than once.
  return {content, nodes};
};

// if a template is unknown, perform the previous mapping, otherwise grab
// its details such as the fragment with all nodes, and updates info.
const mapUpdates = (type, template) => {
  const {content, nodes} = (
    cache$2.get(template) ||
    cache$2.set(template, mapTemplate(type, template))
  );
  // clone deeply the fragment
  const fragment = document.importNode(content, true);
  // and relate an update handler per each node that needs one
  const updates = nodes.map(handlers, fragment);
  // return the fragment and all updates to use within its nodes
  return {content: fragment, updates};
};

// as html and svg can be nested calls, but no parent node is known
// until rendered somewhere, the unroll operation is needed to
// discover what to do with each interpolation, which will result
// into an update operation.
const unroll = (info, {type, template, values}) => {
  const {length} = values;
  // interpolations can contain holes and arrays, so these need
  // to be recursively discovered
  unrollValues(info, values, length);
  let {entry} = info;
  // if the cache entry is either null or different from the template
  // and the type this unroll should resolve, create a new entry
  // assigning a new content fragment and the list of updates.
  if (!entry || (entry.template !== template || entry.type !== type))
    info.entry = (entry = createEntry(type, template));
  const {content, updates, wire} = entry;
  // even if the fragment and its nodes is not live yet,
  // it is already possible to update via interpolations values.
  for (let i = 0; i < length; i++)
    updates[i](values[i]);
  // if the entry was new, or representing a different template or type,
  // create a new persistent entity to use during diffing.
  // This is simply a DOM node, when the template has a single container,
  // as in `<p></p>`, or a "wire" in `<p></p><p></p>` and similar cases.
  return wire || (entry.wire = persistent(content));
};

// the stack retains, per each interpolation value, the cache
// related to each interpolation value, or null, if the render
// was conditional and the value is not special (Array or Hole)
const unrollValues = ({stack}, values, length) => {
  for (let i = 0; i < length; i++) {
    const hole = values[i];
    // each Hole gets unrolled and re-assigned as value
    // so that domdiff will deal with a node/wire, not with a hole
    if (hole instanceof Hole)
      values[i] = unroll(
        stack[i] || (stack[i] = createCache()),
        hole
      );
    // arrays are recursively resolved so that each entry will contain
    // also a DOM node or a wire, hence it can be diffed if/when needed
    else if (isArray(hole))
      unrollValues(
        stack[i] || (stack[i] = createCache()),
        hole,
        hole.length
      );
    // if the value is nothing special, the stack doesn't need to retain data
    // this is useful also to cleanup previously retained data, if the value
    // was a Hole, or an Array, but not anymore, i.e.:
    // const update = content => html`<div>${content}</div>`;
    // update(listOfItems); update(null); update(html`hole`)
    else
      stack[i] = null;
  }
  if (length < stack.length)
    stack.splice(length);
};

/**
 * Holds all details wrappers needed to render the content further on.
 * @constructor
 * @param {string} type The hole type, either `html` or `svg`.
 * @param {string[]} template The template literals used to the define the content.
 * @param {Array} values Zero, one, or more interpolated values to render.
 */
function Hole(type, template, values) {
  this.type = type;
  this.template = template;
  this.values = values;
}

const {create: create$2, defineProperties: defineProperties$2} = Object;

// both `html` and `svg` template literal tags are polluted
// with a `for(ref[, id])` and a `node` tag too
const tag = type => {
  // both `html` and `svg` tags have their own cache
  const keyed = umap(new WeakMap);
  // keyed operations always re-use the same cache and unroll
  // the template and its interpolations right away
  const fixed = cache => (template, ...values) => unroll(
    cache,
    {type, template, values}
  );
  return defineProperties$2(
    // non keyed operations are recognized as instance of Hole
    // during the "unroll", recursively resolved and updated
    (template, ...values) => new Hole(type, template, values),
    {
      for: {
        // keyed operations need a reference object, usually the parent node
        // which is showing keyed results, and optionally a unique id per each
        // related node, handy with JSON results and mutable list of objects
        // that usually carry a unique identifier
        value(ref, id) {
          const memo = keyed.get(ref) || keyed.set(ref, create$2(null));
          return memo[id] || (memo[id] = fixed(createCache()));
        }
      },
      node: {
        // it is possible to create one-off content out of the box via node tag
        // this might return the single created node, or a fragment with all
        // nodes present at the root level and, of course, their child nodes
        value: (template, ...values) => unroll(
          createCache(),
          {type, template, values}
        ).valueOf()
      }
    }
  );
};

// each rendered node gets its own cache
const cache$1 = umap(new WeakMap);

// rendering means understanding what `html` or `svg` tags returned
// and it relates a specific node to its own unique cache.
// Each time the content to render changes, the node is cleaned up
// and the new new content is appended, and if such content is a Hole
// then it's "unrolled" to resolve all its inner nodes.
const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  const info = cache$1.get(where) || cache$1.set(where, createCache());
  const wire = hole instanceof Hole ? unroll(info, hole) : hole;
  if (wire !== info.wire) {
    info.wire = wire;
    where.textContent = '';
    // valueOf() simply returns the node itself, but in case it was a "wire"
    // it will eventually re-append all nodes to its fragment so that such
    // fragment can be re-appended many times in a meaningful way
    // (wires are basically persistent fragments facades with special behavior)
    where.appendChild(wire.valueOf());
  }
  return where;
};

const html = tag('html');
const svg = tag('svg');

function css (t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i];
  return s;
}

const {defineProperties: defineProperties$1, keys: keys$2} = Object;

const accessor = (all, shallow, hook, value, update) => ({
  configurable: true,
  get: () => value,
  set(_) {
    if (all || _ !== value || (shallow && typeof _ === 'object' && _)) {
      value = _;
      if (hook)
        update.call(this, value);
      else
        update.call(this);
    }
  }
});

const loop = (props, get, all, shallow, useState, update) => {
  const desc = {};
  const hook = useState !== noop$1;
  const args = [all, shallow, hook];
  for (let ke = keys$2(props), y = 0; y < ke.length; y++) {
    const value = get(props, ke[y]);
    const extras = hook ? useState(value) : [value, useState];
    if (update)
      extras[1] = update;
    desc[ke[y]] = accessor.apply(null, args.concat(extras));
  }
  return desc;
};

const noop$1 = () => {};

var dom = ({
  all = false,
  shallow = true,
  useState = noop$1,
  getAttribute = (element, key) => element.getAttribute(key)
} = {}) => (element, props, update) => {
  const value = (props, key) => {
    let result = props[key], type = typeof result;
    if (element.hasOwnProperty(key)) {
      result = element[key];
      delete element[key];
    }
    else if (element.hasAttribute(key)) {
      result = getAttribute(element, key);
      if (type == 'number')
        result = +result;
      else if (type == 'boolean')
        result = !/^(?:false|0|)$/.test(result);
    }
    return result;
  };
  const desc = loop(props, value, all, shallow, useState, update);
  return defineProperties$1(element, desc);
};

const reactive = dom({dom: true});

const CE = customElements;
const {define: defineCustomElement} = CE;
const {parse: parse$1, stringify} = JSON;
const {create: create$1, defineProperties, getOwnPropertyDescriptor, keys: keys$1} = Object;

const element = 'element';
const ownProps = new WeakMap;
const constructors = umap(new Map([[element, {c: HTMLElement, e: element}]]));

const el = name => document.createElement(name);

const info = e => constructors.get(e) || constructors.set(e, {
  c: el(e).constructor,
  e
});

const define = (tagName, definition) => {
  const {
    attachShadow,
    attributeChanged,
    bound,
    connected,
    disconnected,
    handleEvent,
    init,
    observedAttributes,
    props,
    render,
    style
  } = definition;
  const initialized = new WeakMap;
  const statics = {};
  const proto = {};
  const listeners = [];
  const retype = create$1(null);
  const bootstrap = (element, key, value) => {
    if (!initialized.has(element)) {
      initialized.set(element, 0);
      defineProperties(element, {
        html: {
          configurable: true,
          value: content.bind(
            attachShadow ? element.attachShadow(attachShadow) : element
          )
        }
      });
      for (let i = 0; i < length; i++) {
        const {type, options} = listeners[i];
        element.addEventListener(type, element, options);
      }
      if (bound)
        bound.forEach(bind, element);
      if (props) {
        const reProps = {};
        for (let k = keys$1(props), i = 0; i < k.length; i++) {
          const key = k[i];
          const value = props[key];
          reProps[key] = typeof value === 'object' ? parse$1(stringify(value)) : value;
        }
        ownProps.set(element, reProps);
        reactive(element, reProps, render);
      }
      if (init || render)
        (init || render).call(element);
      if (key)
        element[key] = value;
    }
  };
  for (let k = keys$1(definition), i = 0, {length} = k; i < length; i++) {
    const key = k[i];
    if (/^on./.test(key) && !/Options$/.test(key)) {
      const options = definition[key + 'Options'] || false;
      const lower = key.toLowerCase();
      let type = lower.slice(2);
      listeners.push({type, options});
      retype[type] = key;
      if (lower !== key) {
        type = lower.slice(2, 3) + key.slice(3);
        retype[type] = key;
        listeners.push({type, options});
      }
    }
    switch (key) {
      case 'attachShadow':
      case 'constructor':
      case 'observedAttributes':
      case 'style':
        break;
      default:
        proto[key] = getOwnPropertyDescriptor(definition, key);
    }
  }
  const {length} = listeners;
  if (length && !handleEvent)
    proto.handleEvent = {value(event) {
      this[retype[event.type]](event);
    }};

  // [props]
  if (props !== null) {
    if (props) {
      for (let k = keys$1(props), i = 0; i < k.length; i++) {
        const key = k[i];
        proto[key] = {
          get() {
            bootstrap(this);
            return ownProps.get(this)[key];
          },
          set(value) {
            bootstrap(this, key, value);
          }
        };
      }
    }
    else {
      proto.props = {get() {
        const props = {};
        for (let {attributes} = this, {length} = attributes, i = 0; i < length; i++) {
          const {name, value} = attributes[i];
          props[name] = value;
        }
        return props;
      }};
    }
  }
  // [/props]

  if (observedAttributes)
    statics.observedAttributes = {value: observedAttributes};
  proto.attributeChangedCallback =  {value() {
    bootstrap(this);
    if (attributeChanged)
      attributeChanged.apply(this, arguments);
  }};

  proto.connectedCallback = {value() {
    bootstrap(this);
    if (connected)
      connected.call(this);
  }};

  if (disconnected)
    proto.disconnectedCallback = {value: disconnected};

  const {c, e} = info(definition.extends || element);
  class MicroElement extends c {}  defineProperties(MicroElement, statics);
  defineProperties(MicroElement.prototype, proto);
  const args = [tagName, MicroElement];
  if (e !== element)
    args.push({extends: e});
  defineCustomElement.apply(CE, args);
  constructors.set(tagName, {c: MicroElement, e});
  if (style)
    document.head.appendChild(el('style')).textContent = style(
      e === element ? tagName : (e + '[is="' + tagName + '"]')
    );
  return MicroElement;
};

/* istanbul ignore else */
if (!CE.get('uce-lib'))
  // theoretically this could be just class { ... }
  // however, if there is for whatever reason a <uce-lib>
  // element on the page, it will break once the registry
  // will try to upgrade such element so ... HTMLElement it is.
  CE.define('uce-lib', class extends info(element).c {
    static get define() { return define; }
    static get render() { return render; }
    static get html() { return html; }
    static get svg() { return svg; }
    static get css() { return css; }
  });

function bind(method) {
  this[method] = this[method].bind(this);
}

function content() {
  return render(this, html.apply(null, arguments));
}

const value = (props, key) => props[key];

var state = ({
  all = false,
  shallow = true,
  useState = noop$1
} = {}) => (props, update) => defineProperties$1(
  {}, loop(props, value, all, shallow, useState, update)
);

var stateHandler = (options = {}) => (options.dom ? dom : state)(options);

const TRUE = true, FALSE = false;
const QSA$1 = 'querySelectorAll';

function add(node) {
  this.observe(node, {subtree: TRUE, childList: TRUE});
}

/**
 * Start observing a generic document or root element.
 * @param {Function} callback triggered per each dis/connected node
 * @param {Element?} root by default, the global document to observe
 * @param {Function?} MO by default, the global MutationObserver
 * @returns {MutationObserver}
 */
const notify = (callback, root, MO) => {
  const loop = (nodes, added, removed, connected, pass) => {
    for (let i = 0, {length} = nodes; i < length; i++) {
      const node = nodes[i];
      if (pass || (QSA$1 in node)) {
        if (connected) {
          if (!added.has(node)) {
            added.add(node);
            removed.delete(node);
            callback(node, connected);
          }
        }
        else if (!removed.has(node)) {
          removed.add(node);
          added.delete(node);
          callback(node, connected);
        }
        if (!pass)
          loop(node[QSA$1]('*'), added, removed, connected, TRUE);
      }
    }
  };

  const observer = new (MO || MutationObserver)(records => {
    for (let
      added = new Set,
      removed = new Set,
      i = 0, {length} = records;
      i < length; i++
    ) {
      const {addedNodes, removedNodes} = records[i];
      loop(removedNodes, added, removed, FALSE, FALSE);
      loop(addedNodes, added, removed, TRUE, FALSE);
    }
  });

  observer.add = add;
  observer.add(root || document);

  return observer;
};

const QSA = 'querySelectorAll';

const {document: document$1, Element, MutationObserver: MutationObserver$1, Set: Set$1, WeakMap: WeakMap$1} = self;

const elements = element => QSA in element;
const {filter} = [];

var QSAO = options => {
  const live = new WeakMap$1;
  const drop = elements => {
    for (let i = 0, {length} = elements; i < length; i++)
      live.delete(elements[i]);
  };
  const flush = () => {
    const records = observer.takeRecords();
    for (let i = 0, {length} = records; i < length; i++) {
      parse(filter.call(records[i].removedNodes, elements), false);
      parse(filter.call(records[i].addedNodes, elements), true);
    }
  };
  const matches = element => (
    element.matches ||
    element.webkitMatchesSelector ||
    element.msMatchesSelector
  );
  const notifier = (element, connected) => {
    let selectors;
    if (connected) {
      for (let q, m = matches(element), i = 0, {length} = query; i < length; i++) {
        if (m.call(element, q = query[i])) {
          if (!live.has(element))
            live.set(element, new Set$1);
          selectors = live.get(element);
          if (!selectors.has(q)) {
            selectors.add(q);
            options.handle(element, connected, q);
          }
        }
      }
    }
    else if (live.has(element)) {
      selectors = live.get(element);
      live.delete(element);
      selectors.forEach(q => {
        options.handle(element, connected, q);
      });
    }
  };
  const parse = (elements, connected = true) => {
    for (let i = 0, {length} = elements; i < length; i++)
      notifier(elements[i], connected);
  };
  const {query} = options;
  const root = options.root || document$1;
  const observer = notify(notifier, root, MutationObserver$1);
  const {attachShadow} = Element.prototype;
  if (attachShadow)
    Element.prototype.attachShadow = function (init) {
      const shadowRoot = attachShadow.call(this, init);
      observer.add(shadowRoot);
      return shadowRoot;
    };
  if (query.length)
    parse(root[QSA](query));
  return {drop, flush, observer, parse};
};

if (!Lie.all)
  Lie.all = list => new Lie($ => {
    const {length} = list;
    if (!length)
      $();
    let i = 0;
    while (i < length)
      list[i++].then(update);
    i = 0;
    function update() {
      if (++i === length) $();
    }
  });

const {create, defineProperty, keys} = Object;

const lazyModules = [];
const strict = '"use strict;"\n';
const $require = module => cache[module];

const cache = create(null);

const waiting = {};

const asCJS = (esm, require) => {
  const exports = [];
  const imports = [];
  const cjs = esm
    .replace(
      /(^|[\r\n])\s*import\s*((['|"])[^\3]+?\3)/g,
      (_, $1, $2) => $1 + 'require(' + $2 + ')'
    )
    .replace(
      /(^|[\r\n])\s*import\s*([^\3]+?)(\s*from\s*)((['|"])[^\5]+?\5)/g,
      (_, $1, $2, $, $3) => (
        $1 + 'const ' + $2.replace(/\s+as\s+/g, ':') + ' = require(' + $3 + ')'
      )
    )
    .replace(
      /^\s*export\s+default(\s*)/mg,
      'exports.default =$1'
    )
    .replace(
      /(^|[\r\n])\s*export\s*\{([^}]+?)\}[^\n]*/g,
      (_, $, $1) => {
        $1.trim().split(/\s*,\s*/).forEach(name => {
          exports.push(`exports.${name} = ${name};`);
        });
        return $;
      }
    )
    .replace(
      /(^|[\r\n])\s*export\s+(const|let|var|function)(\s+)(\w+)/g,
      (_, $, $1, $2, $3) => {
        exports.push(`exports.${$3} = ${$3};`);
        return $ + $1 + $2 + $3;
      }
    )
    .concat('\n', exports.join('\n'))
    .replace(/require\s*\(\s*(['"])([^\1]+?)\1\s*\)/g, ($, _, module) => {
      imports.push(module);
      return $;
    })
  ;
  if (require) {
    imports.forEach(key => {
      if (!(key in cache)) {
        lazyModules.push(new Lie($ => {
          let module = waiting;
          if (/^(?:[./]|https?:)/.test(key)) {
            cache[key] = module;
            const xhr = new XMLHttpRequest;
            xhr.open('get', key, true);
            xhr.send(null);
            xhr.onload = () => {
              $(cache[key] = loader(xhr.responseText));
            };
          }
          else {
            defineProperty(cache, key, {
              get: () => module,
              set: value => {
                $(module = value);
              }
            });
          }
        }));
      }
    });
    return new Lie($ => {
      Lie.all(lazyModules).then(() => $(cjs));
    });
  }
  return cjs;
};

const cjs = extras => {
  const args = keys(extras || {});
  const values = args.map(k => extras[k]).concat($require);
  args.push('require');
  return code => {
    const exports = {};
    const module = {exports};
    const params = args.concat('module', 'exports', strict + asCJS(code));
    const fn = Function.apply(null, params);
    fn.apply(null, values.concat(module, exports));
    const result = module.exports;
    const k = keys(result);
    return k.length === 1 && k[0] === 'default' ? result.default : result;
  };
};

const loader = cjs();

var partial = html => {
  const template = [];
  const values = [];
  const {length} = html;
  let s = 0, e = 0, p = 0;
  while (
    s < length &&
    -1 < (s = html.indexOf('{{', p)) &&
    -1 < (e = html.indexOf('}}', s + 2))
  ) {
    template.push(html.slice(p, s));
    values.push(html.slice(s + 2, e));
    p = e + 2;
  }
  template.push(html.slice(p));
  const args = [template];
  const rest = Function(
    'return function(){with(arguments[0])return[' + values + ']}'
  )();
  return function (object) {
    return args.concat(rest.call(this, object));
  };
};

const domHandler = stateHandler({dom: true, useState});
const query = [];
const {drop, parse: parseQSAO} = QSAO({
  query,
  handle(element, _, selector) {
    drop([element]);
    if (toBeDefined.has(selector)) {
      const define = toBeDefined.get(selector);
      toBeDefined.delete(selector);
      query.splice(query.indexOf(selector), 1);
      define();
    }
  }
});

const resolve = (name, module) => {
  if (name in cache && cache[name] !== waiting)
    console.warn('duplicated ' + name);
  cache[name] = module;
};

const parse = parts => {
  const template = new Template;
  template.innerHTML = parts;
  return template;
};

const toBeDefined = new Map;
const wrapSetup = [
  'module.exports=function(module,exports){"use strict";',
  '}'
];

const noop = () => {};

const badTemplate = () => {
  throw new Error('bad template');
};


const lazySetup = (fn, self, props, exports) => {
  const module = {exports};
  fn.call(self, module, exports);
  const result = module.exports;
  const out = result.default || result;
  if (props)
    domHandler(self, out.props);
  return out;
};

// preloaded imports
const virtualNameSpace = {
  define, render, html, svg, css,
  reactive: stateHandler({useState}),
  ref: ref$1, slot
};

// deprecated? namespace
resolve('@uce/reactive', virtualNameSpace.reactive);
resolve('@uce/slot', virtualNameSpace.slot);

// virtual namespace
resolve('@uce', virtualNameSpace);
resolve('uce', virtualNameSpace);

// extra/useful modules
const hooks = {
  augmentor: hooked,
  hooked,
  useState, useRef,
  useContext, createContext,
  useCallback, useMemo, useReducer,
  useEffect, useLayoutEffect
};
resolve('augmentor', hooks);
resolve('uhooks', hooks);
resolve('qsa-observer', QSAO);
resolve('reactive-props', stateHandler);
resolve('@webreflection/lie', Lie);

// <template is="uce-template" />
const Template = define(
  'uce-template',
  {extends: 'template', props: null, init}
);

Template.resolve = resolve;
Template.from = parse;

function init(tried) {
  const defineComponent = $ => {
    const params = partial(
      template.replace(/(<!--(\{\{)|(\}\})-->)/g, '$2$3')
    );
    const component = script && loader(isSetup ? wrapSetup.join($) : $) || {};
    const {observedAttributes, props, setup} = component;
    const hasTemplate = !!template.trim();
    const apply = isSetup || hasTemplate || !!setup;
    const hooks = new WeakMap;
    const definition = {
      props: null,
      extends: as ? name : 'element',
      init() {
        const self = this;
        const {html} = self;
        let init = true;
        let update = noop;
        const render = hooked(() => {
          if (init) {
            init = !init;
            if (apply) {
              self.render = render;
              if (props)
                domHandler(self, props);
              const values = isSetup ?
                              lazySetup(component, self, isProps, {}) :
                              (setup && component.setup(self));
              if (hasTemplate) {
                const args = params.bind(self, values || {});
                update = () => {
                  html.apply(self, args());
                };
              }
            }
          }
          update();
        });
        render();
        if (hasEffect(render))
          hooks.set(self, render);
      }
    };
    if (css)
      definition.style = () => css;
    if (shadow)
      definition.attachShadow = {mode: shadow};
    if (observedAttributes) {
      definition.observedAttributes = observedAttributes;
      const aC = definition.attributeChanged = function () {
        const {attributeChanged} = this;
        if (attributeChanged !== aC)
          attributeChanged.apply(this, arguments);
      };
    }
    if (script) {
      const c = definition.connected = function () {
        const {connected} = this;
        if (connected !== c)
          connected.call(this);
      };
      const d = definition.disconnected = function () {
        const {disconnected} = this;
        if (hooks.has(this))
          dropEffect(hooks.get(this));
        if (disconnected !== d)
          disconnected.call(this);
      };
    }
    for (const key in component) {
      if (!(key in definition))
        definition[key] = component[key];
    }
    define(as || name, definition);
  };

  const {content, ownerDocument, parentNode} = this;
  const {childNodes} = content || createContent(this.innerHTML);
  const styles = [];

  // drop this element in IE11before its content is live
  if (parentNode && this instanceof HTMLUnknownElement)
    parentNode.removeChild(this);

  let later = defineComponent;
  let isSetup = false;
  let isProps = false;
  let as = '';
  let css = '';
  let name = '';
  let script = '';
  let shadow = '';
  let template = '';
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if (child.nodeType === 1) {
      const {tagName} = child;
      const is = has(child, 'is');
      if (/^style$/i.test(tagName))
        styles.push(child);
      else if (is || /-/i.test(tagName)) {
        if (name)
          badTemplate();
        name = tagName.toLowerCase();
        template = child.innerHTML;
        if (is)
          as = get(child, 'is').toLowerCase();
        if (has(child, 'shadow'))
          shadow = get(child, 'shadow') || 'open';
      }
      else if (/^script$/i.test(tagName)) {
        if (script)
          badTemplate();
        isSetup = has(child, 'setup');
        isProps = isSetup && get(child, 'setup') === 'props';
        script = child.textContent;
        later = () => {
          asCJS(script, true).then(defineComponent);
        };
      }
    }
  }
  const selector = as ? (name + '[is="' + as + '"]') : name;
  if (!selector)
    return setTimeout(tried ? badTemplate : init.bind(this), 0, true);
  for (let i = styles.length; i--;) {
    const child = styles[i];
    const {textContent} = child;
    if (has(child, 'shadow'))
      template = '<style>' + textContent + '</style>' + template;
    else if (has(child, 'scoped')) {
      const def = [];
      css += textContent.replace(
              /\{([^}]+?)\}/g,
              (_, $1) => '\x01' + def.push($1) + ','
            )
            .split(',')
            .map(s => (s.trim() ? (selector + ' ' + s.trim()) : ''))
            .join(',\n')
            .replace(/\x01(\d+),/g, (_, $1) => '{' + def[--$1] + '}')
            .replace(/(,\n)+/g, ',\n');
    }
    else
      css += textContent;
  }
  if (has(this, 'lazy')) {
    toBeDefined.set(selector, later);
    query.push(selector);
    parseQSAO(ownerDocument.querySelectorAll(query));
  }
  else
    later();
}

export { parse, resolve };
