import dq from './dquery';

class CardModal {
  constructor(modalTag) {
    this.tag = modalTag;
  }

  inject(onBack, onDone) {
    dq.insert('#livecard-wrapper', this.template());

    const phoneMask = new IMask(document.querySelector(".phone_us"), {
      mask: "(000) 000-0000",
      lazy: false, // make placeholder always visible
      placeholderChar: "_" // defaults to '_'
    });

    const hide = this.hide.bind(this);

    dq.click(".livecard-modal-back-arrow", () => {
      hide();
      onBack();
    });

    dq.click("#btnFinish", () => {
      hide();
      onDone(dq.val("#txtPhone"));
    });

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', event => { remove(); });
  }

  remove() {
    console.log('reset video container');
    // remove all event handlers
  }

  hide() {
    this.removeClass('#card_created_modal', 'show');
  }

  show() {
    this.addClass('#card_created_modal', 'show');
  }

  template() {
    return `
    <div class="livecard-modal fade" id="card_created_modal" tabindex="-1" role="dialog" aria-labelledby="card_created_modal_label" aria-hidden="true">
      <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
        <div class="livecard-modal-content">
          <div class="livecard-modal-body">
            <img src="https://retailer.live.cards/checkout/livecard-sdk/images/back.png" alt="" class="livecard-modal-back-arrow" />
            <img src="https://retailer.live.cards/checkout/livecard-sdk/images/dismiss.png" alt="x" class="livecard-modal-close" aria-label="Close" />
            <h2 class="livecard-modal-title text-center" id="card_created_modal_label">VIDEO CARD CREATED</h2>
            <div class="livecard-form-group">
              <label>Gift recipient phone number</label>
              <input class="livecard-form-control phone_us" type="tel" placeholder="(888) 888-8888" id="txtPhone" />
            </div>
            <button type="button" class="btn livecard-btn-modal-submit" id="btnFinish">FINISH</button>
          </div>
        </div>
      </div>
    </div>`;
  }

};

export default CardModal;

// ======================================= remove imask later ==================================================

/* https://unpkg.com/imask@4.1.3/dist/imask.min.js */
!(function(t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : (t.IMask = e());
})(this, function() {
  "use strict";
  var t = function(t) {
      if (null == t) throw TypeError("Can't call method on  " + t);
      return t;
    },
    e = {}.hasOwnProperty,
    n = function(t, n) {
      return e.call(t, n);
    },
    u = {}.toString,
    i = Object("z").propertyIsEnumerable(0)
      ? Object
      : function(t) {
          return "String" ==
            (function(t) {
              return u.call(t).slice(8, -1);
            })(t)
            ? t.split("")
            : Object(t);
        },
    r = function(e) {
      return i(t(e));
    },
    a = Math.ceil,
    s = Math.floor,
    o = function(t) {
      return isNaN((t = +t)) ? 0 : (t > 0 ? s : a)(t);
    },
    l = Math.min,
    h = function(t) {
      return t > 0 ? l(o(t), 9007199254740991) : 0;
    },
    c = Math.max,
    f = Math.min;
  function p(t, e) {
    return t((e = { exports: {} }), e.exports), e.exports;
  }
  var d,
    v,
    k = p(function(t) {
      var e = (t.exports =
        "undefined" != typeof window && window.Math == Math
          ? window
          : "undefined" != typeof self && self.Math == Math
          ? self
          : Function("return this")());
      "number" == typeof __g && (__g = e);
    }),
    g = k["__core-js_shared__"] || (k["__core-js_shared__"] = {}),
    y = 0,
    _ = Math.random(),
    m = function(t) {
      return "Symbol(".concat(
        void 0 === t ? "" : t,
        ")_",
        (++y + _).toString(36)
      );
    },
    A = g[(d = "keys")] || (g[d] = {}),
    C = ((v = !1),
    function(t, e, n) {
      var u,
        i = r(t),
        a = h(i.length),
        s = (function(t, e) {
          return (t = o(t)) < 0 ? c(t + e, 0) : f(t, e);
        })(n, a);
      if (v && e != e) {
        for (; a > s; ) if ((u = i[s++]) != u) return !0;
      } else
        for (; a > s; s++) if ((v || s in i) && i[s] === e) return v || s || 0;
      return !v && -1;
    }),
    F = (function(t) {
      return A[t] || (A[t] = m(t));
    })("IE_PROTO"),
    E = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
      ","
    ),
    b =
      Object.keys ||
      function(t) {
        return (function(t, e) {
          var u,
            i = r(t),
            a = 0,
            s = [];
          for (u in i) u != F && n(i, u) && s.push(u);
          for (; e.length > a; ) n(i, (u = e[a++])) && (~C(s, u) || s.push(u));
          return s;
        })(t, E);
      },
    B = p(function(t) {
      var e = (t.exports = { version: "2.5.5" });
      "number" == typeof __e && (__e = e);
    }),
    S = (B.version,
    function(t) {
      return "object" == typeof t ? null !== t : "function" == typeof t;
    }),
    D = function(t) {
      if (!S(t)) throw TypeError(t + " is not an object!");
      return t;
    },
    T = function(t) {
      try {
        return !!t();
      } catch (t) {
        return !0;
      }
    },
    w = !T(function() {
      return (
        7 !=
        Object.defineProperty({}, "a", {
          get: function() {
            return 7;
          }
        }).a
      );
    }),
    x = k.document,
    M = S(x) && S(x.createElement),
    P =
      !w &&
      !T(function() {
        return (
          7 !=
          Object.defineProperty(
            ((t = "div"), M ? x.createElement(t) : {}),
            "a",
            {
              get: function() {
                return 7;
              }
            }
          ).a
        );
        var t;
      }),
    O = Object.defineProperty,
    I = {
      f: w
        ? Object.defineProperty
        : function(t, e, n) {
            if (
              (D(t),
              (e = (function(t, e) {
                if (!S(t)) return t;
                var n, u;
                if (
                  e &&
                  "function" == typeof (n = t.toString) &&
                  !S((u = n.call(t)))
                )
                  return u;
                if ("function" == typeof (n = t.valueOf) && !S((u = n.call(t))))
                  return u;
                if (
                  !e &&
                  "function" == typeof (n = t.toString) &&
                  !S((u = n.call(t)))
                )
                  return u;
                throw TypeError("Can't convert object to primitive value");
              })(e, !0)),
              D(n),
              P)
            )
              try {
                return O(t, e, n);
              } catch (t) {}
            if ("get" in n || "set" in n)
              throw TypeError("Accessors not supported!");
            return "value" in n && (t[e] = n.value), t;
          }
    },
    R = w
      ? function(t, e, n) {
          return I.f(
            t,
            e,
            (function(t, e) {
              return {
                enumerable: !(1 & t),
                configurable: !(2 & t),
                writable: !(4 & t),
                value: e
              };
            })(1, n)
          );
        }
      : function(t, e, n) {
          return (t[e] = n), t;
        },
    V = p(function(t) {
      var e = m("src"),
        u = Function.toString,
        i = ("" + u).split("toString");
      (B.inspectSource = function(t) {
        return u.call(t);
      }),
        (t.exports = function(t, u, r, a) {
          var s = "function" == typeof r;
          s && (n(r, "name") || R(r, "name", u)),
            t[u] !== r &&
              (s && (n(r, e) || R(r, e, t[u] ? "" + t[u] : i.join(String(u)))),
              t === k
                ? (t[u] = r)
                : a
                ? t[u]
                  ? (t[u] = r)
                  : R(t, u, r)
                : (delete t[u], R(t, u, r)));
        })(Function.prototype, "toString", function() {
          return ("function" == typeof this && this[e]) || u.call(this);
        });
    }),
    j = function(t, e, n) {
      if (
        ((function(t) {
          if ("function" != typeof t)
            throw TypeError(t + " is not a function!");
        })(t),
        void 0 === e)
      )
        return t;
      switch (n) {
        case 1:
          return function(n) {
            return t.call(e, n);
          };
        case 2:
          return function(n, u) {
            return t.call(e, n, u);
          };
        case 3:
          return function(n, u, i) {
            return t.call(e, n, u, i);
          };
      }
      return function() {
        return t.apply(e, arguments);
      };
    },
    N = function(t, e, n) {
      var u,
        i,
        r,
        a,
        s = t & N.F,
        o = t & N.G,
        l = t & N.S,
        h = t & N.P,
        c = t & N.B,
        f = o ? k : l ? k[e] || (k[e] = {}) : (k[e] || {}).prototype,
        p = o ? B : B[e] || (B[e] = {}),
        d = p.prototype || (p.prototype = {});
      for (u in (o && (n = e), n))
        (r = ((i = !s && f && void 0 !== f[u]) ? f : n)[u]),
          (a =
            c && i
              ? j(r, k)
              : h && "function" == typeof r
              ? j(Function.call, r)
              : r),
          f && V(f, u, r, t & N.U),
          p[u] != r && R(p, u, a),
          h && d[u] != r && (d[u] = r);
    };
  (k.core = B),
    (N.F = 1),
    (N.G = 2),
    (N.S = 4),
    (N.P = 8),
    (N.B = 16),
    (N.W = 32),
    (N.U = 64),
    (N.R = 128);
  var L,
    H,
    G,
    U,
    z = N;
  (L = "keys"),
    (H = function() {
      return function(e) {
        return b(
          (function(e) {
            return Object(t(e));
          })(e)
        );
      };
    }),
    (G = (B.Object || {})[L] || Object[L]),
    ((U = {})[L] = H(G)),
    z(
      z.S +
        z.F *
          T(function() {
            G(1);
          }),
      "Object",
      U
    );
  B.Object.keys;
  var Y = function(e) {
    var n = String(t(this)),
      u = "",
      i = o(e);
    if (i < 0 || i == 1 / 0) throw RangeError("Count can't be negative");
    for (; i > 0; (i >>>= 1) && (n += n)) 1 & i && (u += n);
    return u;
  };
  z(z.P, "String", { repeat: Y });
  B.String.repeat;
  var Z = function(e, n, u, i) {
      var r = String(t(e)),
        a = r.length,
        s = void 0 === u ? " " : String(u),
        o = h(n);
      if (o <= a || "" == s) return r;
      var l = o - a,
        c = Y.call(s, Math.ceil(l / s.length));
      return c.length > l && (c = c.slice(0, l)), i ? c + r : r + c;
    },
    $ = k.navigator,
    K = ($ && $.userAgent) || "";
  z(z.P + z.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(K), "String", {
    padStart: function(t) {
      return Z(this, t, arguments.length > 1 ? arguments[1] : void 0, !0);
    }
  });
  B.String.padStart;
  z(z.P + z.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(K), "String", {
    padEnd: function(t) {
      return Z(this, t, arguments.length > 1 ? arguments[1] : void 0, !1);
    }
  });
  B.String.padEnd;
  function W(t) {
    return (W =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(t);
  }
  function q(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function");
  }
  function J(t, e) {
    for (var n = 0; n < e.length; n++) {
      var u = e[n];
      (u.enumerable = u.enumerable || !1),
        (u.configurable = !0),
        "value" in u && (u.writable = !0),
        Object.defineProperty(t, u.key, u);
    }
  }
  function Q(t, e, n) {
    return e && J(t.prototype, e), n && J(t, n), t;
  }
  function X(t, e, n) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
          })
        : (t[e] = n),
      t
    );
  }
  function tt() {
    return (tt =
      Object.assign ||
      function(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var u in n)
            Object.prototype.hasOwnProperty.call(n, u) && (t[u] = n[u]);
        }
        return t;
      }).apply(this, arguments);
  }
  function et(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = null != arguments[e] ? arguments[e] : {},
        u = Object.keys(n);
      "function" == typeof Object.getOwnPropertySymbols &&
        (u = u.concat(
          Object.getOwnPropertySymbols(n).filter(function(t) {
            return Object.getOwnPropertyDescriptor(n, t).enumerable;
          })
        )),
        u.forEach(function(e) {
          X(t, e, n[e]);
        });
    }
    return t;
  }
  function nt(t, e) {
    if ("function" != typeof e && null !== e)
      throw new TypeError("Super expression must either be null or a function");
    (t.prototype = Object.create(e && e.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 }
    })),
      e && it(t, e);
  }
  function ut(t) {
    return (ut = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function(t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function it(t, e) {
    return (it =
      Object.setPrototypeOf ||
      function(t, e) {
        return (t.__proto__ = e), t;
      })(t, e);
  }
  function rt(t, e) {
    if (null == t) return {};
    var n,
      u,
      i = (function(t, e) {
        if (null == t) return {};
        var n,
          u,
          i = {},
          r = Object.keys(t);
        for (u = 0; u < r.length; u++)
          (n = r[u]), e.indexOf(n) >= 0 || (i[n] = t[n]);
        return i;
      })(t, e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      for (u = 0; u < r.length; u++)
        (n = r[u]),
          e.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(t, n) && (i[n] = t[n]));
    }
    return i;
  }
  function at(t, e) {
    return !e || ("object" != typeof e && "function" != typeof e)
      ? (function(t) {
          if (void 0 === t)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return t;
        })(t)
      : e;
  }
  function st(t, e) {
    for (
      ;
      !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = ut(t));

    );
    return t;
  }
  function ot(t, e, n) {
    return (ot =
      "undefined" != typeof Reflect && Reflect.get
        ? Reflect.get
        : function(t, e, n) {
            var u = st(t, e);
            if (u) {
              var i = Object.getOwnPropertyDescriptor(u, e);
              return i.get ? i.get.call(n) : i.value;
            }
          })(t, e, n || t);
  }
  function lt(t, e, n, u) {
    return (lt =
      "undefined" != typeof Reflect && Reflect.set
        ? Reflect.set
        : function(t, e, n, u) {
            var i,
              r = st(t, e);
            if (r) {
              if ((i = Object.getOwnPropertyDescriptor(r, e)).set)
                return i.set.call(u, n), !0;
              if (!i.writable) return !1;
            }
            if ((i = Object.getOwnPropertyDescriptor(u, e))) {
              if (!i.writable) return !1;
              (i.value = n), Object.defineProperty(u, e, i);
            } else X(u, e, n);
            return !0;
          })(t, e, n, u);
  }
  function ht(t, e, n, u, i) {
    if (!lt(t, e, n, u || t) && i) throw new Error("failed to set property");
    return n;
  }
  function ct(t, e) {
    return (
      (function(t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function(t, e) {
        var n = [],
          u = !0,
          i = !1,
          r = void 0;
        try {
          for (
            var a, s = t[Symbol.iterator]();
            !(u = (a = s.next()).done) &&
            (n.push(a.value), !e || n.length !== e);
            u = !0
          );
        } catch (t) {
          (i = !0), (r = t);
        } finally {
          try {
            u || null == s.return || s.return();
          } finally {
            if (i) throw r;
          }
        }
        return n;
      })(t, e) ||
      (function() {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      })()
    );
  }
  var ft = {
    NONE: "NONE",
    LEFT: "LEFT",
    FORCE_LEFT: "FORCE_LEFT",
    RIGHT: "RIGHT",
    FORCE_RIGHT: "FORCE_RIGHT"
  };
  function pt(t) {
    return t.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
  }
  var dt =
      ("undefined" != typeof window && window) ||
      ("undefined" != typeof global && global.global === global && global) ||
      ("undefined" != typeof self && self.self === self && self) ||
      {},
    vt = (function() {
      function t(e, n, u, i) {
        for (
          q(this, t),
            this.value = e,
            this.cursorPos = n,
            this.oldValue = u,
            this.oldSelection = i;
          this.value.slice(0, this.startChangePos) !==
          this.oldValue.slice(0, this.startChangePos);

        )
          --this.oldSelection.start;
      }
      return (
        Q(t, [
          {
            key: "startChangePos",
            get: function() {
              return Math.min(this.cursorPos, this.oldSelection.start);
            }
          },
          {
            key: "insertedCount",
            get: function() {
              return this.cursorPos - this.startChangePos;
            }
          },
          {
            key: "inserted",
            get: function() {
              return this.value.substr(this.startChangePos, this.insertedCount);
            }
          },
          {
            key: "removedCount",
            get: function() {
              return Math.max(
                this.oldSelection.end - this.startChangePos ||
                  this.oldValue.length - this.value.length,
                0
              );
            }
          },
          {
            key: "removed",
            get: function() {
              return this.oldValue.substr(
                this.startChangePos,
                this.removedCount
              );
            }
          },
          {
            key: "head",
            get: function() {
              return this.value.substring(0, this.startChangePos);
            }
          },
          {
            key: "tail",
            get: function() {
              return this.value.substring(
                this.startChangePos + this.insertedCount
              );
            }
          },
          {
            key: "removeDirection",
            get: function() {
              return !this.removedCount || this.insertedCount
                ? ft.NONE
                : this.oldSelection.end === this.cursorPos ||
                  this.oldSelection.start === this.cursorPos
                ? ft.RIGHT
                : ft.LEFT;
            }
          }
        ]),
        t
      );
    })(),
    kt = (function() {
      function t(e) {
        q(this, t),
          tt(
            this,
            { inserted: "", rawInserted: "", skip: !1, tailShift: 0 },
            e
          );
      }
      return (
        Q(t, [
          {
            key: "aggregate",
            value: function(t) {
              return (
                (this.rawInserted += t.rawInserted),
                (this.skip = this.skip || t.skip),
                (this.inserted += t.inserted),
                (this.tailShift += t.tailShift),
                this
              );
            }
          },
          {
            key: "offset",
            get: function() {
              return this.tailShift + this.inserted.length;
            }
          }
        ]),
        t
      );
    })(),
    gt = (function() {
      function t(e) {
        q(this, t),
          (this._value = ""),
          this._update(e),
          (this.isInitialized = !0);
      }
      return (
        Q(t, [
          {
            key: "updateOptions",
            value: function(t) {
              Object.keys(t).length &&
                this.withValueRefresh(this._update.bind(this, t));
            }
          },
          {
            key: "_update",
            value: function(t) {
              tt(this, t);
            }
          },
          {
            key: "reset",
            value: function() {
              this._value = "";
            }
          },
          {
            key: "resolve",
            value: function(t) {
              return (
                this.reset(),
                this.append(t, { input: !0 }, { value: "" }),
                this.doCommit(),
                this.value
              );
            }
          },
          {
            key: "nearestInputPos",
            value: function(t, e) {
              return t;
            }
          },
          {
            key: "extractInput",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length;
              return this.value.slice(t, e);
            }
          },
          {
            key: "extractTail",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length;
              return { value: this.extractInput(t, e) };
            }
          },
          {
            key: "_storeBeforeTailState",
            value: function() {
              this._beforeTailState = this.state;
            }
          },
          {
            key: "_restoreBeforeTailState",
            value: function() {
              this.state = this._beforeTailState;
            }
          },
          {
            key: "_resetBeforeTailState",
            value: function() {
              this._beforeTailState = null;
            }
          },
          {
            key: "appendTail",
            value: function(t) {
              return this.append(t ? t.value : "", { tail: !0 });
            }
          },
          {
            key: "_appendCharRaw",
            value: function(t) {
              return (
                (this._value += t), new kt({ inserted: t, rawInserted: t })
              );
            }
          },
          {
            key: "_appendChar",
            value: function(t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                n = arguments.length > 2 ? arguments[2] : void 0;
              if (!(t = this.doPrepare(t, e))) return new kt();
              var u = this.state,
                i = this._appendCharRaw(t, e);
              if (i.inserted) {
                var r = !1 !== this.doValidate(e);
                if (r && null != n) {
                  this._storeBeforeTailState();
                  var a = this.appendTail(n);
                  (r = a.rawInserted === n.value) &&
                    a.inserted &&
                    this._restoreBeforeTailState();
                }
                r || ((i.rawInserted = i.inserted = ""), (this.state = u));
              }
              return i;
            }
          },
          {
            key: "append",
            value: function(t, e, n) {
              this.value.length;
              for (var u = new kt(), i = 0; i < t.length; ++i)
                u.aggregate(this._appendChar(t[i], e, n));
              return (
                null != n &&
                  (this._storeBeforeTailState(),
                  (u.tailShift += this.appendTail(n).tailShift)),
                u
              );
            }
          },
          {
            key: "remove",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length;
              return (
                (this._value = this.value.slice(0, t) + this.value.slice(e)),
                new kt()
              );
            }
          },
          {
            key: "withValueRefresh",
            value: function(t) {
              if (this._refreshing || !this.isInitialized) return t();
              this._refreshing = !0;
              var e = this.unmaskedValue,
                n = this.value,
                u = t();
              return (
                this.resolve(n) !== n && (this.unmaskedValue = e),
                delete this._refreshing,
                u
              );
            }
          },
          {
            key: "doPrepare",
            value: function(t) {
              var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              return this.prepare ? this.prepare(t, this, e) : t;
            }
          },
          {
            key: "doValidate",
            value: function(t) {
              return (
                (!this.validate || this.validate(this.value, this, t)) &&
                (!this.parent || this.parent.doValidate(t))
              );
            }
          },
          {
            key: "doCommit",
            value: function() {
              this.commit && this.commit(this.value, this);
            }
          },
          {
            key: "splice",
            value: function(t, e, n, u) {
              var i = t + e,
                r = this.extractTail(i),
                a = this.nearestInputPos(t, u);
              return new kt({ tailShift: a - t })
                .aggregate(this.remove(a))
                .aggregate(this.append(n, { input: !0 }, r));
            }
          },
          {
            key: "state",
            get: function() {
              return { _value: this.value };
            },
            set: function(t) {
              this._value = t._value;
            }
          },
          {
            key: "value",
            get: function() {
              return this._value;
            },
            set: function(t) {
              this.resolve(t);
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this.value;
            },
            set: function(t) {
              this.reset(), this.append(t, {}, { value: "" }), this.doCommit();
            }
          },
          {
            key: "typedValue",
            get: function() {
              return this.unmaskedValue;
            },
            set: function(t) {
              this.unmaskedValue = t;
            }
          },
          {
            key: "rawInputValue",
            get: function() {
              return this.extractInput(0, this.value.length, { raw: !0 });
            },
            set: function(t) {
              this.reset(),
                this.append(t, { raw: !0 }, { value: "" }),
                this.doCommit();
            }
          },
          {
            key: "isComplete",
            get: function() {
              return !0;
            }
          }
        ]),
        t
      );
    })();
  function yt(t) {
    if (null == t) throw new Error("mask property should be defined");
    return t instanceof RegExp
      ? dt.IMask.MaskedRegExp
      : "string" == typeof (e = t) || e instanceof String
      ? dt.IMask.MaskedPattern
      : t instanceof Date || t === Date
      ? dt.IMask.MaskedDate
      : t instanceof Number || "number" == typeof t || t === Number
      ? dt.IMask.MaskedNumber
      : Array.isArray(t) || t === Array
      ? dt.IMask.MaskedDynamic
      : t.prototype instanceof dt.IMask.Masked
      ? t
      : t instanceof Function
      ? dt.IMask.MaskedFunction
      : (console.warn("Mask not found for mask", t), dt.IMask.Masked);
    var e;
  }
  function _t(t) {
    var e = (t = et({}, t)).mask;
    return e instanceof dt.IMask.Masked ? e : new (yt(e))(t);
  }
  var mt = {
      0: /\d/,
      a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
      "*": /./
    },
    At = (function() {
      function t(e) {
        q(this, t);
        var n = e.mask,
          u = rt(e, ["mask"]);
        (this.masked = _t({ mask: n })), tt(this, u);
      }
      return (
        Q(t, [
          {
            key: "reset",
            value: function() {
              (this._isFilled = !1), this.masked.reset();
            }
          },
          {
            key: "remove",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length;
              return 0 === t && e >= 1
                ? ((this._isFilled = !1), this.masked.remove(t, e))
                : new kt();
            }
          },
          {
            key: "_appendChar",
            value: function(t) {
              var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              if (this._isFilled) return new kt();
              var n = this.masked.state,
                u = this.masked._appendChar(t, e);
              return (
                u.inserted &&
                  !1 === this.doValidate(e) &&
                  ((u.inserted = u.rawInserted = ""), (this.masked.state = n)),
                u.inserted ||
                  this.isOptional ||
                  this.lazy ||
                  e.input ||
                  (u.inserted = this.placeholderChar),
                (u.skip = !u.inserted && !this.isOptional),
                (this._isFilled = Boolean(u.inserted)),
                u
              );
            }
          },
          {
            key: "_appendPlaceholder",
            value: function() {
              var t = new kt();
              return this._isFilled || this.isOptional
                ? t
                : ((this._isFilled = !0),
                  (t.inserted = this.placeholderChar),
                  t);
            }
          },
          {
            key: "extractTail",
            value: function() {
              var t;
              return (t = this.masked).extractTail.apply(t, arguments);
            }
          },
          {
            key: "appendTail",
            value: function() {
              var t;
              return (t = this.masked).appendTail.apply(t, arguments);
            }
          },
          {
            key: "extractInput",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length,
                n = arguments.length > 2 ? arguments[2] : void 0;
              return this.masked.extractInput(t, e, n);
            }
          },
          {
            key: "nearestInputPos",
            value: function(t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : ft.NONE,
                n = this.value.length,
                u = Math.min(Math.max(t, 0), n);
              switch (e) {
                case ft.LEFT:
                case ft.FORCE_LEFT:
                  return this.isComplete ? u : 0;
                case ft.RIGHT:
                case ft.FORCE_RIGHT:
                  return this.isComplete ? u : n;
                case ft.NONE:
                default:
                  return u;
              }
            }
          },
          {
            key: "doValidate",
            value: function() {
              var t, e;
              return (
                (t = this.masked).doValidate.apply(t, arguments) &&
                (!this.parent ||
                  (e = this.parent).doValidate.apply(e, arguments))
              );
            }
          },
          {
            key: "doCommit",
            value: function() {
              this.masked.doCommit();
            }
          },
          {
            key: "value",
            get: function() {
              return (
                this.masked.value ||
                (this._isFilled && !this.isOptional ? this.placeholderChar : "")
              );
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this.masked.unmaskedValue;
            }
          },
          {
            key: "isComplete",
            get: function() {
              return Boolean(this.masked.value) || this.isOptional;
            }
          },
          {
            key: "state",
            get: function() {
              return { masked: this.masked.state, _isFilled: this._isFilled };
            },
            set: function(t) {
              (this.masked.state = t.masked), (this._isFilled = t._isFilled);
            }
          }
        ]),
        t
      );
    })(),
    Ct = (function() {
      function t(e) {
        q(this, t), tt(this, e), (this._value = "");
      }
      return (
        Q(t, [
          {
            key: "reset",
            value: function() {
              (this._isRawInput = !1), (this._value = "");
            }
          },
          {
            key: "remove",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this._value.length;
              return (
                (this._value = this._value.slice(0, t) + this._value.slice(e)),
                this._value || (this._isRawInput = !1),
                new kt()
              );
            }
          },
          {
            key: "nearestInputPos",
            value: function(t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : ft.NONE,
                n = this._value.length;
              switch (e) {
                case ft.LEFT:
                case ft.FORCE_LEFT:
                  return 0;
                case ft.NONE:
                case ft.RIGHT:
                case ft.FORCE_RIGHT:
                default:
                  return n;
              }
            }
          },
          {
            key: "extractInput",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this._value.length;
              return (
                ((arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {}
                ).raw &&
                  this._isRawInput &&
                  this._value.slice(t, e)) ||
                ""
              );
            }
          },
          {
            key: "_appendChar",
            value: function(t, e) {
              var n = new kt();
              if (this._value) return n;
              var u =
                this.char === t[0] &&
                (this.isUnmasking || e.input || e.raw) &&
                !e.tail;
              return (
                u && (n.rawInserted = this.char),
                (this._value = n.inserted = this.char),
                (this._isRawInput = u && (e.raw || e.input)),
                n
              );
            }
          },
          {
            key: "_appendPlaceholder",
            value: function() {
              var t = new kt();
              return this._value
                ? t
                : ((this._value = t.inserted = this.char), t);
            }
          },
          {
            key: "extractTail",
            value: function() {
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : this.value.length;
              return { value: "" };
            }
          },
          {
            key: "appendTail",
            value: function(t) {
              return this._appendChar(t ? t.value : "", { tail: !0 });
            }
          },
          { key: "doCommit", value: function() {} },
          {
            key: "value",
            get: function() {
              return this._value;
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this.isUnmasking ? this.value : "";
            }
          },
          {
            key: "isComplete",
            get: function() {
              return !0;
            }
          },
          {
            key: "state",
            get: function() {
              return { _value: this._value, _isRawInput: this._isRawInput };
            },
            set: function(t) {
              tt(this, t);
            }
          }
        ]),
        t
      );
    })(),
    Ft = (function() {
      function t(e) {
        q(this, t), (this.chunks = e);
      }
      return (
        Q(t, [
          {
            key: "value",
            get: function() {
              return this.chunks
                .map(function(t) {
                  return t.value;
                })
                .join("");
            }
          }
        ]),
        t
      );
    })(),
    Et = (function(t) {
      function e() {
        var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (
          q(this, e),
          (t.definitions = tt({}, mt, t.definitions)),
          at(this, ut(e).call(this, et({}, e.DEFAULTS, t)))
        );
      }
      return (
        nt(e, gt),
        Q(e, [
          {
            key: "_update",
            value: function() {
              var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              (t.definitions = tt({}, this.definitions, t.definitions)),
                ot(ut(e.prototype), "_update", this).call(this, t),
                this._rebuildMask();
            }
          },
          {
            key: "_rebuildMask",
            value: function() {
              var t = this,
                n = this.definitions;
              (this._blocks = []),
                (this._stops = []),
                (this._maskedBlocks = {});
              var u = this.mask;
              if (u && n)
                for (var i = !1, r = !1, a = 0; a < u.length; ++a) {
                  if (this.blocks)
                    if (
                      "continue" ===
                      (function() {
                        var e = u.slice(a),
                          n = Object.keys(t.blocks).filter(function(t) {
                            return 0 === e.indexOf(t);
                          });
                        n.sort(function(t, e) {
                          return e.length - t.length;
                        });
                        var i = n[0];
                        if (i) {
                          var r = _t(
                            et(
                              {
                                parent: t,
                                lazy: t.lazy,
                                placeholderChar: t.placeholderChar
                              },
                              t.blocks[i]
                            )
                          );
                          return (
                            r &&
                              (t._blocks.push(r),
                              t._maskedBlocks[i] || (t._maskedBlocks[i] = []),
                              t._maskedBlocks[i].push(t._blocks.length - 1)),
                            (a += i.length - 1),
                            "continue"
                          );
                        }
                      })()
                    )
                      continue;
                  var s = u[a],
                    o = s in n;
                  if (s !== e.STOP_CHAR)
                    if ("{" !== s && "}" !== s)
                      if ("[" !== s && "]" !== s) {
                        if (s === e.ESCAPE_CHAR) {
                          if (!(s = u[++a])) break;
                          o = !1;
                        }
                        var l = void 0;
                        (l = o
                          ? new At({
                              parent: this,
                              lazy: this.lazy,
                              placeholderChar: this.placeholderChar,
                              mask: n[s],
                              isOptional: r
                            })
                          : new Ct({ char: s, isUnmasking: i })),
                          this._blocks.push(l);
                      } else r = !r;
                    else i = !i;
                  else this._stops.push(this._blocks.length);
                }
            }
          },
          {
            key: "_storeBeforeTailState",
            value: function() {
              this._blocks.forEach(function(t) {
                "function" == typeof t._storeBeforeTailState &&
                  t._storeBeforeTailState();
              }),
                ot(ut(e.prototype), "_storeBeforeTailState", this).call(this);
            }
          },
          {
            key: "_restoreBeforeTailState",
            value: function() {
              this._blocks.forEach(function(t) {
                "function" == typeof t._restoreBeforeTailState &&
                  t._restoreBeforeTailState();
              }),
                ot(ut(e.prototype), "_restoreBeforeTailState", this).call(this);
            }
          },
          {
            key: "_resetBeforeTailState",
            value: function() {
              this._blocks.forEach(function(t) {
                "function" == typeof t._resetBeforeTailState &&
                  t._resetBeforeTailState();
              }),
                ot(ut(e.prototype), "_resetBeforeTailState", this).call(this);
            }
          },
          {
            key: "reset",
            value: function() {
              ot(ut(e.prototype), "reset", this).call(this),
                this._blocks.forEach(function(t) {
                  return t.reset();
                });
            }
          },
          {
            key: "doCommit",
            value: function() {
              this._blocks.forEach(function(t) {
                return t.doCommit();
              }),
                ot(ut(e.prototype), "doCommit", this).call(this);
            }
          },
          {
            key: "appendTail",
            value: function(t) {
              var n = new kt();
              return (
                t &&
                  n.aggregate(
                    t instanceof Ft
                      ? this._appendTailChunks(t.chunks)
                      : ot(ut(e.prototype), "appendTail", this).call(this, t)
                  ),
                n.aggregate(this._appendPlaceholder())
              );
            }
          },
          {
            key: "_appendCharRaw",
            value: function(t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                n = this._mapPosToBlock(this.value.length),
                u = new kt();
              if (!n) return u;
              for (var i = n.index; ; ++i) {
                var r = this._blocks[i];
                if (!r) break;
                var a = r._appendChar(t, e),
                  s = a.skip;
                if ((u.aggregate(a), s || a.rawInserted)) break;
              }
              return u;
            }
          },
          {
            key: "_appendTailChunks",
            value: function(t) {
              for (var e = new kt(), n = 0; n < t.length && !e.skip; ++n) {
                var u = t[n],
                  i = this._mapPosToBlock(this.value.length),
                  r =
                    u instanceof Ft &&
                    null != u.index &&
                    (!i || i.index <= u.index) &&
                    this._blocks[u.index];
                if (r) {
                  e.aggregate(this._appendPlaceholder(u.index));
                  var a = r.appendTail(u);
                  (a.skip = !1), e.aggregate(a), (this._value += a.inserted);
                  var s = u.value.slice(a.rawInserted.length);
                  s && e.aggregate(this.append(s, { tail: !0 }));
                } else {
                  var o = u,
                    l = o.stop,
                    h = o.value;
                  null != l &&
                    this._stops.indexOf(l) >= 0 &&
                    e.aggregate(this._appendPlaceholder(l)),
                    e.aggregate(this.append(h, { tail: !0 }));
                }
              }
              return e;
            }
          },
          {
            key: "extractTail",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length;
              return new Ft(this._extractTailChunks(t, e));
            }
          },
          {
            key: "extractInput",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length,
                n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              if (t === e) return "";
              var u = "";
              return (
                this._forEachBlocksInRange(t, e, function(t, e, i, r) {
                  u += t.extractInput(i, r, n);
                }),
                u
              );
            }
          },
          {
            key: "_extractTailChunks",
            value: function() {
              var t = this,
                e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length;
              if (e === n) return [];
              var u,
                i = [];
              return (
                this._forEachBlocksInRange(e, n, function(e, n, r, a) {
                  for (
                    var s, o = e.extractTail(r, a), l = 0;
                    l < t._stops.length;
                    ++l
                  ) {
                    var h = t._stops[l];
                    if (!(h <= n)) break;
                    s = h;
                  }
                  if (o instanceof Ft) {
                    if (null == s) {
                      for (
                        var c = o.chunks.length, f = 0;
                        f < o.chunks.length;
                        ++f
                      )
                        if (null != o.chunks[f].stop) {
                          c = f;
                          break;
                        }
                      o.chunks
                        .splice(0, c)
                        .filter(function(t) {
                          return t.value;
                        })
                        .forEach(function(t) {
                          u ? (u.value += t.value) : (u = { value: t.value });
                        });
                    }
                    o.chunks.length &&
                      (u && i.push(u), (o.index = s), i.push(o), (u = null));
                  } else {
                    if (null != s) u && i.push(u), (o.stop = s);
                    else if (u) return void (u.value += o.value);
                    u = o;
                  }
                }),
                u && u.value && i.push(u),
                i
              );
            }
          },
          {
            key: "_appendPlaceholder",
            value: function(t) {
              var e = this,
                n = new kt();
              if (this.lazy && null == t) return n;
              var u = this._mapPosToBlock(this.value.length);
              if (!u) return n;
              var i = u.index,
                r = null != t ? t : this._blocks.length;
              return (
                this._blocks.slice(i, r).forEach(function(t) {
                  if ("function" == typeof t._appendPlaceholder) {
                    var u = null != t._blocks ? [t._blocks.length] : [],
                      i = t._appendPlaceholder.apply(t, u);
                    (e._value += i.inserted), n.aggregate(i);
                  }
                }),
                n
              );
            }
          },
          {
            key: "_mapPosToBlock",
            value: function(t) {
              for (var e = "", n = 0; n < this._blocks.length; ++n) {
                var u = this._blocks[n],
                  i = e.length;
                if (t <= (e += u.value).length)
                  return { index: n, offset: t - i };
              }
            }
          },
          {
            key: "_blockStartPos",
            value: function(t) {
              return this._blocks.slice(0, t).reduce(function(t, e) {
                return t + e.value.length;
              }, 0);
            }
          },
          {
            key: "_forEachBlocksInRange",
            value: function(t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length,
                n = arguments.length > 2 ? arguments[2] : void 0,
                u = this._mapPosToBlock(t);
              if (u) {
                var i = this._mapPosToBlock(e),
                  r = i && u.index === i.index,
                  a = u.offset,
                  s = i && r ? i.offset : void 0;
                if ((n(this._blocks[u.index], u.index, a, s), i && !r)) {
                  for (var o = u.index + 1; o < i.index; ++o)
                    n(this._blocks[o], o);
                  n(this._blocks[i.index], i.index, 0, i.offset);
                }
              }
            }
          },
          {
            key: "remove",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length,
                u = ot(ut(e.prototype), "remove", this).call(this, t, n);
              return (
                this._forEachBlocksInRange(t, n, function(t, e, n, i) {
                  u.aggregate(t.remove(n, i));
                }),
                u
              );
            }
          },
          {
            key: "nearestInputPos",
            value: function(t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : ft.NONE,
                n = this._mapPosToBlock(t) || { index: 0, offset: 0 },
                u = n.offset,
                i = n.index,
                r = this._blocks[i];
              if (!r) return t;
              var a = u;
              0 !== a &&
                a < r.value.length &&
                (a = r.nearestInputPos(
                  u,
                  (function(t) {
                    switch (t) {
                      case ft.LEFT:
                        return ft.FORCE_LEFT;
                      case ft.RIGHT:
                        return ft.FORCE_RIGHT;
                      default:
                        return t;
                    }
                  })(e)
                ));
              var s = a === r.value.length;
              if (!(0 === a) && !s) return this._blockStartPos(i) + a;
              var o = s ? i + 1 : i;
              if (e === ft.NONE) {
                if (o > 0) {
                  var l = o - 1,
                    h = this._blocks[l],
                    c = h.nearestInputPos(0, ft.NONE);
                  if (!h.value.length || c !== h.value.length)
                    return this._blockStartPos(o);
                }
                for (var f = o; f < this._blocks.length; ++f) {
                  var p = this._blocks[f],
                    d = p.nearestInputPos(0, ft.NONE);
                  if (d !== p.value.length) return this._blockStartPos(f) + d;
                }
                return this.value.length;
              }
              if (e === ft.LEFT || e === ft.FORCE_LEFT) {
                for (var v, k = o; k < this._blocks.length; ++k)
                  if (this._blocks[k].value) {
                    v = k;
                    break;
                  }
                if (null != v) {
                  var g = this._blocks[v],
                    y = g.nearestInputPos(0, ft.RIGHT);
                  if (0 === y && g.unmaskedValue.length)
                    return this._blockStartPos(v) + y;
                }
                for (var _, m = -1, A = o - 1; A >= 0; --A) {
                  var C = this._blocks[A],
                    F = C.nearestInputPos(C.value.length, ft.FORCE_LEFT);
                  if ((null != _ || (C.value && 0 === F) || (_ = A), 0 !== F)) {
                    if (F !== C.value.length) return this._blockStartPos(A) + F;
                    m = A;
                    break;
                  }
                }
                if (e === ft.LEFT)
                  for (
                    var E = m + 1;
                    E <= Math.min(o, this._blocks.length - 1);
                    ++E
                  ) {
                    var b = this._blocks[E],
                      B = b.nearestInputPos(0, ft.NONE),
                      S = this._blockStartPos(E) + B;
                    if (
                      ((!b.value.length && S === this.value.length) ||
                        B !== b.value.length) &&
                      S <= t
                    )
                      return S;
                  }
                if (m >= 0)
                  return this._blockStartPos(m) + this._blocks[m].value.length;
                if (
                  e === ft.FORCE_LEFT ||
                  (this.lazy &&
                    !this.extractInput() &&
                    !(function(t) {
                      if (!t) return !1;
                      var e = t.value;
                      return !e || t.nearestInputPos(0, ft.NONE) !== e.length;
                    })(this._blocks[o]))
                )
                  return 0;
                if (null != _) return this._blockStartPos(_);
                for (var D = o; D < this._blocks.length; ++D) {
                  var T = this._blocks[D],
                    w = T.nearestInputPos(0, ft.NONE);
                  if (!T.value.length || w !== T.value.length)
                    return this._blockStartPos(D) + w;
                }
                return 0;
              }
              if (e === ft.RIGHT || e === ft.FORCE_RIGHT) {
                for (var x, M, P = o; P < this._blocks.length; ++P) {
                  var O = this._blocks[P],
                    I = O.nearestInputPos(0, ft.NONE);
                  if (I !== O.value.length) {
                    (M = this._blockStartPos(P) + I), (x = P);
                    break;
                  }
                }
                if (null != x && null != M) {
                  for (var R = x; R < this._blocks.length; ++R) {
                    var V = this._blocks[R],
                      j = V.nearestInputPos(0, ft.FORCE_RIGHT);
                    if (j !== V.value.length) return this._blockStartPos(R) + j;
                  }
                  return e === ft.FORCE_RIGHT ? this.value.length : M;
                }
                for (
                  var N = Math.min(o, this._blocks.length - 1);
                  N >= 0;
                  --N
                ) {
                  var L = this._blocks[N],
                    H = L.nearestInputPos(L.value.length, ft.LEFT);
                  if (0 !== H) {
                    var G = this._blockStartPos(N) + H;
                    if (G >= t) return G;
                    break;
                  }
                }
              }
              return t;
            }
          },
          {
            key: "maskedBlock",
            value: function(t) {
              return this.maskedBlocks(t)[0];
            }
          },
          {
            key: "maskedBlocks",
            value: function(t) {
              var e = this,
                n = this._maskedBlocks[t];
              return n
                ? n.map(function(t) {
                    return e._blocks[t];
                  })
                : [];
            }
          },
          {
            key: "state",
            get: function() {
              return et({}, ot(ut(e.prototype), "state", this), {
                _blocks: this._blocks.map(function(t) {
                  return t.state;
                })
              });
            },
            set: function(t) {
              var n = t._blocks,
                u = rt(t, ["_blocks"]);
              this._blocks.forEach(function(t, e) {
                return (t.state = n[e]);
              }),
                ht(ut(e.prototype), "state", u, this, !0);
            }
          },
          {
            key: "isComplete",
            get: function() {
              return this._blocks.every(function(t) {
                return t.isComplete;
              });
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this._blocks.reduce(function(t, e) {
                return t + e.unmaskedValue;
              }, "");
            },
            set: function(t) {
              ht(ut(e.prototype), "unmaskedValue", t, this, !0);
            }
          },
          {
            key: "value",
            get: function() {
              return this._blocks.reduce(function(t, e) {
                return t + e.value;
              }, "");
            },
            set: function(t) {
              ht(ut(e.prototype), "value", t, this, !0);
            }
          }
        ]),
        e
      );
    })();
  (Et.DEFAULTS = { lazy: !0, placeholderChar: "_" }),
    (Et.STOP_CHAR = "`"),
    (Et.ESCAPE_CHAR = "\\"),
    (Et.InputDefinition = At),
    (Et.FixedDefinition = Ct);
  var bt = (function(t) {
      function e() {
        return q(this, e), at(this, ut(e).apply(this, arguments));
      }
      return (
        nt(e, Et),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              t = et({ to: this.to || 0, from: this.from || 0 }, t);
              var n = String(t.to).length;
              null != t.maxLength && (n = Math.max(n, t.maxLength)),
                (t.maxLength = n);
              for (
                var u = String(t.to).padStart(n, "0"),
                  i = String(t.from).padStart(n, "0"),
                  r = 0;
                r < u.length && u[r] === i[r];

              )
                ++r;
              (t.mask = u.slice(0, r).replace(/0/g, "\\0") + "0".repeat(n - r)),
                ot(ut(e.prototype), "_update", this).call(this, t);
            }
          },
          {
            key: "doValidate",
            value: function() {
              var t,
                n = this.value,
                u = "",
                i = "",
                r = ct(n.match(/^(\D*)(\d*)(\D*)/) || [], 3),
                a = r[1],
                s = r[2];
              if (
                (s &&
                  ((u = "0".repeat(a.length) + s),
                  (i = "9".repeat(a.length) + s)),
                -1 === n.search(/[^0]/) && n.length <= this._matchFrom)
              )
                return !0;
              (u = u.padEnd(this.maxLength, "0")),
                (i = i.padEnd(this.maxLength, "9"));
              for (
                var o = arguments.length, l = new Array(o), h = 0;
                h < o;
                h++
              )
                l[h] = arguments[h];
              return (
                this.from <= Number(i) &&
                Number(u) <= this.to &&
                (t = ot(ut(e.prototype), "doValidate", this)).call.apply(
                  t,
                  [this].concat(l)
                )
              );
            }
          },
          {
            key: "_matchFrom",
            get: function() {
              return this.maxLength - String(this.from).length;
            }
          },
          {
            key: "isComplete",
            get: function() {
              return (
                ot(ut(e.prototype), "isComplete", this) && Boolean(this.value)
              );
            }
          }
        ]),
        e
      );
    })(),
    Bt = (function(t) {
      function e(t) {
        return q(this, e), at(this, ut(e).call(this, et({}, e.DEFAULTS, t)));
      }
      return (
        nt(e, Et),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              t.mask === Date && delete t.mask,
                t.pattern && ((t.mask = t.pattern), delete t.pattern);
              var n = t.blocks;
              (t.blocks = tt({}, e.GET_DEFAULT_BLOCKS())),
                t.min && (t.blocks.Y.from = t.min.getFullYear()),
                t.max && (t.blocks.Y.to = t.max.getFullYear()),
                t.min &&
                  t.max &&
                  t.blocks.Y.from === t.blocks.Y.to &&
                  ((t.blocks.m.from = t.min.getMonth() + 1),
                  (t.blocks.m.to = t.max.getMonth() + 1),
                  t.blocks.m.from === t.blocks.m.to &&
                    ((t.blocks.d.from = t.min.getDate()),
                    (t.blocks.d.to = t.max.getDate()))),
                tt(t.blocks, n),
                ot(ut(e.prototype), "_update", this).call(this, t);
            }
          },
          {
            key: "doValidate",
            value: function() {
              for (
                var t,
                  n = this.date,
                  u = arguments.length,
                  i = new Array(u),
                  r = 0;
                r < u;
                r++
              )
                i[r] = arguments[r];
              return (
                (t = ot(ut(e.prototype), "doValidate", this)).call.apply(
                  t,
                  [this].concat(i)
                ) &&
                (!this.isComplete ||
                  (this.isDateExist(this.value) &&
                    null != n &&
                    (null == this.min || this.min <= n) &&
                    (null == this.max || n <= this.max)))
              );
            }
          },
          {
            key: "isDateExist",
            value: function(t) {
              return this.format(this.parse(t)) === t;
            }
          },
          {
            key: "date",
            get: function() {
              return this.isComplete ? this.parse(this.value) : null;
            },
            set: function(t) {
              this.value = this.format(t);
            }
          },
          {
            key: "typedValue",
            get: function() {
              return this.date;
            },
            set: function(t) {
              this.date = t;
            }
          }
        ]),
        e
      );
    })();
  (Bt.DEFAULTS = {
    pattern: "d{.}`m{.}`Y",
    format: function(t) {
      return [
        String(t.getDate()).padStart(2, "0"),
        String(t.getMonth() + 1).padStart(2, "0"),
        t.getFullYear()
      ].join(".");
    },
    parse: function(t) {
      var e = ct(t.split("."), 3),
        n = e[0],
        u = e[1],
        i = e[2];
      return new Date(i, u - 1, n);
    }
  }),
    (Bt.GET_DEFAULT_BLOCKS = function() {
      return {
        d: { mask: bt, from: 1, to: 31, maxLength: 2 },
        m: { mask: bt, from: 1, to: 12, maxLength: 2 },
        Y: { mask: bt, from: 1900, to: 9999 }
      };
    });
  var St = (function() {
      function t() {
        q(this, t);
      }
      return (
        Q(t, [
          {
            key: "select",
            value: function(t, e) {
              if (
                null != t &&
                null != e &&
                (t !== this.selectionStart || e !== this.selectionEnd)
              )
                try {
                  this._unsafeSelect(t, e);
                } catch (t) {}
            }
          },
          { key: "_unsafeSelect", value: function(t, e) {} },
          { key: "bindEvents", value: function(t) {} },
          { key: "unbindEvents", value: function() {} },
          {
            key: "selectionStart",
            get: function() {
              var t;
              try {
                t = this._unsafeSelectionStart;
              } catch (t) {}
              return null != t ? t : this.value.length;
            }
          },
          {
            key: "selectionEnd",
            get: function() {
              var t;
              try {
                t = this._unsafeSelectionEnd;
              } catch (t) {}
              return null != t ? t : this.value.length;
            }
          },
          {
            key: "isActive",
            get: function() {
              return !1;
            }
          }
        ]),
        t
      );
    })(),
    Dt = (function(t) {
      function e(t) {
        var n;
        return (
          q(this, e),
          ((n = at(this, ut(e).call(this))).input = t),
          (n._handlers = {}),
          n
        );
      }
      return (
        nt(e, St),
        Q(e, [
          {
            key: "_unsafeSelect",
            value: function(t, e) {
              this.input.setSelectionRange(t, e);
            }
          },
          {
            key: "bindEvents",
            value: function(t) {
              var n = this;
              Object.keys(t).forEach(function(u) {
                return n._toggleEventHandler(e.EVENTS_MAP[u], t[u]);
              });
            }
          },
          {
            key: "unbindEvents",
            value: function() {
              var t = this;
              Object.keys(this._handlers).forEach(function(e) {
                return t._toggleEventHandler(e);
              });
            }
          },
          {
            key: "_toggleEventHandler",
            value: function(t, e) {
              this._handlers[t] &&
                (this.input.removeEventListener(t, this._handlers[t]),
                delete this._handlers[t]),
                e &&
                  (this.input.addEventListener(t, e), (this._handlers[t] = e));
            }
          },
          {
            key: "isActive",
            get: function() {
              return this.input === document.activeElement;
            }
          },
          {
            key: "_unsafeSelectionStart",
            get: function() {
              return this.input.selectionStart;
            }
          },
          {
            key: "_unsafeSelectionEnd",
            get: function() {
              return this.input.selectionEnd;
            }
          },
          {
            key: "value",
            get: function() {
              return this.input.value;
            },
            set: function(t) {
              this.input.value = t;
            }
          }
        ]),
        e
      );
    })();
  Dt.EVENTS_MAP = {
    selectionChange: "keydown",
    input: "input",
    drop: "drop",
    click: "click",
    focus: "focus",
    commit: "change"
  };
  var Tt = (function() {
      function t(e, n) {
        q(this, t),
          (this.el = e instanceof St ? e : new Dt(e)),
          (this.masked = _t(n)),
          (this._listeners = {}),
          (this._value = ""),
          (this._unmaskedValue = ""),
          (this._saveSelection = this._saveSelection.bind(this)),
          (this._onInput = this._onInput.bind(this)),
          (this._onChange = this._onChange.bind(this)),
          (this._onDrop = this._onDrop.bind(this)),
          (this.alignCursor = this.alignCursor.bind(this)),
          (this.alignCursorFriendly = this.alignCursorFriendly.bind(this)),
          this._bindEvents(),
          this.updateValue(),
          this._onChange();
      }
      return (
        Q(t, [
          {
            key: "_bindEvents",
            value: function() {
              this.el.bindEvents({
                selectionChange: this._saveSelection,
                input: this._onInput,
                drop: this._onDrop,
                click: this.alignCursorFriendly,
                focus: this.alignCursorFriendly,
                commit: this._onChange
              });
            }
          },
          {
            key: "_unbindEvents",
            value: function() {
              this.el.unbindEvents();
            }
          },
          {
            key: "_fireEvent",
            value: function(t) {
              var e = this._listeners[t];
              e &&
                e.forEach(function(t) {
                  return t();
                });
            }
          },
          {
            key: "_saveSelection",
            value: function() {
              this.value !== this.el.value &&
                console.warn(
                  "Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."
                ),
                (this._selection = {
                  start: this.selectionStart,
                  end: this.cursorPos
                });
            }
          },
          {
            key: "updateValue",
            value: function() {
              this.masked.value = this.el.value;
            }
          },
          {
            key: "updateControl",
            value: function() {
              var t = this.masked.unmaskedValue,
                e = this.masked.value,
                n = this.unmaskedValue !== t || this.value !== e;
              (this._unmaskedValue = t),
                (this._value = e),
                this.el.value !== e && (this.el.value = e),
                n && this._fireChangeEvents();
            }
          },
          {
            key: "updateOptions",
            value: function(t) {
              if (
                !(function t(e, n) {
                  if (n === e) return !0;
                  var u,
                    i = Array.isArray(n),
                    r = Array.isArray(e);
                  if (i && r) {
                    if (n.length != e.length) return !1;
                    for (u = 0; u < n.length; u++)
                      if (!t(n[u], e[u])) return !1;
                    return !0;
                  }
                  if (i != r) return !1;
                  if (n && e && "object" === W(n) && "object" === W(e)) {
                    var a = n instanceof Date,
                      s = e instanceof Date;
                    if (a && s) return n.getTime() == e.getTime();
                    if (a != s) return !1;
                    var o = n instanceof RegExp,
                      l = e instanceof RegExp;
                    if (o && l) return n.toString() == e.toString();
                    if (o != l) return !1;
                    var h = Object.keys(n);
                    for (u = 0; u < h.length; u++)
                      if (!Object.prototype.hasOwnProperty.call(e, h[u]))
                        return !1;
                    for (u = 0; u < h.length; u++)
                      if (!t(e[h[u]], n[h[u]])) return !1;
                    return !0;
                  }
                  return !1;
                })(this.masked, t)
              ) {
                var e = t.mask,
                  n = rt(t, ["mask"]);
                (this.mask = e),
                  this.masked.updateOptions(n),
                  this.updateControl();
              }
            }
          },
          {
            key: "updateCursor",
            value: function(t) {
              null != t && ((this.cursorPos = t), this._delayUpdateCursor(t));
            }
          },
          {
            key: "_delayUpdateCursor",
            value: function(t) {
              var e = this;
              this._abortUpdateCursor(),
                (this._changingCursorPos = t),
                (this._cursorChanging = setTimeout(function() {
                  e.el &&
                    ((e.cursorPos = e._changingCursorPos),
                    e._abortUpdateCursor());
                }, 10));
            }
          },
          {
            key: "_fireChangeEvents",
            value: function() {
              this._fireEvent("accept"),
                this.masked.isComplete && this._fireEvent("complete");
            }
          },
          {
            key: "_abortUpdateCursor",
            value: function() {
              this._cursorChanging &&
                (clearTimeout(this._cursorChanging),
                delete this._cursorChanging);
            }
          },
          {
            key: "alignCursor",
            value: function() {
              this.cursorPos = this.masked.nearestInputPos(
                this.cursorPos,
                ft.LEFT
              );
            }
          },
          {
            key: "alignCursorFriendly",
            value: function() {
              this.selectionStart === this.cursorPos && this.alignCursor();
            }
          },
          {
            key: "on",
            value: function(t, e) {
              return (
                this._listeners[t] || (this._listeners[t] = []),
                this._listeners[t].push(e),
                this
              );
            }
          },
          {
            key: "off",
            value: function(t, e) {
              if (this._listeners[t]) {
                if (e) {
                  var n = this._listeners[t].indexOf(e);
                  return n >= 0 && this._listeners[t].splice(n, 1), this;
                }
                delete this._listeners[t];
              }
            }
          },
          {
            key: "_onInput",
            value: function() {
              if ((this._abortUpdateCursor(), !this._selection))
                return this.updateValue();
              var t = new vt(
                  this.el.value,
                  this.cursorPos,
                  this.value,
                  this._selection
                ),
                e = this.masked.splice(
                  t.startChangePos,
                  t.removed.length,
                  t.inserted,
                  t.removeDirection
                ).offset,
                n = this.masked.nearestInputPos(
                  t.startChangePos + e,
                  t.removeDirection
                );
              this.updateControl(), this.updateCursor(n);
            }
          },
          {
            key: "_onChange",
            value: function() {
              this.value !== this.el.value && this.updateValue(),
                this.masked.doCommit(),
                this.updateControl();
            }
          },
          {
            key: "_onDrop",
            value: function(t) {
              t.preventDefault(), t.stopPropagation();
            }
          },
          {
            key: "destroy",
            value: function() {
              this._unbindEvents(),
                (this._listeners.length = 0),
                delete this.el;
            }
          },
          {
            key: "mask",
            get: function() {
              return this.masked.mask;
            },
            set: function(t) {
              if (
                !(
                  null == t ||
                  t === this.masked.mask ||
                  (t === Date && this.masked instanceof Bt)
                )
              )
                if (this.masked.constructor !== yt(t)) {
                  var e = _t({ mask: t });
                  (e.unmaskedValue = this.masked.unmaskedValue),
                    (this.masked = e);
                } else this.masked.updateOptions({ mask: t });
            }
          },
          {
            key: "value",
            get: function() {
              return this._value;
            },
            set: function(t) {
              (this.masked.value = t), this.updateControl(), this.alignCursor();
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this._unmaskedValue;
            },
            set: function(t) {
              (this.masked.unmaskedValue = t),
                this.updateControl(),
                this.alignCursor();
            }
          },
          {
            key: "typedValue",
            get: function() {
              return this.masked.typedValue;
            },
            set: function(t) {
              (this.masked.typedValue = t),
                this.updateControl(),
                this.alignCursor();
            }
          },
          {
            key: "selectionStart",
            get: function() {
              return this._cursorChanging
                ? this._changingCursorPos
                : this.el.selectionStart;
            }
          },
          {
            key: "cursorPos",
            get: function() {
              return this._cursorChanging
                ? this._changingCursorPos
                : this.el.selectionEnd;
            },
            set: function(t) {
              this.el.isActive && (this.el.select(t, t), this._saveSelection());
            }
          }
        ]),
        t
      );
    })(),
    wt = (function(t) {
      function e() {
        return q(this, e), at(this, ut(e).apply(this, arguments));
      }
      return (
        nt(e, Et),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              t.enum && (t.mask = "*".repeat(t.enum[0].length)),
                ot(ut(e.prototype), "_update", this).call(this, t);
            }
          },
          {
            key: "doValidate",
            value: function() {
              for (
                var t, n = this, u = arguments.length, i = new Array(u), r = 0;
                r < u;
                r++
              )
                i[r] = arguments[r];
              return (
                this.enum.some(function(t) {
                  return t.indexOf(n.unmaskedValue) >= 0;
                }) &&
                (t = ot(ut(e.prototype), "doValidate", this)).call.apply(
                  t,
                  [this].concat(i)
                )
              );
            }
          }
        ]),
        e
      );
    })(),
    xt = (function(t) {
      function e(t) {
        return q(this, e), at(this, ut(e).call(this, et({}, e.DEFAULTS, t)));
      }
      return (
        nt(e, gt),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              ot(ut(e.prototype), "_update", this).call(this, t),
                this._updateRegExps();
            }
          },
          {
            key: "_updateRegExps",
            value: function() {
              var t = "",
                e = "";
              this.allowNegative
                ? ((t += "([+|\\-]?|([+|\\-]?(0|([1-9]+\\d*))))"),
                  (e += "[+|\\-]?"))
                : (t += "(0|([1-9]+\\d*))"),
                (e += "\\d*");
              var n =
                (this.scale
                  ? "(" + pt(this.radix) + "\\d{0," + this.scale + "})?"
                  : "") + "$";
              (this._numberRegExpInput = new RegExp("^" + t + n)),
                (this._numberRegExp = new RegExp("^" + e + n)),
                (this._mapToRadixRegExp = new RegExp(
                  "[" + this.mapToRadix.map(pt).join("") + "]",
                  "g"
                )),
                (this._thousandsSeparatorRegExp = new RegExp(
                  pt(this.thousandsSeparator),
                  "g"
                ));
            }
          },
          {
            key: "extractTail",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length,
                u = ot(ut(e.prototype), "extractTail", this).call(this, t, n);
              return et({}, u, {
                value: this._removeThousandsSeparators(u.value)
              });
            }
          },
          {
            key: "_removeThousandsSeparators",
            value: function(t) {
              return t.replace(this._thousandsSeparatorRegExp, "");
            }
          },
          {
            key: "_insertThousandsSeparators",
            value: function(t) {
              var e = t.split(this.radix);
              return (
                (e[0] = e[0].replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  this.thousandsSeparator
                )),
                e.join(this.radix)
              );
            }
          },
          {
            key: "doPrepare",
            value: function(t) {
              for (
                var n,
                  u = arguments.length,
                  i = new Array(u > 1 ? u - 1 : 0),
                  r = 1;
                r < u;
                r++
              )
                i[r - 1] = arguments[r];
              return (n = ot(ut(e.prototype), "doPrepare", this)).call.apply(
                n,
                [
                  this,
                  this._removeThousandsSeparators(
                    t.replace(this._mapToRadixRegExp, this.radix)
                  )
                ].concat(i)
              );
            }
          },
          {
            key: "_separatorsCount",
            value: function() {
              for (
                var t =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : this._value,
                  e = this._removeThousandsSeparators(t).length,
                  n = e,
                  u = 0;
                u <= n;
                ++u
              )
                this._value[u] === this.thousandsSeparator && ++n;
              return n - e;
            }
          },
          {
            key: "_appendCharRaw",
            value: function(t) {
              var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              if (!this.thousandsSeparator)
                return ot(ut(e.prototype), "_appendCharRaw", this).call(
                  this,
                  t,
                  n
                );
              var u = this._separatorsCount(
                n.tail && this._beforeTailState
                  ? this._beforeTailState._value
                  : this._value
              );
              this._value = this._removeThousandsSeparators(this.value);
              var i = ot(ut(e.prototype), "_appendCharRaw", this).call(
                this,
                t,
                n
              );
              this._value = this._insertThousandsSeparators(this._value);
              var r = this._separatorsCount(
                n.tail && this._beforeTailState
                  ? this._beforeTailState._value
                  : this._value
              );
              return (i.tailShift += r - u), i;
            }
          },
          {
            key: "remove",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : this.value.length,
                n = this.value.slice(0, t),
                u = this.value.slice(e),
                i = this._separatorsCount(n);
              this._value = this._insertThousandsSeparators(
                this._removeThousandsSeparators(n + u)
              );
              var r = this._separatorsCount(n);
              return new kt({ tailShift: r - i });
            }
          },
          {
            key: "nearestInputPos",
            value: function(t, e) {
              if (!e) return t;
              var n = (function(t, e) {
                return e === ft.LEFT && --t, t;
              })(t, e);
              return (
                this.value[n] === this.thousandsSeparator &&
                  (t = (function(t, e) {
                    switch (e) {
                      case ft.LEFT:
                        return --t;
                      case ft.RIGHT:
                      case ft.FORCE_RIGHT:
                        return ++t;
                      default:
                        return t;
                    }
                  })(t, e)),
                t
              );
            }
          },
          {
            key: "doValidate",
            value: function(t) {
              var n = (t.input
                ? this._numberRegExpInput
                : this._numberRegExp
              ).test(this._removeThousandsSeparators(this.value));
              if (n) {
                var u = this.number;
                n =
                  n &&
                  !isNaN(u) &&
                  (null == this.min ||
                    this.min >= 0 ||
                    this.min <= this.number) &&
                  (null == this.max ||
                    this.max <= 0 ||
                    this.number <= this.max);
              }
              return n && ot(ut(e.prototype), "doValidate", this).call(this, t);
            }
          },
          {
            key: "doCommit",
            value: function() {
              var t = this.number,
                n = t;
              null != this.min && (n = Math.max(n, this.min)),
                null != this.max && (n = Math.min(n, this.max)),
                n !== t && (this.unmaskedValue = String(n));
              var u = this.value;
              this.normalizeZeros && (u = this._normalizeZeros(u)),
                this.padFractionalZeros && (u = this._padFractionalZeros(u)),
                (this._value = this._insertThousandsSeparators(u)),
                ot(ut(e.prototype), "doCommit", this).call(this);
            }
          },
          {
            key: "_normalizeZeros",
            value: function(t) {
              var e = this._removeThousandsSeparators(t).split(this.radix);
              return (
                (e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, function(t, e, n, u) {
                  return e + u;
                })),
                t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"),
                e.length > 1 &&
                  ((e[1] = e[1].replace(/0*$/, "")),
                  e[1].length || (e.length = 1)),
                this._insertThousandsSeparators(e.join(this.radix))
              );
            }
          },
          {
            key: "_padFractionalZeros",
            value: function(t) {
              if (!t) return t;
              var e = t.split(this.radix);
              return (
                e.length < 2 && e.push(""),
                (e[1] = e[1].padEnd(this.scale, "0")),
                e.join(this.radix)
              );
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this._removeThousandsSeparators(
                this._normalizeZeros(this.value)
              ).replace(this.radix, ".");
            },
            set: function(t) {
              ht(
                ut(e.prototype),
                "unmaskedValue",
                t.replace(".", this.radix),
                this,
                !0
              );
            }
          },
          {
            key: "number",
            get: function() {
              return Number(this.unmaskedValue);
            },
            set: function(t) {
              this.unmaskedValue = String(t);
            }
          },
          {
            key: "typedValue",
            get: function() {
              return this.number;
            },
            set: function(t) {
              this.number = t;
            }
          },
          {
            key: "allowNegative",
            get: function() {
              return (
                this.signed ||
                (null != this.min && this.min < 0) ||
                (null != this.max && this.max < 0)
              );
            }
          }
        ]),
        e
      );
    })();
  xt.DEFAULTS = {
    radix: ",",
    thousandsSeparator: "",
    mapToRadix: ["."],
    scale: 2,
    signed: !1,
    normalizeZeros: !0,
    padFractionalZeros: !1
  };
  var Mt = (function(t) {
      function e() {
        return q(this, e), at(this, ut(e).apply(this, arguments));
      }
      return (
        nt(e, gt),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              t.mask &&
                (t.validate = function(e) {
                  return e.search(t.mask) >= 0;
                }),
                ot(ut(e.prototype), "_update", this).call(this, t);
            }
          }
        ]),
        e
      );
    })(),
    Pt = (function(t) {
      function e() {
        return q(this, e), at(this, ut(e).apply(this, arguments));
      }
      return (
        nt(e, gt),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              t.mask && (t.validate = t.mask),
                ot(ut(e.prototype), "_update", this).call(this, t);
            }
          }
        ]),
        e
      );
    })(),
    Ot = (function(t) {
      function e(t) {
        var n;
        return (
          q(this, e),
          ((n = at(
            this,
            ut(e).call(this, et({}, e.DEFAULTS, t))
          )).currentMask = null),
          n
        );
      }
      return (
        nt(e, gt),
        Q(e, [
          {
            key: "_update",
            value: function(t) {
              ot(ut(e.prototype), "_update", this).call(this, t),
                "mask" in t &&
                  (this.compiledMasks = Array.isArray(t.mask)
                    ? t.mask.map(function(t) {
                        return _t(t);
                      })
                    : []);
            }
          },
          {
            key: "_appendCharRaw",
            value: function() {
              var t,
                e = this._applyDispatch.apply(this, arguments);
              this.currentMask &&
                e.aggregate(
                  (t = this.currentMask)._appendChar.apply(t, arguments)
                );
              return e;
            }
          },
          {
            key: "_storeBeforeTailState",
            value: function() {
              ot(ut(e.prototype), "_storeBeforeTailState", this).call(this),
                this.currentMask && this.currentMask._storeBeforeTailState();
            }
          },
          {
            key: "_restoreBeforeTailState",
            value: function() {
              ot(ut(e.prototype), "_restoreBeforeTailState", this).call(this),
                this.currentMask && this.currentMask._restoreBeforeTailState();
            }
          },
          {
            key: "_resetBeforeTailState",
            value: function() {
              ot(ut(e.prototype), "_resetBeforeTailState", this).call(this),
                this.currentMask && this.currentMask._resetBeforeTailState();
            }
          },
          {
            key: "_applyDispatch",
            value: function() {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : "",
                e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                n =
                  e.tail && this._beforeTailState
                    ? this._beforeTailState._value
                    : this.value,
                u = this.rawInputValue,
                i =
                  e.tail && this._beforeTailState
                    ? this._beforeTailState._rawInputValue
                    : u,
                r = u.slice(i.length),
                a = this.currentMask,
                s = new kt(),
                o = a && a.state,
                l = a && a._beforeTailState;
              if (
                ((this.currentMask = this.doDispatch(t, e)), this.currentMask)
              )
                if (this.currentMask !== a) {
                  this.currentMask.reset();
                  var h = this.currentMask.append(i, { raw: !0 });
                  (s.tailShift = h.inserted.length - n.length),
                    this._storeBeforeTailState(),
                    r &&
                      (s.tailShift += this.currentMask.append(r, {
                        raw: !0,
                        tail: !0
                      }).tailShift);
                } else
                  (this.currentMask.state = o),
                    (this.currentMask._beforeTailState = l);
              return s;
            }
          },
          {
            key: "doDispatch",
            value: function(t) {
              var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              return this.dispatch(t, this, e);
            }
          },
          {
            key: "doValidate",
            value: function() {
              for (
                var t, n, u = arguments.length, i = new Array(u), r = 0;
                r < u;
                r++
              )
                i[r] = arguments[r];
              return (
                (t = ot(ut(e.prototype), "doValidate", this)).call.apply(
                  t,
                  [this].concat(i)
                ) &&
                (!this.currentMask ||
                  (n = this.currentMask).doValidate.apply(n, i))
              );
            }
          },
          {
            key: "reset",
            value: function() {
              this.currentMask && this.currentMask.reset(),
                this.compiledMasks.forEach(function(t) {
                  return t.reset();
                });
            }
          },
          {
            key: "remove",
            value: function() {
              var t,
                e = new kt();
              this.currentMask &&
                e
                  .aggregate((t = this.currentMask).remove.apply(t, arguments))
                  .aggregate(this._applyDispatch());
              return e;
            }
          },
          {
            key: "extractInput",
            value: function() {
              var t;
              return this.currentMask
                ? (t = this.currentMask).extractInput.apply(t, arguments)
                : "";
            }
          },
          {
            key: "extractTail",
            value: function() {
              for (
                var t, n, u = arguments.length, i = new Array(u), r = 0;
                r < u;
                r++
              )
                i[r] = arguments[r];
              return this.currentMask
                ? (t = this.currentMask).extractTail.apply(t, i)
                : (n = ot(ut(e.prototype), "extractTail", this)).call.apply(
                    n,
                    [this].concat(i)
                  );
            }
          },
          {
            key: "doCommit",
            value: function() {
              this.currentMask && this.currentMask.doCommit(),
                ot(ut(e.prototype), "doCommit", this).call(this);
            }
          },
          {
            key: "nearestInputPos",
            value: function() {
              for (
                var t, n, u = arguments.length, i = new Array(u), r = 0;
                r < u;
                r++
              )
                i[r] = arguments[r];
              return this.currentMask
                ? (t = this.currentMask).nearestInputPos.apply(t, i)
                : (n = ot(ut(e.prototype), "nearestInputPos", this)).call.apply(
                    n,
                    [this].concat(i)
                  );
            }
          },
          {
            key: "value",
            get: function() {
              return this.currentMask ? this.currentMask.value : "";
            },
            set: function(t) {
              ht(ut(e.prototype), "value", t, this, !0);
            }
          },
          {
            key: "unmaskedValue",
            get: function() {
              return this.currentMask ? this.currentMask.unmaskedValue : "";
            },
            set: function(t) {
              ht(ut(e.prototype), "unmaskedValue", t, this, !0);
            }
          },
          {
            key: "typedValue",
            get: function() {
              return this.currentMask ? this.currentMask.typedValue : "";
            },
            set: function(t) {
              var e = String(t);
              this.currentMask &&
                ((this.currentMask.typedValue = t),
                (e = this.currentMask.unmaskedValue)),
                (this.unmaskedValue = e);
            }
          },
          {
            key: "isComplete",
            get: function() {
              return !!this.currentMask && this.currentMask.isComplete;
            }
          },
          {
            key: "state",
            get: function() {
              return et({}, ot(ut(e.prototype), "state", this), {
                _rawInputValue: this.rawInputValue,
                compiledMasks: this.compiledMasks.map(function(t) {
                  return t.state;
                }),
                currentMaskRef: this.currentMask,
                currentMask: this.currentMask && this.currentMask.state
              });
            },
            set: function(t) {
              var n = t.compiledMasks,
                u = t.currentMaskRef,
                i = t.currentMask,
                r = rt(t, ["compiledMasks", "currentMaskRef", "currentMask"]);
              this.compiledMasks.forEach(function(t, e) {
                return (t.state = n[e]);
              }),
                null != u &&
                  ((this.currentMask = u), (this.currentMask.state = i)),
                ht(ut(e.prototype), "state", r, this, !0);
            }
          }
        ]),
        e
      );
    })();
  function It(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return new Tt(t, e);
  }
  return (
    (Ot.DEFAULTS = {
      dispatch: function(t, e, n) {
        if (e.compiledMasks.length) {
          var u = e.rawInputValue,
            i = e.compiledMasks.map(function(e, i) {
              return (
                (e.rawInputValue = u),
                e.append(t, n),
                { weight: e.rawInputValue.length, index: i }
              );
            });
          return (
            i.sort(function(t, e) {
              return e.weight - t.weight;
            }),
            e.compiledMasks[i[0].index]
          );
        }
      }
    }),
    (It.InputMask = Tt),
    (It.Masked = gt),
    (It.MaskedPattern = Et),
    (It.MaskedEnum = wt),
    (It.MaskedRange = bt),
    (It.MaskedNumber = xt),
    (It.MaskedDate = Bt),
    (It.MaskedRegExp = Mt),
    (It.MaskedFunction = Pt),
    (It.MaskedDynamic = Ot),
    (It.createMask = _t),
    (It.MaskElement = St),
    (It.HTMLMaskElement = Dt),
    (dt.IMask = It),
    It
  );
});