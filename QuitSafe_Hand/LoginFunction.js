!window.console && (window.console = {
    log: function() {},
    warn: function() {},
    error: function() {}
});
var $ = window.Simple = function(a) {
    return typeof(a) == "string" ? document.getElementById(a) : a
};
$.cookie = {
    get: function(b) {
        var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
        return ! a ? "": decodeURIComponent(a[2])
    },
    getOrigin: function(b) {
        var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
        return ! a ? "": (a[2])
    },
    set: function(c, f, d, g, a) {
        var b = new Date();
        if (a) {
            b.setTime(b.getTime() + 3600000 * a);
            document.cookie = c + "=" + f + "; expires=" + b.toGMTString() + "; path=" + (g ? g: "/") + "; " + (d ? ("domain=" + d + ";") : "")
        } else {
            document.cookie = c + "=" + f + "; path=" + (g ? g: "/") + "; " + (d ? ("domain=" + d + ";") : "")
        }
    },
    del: function(a, b, c) {
        document.cookie = a + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (c ? c: "/") + "; " + (b ? ("domain=" + b + ";") : "")
    },
    uin: function() {
        var a = $.cookie.get("uin");
        return ! a ? null: parseInt(a.substring(1, a.length), 10)
    }
};
$.http = {
    getXHR: function() {
        return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
    },
    ajax: function(url, para, cb, method, type) {
        var xhr = $.http.getXHR();
        xhr.open(method, url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status === 1223 || xhr.status === 0) {
                    if (typeof(type) == "undefined" && xhr.responseText) {
                        cb(eval("(" + xhr.responseText + ")"))
                    } else {
                        cb(xhr.responseText);
                        if ((!xhr.responseText) && $.badjs._smid) {
                            $.badjs("HTTP Empty[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)
                        }
                    }
                } else {
                    if ($.badjs._smid) {
                        $.badjs("HTTP Error[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)
                    }
                }
                xhr = null
            }
        };
        xhr.send(para);
        return xhr
    },
    post: function(c, b, a, g) {
        var f = "";
        for (var d in b) {
            f += "&" + d + "=" + b[d]
        }
        return $.http.ajax(c, f, a, "POST", g)
    },
    get: function(c, b, a, f) {
        var g = [];
        for (var d in b) {
            g.push(d + "=" + b[d])
        }
        if (c.indexOf("?") == -1) {
            c += "?"
        }
        c += g.join("&");
        return $.http.ajax(c, null, a, "GET", f)
    },
    jsonp: function(a) {
        var b = document.createElement("script");
        b.src = a;
        document.getElementsByTagName("head")[0].appendChild(b)
    },
    loadScript: function(c, d, b) {
        var a = document.createElement("script");
        a.onload = a.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                if (typeof d == "function") {
                    d()
                }
                a.onload = a.onreadystatechange = null;
                if (a.parentNode) {
                    a.parentNode.removeChild(a)
                }
            }
        };
        a.src = c;
        document.getElementsByTagName("head")[0].appendChild(a)
    },
    preload: function(a) {
        var b = document.createElement("img");
        b.src = a;
        b = null
    }
};
$.get = $.http.get;
$.post = $.http.post;
$.jsonp = $.http.jsonp;
$.browser = function(b) {
    if (typeof $.browser.info == "undefined") {
        var a = {
            type: ""
        };
        var c = navigator.userAgent.toLowerCase();
        if (/webkit/.test(c)) {
            a = {
                type: "webkit",
                version: /webkit[\/ ]([\w.]+)/
            }
        } else {
            if (/opera/.test(c)) {
                a = {
                    type: "opera",
                    version: /version/.test(c) ? /version[\/ ]([\w.]+)/: /opera[\/ ]([\w.]+)/
                }
            } else {
                if (/msie/.test(c)) {
                    a = {
                        type: "msie",
                        version: /msie ([\w.]+)/
                    }
                } else {
                    if (/mozilla/.test(c) && !/compatible/.test(c)) {
                        a = {
                            type: "ff",
                            version: /rv:([\w.]+)/
                        }
                    }
                }
            }
        }
        a.version = (a.version && a.version.exec(c) || [0, "0"])[1];
        $.browser.info = a
    }
    return $.browser.info[b]
};
$.e = {
    _counter: 0,
    _uid: function() {
        return "h" + $.e._counter++
    },
    add: function(c, b, g) {
        if (typeof c != "object") {
            c = $(c)
        }
        if (document.addEventListener) {
            c.addEventListener(b, g, false)
        } else {
            if (document.attachEvent) {
                if ($.e._find(c, b, g) != -1) {
                    return
                }
                var j = function(h) {
                    if (!h) {
                        h = window.event
                    }
                    var d = {
                        _event: h,
                        type: h.type,
                        target: h.srcElement,
                        currentTarget: c,
                        relatedTarget: h.fromElement ? h.fromElement: h.toElement,
                        eventPhase: (h.srcElement == c) ? 2 : 3,
                        clientX: h.clientX,
                        clientY: h.clientY,
                        screenX: h.screenX,
                        screenY: h.screenY,
                        altKey: h.altKey,
                        ctrlKey: h.ctrlKey,
                        shiftKey: h.shiftKey,
                        keyCode: h.keyCode,
                        data: h.data,
                        origin: h.origin,
                        stopPropagation: function() {
                            this._event.cancelBubble = true
                        },
                        preventDefault: function() {
                            this._event.returnValue = false
                        }
                    };
                    if (Function.prototype.call) {
                        g.call(c, d)
                    } else {
                        c._currentHandler = g;
                        c._currentHandler(d);
                        c._currentHandler = null
                    }
                };
                c.attachEvent("on" + b, j);
                var f = {
                    element: c,
                    eventType: b,
                    handler: g,
                    wrappedHandler: j
                };
                var k = c.document || c;
                var a = k.parentWindow;
                var l = $.e._uid();
                if (!a._allHandlers) {
                    a._allHandlers = {}
                }
                a._allHandlers[l] = f;
                if (!c._handlers) {
                    c._handlers = []
                }
                c._handlers.push(l);
                if (!a._onunloadHandlerRegistered) {
                    a._onunloadHandlerRegistered = true;
                    a.attachEvent("onunload", $.e._removeAllHandlers)
                }
            }
        }
    },
    remove: function(f, c, j) {
        if (document.addEventListener) {
            f.removeEventListener(c, j, false)
        } else {
            if (document.attachEvent) {
                var b = $.e._find(f, c, j);
                if (b == -1) {
                    return
                }
                var l = f.document || f;
                var a = l.parentWindow;
                var k = f._handlers[b];
                var g = a._allHandlers[k];
                f.detachEvent("on" + c, g.wrappedHandler);
                f._handlers.splice(b, 1);
                delete a._allHandlers[k]
            }
        }
    },
    _find: function(f, a, m) {
        var b = f._handlers;
        if (!b) {
            return - 1
        }
        var k = f.document || f;
        var l = k.parentWindow;
        for (var g = b.length - 1; g >= 0; g--) {
            var c = b[g];
            var j = l._allHandlers[c];
            if (j.eventType == a && j.handler == m) {
                return g
            }
        }
        return - 1
    },
    _removeAllHandlers: function() {
        var a = this;
        for (id in a._allHandlers) {
            var b = a._allHandlers[id];
            b.element.detachEvent("on" + b.eventType, b.wrappedHandler);
            delete a._allHandlers[id]
        }
    },
    src: function(a) {
        return a ? a.target: event.srcElement
    },
    stopPropagation: function(a) {
        a ? a.stopPropagation() : event.cancelBubble = true
    },
    trigger: function(c, b) {
        var f = {
            HTMLEvents: "abort,blur,change,error,focus,load,reset,resize,scroll,select,submit,unload",
            UIEevents: "keydown,keypress,keyup",
            MouseEvents: "click,mousedown,mousemove,mouseout,mouseover,mouseup"
        };
        if (document.createEvent) {
            var d = ""; (b == "mouseleave") && (b = "mouseout"); (b == "mouseenter") && (b = "mouseover");
            for (var g in f) {
                if (f[g].indexOf(b)) {
                    d = g;
                    break
                }
            }
            var a = document.createEvent(d);
            a.initEvent(b, true, false);
            c.dispatchEvent(a)
        } else {
            if (document.createEventObject) {
                c.fireEvent("on" + b)
            }
        }
    }
};
$.bom = {
    query: function(b) {
        var a = window.location.search.match(new RegExp("(\\?|&)" + b + "=([^&]*)(&|$)"));
        return ! a ? "": decodeURIComponent(a[2])
    },
    getHash: function(b) {
        var a = window.location.hash.match(new RegExp("(#|&)" + b + "=([^&]*)(&|$)"));
        return ! a ? "": decodeURIComponent(a[2])
    }
};
$.winName = {
    set: function(c, a) {
        var b = window.name || "";
        if (b.match(new RegExp(";" + c + "=([^;]*)(;|$)"))) {
            window.name = b.replace(new RegExp(";" + c + "=([^;]*)"), ";" + c + "=" + a)
        } else {
            window.name = b + ";" + c + "=" + a
        }
    },
    get: function(c) {
        var b = window.name || "";
        var a = b.match(new RegExp(";" + c + "=([^;]*)(;|$)"));
        return a ? a[1] : ""
    },
    clear: function(b) {
        var a = window.name || "";
        window.name = a.replace(new RegExp(";" + b + "=([^;]*)"), "")
    }
};
$.localData = function() {
    var a = "ptlogin2.qq.com";
    var d = /^[0-9A-Za-z_-]*$/;
    var b;
    function c() {
        var h = document.createElement("link");
        h.style.display = "none";
        h.id = a;
        document.getElementsByTagName("head")[0].appendChild(h);
        h.addBehavior("#default#userdata");
        return h
    }
    function f() {
        if (typeof b == "undefined") {
            if (window.localStorage) {
                b = localStorage
            } else {
                try {
                    b = c();
                    b.load(a)
                } catch(h) {
                    b = false;
                    return false
                }
            }
        }
        return true
    }
    function g(h) {
        if (typeof h != "string") {
            return false
        }
        return d.test(h)
    }
    return {
        set: function(h, j) {
            var l = false;
            if (g(h) && f()) {
                try {
                    j += "";
                    if (window.localStorage) {
                        b.setItem(h, j);
                        l = true
                    } else {
                        b.setAttribute(h, j);
                        b.save(a);
                        l = b.getAttribute(h) === j
                    }
                } catch(k) {}
            }
            return l
        },
        get: function(h) {
            if (g(h) && f()) {
                try {
                    return window.localStorage ? b.getItem(h) : b.getAttribute(h)
                } catch(j) {}
            }
            return null
        },
        remove: function(h) {
            if (g(h) && f()) {
                try {
                    window.localStorage ? b.removeItem(h) : b.removeAttribute(h);
                    return true
                } catch(j) {}
            }
            return false
        }
    }
} ();
$.str = (function() {
    var htmlDecodeDict = {
        quot: '"',
        lt: "<",
        gt: ">",
        amp: "&",
        nbsp: " ",
        "#34": '"',
        "#60": "<",
        "#62": ">",
        "#38": "&",
        "#160": " "
    };
    var htmlEncodeDict = {
        '"': "#34",
        "<": "#60",
        ">": "#62",
        "&": "#38",
        " ": "#160"
    };
    return {
        decodeHtml: function(s) {
            s += "";
            return s.replace(/&(quot|lt|gt|amp|nbsp);/ig,
            function(all, key) {
                return htmlDecodeDict[key]
            }).replace(/&#u([a-f\d]{4});/ig,
            function(all, hex) {
                return String.fromCharCode(parseInt("0x" + hex))
            }).replace(/&#(\d+);/ig,
            function(all, number) {
                return String.fromCharCode( + number)
            })
        },
        encodeHtml: function(s) {
            s += "";
            return s.replace(/["<>& ]/g,
            function(all) {
                return "&" + htmlEncodeDict[all] + ";"
            })
        },
        trim: function(str) {
            str += "";
            var str = str.replace(/^\s+/, ""),
            ws = /\s/,
            end = str.length;
            while (ws.test(str.charAt(--end))) {}
            return str.slice(0, end + 1)
        },
        uin2hex: function(str) {
            var maxLength = 16;
            str = parseInt(str);
            var hex = str.toString(16);
            var len = hex.length;
            for (var i = len; i < maxLength; i++) {
                hex = "0" + hex
            }
            var arr = [];
            for (var j = 0; j < maxLength; j += 2) {
                arr.push("\\x" + hex.substr(j, 2))
            }
            var result = arr.join("");
            eval('result="' + result + '"');
            return result
        },
        bin2String: function(a) {
            var arr = [];
            for (var i = 0,
            len = a.length; i < len; i++) {
                var temp = a.charCodeAt(i).toString(16);
                if (temp.length == 1) {
                    temp = "0" + temp
                }
                arr.push(temp)
            }
            arr = "0x" + arr.join("");
            arr = parseInt(arr, 16);
            return arr
        },
        utf8ToUincode: function(s) {
            var result = "";
            try {
                var length = s.length;
                var arr = [];
                for (i = 0; i < length; i += 2) {
                    arr.push("%" + s.substr(i, 2))
                }
                result = decodeURIComponent(arr.join(""));
                result = $.str.decodeHtml(result)
            } catch(e) {
                result = ""
            }
            return result
        },
        json2str: function(obj) {
            var result = "";
            if (typeof JSON != "undefined") {
                result = JSON.stringify(obj)
            } else {
                var arr = [];
                for (var i in obj) {
                    arr.push('"' + i + '":"' + obj[i] + '"')
                }
                result = "{" + arr.join(",") + "}"
            }
            return result
        },
        time33: function(str) {
            var hash = 0;
            for (var i = 0,
            length = str.length; i < length; i++) {
                hash = hash * 33 + str.charCodeAt(i)
            }
            return hash % 4294967296
        }
    }
})();
$.css = function() {
    var a = document.documentElement;
    return {
        getPageScrollTop: function() {
            return window.pageYOffset || a.scrollTop || document.body.scrollTop || 0
        },
        getPageScrollLeft: function() {
            return window.pageXOffset || a.scrollLeft || document.body.scrollLeft || 0
        },
        getOffsetPosition: function(c) {
            c = $(c);
            var f = 0,
            d = 0;
            if (a.getBoundingClientRect && c.getBoundingClientRect) {
                var b = c.getBoundingClientRect();
                var h = a.clientTop || document.body.clientTop || 0;
                var g = a.clientLeft || document.body.clientLeft || 0;
                f = b.top + this.getPageScrollTop() - h,
                d = b.left + this.getPageScrollLeft() - g
            } else {
                do {
                    f += c.offsetTop || 0;
                    d += c.offsetLeft || 0;
                    c = c.offsetParent
                } while ( c )
            }
            return {
                left: d,
                top: f
            }
        },
        getWidth: function(b) {
            return $(b).offsetWidth
        },
        getHeight: function(b) {
            return $(b).offsetHeight
        },
        show: function(b) {
            b.style.display = "block"
        },
        hide: function(b) {
            b.style.display = "none"
        },
        hasClass: function(f, g) {
            if (!f.className) {
                return false
            }
            var c = f.className.split(" ");
            for (var d = 0,
            b = c.length; d < b; d++) {
                if (g == c[d]) {
                    return true
                }
            }
            return false
        },
        addClass: function(b, c) {
            $.css.updateClass(b, c, false)
        },
        removeClass: function(b, c) {
            $.css.updateClass(b, false, c)
        },
        updateClass: function(f, m, o) {
            var b = f.className.split(" ");
            var j = {},
            g = 0,
            l = b.length;
            for (; g < l; g++) {
                b[g] && (j[b[g]] = true)
            }
            if (m) {
                var h = m.split(" ");
                for (g = 0, l = h.length; g < l; g++) {
                    h[g] && (j[h[g]] = true)
                }
            }
            if (o) {
                var c = o.split(" ");
                for (g = 0, l = c.length; g < l; g++) {
                    c[g] && (delete j[c[g]])
                }
            }
            var n = [];
            for (var d in j) {
                n.push(d)
            }
            f.className = n.join(" ")
        },
        setClass: function(c, b) {
            c.className = b
        }
    }
} ();
$.animate = {
    fade: function(d, j, b, f, n) {
        d = $(d);
        if (!d) {
            return
        }
        if (!d.effect) {
            d.effect = {}
        }
        var g = Object.prototype.toString.call(j);
        var c = 100;
        if (!isNaN(j)) {
            c = j
        } else {
            if (g == "[object Object]") {
                if (j) {
                    if (j.to) {
                        if (!isNaN(j.to)) {
                            c = j.to
                        }
                        if (!isNaN(j.from)) {
                            d.style.opacity = j.from / 100;
                            d.style.filter = "alpha(opacity=" + j.from + ")"
                        }
                    }
                }
            }
        }
        if (typeof(d.effect.fade) == "undefined") {
            d.effect.fade = 0
        }
        window.clearInterval(d.effect.fade);
        var b = b || 1,
        f = f || 20,
        h = window.navigator.userAgent.toLowerCase(),
        m = function(o) {
            var q;
            if (h.indexOf("msie") != -1) {
                var p = (o.currentStyle || {}).filter || "";
                q = p.indexOf("opacity") >= 0 ? (parseFloat(p.match(/opacity=([^)]*)/)[1])) + "": "100"
            } else {
                var r = o.ownerDocument.defaultView;
                r = r && r.getComputedStyle;
                q = 100 * (r && r(o, null)["opacity"] || 1)
            }
            return parseFloat(q)
        },
        a = m(d),
        k = a < c ? 1 : -1;
        if (h.indexOf("msie") != -1) {
            if (f < 15) {
                b = Math.floor((b * 15) / f);
                f = 15
            }
        }
        var l = function() {
            a = a + b * k;
            if ((Math.round(a) - c) * k >= 0) {
                d.style.opacity = c / 100;
                d.style.filter = "alpha(opacity=" + c + ")";
                window.clearInterval(d.effect.fade);
                if (typeof(n) == "function") {
                    n(d)
                }
            } else {
                d.style.opacity = a / 100;
                d.style.filter = "alpha(opacity=" + a + ")"
            }
        };
        d.effect.fade = window.setInterval(l, f)
    },
    animate: function(b, c, j, t, h) {
        b = $(b);
        if (!b) {
            return
        }
        if (!b.effect) {
            b.effect = {}
        }
        if (typeof(b.effect.animate) == "undefined") {
            b.effect.animate = 0
        }
        for (var o in c) {
            c[o] = parseInt(c[o]) || 0
        }
        window.clearInterval(b.effect.animate);
        var j = j || 10,
        t = t || 20,
        k = function(x) {
            var w = {
                left: x.offsetLeft,
                top: x.offsetTop
            };
            return w
        },
        v = k(b),
        g = {
            width: b.clientWidth,
            height: b.clientHeight,
            left: v.left,
            top: v.top
        },
        d = [],
        s = window.navigator.userAgent.toLowerCase();
        if (! (s.indexOf("msie") != -1 && document.compatMode == "BackCompat")) {
            var m = document.defaultView ? document.defaultView.getComputedStyle(b, null) : b.currentStyle;
            var f = c.width || c.width == 0 ? parseInt(c.width) : null,
            u = c.height || c.height == 0 ? parseInt(c.height) : null;
            if (typeof(f) == "number") {
                d.push("width");
                c.width = f - m.paddingLeft.replace(/\D/g, "") - m.paddingRight.replace(/\D/g, "")
            }
            if (typeof(u) == "number") {
                d.push("height");
                c.height = u - m.paddingTop.replace(/\D/g, "") - m.paddingBottom.replace(/\D/g, "")
            }
            if (t < 15) {
                j = Math.floor((j * 15) / t);
                t = 15
            }
        }
        var r = c.left || c.left == 0 ? parseInt(c.left) : null,
        n = c.top || c.top == 0 ? parseInt(c.top) : null;
        if (typeof(r) == "number") {
            d.push("left");
            b.style.position = "absolute"
        }
        if (typeof(n) == "number") {
            d.push("top");
            b.style.position = "absolute"
        }
        var l = [],
        q = d.length;
        for (var o = 0; o < q; o++) {
            l[d[o]] = g[d[o]] < c[d[o]] ? 1 : -1
        }
        var p = b.style;
        var a = function() {
            var w = true;
            for (var x = 0; x < q; x++) {
                g[d[x]] = g[d[x]] + l[d[x]] * Math.abs(c[d[x]] - g[d[x]]) * j / 100;
                if ((Math.round(g[d[x]]) - c[d[x]]) * l[d[x]] >= 0) {
                    w = w && true;
                    p[d[x]] = c[d[x]] + "px"
                } else {
                    w = w && false;
                    p[d[x]] = g[d[x]] + "px"
                }
            }
            if (w) {
                window.clearInterval(b.effect.animate);
                if (typeof(h) == "function") {
                    h(b)
                }
            }
        };
        b.effect.animate = window.setInterval(a, t)
    }
};
$.check = {
    isHttps: function() {
        return document.location.protocol == "https:"
    },
    isSsl: function() {
        var a = document.location.host;
        return /^ssl./i.test(a)
    },
    isIpad: function() {
        var a = navigator.userAgent.toLowerCase();
        return /ipad/i.test(a)
    },
    isQQ: function(a) {
        return /^[1-9]{1}\d{4,9}$/.test(a)
    },
    isQQMail: function(a) {
        return /^[1-9]{1}\d{4,9}@qq\.com$/.test(a)
    },
    isNullQQ: function(a) {
        return /^\d{1,4}$/.test(a)
    },
    isNick: function(a) {
        return /^[a-zA-Z]{1}([a-zA-Z0-9]|[-_]){0,19}$/.test(a)
    },
    isName: function(a) {
        return /[\u4E00-\u9FA5]{1,8}/.test(a)
    },
    isPhone: function(a) {
        return /^(?:86|886|)1\d{10}\s*$/.test(a)
    },
    isDXPhone: function(a) {
        return /^(?:86|886|)1(?:33|53|80|81|89)\d{8}$/.test(a)
    },
    isSeaPhone: function(a) {
        return /^(00)?(?:852|853|886(0)?\d{1})\d{8}$/.test(a)
    },
    isMail: function(a) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(a)
    },
    isQiyeQQ800: function(a) {
        return /^(800)\d{7}$/.test(a)
    },
    isPassword: function(a) {
        return a && a.length >= 16
    },
    isForeignPhone: function(a) {
        return /^00\d{7,}/.test(a)
    },
    needVip: function(f) {
        var a = ["21001601", "21000110", "21000121", "46000101", "716027609", "716027610", "549000912", "637009801"];
        var b = true;
        for (var c = 0,
        d = a.length; c < d; c++) {
            if (a[c] == f) {
                b = false;
                break
            }
        }
        return b
    },
    isPaipai: function() {
        return /paipai.com$/.test(window.location.hostname)
    },
    is_weibo_appid: function(a) {
        if (a == 46000101 || a == 607000101 || a == 558032501) {
            return true
        }
        return false
    }
};
$.report = {
    monitor: function(c, b) {
        if (Math.random() > (b || 1)) {
            return
        }
        var a = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + c;
        $.http.preload(a)
    },
    nlog: function(f, a, c) {
        if (Math.random() >= (c || 1)) {
            return
        }
        var d = location.protocol == "https:" ? "https://ssl.qq.com/ptlogin/cgi-bin/ptlogin_report?": "http://log.wtlogin.qq.com/cgi-bin/ptlogin_report?";
        var b = encodeURIComponent(f + "|_|" + location.href + "|_|" + window.navigator.userAgent);
        a = a ? a + "-487131": 0;
        d += ("id=" + a + "&msg=" + b + "&v=" + Math.random());
        $.http.preload(d)
    },
    simpleIsdSpeed: function(a, c) {
        if (Math.random() < (c || 1)) {
            var b = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
            if ($.check.isHttps()) {
                b = "https://login.qq.com/cgi-bin/r.cgi?"
            }
            b += a;
            $.http.preload(b)
        }
    },
    isdSpeed: function(a, g) {
        var b = false;
        var d = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
        if ($.check.isHttps()) {
            d = "https://login.qq.com/cgi-bin/r.cgi?"
        }
        d += a;
        if (Math.random() < (g || 1)) {
            var c = $.report.getSpeedPoints(a);
            for (var f in c) {
                if (c[f] && c[f] < 30000) {
                    d += ("&" + f + "=" + c[f]);
                    b = true
                }
            }
            d += "&v=" + Math.random();
            if (b) {
                $.http.preload(d)
            }
        }
        $.report.setSpeedPoint(a)
    },
    speedPoints: {},
    basePoint: {},
    setBasePoint: function(a, b) {
        $.report.basePoint[a] = b
    },
    setSpeedPoint: function(a, b, c) {
        if (!b) {
            $.report.speedPoints[a] = {}
        } else {
            if (!$.report.speedPoints[a]) {
                $.report.speedPoints[a] = {}
            }
            $.report.speedPoints[a][b] = c - $.report.basePoint[a]
        }
    },
    setSpeedPoints: function(a, b) {
        $.report.speedPoints[a] = b
    },
    getSpeedPoints: function(a) {
        return $.report.speedPoints[a]
    }
};
$.sso_ver = 0;
$.sso_state = 0;
$.plugin_isd_flag = "";
$.nptxsso = null;
$.activetxsso = null;
$.sso_loadComplete = true;
$.np_clock = 0;
$.loginQQnum = 0;
$.suportActive = function() {
    var a = true;
    try {
        if (window.ActiveXObject || window.ActiveXObject.prototype) {
            a = true;
            if (window.ActiveXObject.prototype && !window.ActiveXObject) {
                $.report.nlog("activeobject 判断有问题")
            }
        } else {
            a = false
        }
    } catch(b) {
        a = false
    }
    return a
};
$.getLoginQQNum = function() {
    try {
        var f = 0;
        if ($.suportActive()) {
            $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=20";
            $.report.setBasePoint($.plugin_isd_flag, new Date());
            var l = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin2");
            $.activetxsso = l;
            var b = l.CreateTXSSOData();
            l.InitSSOFPTCtrl(0, b);
            var a = l.DoOperation(2, b);
            var d = a.GetArray("PTALIST");
            f = d.GetSize();
            try {
                var c = l.QuerySSOInfo(1);
                $.sso_ver = c.GetInt("nSSOVersion")
            } catch(g) {
                $.sso_ver = 0
            }
        } else {
            if (navigator.mimeTypes["application/nptxsso"]) {
                $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=21";
                $.report.setBasePoint($.plugin_isd_flag, (new Date()).getTime());
                if (!$.nptxsso) {
                    $.nptxsso = document.createElement("embed");
                    $.nptxsso.type = "application/nptxsso";
                    $.nptxsso.style.width = "0px";
                    $.nptxsso.style.height = "0px";
                    document.body.appendChild($.nptxsso)
                }
                if (typeof $.nptxsso.InitPVANoST != "function") {
                    $.sso_loadComplete = false;
                    $.report.nlog("没有找到插件的InitPVANoST方法", 269929)
                } else {
                    var j = $.nptxsso.InitPVANoST();
                    if (j) {
                        f = $.nptxsso.GetPVACount();
                        $.sso_loadComplete = true
                    }
                    try {
                        $.sso_ver = $.nptxsso.GetSSOVersion()
                    } catch(g) {
                        $.sso_ver = 0
                    }
                }
            } else {
                $.report.nlog("插件没有注册成功", 263744);
                $.sso_state = 2
            }
        }
    } catch(g) {
        var k = null;
        try {
            k = $.http.getXHR()
        } catch(g) {
            return 0
        }
        var h = g.message || g;
        if (/^pt_windows_sso/.test(h)) {
            if (/^pt_windows_sso_\d+_3/.test(h)) {
                $.report.nlog("QQ插件不支持该url" + g.message, 326044)
            } else {
                $.report.nlog("QQ插件抛出内部错误" + g.message, 325361)
            }
            $.sso_state = 1
        } else {
            if (k) {
                $.report.nlog("可能没有安装QQ" + g.message, 322340);
                $.sso_state = 2
            } else {
                $.report.nlog("获取登录QQ号码出错" + g.message, 263745);
                if (window.ActiveXObject) {
                    $.sso_state = 1
                }
            }
        }
        return 0
    }
    $.loginQQnum = f;
    return f
};
$.checkNPPlugin = function() {
    var a = 10;
    window.clearInterval($.np_clock);
    $.np_clock = window.setInterval(function() {
        if (typeof $.nptxsso.InitPVANoST == "function" || a == 0) {
            window.clearInterval($.np_clock);
            if (typeof $.nptxsso.InitPVANoST == "function") {
                pt.plogin.auth();
                if (window.console) {
                    console.log("延迟切换快速登录:" + a)
                }
            }
        } else {
            a--
        }
    },
    200)
};
$.guanjiaPlugin = null;
$.initGuanjiaPlugin = function() {
    try {
        if (window.ActiveXObject) {
            $.guanjiaPlugin = new ActiveXObject("npQMExtensionsIE.Basic")
        } else {
            if (navigator.mimeTypes["application/qqpcmgr-extensions-mozilla"]) {
                $.guanjiaPlugin = document.createElement("embed");
                $.guanjiaPlugin.type = "application/qqpcmgr-extensions-mozilla";
                $.guanjiaPlugin.style.width = "0px";
                $.guanjiaPlugin.style.height = "0px";
                document.body.appendChild($.guanjiaPlugin)
            }
        }
        var a = $.guanjiaPlugin.QMGetVersion().split(".");
        if (a.length == 4 && a[2] >= 9319) {} else {
            $.guanjiaPlugin = null
        }
    } catch(b) {
        $.guanjiaPlugin = null
    }
};
function pluginBegin() {
    if (!$.sso_loadComplete) {
        try {
            $.checkNPPlugin()
        } catch(a) {}
    }
    $.sso_loadComplete = true;
    $.report.setSpeedPoint($.plugin_isd_flag, 1, (new Date()).getTime());
    window.setTimeout(function(b) {
        $.report.isdSpeed($.plugin_isd_flag, 0.05)
    },
    2000)
} (function() {
    var a = "nohost_guid";
    var b = "/nohost_htdocs/js/SwitchHost.js";
    if ($.cookie.get(a) != "") {
        $.http.loadScript(b,
        function() {
            var c = window.SwitchHost && window.SwitchHost.init;
            c && c()
        })
    }
})();
setTimeout(function() {
    var a = "flag1=7808&flag2=1&flag3=9";
    $.report.setBasePoint(a, 0);
    if (typeof window.postMessage != "undefined") {
        $.report.setSpeedPoint(a, 1, 2000)
    } else {
        $.report.setSpeedPoint(a, 1, 1000)
    }
    $.report.isdSpeed(a, 0.01)
},
500);
$ = window.$ || {};
$pt = window.$pt || {};
$.RSA = $pt.RSA = function() {
    function h(z, t) {
        return new au(z, t)
    }
    function aj(aC, aD) {
        var t = "";
        var z = 0;
        while (z + aD < aC.length) {
            t += aC.substring(z, z + aD) + "\n";
            z += aD
        }
        return t + aC.substring(z, aC.length)
    }
    function u(t) {
        if (t < 16) {
            return "0" + t.toString(16)
        } else {
            return t.toString(16)
        }
    }
    function ah(aD, aG) {
        if (aG < aD.length + 11) {
            uv_alert("Message too long for RSA");
            return null
        }
        var aF = new Array();
        var aC = aD.length - 1;
        while (aC >= 0 && aG > 0) {
            var aE = aD.charCodeAt(aC--);
            aF[--aG] = aE
        }
        aF[--aG] = 0;
        var z = new af();
        var t = new Array();
        while (aG > 2) {
            t[0] = 0;
            while (t[0] == 0) {
                z.nextBytes(t)
            }
            aF[--aG] = t[0]
        }
        aF[--aG] = 2;
        aF[--aG] = 0;
        return new au(aF)
    }
    function N() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null
    }
    function q(z, t) {
        if (z != null && t != null && z.length > 0 && t.length > 0) {
            this.n = h(z, 16);
            this.e = parseInt(t, 16)
        } else {
            uv_alert("Invalid RSA public key")
        }
    }
    function Y(t) {
        return t.modPowInt(this.e, this.n)
    }
    function r(aC) {
        var t = ah(aC, (this.n.bitLength() + 7) >> 3);
        if (t == null) {
            return null
        }
        var aD = this.doPublic(t);
        if (aD == null) {
            return null
        }
        var z = aD.toString(16);
        if ((z.length & 1) == 0) {
            return z
        } else {
            return "0" + z
        }
    }
    N.prototype.doPublic = Y;
    N.prototype.setPublic = q;
    N.prototype.encrypt = r;
    var ay;
    var ak = 244837814094590;
    var ab = ((ak & 16777215) == 15715070);
    function au(z, t, aC) {
        if (z != null) {
            if ("number" == typeof z) {
                this.fromNumber(z, t, aC)
            } else {
                if (t == null && "string" != typeof z) {
                    this.fromString(z, 256)
                } else {
                    this.fromString(z, t)
                }
            }
        }
    }
    function j() {
        return new au(null)
    }
    function b(aE, t, z, aD, aG, aF) {
        while (--aF >= 0) {
            var aC = t * this[aE++] + z[aD] + aG;
            aG = Math.floor(aC / 67108864);
            z[aD++] = aC & 67108863
        }
        return aG
    }
    function aA(aE, aJ, aK, aD, aH, t) {
        var aG = aJ & 32767,
        aI = aJ >> 15;
        while (--t >= 0) {
            var aC = this[aE] & 32767;
            var aF = this[aE++] >> 15;
            var z = aI * aC + aF * aG;
            aC = aG * aC + ((z & 32767) << 15) + aK[aD] + (aH & 1073741823);
            aH = (aC >>> 30) + (z >>> 15) + aI * aF + (aH >>> 30);
            aK[aD++] = aC & 1073741823
        }
        return aH
    }
    function az(aE, aJ, aK, aD, aH, t) {
        var aG = aJ & 16383,
        aI = aJ >> 14;
        while (--t >= 0) {
            var aC = this[aE] & 16383;
            var aF = this[aE++] >> 14;
            var z = aI * aC + aF * aG;
            aC = aG * aC + ((z & 16383) << 14) + aK[aD] + aH;
            aH = (aC >> 28) + (z >> 14) + aI * aF;
            aK[aD++] = aC & 268435455
        }
        return aH
    }
    if (ab && (navigator.appName == "Microsoft Internet Explorer")) {
        au.prototype.am = aA;
        ay = 30
    } else {
        if (ab && (navigator.appName != "Netscape")) {
            au.prototype.am = b;
            ay = 26
        } else {
            au.prototype.am = az;
            ay = 28
        }
    }
    au.prototype.DB = ay;
    au.prototype.DM = ((1 << ay) - 1);
    au.prototype.DV = (1 << ay);
    var ac = 52;
    au.prototype.FV = Math.pow(2, ac);
    au.prototype.F1 = ac - ay;
    au.prototype.F2 = 2 * ay - ac;
    var ag = "0123456789abcdefghijklmnopqrstuvwxyz";
    var ai = new Array();
    var ar, x;
    ar = "0".charCodeAt(0);
    for (x = 0; x <= 9; ++x) {
        ai[ar++] = x
    }
    ar = "a".charCodeAt(0);
    for (x = 10; x < 36; ++x) {
        ai[ar++] = x
    }
    ar = "A".charCodeAt(0);
    for (x = 10; x < 36; ++x) {
        ai[ar++] = x
    }
    function aB(t) {
        return ag.charAt(t)
    }
    function C(z, t) {
        var aC = ai[z.charCodeAt(t)];
        return (aC == null) ? -1 : aC
    }
    function aa(z) {
        for (var t = this.t - 1; t >= 0; --t) {
            z[t] = this[t]
        }
        z.t = this.t;
        z.s = this.s
    }
    function p(t) {
        this.t = 1;
        this.s = (t < 0) ? -1 : 0;
        if (t > 0) {
            this[0] = t
        } else {
            if (t < -1) {
                this[0] = t + DV
            } else {
                this.t = 0
            }
        }
    }
    function c(t) {
        var z = j();
        z.fromInt(t);
        return z
    }
    function y(aG, z) {
        var aD;
        if (z == 16) {
            aD = 4
        } else {
            if (z == 8) {
                aD = 3
            } else {
                if (z == 256) {
                    aD = 8
                } else {
                    if (z == 2) {
                        aD = 1
                    } else {
                        if (z == 32) {
                            aD = 5
                        } else {
                            if (z == 4) {
                                aD = 2
                            } else {
                                this.fromRadix(aG, z);
                                return
                            }
                        }
                    }
                }
            }
        }
        this.t = 0;
        this.s = 0;
        var aF = aG.length,
        aC = false,
        aE = 0;
        while (--aF >= 0) {
            var t = (aD == 8) ? aG[aF] & 255 : C(aG, aF);
            if (t < 0) {
                if (aG.charAt(aF) == "-") {
                    aC = true
                }
                continue
            }
            aC = false;
            if (aE == 0) {
                this[this.t++] = t
            } else {
                if (aE + aD > this.DB) {
                    this[this.t - 1] |= (t & ((1 << (this.DB - aE)) - 1)) << aE;
                    this[this.t++] = (t >> (this.DB - aE))
                } else {
                    this[this.t - 1] |= t << aE
                }
            }
            aE += aD;
            if (aE >= this.DB) {
                aE -= this.DB
            }
        }
        if (aD == 8 && (aG[0] & 128) != 0) {
            this.s = -1;
            if (aE > 0) {
                this[this.t - 1] |= ((1 << (this.DB - aE)) - 1) << aE
            }
        }
        this.clamp();
        if (aC) {
            au.ZERO.subTo(this, this)
        }
    }
    function Q() {
        var t = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == t) {--this.t
        }
    }
    function s(z) {
        if (this.s < 0) {
            return "-" + this.negate().toString(z)
        }
        var aC;
        if (z == 16) {
            aC = 4
        } else {
            if (z == 8) {
                aC = 3
            } else {
                if (z == 2) {
                    aC = 1
                } else {
                    if (z == 32) {
                        aC = 5
                    } else {
                        if (z == 4) {
                            aC = 2
                        } else {
                            return this.toRadix(z)
                        }
                    }
                }
            }
        }
        var aE = (1 << aC) - 1,
        aH,
        t = false,
        aF = "",
        aD = this.t;
        var aG = this.DB - (aD * this.DB) % aC;
        if (aD-->0) {
            if (aG < this.DB && (aH = this[aD] >> aG) > 0) {
                t = true;
                aF = aB(aH)
            }
            while (aD >= 0) {
                if (aG < aC) {
                    aH = (this[aD] & ((1 << aG) - 1)) << (aC - aG);
                    aH |= this[--aD] >> (aG += this.DB - aC)
                } else {
                    aH = (this[aD] >> (aG -= aC)) & aE;
                    if (aG <= 0) {
                        aG += this.DB; --aD
                    }
                }
                if (aH > 0) {
                    t = true
                }
                if (t) {
                    aF += aB(aH)
                }
            }
        }
        return t ? aF: "0"
    }
    function T() {
        var t = j();
        au.ZERO.subTo(this, t);
        return t
    }
    function an() {
        return (this.s < 0) ? this.negate() : this
    }
    function I(t) {
        var aC = this.s - t.s;
        if (aC != 0) {
            return aC
        }
        var z = this.t;
        aC = z - t.t;
        if (aC != 0) {
            return aC
        }
        while (--z >= 0) {
            if ((aC = this[z] - t[z]) != 0) {
                return aC
            }
        }
        return 0
    }
    function l(z) {
        var aD = 1,
        aC;
        if ((aC = z >>> 16) != 0) {
            z = aC;
            aD += 16
        }
        if ((aC = z >> 8) != 0) {
            z = aC;
            aD += 8
        }
        if ((aC = z >> 4) != 0) {
            z = aC;
            aD += 4
        }
        if ((aC = z >> 2) != 0) {
            z = aC;
            aD += 2
        }
        if ((aC = z >> 1) != 0) {
            z = aC;
            aD += 1
        }
        return aD
    }
    function w() {
        if (this.t <= 0) {
            return 0
        }
        return this.DB * (this.t - 1) + l(this[this.t - 1] ^ (this.s & this.DM))
    }
    function at(aC, z) {
        var t;
        for (t = this.t - 1; t >= 0; --t) {
            z[t + aC] = this[t]
        }
        for (t = aC - 1; t >= 0; --t) {
            z[t] = 0
        }
        z.t = this.t + aC;
        z.s = this.s
    }
    function Z(aC, z) {
        for (var t = aC; t < this.t; ++t) {
            z[t - aC] = this[t]
        }
        z.t = Math.max(this.t - aC, 0);
        z.s = this.s
    }
    function v(aH, aD) {
        var z = aH % this.DB;
        var t = this.DB - z;
        var aF = (1 << t) - 1;
        var aE = Math.floor(aH / this.DB),
        aG = (this.s << z) & this.DM,
        aC;
        for (aC = this.t - 1; aC >= 0; --aC) {
            aD[aC + aE + 1] = (this[aC] >> t) | aG;
            aG = (this[aC] & aF) << z
        }
        for (aC = aE - 1; aC >= 0; --aC) {
            aD[aC] = 0
        }
        aD[aE] = aG;
        aD.t = this.t + aE + 1;
        aD.s = this.s;
        aD.clamp()
    }
    function n(aG, aD) {
        aD.s = this.s;
        var aE = Math.floor(aG / this.DB);
        if (aE >= this.t) {
            aD.t = 0;
            return
        }
        var z = aG % this.DB;
        var t = this.DB - z;
        var aF = (1 << z) - 1;
        aD[0] = this[aE] >> z;
        for (var aC = aE + 1; aC < this.t; ++aC) {
            aD[aC - aE - 1] |= (this[aC] & aF) << t;
            aD[aC - aE] = this[aC] >> z
        }
        if (z > 0) {
            aD[this.t - aE - 1] |= (this.s & aF) << t
        }
        aD.t = this.t - aE;
        aD.clamp()
    }
    function ad(z, aD) {
        var aC = 0,
        aE = 0,
        t = Math.min(z.t, this.t);
        while (aC < t) {
            aE += this[aC] - z[aC];
            aD[aC++] = aE & this.DM;
            aE >>= this.DB
        }
        if (z.t < this.t) {
            aE -= z.s;
            while (aC < this.t) {
                aE += this[aC];
                aD[aC++] = aE & this.DM;
                aE >>= this.DB
            }
            aE += this.s
        } else {
            aE += this.s;
            while (aC < z.t) {
                aE -= z[aC];
                aD[aC++] = aE & this.DM;
                aE >>= this.DB
            }
            aE -= z.s
        }
        aD.s = (aE < 0) ? -1 : 0;
        if (aE < -1) {
            aD[aC++] = this.DV + aE
        } else {
            if (aE > 0) {
                aD[aC++] = aE
            }
        }
        aD.t = aC;
        aD.clamp()
    }
    function F(z, aD) {
        var t = this.abs(),
        aE = z.abs();
        var aC = t.t;
        aD.t = aC + aE.t;
        while (--aC >= 0) {
            aD[aC] = 0
        }
        for (aC = 0; aC < aE.t; ++aC) {
            aD[aC + t.t] = t.am(0, aE[aC], aD, aC, 0, t.t)
        }
        aD.s = 0;
        aD.clamp();
        if (this.s != z.s) {
            au.ZERO.subTo(aD, aD)
        }
    }
    function S(aC) {
        var t = this.abs();
        var z = aC.t = 2 * t.t;
        while (--z >= 0) {
            aC[z] = 0
        }
        for (z = 0; z < t.t - 1; ++z) {
            var aD = t.am(z, t[z], aC, 2 * z, 0, 1);
            if ((aC[z + t.t] += t.am(z + 1, 2 * t[z], aC, 2 * z + 1, aD, t.t - z - 1)) >= t.DV) {
                aC[z + t.t] -= t.DV;
                aC[z + t.t + 1] = 1
            }
        }
        if (aC.t > 0) {
            aC[aC.t - 1] += t.am(z, t[z], aC, 2 * z, 0, 1)
        }
        aC.s = 0;
        aC.clamp()
    }
    function G(aK, aH, aG) {
        var aQ = aK.abs();
        if (aQ.t <= 0) {
            return
        }
        var aI = this.abs();
        if (aI.t < aQ.t) {
            if (aH != null) {
                aH.fromInt(0)
            }
            if (aG != null) {
                this.copyTo(aG)
            }
            return
        }
        if (aG == null) {
            aG = j()
        }
        var aE = j(),
        z = this.s,
        aJ = aK.s;
        var aP = this.DB - l(aQ[aQ.t - 1]);
        if (aP > 0) {
            aQ.lShiftTo(aP, aE);
            aI.lShiftTo(aP, aG)
        } else {
            aQ.copyTo(aE);
            aI.copyTo(aG)
        }
        var aM = aE.t;
        var aC = aE[aM - 1];
        if (aC == 0) {
            return
        }
        var aL = aC * (1 << this.F1) + ((aM > 1) ? aE[aM - 2] >> this.F2: 0);
        var aT = this.FV / aL,
        aS = (1 << this.F1) / aL,
        aR = 1 << this.F2;
        var aO = aG.t,
        aN = aO - aM,
        aF = (aH == null) ? j() : aH;
        aE.dlShiftTo(aN, aF);
        if (aG.compareTo(aF) >= 0) {
            aG[aG.t++] = 1;
            aG.subTo(aF, aG)
        }
        au.ONE.dlShiftTo(aM, aF);
        aF.subTo(aE, aE);
        while (aE.t < aM) {
            aE[aE.t++] = 0
        }
        while (--aN >= 0) {
            var aD = (aG[--aO] == aC) ? this.DM: Math.floor(aG[aO] * aT + (aG[aO - 1] + aR) * aS);
            if ((aG[aO] += aE.am(0, aD, aG, aN, 0, aM)) < aD) {
                aE.dlShiftTo(aN, aF);
                aG.subTo(aF, aG);
                while (aG[aO] < --aD) {
                    aG.subTo(aF, aG)
                }
            }
        }
        if (aH != null) {
            aG.drShiftTo(aM, aH);
            if (z != aJ) {
                au.ZERO.subTo(aH, aH)
            }
        }
        aG.t = aM;
        aG.clamp();
        if (aP > 0) {
            aG.rShiftTo(aP, aG)
        }
        if (z < 0) {
            au.ZERO.subTo(aG, aG)
        }
    }
    function P(t) {
        var z = j();
        this.abs().divRemTo(t, null, z);
        if (this.s < 0 && z.compareTo(au.ZERO) > 0) {
            t.subTo(z, z)
        }
        return z
    }
    function M(t) {
        this.m = t
    }
    function X(t) {
        if (t.s < 0 || t.compareTo(this.m) >= 0) {
            return t.mod(this.m)
        } else {
            return t
        }
    }
    function am(t) {
        return t
    }
    function L(t) {
        t.divRemTo(this.m, null, t)
    }
    function J(t, aC, z) {
        t.multiplyTo(aC, z);
        this.reduce(z)
    }
    function aw(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    M.prototype.convert = X;
    M.prototype.revert = am;
    M.prototype.reduce = L;
    M.prototype.mulTo = J;
    M.prototype.sqrTo = aw;
    function D() {
        if (this.t < 1) {
            return 0
        }
        var t = this[0];
        if ((t & 1) == 0) {
            return 0
        }
        var z = t & 3;
        z = (z * (2 - (t & 15) * z)) & 15;
        z = (z * (2 - (t & 255) * z)) & 255;
        z = (z * (2 - (((t & 65535) * z) & 65535))) & 65535;
        z = (z * (2 - t * z % this.DV)) % this.DV;
        return (z > 0) ? this.DV - z: -z
    }
    function g(t) {
        this.m = t;
        this.mp = t.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << (t.DB - 15)) - 1;
        this.mt2 = 2 * t.t
    }
    function al(t) {
        var z = j();
        t.abs().dlShiftTo(this.m.t, z);
        z.divRemTo(this.m, null, z);
        if (t.s < 0 && z.compareTo(au.ZERO) > 0) {
            this.m.subTo(z, z)
        }
        return z
    }
    function av(t) {
        var z = j();
        t.copyTo(z);
        this.reduce(z);
        return z
    }
    function R(t) {
        while (t.t <= this.mt2) {
            t[t.t++] = 0
        }
        for (var aC = 0; aC < this.m.t; ++aC) {
            var z = t[aC] & 32767;
            var aD = (z * this.mpl + (((z * this.mph + (t[aC] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
            z = aC + this.m.t;
            t[z] += this.m.am(0, aD, t, aC, 0, this.m.t);
            while (t[z] >= t.DV) {
                t[z] -= t.DV;
                t[++z]++
            }
        }
        t.clamp();
        t.drShiftTo(this.m.t, t);
        if (t.compareTo(this.m) >= 0) {
            t.subTo(this.m, t)
        }
    }
    function ao(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    function B(t, aC, z) {
        t.multiplyTo(aC, z);
        this.reduce(z)
    }
    g.prototype.convert = al;
    g.prototype.revert = av;
    g.prototype.reduce = R;
    g.prototype.mulTo = B;
    g.prototype.sqrTo = ao;
    function k() {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
    }
    function A(aH, aI) {
        if (aH > 4294967295 || aH < 1) {
            return au.ONE
        }
        var aG = j(),
        aC = j(),
        aF = aI.convert(this),
        aE = l(aH) - 1;
        aF.copyTo(aG);
        while (--aE >= 0) {
            aI.sqrTo(aG, aC);
            if ((aH & (1 << aE)) > 0) {
                aI.mulTo(aC, aF, aG)
            } else {
                var aD = aG;
                aG = aC;
                aC = aD
            }
        }
        return aI.revert(aG)
    }
    function ap(aC, t) {
        var aD;
        if (aC < 256 || t.isEven()) {
            aD = new M(t)
        } else {
            aD = new g(t)
        }
        return this.exp(aC, aD)
    }
    au.prototype.copyTo = aa;
    au.prototype.fromInt = p;
    au.prototype.fromString = y;
    au.prototype.clamp = Q;
    au.prototype.dlShiftTo = at;
    au.prototype.drShiftTo = Z;
    au.prototype.lShiftTo = v;
    au.prototype.rShiftTo = n;
    au.prototype.subTo = ad;
    au.prototype.multiplyTo = F;
    au.prototype.squareTo = S;
    au.prototype.divRemTo = G;
    au.prototype.invDigit = D;
    au.prototype.isEven = k;
    au.prototype.exp = A;
    au.prototype.toString = s;
    au.prototype.negate = T;
    au.prototype.abs = an;
    au.prototype.compareTo = I;
    au.prototype.bitLength = w;
    au.prototype.mod = P;
    au.prototype.modPowInt = ap;
    au.ZERO = c(0);
    au.ONE = c(1);
    var o;
    var W;
    var ae;
    function d(t) {
        W[ae++] ^= t & 255;
        W[ae++] ^= (t >> 8) & 255;
        W[ae++] ^= (t >> 16) & 255;
        W[ae++] ^= (t >> 24) & 255;
        if (ae >= O) {
            ae -= O
        }
    }
    function V() {
        d(new Date().getTime())
    }
    if (W == null) {
        W = new Array();
        ae = 0;
        var K;
        if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
            var H = window.crypto.random(32);
            for (K = 0; K < H.length; ++K) {
                W[ae++] = H.charCodeAt(K) & 255
            }
        }
        while (ae < O) {
            K = Math.floor(65536 * Math.random());
            W[ae++] = K >>> 8;
            W[ae++] = K & 255
        }
        ae = 0;
        V()
    }
    function E() {
        if (o == null) {
            V();
            o = aq();
            o.init(W);
            for (ae = 0; ae < W.length; ++ae) {
                W[ae] = 0
            }
            ae = 0
        }
        return o.next()
    }
    function ax(z) {
        var t;
        for (t = 0; t < z.length; ++t) {
            z[t] = E()
        }
    }
    function af() {}
    af.prototype.nextBytes = ax;
    function m() {
        this.i = 0;
        this.j = 0;
        this.S = new Array()
    }
    function f(aE) {
        var aD, z, aC;
        for (aD = 0; aD < 256; ++aD) {
            this.S[aD] = aD
        }
        z = 0;
        for (aD = 0; aD < 256; ++aD) {
            z = (z + this.S[aD] + aE[aD % aE.length]) & 255;
            aC = this.S[aD];
            this.S[aD] = this.S[z];
            this.S[z] = aC
        }
        this.i = 0;
        this.j = 0
    }
    function a() {
        var z;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        z = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = z;
        return this.S[(z + this.S[this.i]) & 255]
    }
    m.prototype.init = f;
    m.prototype.next = a;
    function aq() {
        return new m()
    }
    var O = 256;
    function U(aD, aC, z) {
        aC = "F20CE00BAE5361F8FA3AE9CEFA495362FF7DA1BA628F64A347F0A8C012BF0B254A30CD92ABFFE7A6EE0DC424CB6166F8819EFA5BCCB20EDFB4AD02E412CCF579B1CA711D55B8B0B3AEB60153D5E0693A2A86F3167D7847A0CB8B00004716A9095D9BADC977CBB804DBDCBA6029A9710869A453F27DFDDF83C016D928B3CBF4C7";
        z = "3";
        var t = new N();
        t.setPublic(aC, z);
        return t.encrypt(aD)
    }
    return {
        rsa_encrypt: U
    }
} (); (function(t) {
    var u = "",
    a = 0,
    h = [],
    z = [],
    A = 0,
    w = 0,
    o = [],
    v = [],
    p = true;
    function f() {
        return Math.round(Math.random() * 4294967295)
    }
    function k(E, F, B) {
        if (!B || B > 4) {
            B = 4
        }
        var C = 0;
        for (var D = F; D < F + B; D++) {
            C <<= 8;
            C |= E[D]
        }
        return (C & 4294967295) >>> 0
    }
    function b(C, D, B) {
        C[D + 3] = (B >> 0) & 255;
        C[D + 2] = (B >> 8) & 255;
        C[D + 1] = (B >> 16) & 255;
        C[D + 0] = (B >> 24) & 255
    }
    function y(E) {
        if (!E) {
            return ""
        }
        var B = "";
        for (var C = 0; C < E.length; C++) {
            var D = Number(E[C]).toString(16);
            if (D.length == 1) {
                D = "0" + D
            }
            B += D
        }
        return B
    }
    function x(C) {
        var D = "";
        for (var B = 0; B < C.length; B += 2) {
            D += String.fromCharCode(parseInt(C.substr(B, 2), 16))
        }
        return D
    }
    function c(E, B) {
        if (!E) {
            return ""
        }
        if (B) {
            E = m(E)
        }
        var D = [];
        for (var C = 0; C < E.length; C++) {
            D[C] = E.charCodeAt(C)
        }
        return y(D)
    }
    function m(E) {
        var D, F, C = [],
        B = E.length;
        for (D = 0; D < B; D++) {
            F = E.charCodeAt(D);
            if (F > 0 && F <= 127) {
                C.push(E.charAt(D))
            } else {
                if (F >= 128 && F <= 2047) {
                    C.push(String.fromCharCode(192 | ((F >> 6) & 31)), String.fromCharCode(128 | (F & 63)))
                } else {
                    if (F >= 2048 && F <= 65535) {
                        C.push(String.fromCharCode(224 | ((F >> 12) & 15)), String.fromCharCode(128 | ((F >> 6) & 63)), String.fromCharCode(128 | (F & 63)))
                    }
                }
            }
        }
        return C.join("")
    }
    function j(D) {
        h = new Array(8);
        z = new Array(8);
        A = w = 0;
        p = true;
        a = 0;
        var B = D.length;
        var E = 0;
        a = (B + 10) % 8;
        if (a != 0) {
            a = 8 - a
        }
        o = new Array(B + a + 10);
        h[0] = ((f() & 248) | a) & 255;
        for (var C = 1; C <= a; C++) {
            h[C] = f() & 255
        }
        a++;
        for (var C = 0; C < 8; C++) {
            z[C] = 0
        }
        E = 1;
        while (E <= 2) {
            if (a < 8) {
                h[a++] = f() & 255;
                E++
            }
            if (a == 8) {
                r()
            }
        }
        var C = 0;
        while (B > 0) {
            if (a < 8) {
                h[a++] = D[C++];
                B--
            }
            if (a == 8) {
                r()
            }
        }
        E = 1;
        while (E <= 7) {
            if (a < 8) {
                h[a++] = 0;
                E++
            }
            if (a == 8) {
                r()
            }
        }
        return o
    }
    function s(F) {
        var E = 0;
        var C = new Array(8);
        var B = F.length;
        v = F;
        if (B % 8 != 0 || B < 16) {
            return null
        }
        z = n(F);
        a = z[0] & 7;
        E = B - a - 10;
        if (E < 0) {
            return null
        }
        for (var D = 0; D < C.length; D++) {
            C[D] = 0
        }
        o = new Array(E);
        w = 0;
        A = 8;
        a++;
        var G = 1;
        while (G <= 2) {
            if (a < 8) {
                a++;
                G++
            }
            if (a == 8) {
                C = F;
                if (!g()) {
                    return null
                }
            }
        }
        var D = 0;
        while (E != 0) {
            if (a < 8) {
                o[D] = (C[w + a] ^ z[a]) & 255;
                D++;
                E--;
                a++
            }
            if (a == 8) {
                C = F;
                w = A - 8;
                if (!g()) {
                    return null
                }
            }
        }
        for (G = 1; G < 8; G++) {
            if (a < 8) {
                if ((C[w + a] ^ z[a]) != 0) {
                    return null
                }
                a++
            }
            if (a == 8) {
                C = F;
                w = A;
                if (!g()) {
                    return null
                }
            }
        }
        return o
    }
    function r() {
        for (var B = 0; B < 8; B++) {
            if (p) {
                h[B] ^= z[B]
            } else {
                h[B] ^= o[w + B]
            }
        }
        var C = l(h);
        for (var B = 0; B < 8; B++) {
            o[A + B] = C[B] ^ z[B];
            z[B] = h[B]
        }
        w = A;
        A += 8;
        a = 0;
        p = false
    }
    function l(B) {
        var C = 16;
        var H = k(B, 0, 4);
        var G = k(B, 4, 4);
        var J = k(u, 0, 4);
        var I = k(u, 4, 4);
        var F = k(u, 8, 4);
        var E = k(u, 12, 4);
        var D = 0;
        var K = 2654435769 >>> 0;
        while (C-->0) {
            D += K;
            D = (D & 4294967295) >>> 0;
            H += ((G << 4) + J) ^ (G + D) ^ ((G >>> 5) + I);
            H = (H & 4294967295) >>> 0;
            G += ((H << 4) + F) ^ (H + D) ^ ((H >>> 5) + E);
            G = (G & 4294967295) >>> 0
        }
        var L = new Array(8);
        b(L, 0, H);
        b(L, 4, G);
        return L
    }
    function n(B) {
        var C = 16;
        var H = k(B, 0, 4);
        var G = k(B, 4, 4);
        var J = k(u, 0, 4);
        var I = k(u, 4, 4);
        var F = k(u, 8, 4);
        var E = k(u, 12, 4);
        var D = 3816266640 >>> 0;
        var K = 2654435769 >>> 0;
        while (C-->0) {
            G -= ((H << 4) + F) ^ (H + D) ^ ((H >>> 5) + E);
            G = (G & 4294967295) >>> 0;
            H -= ((G << 4) + J) ^ (G + D) ^ ((G >>> 5) + I);
            H = (H & 4294967295) >>> 0;
            D -= K;
            D = (D & 4294967295) >>> 0
        }
        var L = new Array(8);
        b(L, 0, H);
        b(L, 4, G);
        return L
    }
    function g() {
        var B = v.length;
        for (var C = 0; C < 8; C++) {
            z[C] ^= v[A + C]
        }
        z = n(z);
        A += 8;
        a = 0;
        return true
    }
    function q(F, E) {
        var D = [];
        if (E) {
            for (var C = 0; C < F.length; C++) {
                D[C] = F.charCodeAt(C) & 255
            }
        } else {
            var B = 0;
            for (var C = 0; C < F.length; C += 2) {
                D[B++] = parseInt(F.substr(C, 2), 16)
            }
        }
        return D
    }
    t.TEA = {
        encrypt: function(E, D) {
            var C = q(E, D);
            var B = j(C);
            return y(B)
        },
        enAsBase64: function(G, F) {
            var E = q(G, F);
            var D = j(E);
            var B = "";
            for (var C = 0; C < D.length; C++) {
                B += String.fromCharCode(D[C])
            }
            return btoa(B)
        },
        decrypt: function(D) {
            var C = q(D, false);
            var B = s(C);
            return y(B)
        },
        initkey: function(B, C) {
            u = q(B, C)
        },
        bytesToStr: x,
        strToBytes: c,
        bytesInStr: y,
        dataFromStr: q
    };
    var d = {};
    d.PADCHAR = "=";
    d.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    d.getbyte = function(D, C) {
        var B = D.charCodeAt(C);
        if (B > 255) {
            throw "INVALID_CHARACTER_ERR: DOM Exception 5"
        }
        return B
    };
    d.encode = function(F) {
        if (arguments.length != 1) {
            throw "SyntaxError: Not enough arguments"
        }
        var C = d.PADCHAR;
        var H = d.ALPHA;
        var G = d.getbyte;
        var E, I;
        var B = [];
        F = "" + F;
        var D = F.length - F.length % 3;
        if (F.length == 0) {
            return F
        }
        for (E = 0; E < D; E += 3) {
            I = (G(F, E) << 16) | (G(F, E + 1) << 8) | G(F, E + 2);
            B.push(H.charAt(I >> 18));
            B.push(H.charAt((I >> 12) & 63));
            B.push(H.charAt((I >> 6) & 63));
            B.push(H.charAt(I & 63))
        }
        switch (F.length - D) {
        case 1:
            I = G(F, E) << 16;
            B.push(H.charAt(I >> 18) + H.charAt((I >> 12) & 63) + C + C);
            break;
        case 2:
            I = (G(F, E) << 16) | (G(F, E + 1) << 8);
            B.push(H.charAt(I >> 18) + H.charAt((I >> 12) & 63) + H.charAt((I >> 6) & 63) + C);
            break
        }
        return B.join("")
    };
    if (!window.btoa) {
        window.btoa = d.encode
    }
})(window);
$ = window.$ || {};
$pt = window.$pt || {};
$.Encryption = $pt.Encryption = function() {
    var hexcase = 1;
    var b64pad = "";
    var chrsz = 8;
    var mode = 32;
    function md5(s) {
        return hex_md5(s)
    }
    function hex_md5(s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz))
    }
    function str_md5(s) {
        return binl2str(core_md5(str2binl(s), s.length * chrsz))
    }
    function hex_hmac_md5(key, data) {
        return binl2hex(core_hmac_md5(key, data))
    }
    function b64_hmac_md5(key, data) {
        return binl2b64(core_hmac_md5(key, data))
    }
    function str_hmac_md5(key, data) {
        return binl2str(core_hmac_md5(key, data))
    }
    function core_md5(x, len) {
        x[len >> 5] |= 128 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd)
        }
        if (mode == 16) {
            return Array(b, c)
        } else {
            return Array(a, b, c, d)
        }
    }
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
    }
    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) {
            bkey = core_md5(bkey, key.length * chrsz)
        }
        var ipad = Array(16),
        opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828
        }
        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128)
    }
    function safe_add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 65535)
    }
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
        }
        return bin
    }
    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz) {
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
        }
        return str
    }
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF": "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
        }
        return str
    }
    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) {
                    str += b64pad
                } else {
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
                }
            }
        }
        return str
    }
    function hexchar2bin(str) {
        var arr = [];
        for (var i = 0; i < str.length; i = i + 2) {
            arr.push("\\x" + str.substr(i, 2))
        }
        arr = arr.join("");
        eval("var temp = '" + arr + "'");
        return temp
    }
    function __monitor(mid, probability) {
        if (Math.random() > (probability || 1)) {
            return
        }
        try {
            var url = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + mid;
            var s = document.createElement("img");
            s.src = url
        } catch(e) {}
    }
    function getEncryption(password, salt, vcode, isMd5) {
        vcode = vcode || "";
        password = password || "";
        var md5Pwd = isMd5 ? password: md5(password),
        h1 = hexchar2bin(md5Pwd),
        s2 = md5(h1 + salt),
        rsaH1 = $pt.RSA.rsa_encrypt(h1),
        rsaH1Len = (rsaH1.length / 2).toString(16),
        hexVcode = TEA.strToBytes(vcode.toUpperCase(), true),
        vcodeLen = Number(hexVcode.length / 2).toString(16);
        while (vcodeLen.length < 4) {
            vcodeLen = "0" + vcodeLen
        }
        while (rsaH1Len.length < 4) {
            rsaH1Len = "0" + rsaH1Len
        }
        TEA.initkey(s2);
        var saltPwd = TEA.enAsBase64(rsaH1Len + rsaH1 + TEA.strToBytes(salt) + vcodeLen + hexVcode);
        TEA.initkey("");
        setTimeout(function() {
            __monitor(488358, 1)
        },
        0);
        return saltPwd.replace(/[\/\+=]/g,
        function(a) {
            return {
                "/": "-",
                "+": "*",
                "=": "_"
            } [a]
        })
    }
    function getRSAEncryption(password, vcode, isMd5) {
        var str1 = isMd5 ? password: md5(password);
        var str2 = str1 + vcode.toUpperCase();
        var str3 = $.RSA.rsa_encrypt(str2);
        return str3
    }
    return {
        getEncryption: getEncryption,
        getRSAEncryption: getRSAEncryption,
        md5: md5
    }
} ();
pt.setHeader = function(b) {
    for (var c in b) {
        if (c != "") {
            var a = $("img_" + c);
            if (a) {
                if (b[c] && b[c].indexOf("sys.getface.qq.com") > -1) {
                    a.src = pt.plogin.dftImg
                } else {
                    a.src = b[c] || pt.plogin.dftImg
                }
            } else {
                if (b[c] && b[c].indexOf("sys.getface.qq.com") > -1) {
                    $("auth_face").src = pt.plogin.dftImg
                } else {
                    $("auth_face").src = b[c] || pt.plogin.dftImg
                }
            }
        }
    }
};
pt.qlogin = function() {
    var R = {
        "17": 2,
        "19": 3,
        "20": 2,
        "21": 3,
        "22": 3,
        "23": 3,
        "25": 3,
        "32": 3,
        "33": 3,
        "34": 3
    };
    var x = {
        "17": 240,
        "19": 300,
        "20": 240,
        "21": 360,
        "22": 360,
        "23": 300,
        "25": 300,
        "32": 360,
        "33": 300,
        "34": 300
    };
    var l = 1,
    z = 2,
    C = 3,
    j = 4;
    var I = [];
    var u = [];
    var J = 9;
    var X = '<a hidefocus=true draggable=false href="javascript:void(0);" tabindex="#tabindex#" uin="#uin#" type="#type#" onclick="pt.qlogin.imgClick(this);return false;" onfocus="pt.qlogin.imgFocus(this);" onblur="pt.qlogin.imgBlur(this);" onmouseover="pt.qlogin.imgMouseover(this);" onmousedown="pt.qlogin.imgMouseDowm(this)" onmouseup="pt.qlogin.imgMouseUp(this)" onmouseout="pt.qlogin.imgMouseUp(this)" class="face"  >          <img  id="img_#uin#" uin="#uin#" type="#type#" src="#src#"    onerror="pt.qlogin.imgErr(this);" />           <span id="mengban_#uin#"></span>          <span class="uin_menban"></span>          <span class="uin">#uin#</span>          <span id="img_out_#uin#" uin="#uin#" type="#type#"  class="img_out"  ></span>          <span id="nick_#uin#" class="#nick_class#">#nick#</span>          <span  class="#vip_logo#"></span>      </a>';
    var N = false;
    var o = 1;
    var G = R[pt.ptui.style];
    var B = x[pt.ptui.style];
    var y = 1;
    var S = 5;
    var g = null;
    var Q = true;
    var w = 0;
    var d = 0;
    var q = [4300, 4302, 4304, 4306, 4308],
    D = [4301, 4303, 4305, 4307, 4309];
    var r = 0;
    var a = function(af) {
        if ((af == 1 && y <= 1) || (af == 2 && y >= o)) {
            return
        }
        var ab = 0;
        var ae = 1;
        var ad = $("qlogin_show").offsetWidth || B;
        var Y = 10;
        var ac = Math.ceil(ad / Y);
        var aa = 0;
        if (af == 1) {
            y--;
            if (y <= 1) {
                $.css.hide($("prePage"));
                $.css.show($("nextPage"))
            } else {
                $.css.show($("nextPage"));
                $.css.show($("prePage"))
            }
        } else {
            y++;
            if (y >= o) {
                $.css.hide($("nextPage"));
                $.css.show($("prePage"))
            } else {
                $.css.show($("nextPage"));
                $.css.show($("prePage"))
            }
        }
        function Z() {
            if (af == 1) {
                $("qlogin_list").style.left = (aa * Y - y * ad) + "px"
            } else {
                $("qlogin_list").style.left = ((2 - y) * ad - aa * Y) + "px"
            }
            aa++;
            if (aa > ac) {
                window.clearInterval(ab)
            }
        }
        ab = window.setInterval(Z, ae)
    };
    var T = function() {
        u.length = 0;
        if ($.suportActive()) {
            try {
                var au = $.activetxsso;
                var ac = au.CreateTXSSOData();
                au.InitSSOFPTCtrl(0, ac);
                var aq = au.DoOperation(1, ac);
                if (null == aq) {
                    return
                }
                var ao = aq.GetArray("PTALIST");
                var aw = ao.GetSize();
                for (var ax = 0; ax < aw; ax++) {
                    var ab = ao.GetData(ax);
                    var at = ab.GetDWord("dwSSO_Account_dwAccountUin");
                    var ak = ab.GetDWord("dwSSO_Account_dwAccountUin");
                    var af = "";
                    var aj = ab.GetByte("cSSO_Account_cAccountType");
                    var av = at;
                    if (aj == 1) {
                        try {
                            af = ab.GetArray("SSO_Account_AccountValueList");
                            av = af.GetStr(0)
                        } catch(ar) {}
                    }
                    var am = 0;
                    try {
                        am = ab.GetWord("wSSO_Account_wFaceIndex")
                    } catch(ar) {
                        am = 0
                    }
                    var an = "";
                    try {
                        an = ab.GetStr("strSSO_Account_strNickName")
                    } catch(ar) {
                        an = ""
                    }
                    var ad = ab.GetBuf("bufST_PTLOGIN");
                    var ai = "";
                    var Y = ad.GetSize();
                    for (var ap = 0; ap < Y; ap++) {
                        var Z = ad.GetAt(ap).toString("16");
                        if (Z.length == 1) {
                            Z = "0" + Z
                        }
                        ai += Z
                    }
                    var al = ab.GetDWord("dwSSO_Account_dwUinFlag");
                    var ah = {
                        uin: at,
                        name: av,
                        uinString: ak,
                        type: aj,
                        face: am,
                        nick: an,
                        flag: al,
                        key: ai,
                        loginType: z
                    };
                    u.push(ah)
                }
            } catch(ar) {
                P();
                $.report.nlog("IE获取快速登录信息失败：" + ar.message, "391626", 0.05)
            }
        } else {
            try {
                var aa = $.nptxsso;
                var ag = aa.InitPVA();
                if (ag != false) {
                    var ae = aa.GetPVACount();
                    for (var ap = 0; ap < ae; ap++) {
                        var ah = {
                            uin: aa.GetUin(ap),
                            name: aa.GetAccountName(ap),
                            uinString: aa.GetUinString(ap),
                            type: 0,
                            face: aa.GetFaceIndex(ap),
                            nick: aa.GetNickname(ap) || aa.GetUinString(ap),
                            flag: aa.GetUinFlag(ap),
                            key: aa.GetST(ap),
                            loginType: z
                        };
                        u.push(ah)
                    }
                    if (typeof(aa.GetKeyIndex) == "function") {
                        J = aa.GetKeyIndex()
                    }
                }
            } catch(ar) {
                if (navigator.userAgent.match(/mac.*?safari/i)) { ! window.chrome && pt.plogin.showAssistant(4)
                } else {
                    P()
                }
                $.report.nlog("非IE获取快速登录信息失败：" + (ar.message || ar), "391627", 0.05)
            }
        }
    };
    var p = function(aa) {
        for (var Z = 0,
        Y = u.length; Z < Y; Z++) {
            var ab = u[Z];
            if (ab.uinString == aa) {
                return ab
            }
        }
        return null
    };
    var P = function() {
        if (pt.ptui.enable_qlogin == 0) {
            return
        }
        if (!$.cookie.get("pt_local_token")) {
            $.cookie.set("pt_local_token", Math.random(), "ptlogin2." + pt.ptui.domain);
            if (!$.cookie.get("pt_local_token")) {
                return
            }
        }
        var ab = pt.ptui.isHttps ? D: q,
        Z = pt.ptui.isHttps ? 80 : 50;
        var Y = "http" + (pt.ptui.isHttps ? "s": "") + "://localhost.ptlogin2." + pt.ptui.domain + ":[port]/pt_get_uins?callback=ptui_getuins_CB&r=" + Math.random() + "&pt_local_tk=" + $.cookie.get("pt_local_token");
        var aa = 0;
        pt.qlogin.__getuinsClock = setTimeout(function() {
            var af = window.localStorage && localStorage.getItem("newQQ");
            if (af) {
                return
            }
            var ac = navigator.userAgent.toLocaleLowerCase();
            if (ac.indexOf("windows nt") == -1) {
                return
            }
            if (ac.indexOf("touch") > 0) {
                return
            }
            var ae = ["tencent.com", "3366.com", "51buy.com", "ejinshang.com", "imqq.com", "myapp.com", "paipai.com", "pengyou.com", "qcloud.com", "qq.com", "qzone.com", "tenpay.com", "wanggou.com", "weiyun.com", "yixun.com"];
            for (var ad in ae) {
                if (ae[ad] == pt.ptui.domain) {
                    return pt.plogin.showAssistant(3)
                }
            }
        },
        Z * 20);
        $.http.loadScript(Y.replace("[port]", ab[aa++]));
        r = setInterval(function() {
            if (window.ptui_getuins_CB && ptui_getuins_CB.called) {
                clearTimeout(pt.qlogin.__getuinsClock)
            }
            if (aa >= ab.length || (window.ptui_getuins_CB && ptui_getuins_CB.called)) {
                clearInterval(r)
            } else {
                $.http.loadScript(Y.replace("[port]", ab[aa++]))
            }
        },
        Z)
    };
    var V = function(Y) {
        if (!Y) {
            return
        }
        pt.plogin.showLoading();
        var ac = $.cookie.get("pt_local_token");
        var Z = "http" + (pt.ptui.isHttps ? "s": "") + "://localhost.ptlogin2." + pt.ptui.domain + ":[port]/pt_get_st?clientuin=" + Y + "&callback=ptui_getst_CB&r=" + Math.random() + "&pt_local_tk=" + ac;
        var ad = pt.ptui.isHttps ? D: q,
        aa = pt.ptui.isHttps ? 80 : 50;
        var ab = 0;
        ptui_getst_CB.submitUrl = k({
            uin: Y,
            pt_local_tk: ac
        });
        $.http.loadScript(Z.replace("[port]", ad[ab++]));
        r = setInterval(function() {
            if (ab >= ad.length || (window.ptui_getst_CB && ptui_getst_CB.called)) {
                clearInterval(r)
            } else {
                $.http.loadScript(Z.replace("[port]", ad[ab++]))
            }
            if (ab >= ad.length) {
                pt.qlogin.__getstClock = setTimeout(function() {
                    pt.plogin.hideLoading();
                    ptui_qlogin_CB("-1234", "", "快速登录失败，请检查QQ客户端是否打开")
                },
                3000)
            }
        },
        aa)
    };
    var K = function(Y) {
        if (Y) {
            u = [].concat(Y)
        } else {
            T()
        }
        var ad = [];
        var ab = u.length;
        if (pt.plogin.isNewQr) {
            var ac = {};
            ac.loginType = C;
            ad.push(ac)
        }
        if (pt.plogin.authUin && pt.ptui.auth_mode == "0") {
            var ac = {};
            ac.name = pt.plogin.authUin;
            ac.uinString = pt.plogin.authUin;
            ac.nick = $.str.utf8ToUincode($.cookie.get("ptnick_" + pt.plogin.authUin)) || pt.plogin.authUin;
            ac.loginType = l;
            ad.push(ac)
        }
        for (var Z = 0; Z < ab; Z++) {
            var aa = u[Z];
            if (pt.plogin.authUin && (pt.plogin.authUin == aa.name || pt.plogin.authUin == aa.uinString)) {
                continue
            } else {
                ad.push(aa)
            }
            if (ad.length == 5) {
                break
            }
        }
        I = ad;
        return ad
    };
    var U = function(al) {
        var aj = "";
        var ai = K(al);
        var am = $("qlogin_list");
        if (null == am) {
            return
        }
        if (al) {
            var ad = $("qr_area");
            if (ad) {
                am.removeChild(ad)
            }
            am.innerHTML = "";
            ad && am.appendChild(ad)
        }
        var af = ai.length > S ? S: ai.length;
        if (af == 0) {
            pt.plogin.switchpage(1, true);
            return
        }
        if (pt.plogin.isNewQr) {
            if (af == 1 && pt.plogin.isNewQr) {
                $("qlogin_tips") && $.css.hide($("qlogin_tips"));
                $("qlogin_show").style.top = "25px"
            } else {
                $("qlogin_tips") && $.css.show($("qlogin_tips"));
                $("qlogin_show").style.top = ""
            }
        }
        o = Math.ceil(af / G);
        if (o >= 2) {
            $.css.show($("nextPage"))
        }
        for (var ac = 0; ac < af; ac++) {
            var ae = ai[ac];
            var ab = $.str.encodeHtml(ae.uinString + "");
            var Z = $.str.encodeHtml(ae.nick);
            if ($.str.trim(ae.nick) == "") {
                Z = ab
            }
            var ak = ae.flag;
            var ah = ((ak & 4) == 4);
            var Y = pt.plogin.dftImg;
            if (ae.loginType == C) {
                var ad = $("qr_area");
                if (af == 1) {
                    if (ad) {
                        $("qr_area").className = "qr_0"
                    }
                    if (pt.ptui.lang == "1033") {
                        $("qlogin_show").style.height = ($("qlogin_show").offsetHeight + 10) + "px"
                    }
                } else {
                    if (ad) {
                        $("qr_area").className = "qr_1"
                    }
                }
            } else {
                aj += X.replace(/#uin#/g, ab).replace(/#nick#/g,
                function() {
                    return Z
                }).replace(/#nick_class#/, ah ? "nick red": "nick").replace(/#vip_logo#/, ah ? "vip_logo": "").replace(/#type#/g, ae.loginType).replace(/#src#/g, Y).replace(/#tabindex#/, ac + 1).replace(/#class#/g, ae.loginType == l ? "auth": "hide")
            }
        }
        aj = am.innerHTML + aj;
        am.innerHTML = aj;
        var ag = $("qlogin_show").offsetWidth || B;
        var aa = (o == 1 ? ag: ag / G * af);
        am.style.width = aa + "px";
        if (pt.plogin.isNewQr) {
            am.style.width = (aa + 4) + "px"
        }
        if (r <= 0) {
            pt.qlogin.hasBuildQlogin = true
        }
        W();
        M()
    };
    var A = function(Z) {
        if (Z) {
            T();
            var Y = p(Z);
            if (Y == null) {
                pt.plogin.show_err(pt.str.qlogin_expire);
                $.report.monitor(231544, 1)
            } else {
                var aa = k(Y);
                if (Q) {
                    $.http.loadScript(aa)
                } else {
                    pt.plogin.redirect(pt.ptui.target, aa)
                }
                pt.plogin.showLoading();
                window.clearTimeout(pt.qlogin.__getstClock);
                pt.qlogin.__getstClock = window.setTimeout("pt.plogin.hideLoading();pt.plogin.showAssistant(0);", 10000)
            }
        }
    };
    var s = function(aa, Z, ab) {
        var ac = aa.split("#");
        var Y = ac[0].indexOf("?") > 0 ? "&": "?";
        if (ac[0].substr(ac[0].length - 1, 1) == "?") {
            Y = ""
        }
        if (ac[1]) {
            ac[1] = "#" + ac[1]
        } else {
            ac[1] = ""
        }
        return ac[0] + Y + Z + "=" + ab + ac[1]
    };
    var O = function(Z) {
        var Y = pt.ptui.s_url;
        if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && pt.plogin.isMailLogin) {
            Y = s(Y, "ss", 1)
        }
        if (pt.plogin.isMailLogin && Z) {
            Y = s(Y, "account", encodeURIComponent(Z))
        }
        return Y
    };
    var k = function(Y) {
        var Z = (pt.ptui.isHttps ? "https://ssl.ptlogin2.": "http://ptlogin2.") + pt.ptui.domain + "/" + (pt.ptui.jumpname || "jump") + "?";
        if (pt.ptui.regmaster == 2) {
            Z = "http://ptlogin2.function.qq.com/jump?regmaster=2&"
        } else {
            if (pt.ptui.regmaster == 3) {
                Z = "http://ptlogin2.crm2.qq.com/jump?regmaster=3&"
            } else {
                if (pt.ptui.regmaster == 4) {
                    Z = "https://ssl.ptlogin2.mail.qq.com/jump?regmaster=4&"
                }
            }
        }
        Z += "clientuin=" + Y.uin + "&keyindex=" + J + "&pt_aid=" + pt.ptui.appid + (pt.ptui.daid ? "&daid=" + pt.ptui.daid: "") + "&u1=" + encodeURIComponent(O());
        if (typeof Y.key != "undefined") {
            Z += "&clientkey=" + Y.key
        } else {
            Z += "&pt_local_tk=" + Y.pt_local_tk
        }
        if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && !pt.plogin.isMailLogin) {
            Z += "&low_login_enable=1&low_login_hour=" + pt.plogin.low_login_hour
        }
        if (pt.ptui.csimc != "0" && pt.ptui.csimc) {
            Z += "&csimc=" + pt.ptui.csimc + "&csnum=" + pt.ptui.csnum + "&authid=" + pt.ptui.authid
        }
        if (pt.ptui.pt_qzone_sig == "1") {
            Z += "&pt_qzone_sig=1"
        }
        if (pt.ptui.pt_light == "1") {
            Z += "&pt_light=1"
        }
        if (Q) {
            Z += "&ptopt=1"
        }
        return Z
    };
    var F = function() {
        var Y = t();
        pt.plogin.redirect(pt.ptui.target, Y);
        pt.plogin.showLoading()
    };
    var t = function() {
        var Y = pt.plogin.authSubmitUrl;
        Y += "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(O());
        if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable) {
            Y += "&low_login_enable=1&low_login_hour=" + pt.plogin.low_login_hour
        }
        if (pt.ptui.pt_light == "1") {
            Y += "&pt_light=1"
        }
        return Y
    };
    var n = function(Y) {
        Y.onerror = null;
        if (Y.src != pt.plogin.dftImg) {
            Y.src = pt.plogin.dftImg
        }
        return false
    };
    var b = function(Y) {
        var aa = parseInt(Y.getAttribute("type"));
        var Z = Y.getAttribute("uin");
        switch (aa) {
        case l:
            F();
            break;
        case z:
            A(Z);
            break;
        case j:
            V(Z);
            break
        }
    };
    var h = function(Y) {
        if (!Y) {
            return
        }
        var Z = Y.getAttribute("uin");
        if (Z) {
            $("img_out_" + Z).className = "img_out_focus"
        }
    };
    var E = function(Y) {
        if (!Y) {
            return
        }
        var Z = Y.getAttribute("uin");
        if (Z) {
            $("img_out_" + Z).className = "img_out"
        }
    };
    var L = function(Y) {
        if (!Y) {
            return
        }
        if (g != Y) {
            E(g);
            g = Y
        }
        h(Y)
    };
    var f = function(Y) {
        if (!Y) {
            return
        }
        var Z = Y.getAttribute("uin");
        var aa = $("mengban_" + Z);
        aa && (aa.className = "face_mengban")
    };
    var v = function(Y) {
        if (!Y) {
            return
        }
        var Z = Y.getAttribute("uin");
        var aa = $("mengban_" + Z);
        aa && (aa.className = "")
    };
    var W = function() {
        var Z = $("qlogin_list");
        var Y = Z.getElementsByTagName("a");
        if (Y.length > 0) {
            g = Y[0]
        }
    };
    var M = function() {
        try {
            g.focus()
        } catch(Y) {}
    };
    var H = function() {
        var Z = $("prePage");
        var Y = $("nextPage");
        if (Z) {
            $.e.add(Z, "click",
            function(aa) {
                a(1)
            })
        }
        if (Y) {
            $.e.add(Y, "click",
            function(aa) {
                a(2)
            })
        }
    };
    var c = function() {
        var Z = I.length;
        for (var Y = 0; Y < Z; Y++) {
            if (I[Y].uinString) {
                $.http.loadScript((pt.ptui.isHttps ? "https://ssl.ptlogin2.": "http://ptlogin2.") + pt.ptui.domain + "/getface?appid=" + pt.ptui.appid + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + I[Y].uinString + "&r=" + Math.random())
            }
        }
    };
    var m = function() {
        H();
        setTimeout(function() {
            $.report.monitor(492804, 0.05)
        },
        0)
    };
    m();
    return {
        qloginInit: m,
        hasBuildQlogin: N,
        buildQloginList: U,
        imgClick: b,
        imgFocus: h,
        imgBlur: E,
        imgMouseover: L,
        imgMouseDowm: f,
        imgMouseUp: v,
        imgErr: n,
        focusHeader: M,
        initFace: c,
        authLoginSubmit: F,
        __getstClock: w,
        __getuinsClock: d,
        getSurl: O,
        PCSvrQlogin: j
    }
} ();
function ptui_qlogin_CB(b, a, c) {
    window.clearTimeout(pt.qlogin.__getstClock);
    ptui_qlogin_CB.called = true;
    switch (b) {
    case "0":
        pt.plogin.redirect(pt.ptui.target, a);
        break;
    case "10006":
        pt.plogin.force_qrlogin();
        pt.plogin.show_err(c, true);
        break;
    default:
        pt.plogin.switchpage(1);
        pt.plogin.show_err(c, true)
    }
}
function ptui_getuins_CB(b) {
    clearTimeout(pt.qlogin.__getuinsClock);
    if (!b || ptui_getuins_CB.called) {
        return
    }
    ptui_getuins_CB.called = true;
    pt.plogin.hide_err();
    var a = [];
    for (var c = 0; c < b.length; c++) {
        var d = b[c];
        a.push({
            uin: d.uin,
            name: d.account,
            uinString: d.uin,
            type: 0,
            face: d.face_index,
            nick: d.nickname,
            flag: d.uin_flag,
            loginType: pt.qlogin.PCSvrQlogin
        })
    }
    pt.plogin.initQlogin("", a);
    pt.qlogin.initFace();
    $.report.monitor(508158, 1);
    window.localStorage && localStorage.setItem("newQQ", true)
}
function ptui_getst_CB(a) {
    if (!a) {
        return
    }
    ptui_getst_CB.called = true;
    pt.plogin.hideLoading();
    if (ptui_getst_CB.submitUrl) {
        $.http.loadScript(ptui_getst_CB.submitUrl)
    }
    $.report.monitor(508159, 1)
}
pt.LoginState = {
    PLogin: 1,
    QLogin: 2
};
pt.plogin = {
    account: "",
    at_account: "",
    uin: "",
    salt: "",
    hasCheck: false,
    lastCheckAccount: "",
    needVc: false,
    vcFlag: false,
    ckNum: {},
    action: [0, 0],
    passwordErrorNum: 1,
    isIpad: /iPad/.test(navigator.userAgent),
    ios8: /iPad.*?OS 8_/i.test(navigator.userAgent),
    t_appid: 46000101,
    seller_id: 703010802,
    checkUrl: "",
    loginUrl: "",
    verifycodeUrl: "",
    newVerifycodeUrl: "",
    needShowNewVc: false,
    pt_verifysession: "",
    checkClock: 0,
    isCheckTimeout: false,
    errclock: 0,
    loginClock: 0,
    login_param: pt.ptui.href.substring(pt.ptui.href.indexOf("?") + 1),
    err_m: $("err_m"),
    low_login_enable: true,
    low_login_hour: 720,
    low_login_isshow: false,
    list_index: [ - 1, 2],
    keyCode: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13,
        TAB: 9,
        BACK: 8,
        DEL: 46,
        F5: 116
    },
    knownEmail: ["qq.com", "foxmail.com", "gmail.com", "hotmail.com", "yahoo.com", "sina.com", "163.com", "126.com", "vip.qq.com", "vip.sina.com", "sina.cn", "sohu.com", "yahoo.cn", "yahoo.com.cn", "139.com", "wo.com.cn", "189.cn", "live.com", "msn.com", "live.hk", "live.cn", "hotmail.com.cn", "hinet.net", "msa.hinet.net", "cm1.hinet.net", "umail.hinet.net", "xuite.net", "yam.com", "pchome.com.tw", "netvigator.com", "seed.net.tw", "anet.net.tw"],
    qrlogin_clock: 0,
    qrlogin_timeout: 0,
    qrlogin_timeout_time: 100000,
    isQrLogin: false,
    qr_uin: "",
    qr_nick: "",
    dftImg: "",
    need_hide_operate_tips: true,
    js_type: 1,
    xuiState: 1,
    delayTime: 5000,
    delayMonitorId: "294059",
    hasSubmit: false,
    authUin: "",
    authSubmitUrl: "",
    loginState: pt.LoginState.PLogin,
    checkRet: -1,
    cap_cd: 0,
    checkErr: {
        "2052": "网络繁忙，请稍后重试。",
        "1028": "網絡繁忙，請稍後重試。",
        "1033": "The network is busy, please try again later."
    },
    isUIStyle: pt.ptui.fromStyle == 17,
    domFocus: function(b) {
        try {
            window.setTimeout(function() {
                b.focus()
            },
            0)
        } catch(a) {}
    },
    formFocus: function() {
        var b = document.loginform;
        try {
            var a = b.u;
            var d = b.p;
            var f = b.verifycode;
            if (a.value == "") {
                a.focus();
                return
            }
            if (d.value == "") {
                d.focus();
                return
            }
            if (f.value == "") {
                f.focus()
            }
        } catch(c) {}
    },
    getAuthUrl: function() {
        var b = (pt.ptui.isHttps ? "https://ssl.": "http://") + "ptlogin2." + pt.ptui.domain + "/pt4_auth?daid=" + pt.ptui.daid + "&appid=" + pt.ptui.appid + "&auth_token=" + $.str.time33($.cookie.get("supertoken"));
        var a = pt.ptui.s_url;
        if (/^https/.test(a)) {
            b += "&pt4_shttps=1"
        }
        if (pt.ptui.pt_qzone_sig == "1") {
            b += "&pt_qzone_sig=1"
        }
        return b
    },
    auth: function() {
        pt.ptui.isHttps = $.check.isHttps();
        var a = pt.plogin.getAuthUrl();
        var b = $.cookie.get("superuin");
        if (pt.ptui.daid && pt.ptui.noAuth != "1" && b != "" && pt.ptui.regmaster != 4) {
            $.http.loadScript(a)
        } else {
            pt.plogin.init()
        }
    },
    initQlogin: function(c, b) {
        c = c || pt.plogin.initQlogin.url;
        pt.plogin.initQlogin.url = c;
        var d = 0;
        var a = false;
        if (c && pt.ptui.auth_mode == 0) {
            a = true
        }
        if (!b && pt.ptui.enable_qlogin != 0 && $.cookie.get("pt_qlogincode") != 5) {
            d = $.getLoginQQNum()
        }
        d += a ? 1 : 0;
        d += b ? b.length: 0;
        if (d > 0) {
            pt.plogin.switchpage(pt.LoginState.QLogin)
        } else {
            pt.plogin.switchpage(pt.LoginState.PLogin, true);
            if ($("u").value && pt.ptui.auth_mode == 0) {
                pt.plogin.check()
            }
        }
        if (pt.ptui.enable_qlogin != 0 && !pt.qlogin.hasBuildQlogin) {
            pt.qlogin.buildQloginList(b)
        }
    },
    switchpage: function(a, b) {
        pt.plogin.loginState = a;
        if (!b) {
            pt.plogin.hide_err()
        }
        switch (a) {
        case 1:
            $.css.hide($("qloginTips"));
            $.css.hide($("qlogin"));
            $.css.show($("plogin"));
            $.css.show($("ploginTips"));
            $("fgtpwdbox").style.display = "inline";
            $("q_low_login_box") && $.css.hide($("q_low_login_box"));
            if (b) {
                $("login_switcher_box").className = "login_switcher_no_qlogin"
            } else {
                $("login_switcher_box").className = "login_switcher_plogin"
            }
            window.setTimeout(function() {
                pt.plogin.formFocus()
            },
            0);
            break;
        case 2:
            $.css.hide($("ploginTips"));
            $.css.hide($("plogin"));
            $.css.show($("qlogin"));
            $.css.show($("qloginTips"));
            $.css.hide($("fgtpwdbox"));
            $("q_low_login_box") && $.css.show($("q_low_login_box"));
            $("login_switcher_box").className = "login_switcher_qlogin";
            pt.qlogin.focusHeader();
            break
        }
        pt.plogin.ptui_notifySize("login")
    },
    detectCapsLock: function(c) {
        var b = c.keyCode || c.which;
        var a = c.shiftKey || (b == 16) || false;
        if (((b >= 65 && b <= 90) && !a) || ((b >= 97 && b <= 122) && a)) {
            return true
        } else {
            return false
        }
    },
    generateEmailTips: function(f) {
        var k = f.indexOf("@");
        var h = "";
        if (k == -1) {
            h = f
        } else {
            h = f.substring(0, k)
        }
        var b = [];
        for (var d = 0,
        a = pt.plogin.knownEmail.length; d < a; d++) {
            b.push(h + "@" + pt.plogin.knownEmail[d])
        }
        var g = [];
        for (var c = 0,
        a = b.length; c < a; c++) {
            if (b[c].indexOf(f) > -1) {
                g.push($.str.encodeHtml(b[c]))
            }
        }
        return g
    },
    createEmailTips: function(f) {
        var a = pt.plogin.generateEmailTips(f);
        var h = a.length;
        var g = [];
        var d = "";
        var c = 4;
        h = Math.min(h, c);
        if (h == 0) {
            pt.plogin.list_index[0] = -1;
            pt.plogin.hideEmailTips();
            return
        }
        for (var b = 0; b < h; b++) {
            if (f == a[b]) {
                pt.plogin.hideEmailTips();
                return
            }
            d = "emailTips_" + b;
            if (0 == b) {
                g.push("<li id=" + d + " class='hover' >" + a[b] + "</li>")
            } else {
                g.push("<li id=" + d + ">" + a[b] + "</li>")
            }
        }
        $("email_list").innerHTML = g.join(" ");
        pt.plogin.list_index[0] = 0
    },
    showEmailTips: function() {
        $.css.show($("email_list"));
        pt.plogin.__isShowEmailTips = true
    },
    hideEmailTips: function() {
        $.css.hide($("email_list"));
        pt.plogin.__isShowEmailTips = false
    },
    setUrl: function() {
        var a = pt.ptui.domain;
        var b = $.check.isHttps() && $.check.isSsl();
        pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl.": "http://check.") + "ptlogin2." + a + "/check";
        pt.plogin.loginUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "ptlogin2." + a + "/";
        pt.plogin.verifycodeUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "captcha." + a + "/getimage";
        pt.plogin.newVerifycodeUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "captcha.qq.com/cap_union_show?clientype=2";
        if (b && a != "qq.com" && a != "tenpay.com") {
            pt.plogin.verifycodeUrl = "https://ssl.ptlogin2." + a + "/ptgetimage"
        }
        if (pt.ptui.regmaster == 2) {
            pt.plogin.checkUrl = "http://check.ptlogin2.function.qq.com/check";
            pt.plogin.loginUrl = "http://ptlogin2.function.qq.com/"
        } else {
            if (pt.ptui.regmaster == 3) {
                pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "check.ptlogin2.crm2.qq.com/check";
                pt.plogin.loginUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "ptlogin2.crm2.qq.com/"
            } else {
                if (pt.ptui.regmaster == 4) {
                    pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "ptlogin2.mail.qq.com/check";
                    pt.plogin.loginUrl = (pt.ptui.isHttps ? "https://ssl.": "http://") + "ptlogin2.mail.qq.com/"
                }
            }
        }
        pt.plogin.dftImg = pt.ptui.isHttps ? "https://ui.ptlogin2.qq.com/style/0/images/1.gif": "http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"
    },
    init: function(a) {
        pt.ptui.login_sig = pt.ptui.login_sig || $.cookie.get("pt_login_sig");
        pt.ptui.isHttps = $.check.isHttps();
        pt.plogin.setUrl();
        pt.plogin.bindEvent();
        $("login_button") && ($("login_button").disabled = false);
        pt.plogin.set_default_uin(pt.ptui.defaultUin);
        if ($.check.is_weibo_appid(pt.ptui.appid)) {
            $("u") && ($("u").style.imeMode = "auto")
        }
        if (pt.ptui.isHttps) {
            pt.plogin.delayTime = 7000;
            pt.plogin.delayMonitorId = "294060"
        }
        if (pt.ptui.lockuin) {
            pt.plogin.doLockuin()
        } else {
            pt.plogin.initQlogin(a)
        }
        window.setTimeout(function() {
            pt.plogin.domLoad()
        },
        100)
    },
    aq_patch: function() {
        if (Math.random() < 0.05 && !pt.ptui.isHttps) {
            $.http.loadScript("http://mat1.gtimg.com/www/js/common_v2.js",
            function() {
                if (typeof checkNonTxDomain == "function") {
                    try {
                        checkNonTxDomain(1, 5)
                    } catch(a) {}
                }
            })
        }
    },
    set_default_uin: function(a) {
        if (a == "0") {
            return
        }
        if (a) {} else {
            a = unescape($.cookie.getOrigin("ptui_loginuin"));
            if (pt.ptui.appid != pt.plogin.t_appid && ($.check.isNick(a) || $.check.isName(a))) {
                a = $.cookie.get("pt2gguin").replace(/^o/, "") - 0;
                a = a == 0 ? "": a
            }
        }
        $("u").value = a;
        if (a) {
            $.css.hide($("uin_tips"));
            $.css.show($("uin_del"));
            pt.plogin.set_account()
        }
    },
    doLockuin: function() {
        $("u").readOnly = true;
        var b = $("uinArea");
        if (!$.css.hasClass(b, "lockuin")) {
            $.css.addClass(b, "lockuin")
        }
        var a = $("uin_del");
        a && a.parentNode.removeChild(a);
        $("p").focus()
    },
    set_account: function() {
        var a = $.str.trim($("u").value);
        var b = pt.ptui.appid;
        pt.plogin.account = a;
        pt.plogin.at_account = a;
        if ($.check.is_weibo_appid(b)) {
            if ($.check.isQQ(a) || $.check.isMail(a)) {
                return true
            } else {
                if ($.check.isNick(a) || $.check.isName(a)) {
                    pt.plogin.at_account = "@" + a;
                    return true
                } else {
                    if ($.check.isPhone(a)) {
                        pt.plogin.at_account = "@" + a.replace(/^(86|886)/, "");
                        return true
                    } else {
                        if ($.check.isSeaPhone(a)) {
                            pt.plogin.at_account = "@00" + a.replace(/^(00)/, "");
                            if (/^(@0088609)/.test(pt.plogin.at_account)) {
                                pt.plogin.at_account = pt.plogin.at_account.replace(/^(@0088609)/, "@008869")
                            }
                            return true
                        }
                    }
                }
            }
        } else {
            if ($.check.isQQ(a) || $.check.isMail(a)) {
                return true
            }
            if ($.check.isPhone(a)) {
                pt.plogin.at_account = "@" + a.replace(/^(86|886)/, "");
                return true
            }
            if ($.check.isNick(a)) {
                $("u").value = a + "@qq.com";
                pt.plogin.account = a + "@qq.com";
                pt.plogin.at_account = a + "@qq.com";
                return true
            }
        }
        if ($.check.isForeignPhone(a)) {
            pt.plogin.at_account = "@" + a
        }
        return true
    },
    show_err: function(b, a) {
        pt.plogin.hideLoading();
        $.css.show($("error_tips"));
        pt.plogin.err_m.innerHTML = b;
        clearTimeout(pt.plogin.errclock);
        if (!a) {
            pt.plogin.errclock = setTimeout("pt.plogin.hide_err()", 5000)
        }
    },
    hide_err: function() {
        $.css.hide($("error_tips"));
        pt.plogin.err_m.innerHTML = ""
    },
    showAssistant: function(a) {
        if (pt.ptui.lang != "2052") {
            return
        }
        pt.plogin.hideLoading();
        $.css.show($("error_tips"));
        var b = "";
        switch (a) {
        case 0:
            b = "快速登录异常，试试 {/assistant/troubleshooter.html,登录助手,} 修复";
            $.report.monitor("315785");
            break;
        case 1:
            b = "快速登录异常，试试 {/assistant/troubleshooter.html,登录助手,} 修复";
            $.report.monitor("315786");
            break;
        case 2:
            b = "登录异常，试试 {/assistant/troubleshooter.html,登录助手,} 修复";
            $.report.monitor("315787");
            break;
        case 3:
            b = "快速登录异常，试试 {http://im.qq.com/qq/2013/,升级QQ,onclick='$.report.monitor(326049);'} 修复";
            $.report.monitor("326046");
            break;
        case 4:
            b = "快速登录异常，试试 {http://im.qq.com/macqq/index.shtml#im.qqformac.plusdown,安装插件,}";
            break
        }
        pt.plogin.err_m.innerHTML = b.replace(/{([^,]+?),([^,]+?),(.*?)}/, "<a class='tips_link' style='color: #29B1F1' href='$1' target='_blank' $3>$2</a>")
    },
    showGuanjiaTips: function() {
        $.initGuanjiaPlugin();
        if ($.guanjiaPlugin) {
            $.guanjiaPlugin.QMStartUp(16, '/traytip=3 /tipProblemid=1401 /tipSource=18 /tipType=0 /tipIdParam=0 /tipIconUrl="http://dldir2.qq.com/invc/xfspeed/qqpcmgr/clinic/image/tipsicon_qq.png" /tipTitle="QQ快速登录异常?" /tipDesc="不能用已登录的QQ号快速登录，只能手动输入账号密码，建议用电脑诊所一键修复。"');
            $.report.monitor("316548")
        } else {
            $.report.monitor("316549")
        }
    },
    showLoading: function(a) {
        if (pt.plogin.loginState == pt.LoginState.QLogin) {
            a = 35
        } else {
            a = 20
        }
        pt.plogin.hide_err();
        $("loading_tips").style.top = a + "px";
        $.css.show($("loading_tips"))
    },
    hideLoading: function() {
        $.css.hide($("loading_tips"))
    },
    showLowList: function() {
        var a = $("combox_list");
        if (a) {
            $.css.show(a);
            pt.plogin.low_login_isshow = true
        }
    },
    hideLowList: function() {
        var a = $("combox_list");
        if (a) {
            $.css.hide(a);
            pt.plogin.low_login_isshow = false
        }
    },
    u_focus: function() {
        if ($("u").value == "") {
            $.css.show($("uin_tips"));
            $("uin_tips").className = "input_tips_focus"
        }
        $("u").parentNode.className = "inputOuter_focus"
    },
    u_blur: function() {
        if (pt.plogin.__isShowEmailTips) {
            return
        }
        if (/^\+/.test(this.value)) {
            this.value = this.value.replace(/^\+/, "");
            if (!/^00/.test(this.value)) {
                this.value = "00" + this.value
            }
        }
        if ($("u").value == "") {
            $.css.show($("uin_tips"));
            $("uin_tips").className = "input_tips"
        } else {
            pt.plogin.set_account();
            pt.plogin.check()
        }
        $("u").parentNode.className = "inputOuter"
    },
    u_mouseover: function() {
        var a = $("u").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("u").parentNode.className = "inputOuter_hover"
        }
    },
    u_mouseout: function() {
        var a = $("u").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("u").parentNode.className = "inputOuter"
        }
    },
    window_blur: function() {
        pt.plogin.lastCheckAccount = ""
    },
    u_change: function() {
        pt.plogin.set_account();
        pt.plogin.passwordErrorNum = 1;
        pt.plogin.hasCheck = false;
        pt.plogin.hasSubmit = false
    },
    list_keydown: function(j, g) {
        var f = $("email_list");
        var d = $("u");
        if (g == 1) {
            var f = $("combox_list")
        }
        var h = f.getElementsByTagName("li");
        var b = h.length;
        var a = j.keyCode;
        switch (a) {
        case pt.plogin.keyCode.UP:
            h[pt.plogin.list_index[g]].className = "";
            pt.plogin.list_index[g] = (pt.plogin.list_index[g] - 1 + b) % b;
            h[pt.plogin.list_index[g]].className = "hover";
            break;
        case pt.plogin.keyCode.DOWN:
            h[pt.plogin.list_index[g]].className = "";
            pt.plogin.list_index[g] = (pt.plogin.list_index[g] + 1) % b;
            h[pt.plogin.list_index[g]].className = "hover";
            break;
        case pt.plogin.keyCode.ENTER:
            var c = h[pt.plogin.list_index[g]].innerHTML;
            if (g == 0) {
                $("u").value = $.str.decodeHtml(c)
            }
            pt.plogin.hideEmailTips();
            pt.plogin.hideLowList();
            j.preventDefault();
            break;
        case pt.plogin.keyCode.TAB:
            pt.plogin.hideEmailTips();
            pt.plogin.hideLowList();
            break;
        default:
            break
        }
        if (g == 1) {
            $("combox_box").innerHTML = h[pt.plogin.list_index[g]].innerHTML;
            $("low_login_hour").value = h[pt.plogin.list_index[g]].getAttribute("value")
        }
    },
    u_keydown: function(a) {
        $.css.hide($("uin_tips"));
        if (pt.plogin.list_index[0] == -1) {
            return
        }
        pt.plogin.list_keydown(a, 0)
    },
    u_keyup: function(b) {
        var c = this.value;
        if (c == "") {
            $.css.show($("uin_tips"));
            $("uin_tips").className = "input_tips_focus";
            $.css.hide($("uin_del"))
        } else {
            $.css.show($("uin_del"))
        }
        var a = b.keyCode;
        if (a != pt.plogin.keyCode.UP && a != pt.plogin.keyCode.DOWN && a != pt.plogin.keyCode.ENTER && a != pt.plogin.keyCode.TAB && a != pt.plogin.keyCode.F5) {
            if ($("u").value.indexOf("@") > -1) {
                pt.plogin.showEmailTips();
                pt.plogin.createEmailTips($("u").value)
            } else {
                pt.plogin.hideEmailTips()
            }
        }
    },
    email_mousemove: function(c) {
        var b = c.target;
        if (b.tagName.toLowerCase() != "li") {
            return
        }
        var a = $("emailTips_" + pt.plogin.list_index[0]);
        if (a) {
            a.className = ""
        }
        b.className = "hover";
        pt.plogin.list_index[0] = parseInt(b.getAttribute("id").substring(10));
        c.stopPropagation()
    },
    email_click: function(c) {
        var b = c.target;
        if (b.tagName.toLowerCase() != "li") {
            return
        }
        var a = $("emailTips_" + pt.plogin.list_index[0]);
        if (a) {
            $("u").value = $.str.decodeHtml(a.innerHTML);
            pt.plogin.set_account();
            pt.plogin.check()
        }
        pt.plogin.hideEmailTips();
        c.stopPropagation()
    },
    p_focus: function() {
        if (this.value == "") {
            $.css.show($("pwd_tips"));
            $("pwd_tips").className = "input_tips_focus"
        }
        this.parentNode.className = "inputOuter_focus";
        pt.plogin.check()
    },
    p_blur: function() {
        if (this.value == "") {
            $.css.show($("pwd_tips"));
            $("pwd_tips").className = "input_tips"
        }
        $.css.hide($("caps_lock_tips"));
        this.parentNode.className = "inputOuter"
    },
    p_mouseover: function() {
        var a = $("p").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("p").parentNode.className = "inputOuter_hover"
        }
    },
    p_mouseout: function() {
        var a = $("p").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("p").parentNode.className = "inputOuter"
        }
    },
    p_keydown: function(a) {
        $.css.hide($("pwd_tips"))
    },
    p_keyup: function() {
        if (this.value == "") {
            $.css.show($("pwd_tips"))
        }
    },
    p_keypress: function(a) {
        if (pt.plogin.detectCapsLock(a)) {
            $.css.show($("caps_lock_tips"))
        } else {
            $.css.hide($("caps_lock_tips"))
        }
    },
    vc_focus: function() {
        if (this.value == "") {
            $.css.show($("vc_tips"));
            $("vc_tips").className = "input_tips_focus"
        }
        this.parentNode.className = "inputOuter_focus"
    },
    vc_blur: function() {
        if (this.value == "") {
            $.css.show($("vc_tips"));
            $("vc_tips").className = "input_tips"
        }
        this.parentNode.className = "inputOuter"
    },
    vc_keydown: function() {
        $.css.hide($("vc_tips"))
    },
    vc_keyup: function() {
        if (this.value == "") {
            $.css.show($("vc_tips"))
        }
    },
    document_click: function() {
        pt.plogin.action[0]++;
        pt.plogin.hideEmailTips();
        pt.plogin.hideLowList()
    },
    document_keydown: function() {
        pt.plogin.action[1]++
    },
    checkbox_click: function() {
        if (!pt.plogin.low_login_enable) {
            $("q_low_login_enable").className = "checked";
            $("p_low_login_enable").className = "checked"
        } else {
            $("q_low_login_enable").className = "uncheck";
            $("p_low_login_enable").className = "uncheck"
        }
        pt.plogin.low_login_enable = !pt.plogin.low_login_enable
    },
    feedback: function(d) {
        var c = d ? d.target: null;
        var a = c ? c.id + "-": "";
        var b = "http://support.qq.com/write.shtml?guest=1&fid=713&SSTAG=hailunna-" + a + $.str.encodeHtml(pt.plogin.account);
        window.open(b)
    },
    bind_account: function() {
        $.css.hide($("operate_tips"));
        pt.plogin.need_hide_operate_tips = true;
        window.open("http://id.qq.com/index.html#account");
        $.report.monitor("234964")
    },
    combox_click: function(a) {
        if (pt.plogin.low_login_isshow) {
            pt.plogin.hideLowList()
        } else {
            pt.plogin.showLowList()
        }
        a.stopPropagation()
    },
    delUin: function(a) {
        a && $.css.hide(a.target);
        $("u").value = "";
        pt.plogin.domFocus($("u"));
        pt.plogin.hasCheck = false
    },
    check_cdn_img: function() {
        if (!window.g_cdn_js_fail || pt.ptui.isHttps) {
            return
        }
        var a = new Image();
        a.onload = function() {
            a.onload = a.onerror = null
        };
        a.onerror = function() {
            a.onload = a.onerror = null;
            var d = $("main_css").innerHTML;
            var b = "http://imgcache.qq.com/ptlogin/v4/style/";
            var c = "http://ui.ptlogin2.qq.com/style/";
            d = d.replace(new RegExp(b, "g"), c);
            pt.plogin.insertInlineCss(d);
            $.report.monitor(312520)
        };
        a.src = "http://imgcache.qq.com/ptlogin/v4/style/11/images/icon_3.png"
    },
    insertInlineCss: function(a) {
        if (document.createStyleSheet) {
            var c = document.createStyleSheet("");
            c.cssText = a
        } else {
            var b = document.createElement("style");
            b.type = "text/css";
            b.textContent = a;
            document.getElementsByTagName("head")[0].appendChild(b)
        }
    },
    createLink: function(a) {
        var b = document.createElement("link");
        b.setAttribute("type", "text/css");
        b.setAttribute("rel", "stylesheet");
        b.setAttribute("href", a);
        document.getElementsByTagName("head")[0].appendChild(b)
    },
    domLoad: function(b) {
        if (pt.plogin.hasDomLoad) {
            return
        } else {
            pt.plogin.hasDomLoad = true
        }
        pt.plogin.begin_qrlogin();
        pt.qlogin.initFace();
        pt.plogin.loadQrTipsPic(pt.ptui.lang);
        var a = $("loading_img");
        if (a) {
            a.setAttribute("src", a.getAttribute("place_src"))
        }
        pt.plogin.check_cdn_img();
        pt.plogin.ptui_notifySize("login");
        $.report.monitor("373507&union=256042", 0.05);
        pt.plogin.webLoginReport();
        pt.plogin.monitorQQNum();
        pt.plogin.aq_patch();
        pt.plogin.gzipReport()
    },
    gzipReport: function() {
        if (pt.ptui.gzipEnable == "1" || pt.ptui.isHttps || pt.plogin.isUIStyle) {
            return
        } else {
            $.report.monitor("455847");
            var b = $.http.getXHR();
            if (b) {
                var c = "get";
                var a = "/cgi-bin/xver?t=" + Math.random();
                b.open(c, a);
                b.onreadystatechange = function() {
                    if (b.readyState == 4) {
                        if ((b.status >= 200 && b.status < 300) || b.status === 304 || b.status === 1223 || b.status === 0) {
                            var d = document.createElement("script");
                            d.innerHTML = b.responseText;
                            document.getElementsByTagName("head")[0].appendChild(d);
                            if (!window._gz) {
                                $.report.nlog("gzip探测异常，返回内容：" + b.responseText + "返回码：" + b.status + "uin=" + $.cookie.get("pt2gguin"), "462348")
                            } else {}
                        } else {
                            $.report.nlog("gzip探测异常，返回内容：" + b.responseText + "返回码：" + b.status + "uin=" + $.cookie.get("pt2gguin"), "462348")
                        }
                    }
                };
                b.send()
            }
        }
    },
    monitorQQNum: function() {
        var a = $.loginQQnum;
        switch (a) {
        case 0:
            $.report.monitor("330314", 0.05);
            break;
        case 1:
            $.report.monitor("330315", 0.05);
            break;
        case 2:
            $.report.monitor("330316", 0.05);
            break;
        case 3:
            $.report.monitor("330317", 0.05);
            break;
        case 4:
            $.report.monitor("330318", 0.05);
            break;
        default:
            $.report.monitor("330319", 0.05);
            break
        }
    },
    noscript_err: function() {
        $.report.nlog("noscript_err", 316648);
        $("noscript_area").style.display = "none"
    },
    bindEvent: function() {
        var domU = $("u");
        var domP = $("p");
        var domVerifycode = $("verifycode");
        var domVC = $("verifyimgArea");
        var domBtn = $("login_button");
        var domCheckBox_p = $("p_low_login_box");
        var domCheckBox_q = $("q_low_login_box");
        var domEmailList = $("email_list");
        var domFeedback_web = $("feedback_web");
        var domFeedback_qr = $("feedback_qr");
        var domFeedback_qlogin = $("feedback_qlogin");
        var domClose = $("close");
        var domQloginSwitch = $("switcher_qlogin");
        var domLoginSwitch = $("switcher_plogin");
        var domDelUin = $("uin_del");
        var domBindAccount = $("bind_account");
        var domCancleAuth = $("cancleAuth");
        var domAuthClose = $("authClose");
        var domAuthArea = $("auth_area");
        var domAuthCheckBox = $("auth_low_login_enable");
        var domQr_invalid = $("qr_invalid");
        var domGoback = $("goBack");
        var domQr_img_box = $("qr_img_box");
        var domQr_img = $("qr_img");
        var domQr_info_link = $("qr_info_link");
        var domAgreeMent = $("userAgree_checkbox");
        if (domAgreeMent) {
            $.e.add(domAgreeMent, "click",
            function(e) {
                alert("亲爱的玩家，您如果不同意用户协议，是不能登录的哦")
            })
        }
        if (domQr_info_link) {
            $.e.add(domQr_img, "click",
            function(e) {
                $.report.monitor("331287", 0.05)
            })
        }
        if (domQr_img) {
            $.e.add(domQr_img, "load", pt.plogin.qr_load);
            $.e.add(domQr_img, "error", pt.plogin.qr_error)
        }
        if (domQr_img_box) {
            $.e.add(domQr_img_box, "mouseover", pt.plogin.showQrTips);
            $.e.add(domQr_img_box, "mouseout", pt.plogin.hideQrTips)
        }
        if (domGoback) {
            $.e.add(domGoback, "click",
            function(e) {
                e.preventDefault();
                pt.plogin.go_qrlogin_step(1);
                $.report.monitor("331288", 0.05)
            })
        }
        if (domQr_invalid) {
            $.e.add(domQr_invalid, "click", pt.plogin.begin_qrlogin)
        }
        if (domAuthArea) {
            $.e.add(domAuthArea, "click", pt.plogin.authLogin);
            $.e.add(domAuthArea, "mousedown", pt.plogin.authMouseDowm);
            $.e.add(domAuthArea, "mouseup", pt.plogin.authMouseUp)
        }
        if (domCancleAuth) {}
        if (domAuthClose) {
            $.e.add(domAuthClose, "click", pt.plogin.ptui_notifyClose)
        }
        if (domQloginSwitch) {
            $.e.add(domQloginSwitch, "click",
            function(e) {
                pt.plogin.switchpage(pt.LoginState.QLogin);
                $.report.monitor("331284", 0.05);
                e.preventDefault()
            })
        }
        if (domLoginSwitch) {
            $.e.add(domLoginSwitch, "click",
            function(e) {
                e.preventDefault();
                pt.plogin.switchpage(pt.LoginState.PLogin);
                $.report.monitor("331285", 0.05)
            })
        }
        if (domBindAccount) {
            $.e.add(domBindAccount, "click", pt.plogin.bind_account);
            $.e.add(domBindAccount, "mouseover",
            function(e) {
                pt.plogin.need_hide_operate_tips = false
            });
            $.e.add(domBindAccount, "mouseout",
            function(e) {
                pt.plogin.need_hide_operate_tips = true
            })
        }
        if (domClose) {
            $.e.add(domClose, "click", pt.plogin.ptui_notifyClose)
        }
        if (pt.ptui.low_login == 1 && domCheckBox_p && domCheckBox_q) {
            $.e.add(domCheckBox_p, "click", pt.plogin.checkbox_click);
            $.e.add(domCheckBox_q, "click", pt.plogin.checkbox_click)
        }
        if (pt.ptui.low_login == 1 && domAuthCheckBox) {
            $.e.add(domAuthCheckBox, "click", pt.plogin.checkbox_click);
            $.e.add(domAuthCheckBox, "click", pt.plogin.checkbox_click)
        }
        if (pt.plogin.ios8) {
            domP.focus = domU.focus = function() {}
        }
        $.e.add(domU, "focus", pt.plogin.u_focus);
        $.e.add(domU, "blur", pt.plogin.u_blur);
        $.e.add(domU, "change", pt.plogin.u_change);
        $.e.add(domU, "keydown", pt.plogin.u_keydown);
        $.e.add(domU, "keyup", pt.plogin.u_keyup);
        $.e.add(domU.parentNode, "mouseover", pt.plogin.u_mouseover);
        $.e.add(domU.parentNode, "mouseout", pt.plogin.u_mouseout);
        $.e.add(domDelUin, "click", pt.plogin.delUin);
        $.e.add(domP, "focus", pt.plogin.p_focus);
        $.e.add(domP, "blur", pt.plogin.p_blur);
        $.e.add(domP, "keydown", pt.plogin.p_keydown);
        $.e.add(domP, "keyup", pt.plogin.p_keyup);
        $.e.add(domP, "keypress", pt.plogin.p_keypress);
        $.e.add(domP.parentNode, "mouseover", pt.plogin.p_mouseover);
        $.e.add(domP.parentNode, "mouseout", pt.plogin.p_mouseout);
        $.e.add(domBtn, "click",
        function(e) {
            e && e.preventDefault();
            if (pt.plogin.needShowNewVc == true) {
                pt.plogin.showVC()
            } else {
                pt.plogin.submit(e)
            }
        });
        $.e.add(domVC, "click", pt.plogin.changeVC);
        $.e.add(domEmailList, "mousemove", pt.plogin.email_mousemove);
        $.e.add(domEmailList, "click", pt.plogin.email_click);
        $.e.add(document, "click", pt.plogin.document_click);
        $.e.add(document, "keydown", pt.plogin.document_keydown);
        $.e.add(domVerifycode, "focus", pt.plogin.vc_focus);
        $.e.add(domVerifycode, "blur", pt.plogin.vc_blur);
        $.e.add(domVerifycode, "keydown", pt.plogin.vc_keydown);
        $.e.add(domVerifycode, "keyup", pt.plogin.vc_keyup);
        $.e.add(window, "load", pt.plogin.domLoad);
        $.e.add(window, "message",
        function(e) {
            var origin = e.origin;
            if (origin == (pt.ptui.isHttps ? "https://ssl.": "http://") + "captcha.qq.com") {
                var data = e.data;
                if (window.JSON) {
                    data = JSON.parse(data)
                } else {
                    data = eval("(" + data + ")")
                }
                msgCB(data)
            }
        });
        navigator.captcha_callback = msgCB;
        function msgCB(data) {
            var type = data.type;
            switch (type + "") {
            case "1":
                pt.plogin.vcodeMessage(data);
                break;
            case "2":
                pt.plogin.hideVC();
                break
            }
        }
        var noscript_img = $("noscript_img");
        if (noscript_img) {
            $.e.add(noscript_img, "load", pt.plogin.noscript_err);
            $.e.add(noscript_img, "error", pt.plogin.noscript_err)
        }
    },
    vcodeMessage: function(a) {
        if (!a.randstr || !a.sig) {
            $.report.nlog("vcode postMessage error：" + e.data)
        }
        $("verifycode").value = a.randstr;
        pt.plogin.pt_verifysession = a.sig;
        pt.plogin.hideVC();
        pt.plogin.submit()
    },
    showNewVC: function() {
        var a = pt.plogin.getNewVCUrl();
        var b = $("newVcodeArea");
        b.style.cssText = "background: none #FFFFFF; position: absolute; top: 20px; width: 100%; z-index:9999;";
        b.style.height = ($("login").offsetHeight - b.offsetTop - 2) + "px";
        b.innerHTML = '<iframe name="vcode" allowtransparency="true" scrolling="no" frameborder="0" width="100%" height="100%" src="' + a + '">';
        $.css.show(b)
    },
    hideNewVC: function() {
        $("newVcodeArea") && $.css.hide($("newVcodeArea"))
    },
    changeNewVC: function() {
        pt.plogin.showNewVC()
    },
    showVC: function() {
        pt.plogin.vcFlag = true;
        if (pt.ptui.pt_vcode_v1 == "1") {
            pt.plogin.showNewVC()
        } else {
            $.css.show($("verifyArea"));
            $("verifycode").value = "";
            $("verifyimg").src = pt.plogin.getVCUrl()
        }
        pt.plogin.ptui_notifySize("login")
    },
    hideVC: function() {
        pt.plogin.vcFlag = false;
        if (pt.ptui.pt_vcode_v1 == "1") {
            pt.plogin.hideNewVC()
        } else {
            $.css.hide($("verifyArea"))
        }
        pt.plogin.ptui_notifySize("login")
    },
    changeVC: function(a) {
        a && a.preventDefault();
        if (pt.ptui.pt_vcode_v1 == "1") {
            pt.plogin.changeNewVC()
        } else {
            $("verifyimg").src = pt.plogin.getVCUrl()
        }
        a && $.report.monitor("330322", 0.05)
    },
    getVCUrl: function() {
        var d = pt.plogin.at_account;
        var c = pt.ptui.domain;
        var b = pt.ptui.appid;
        var a = pt.plogin.verifycodeUrl + "?uin=" + d + "&aid=" + b + "&cap_cd=" + pt.plogin.cap_cd + "&" + Math.random();
        return a
    },
    getNewVCUrl: function() {
        var d = pt.plogin.at_account;
        var c = pt.ptui.domain;
        var b = pt.ptui.appid;
        var a = pt.plogin.newVerifycodeUrl + "&uin=" + d + "&aid=" + b + "&cap_cd=" + pt.plogin.cap_cd + "&" + Math.random();
        return a
    },
    checkValidate: function(b) {
        try {
            var a = b.u;
            var d = b.p;
            var f = b.verifycode;
            if ($.str.trim(a.value) == "") {
                pt.plogin.show_err(pt.str.no_uin);
                pt.plogin.domFocus(a);
                return false
            }
            if ($.check.isNullQQ(a.value)) {
                pt.plogin.show_err(pt.str.inv_uin);
                pt.plogin.domFocus(a);
                return false
            }
            if (d.value == "") {
                pt.plogin.show_err(pt.str.no_pwd);
                pt.plogin.domFocus(d);
                return false
            }
            if (f.value == "") {
                if (!pt.plogin.needVc && !pt.plogin.vcFlag) {
                    pt.plogin.checkResultReport(14);
                    clearTimeout(pt.plogin.checkClock);
                    pt.plogin.showVC()
                } else {
                    pt.plogin.show_err(pt.str.no_vcode);
                    pt.plogin.domFocus(f)
                }
                return false
            }
            if (f.value.length < 4) {
                pt.plogin.show_err(pt.str.inv_vcode);
                pt.plogin.domFocus(f);
                f.select();
                return false
            }
        } catch(c) {}
        return true
    },
    checkTimeout: function() {
        var a = $.str.trim($("u").value);
        if ($.check.isQQ(a) || $.check.isQQMail(a)) {
            pt.plogin.cap_cd = 0;
            pt.plogin.salt = $.str.uin2hex(a.replace("@qq.com", ""));
            pt.plogin.needVc = true;
            if (pt.ptui.pt_vcode_v1 == "1") {
                pt.plogin.needShowNewVc = true
            } else {
                pt.plogin.showVC()
            }
            pt.plogin.isCheckTimeout = true;
            pt.plogin.checkRet = 1
        }
        $.report.monitor(216082)
    },
    loginTimeout: function() {
        pt.plogin.showAssistant(2)
    },
    check: function(b) {
        if (!pt.plogin.account) {
            pt.plogin.set_account()
        }
        if ($.check.isNullQQ(pt.plogin.account)) {
            pt.plogin.show_err(pt.str.inv_uin);
            return false
        }
        if (pt.plogin.account == pt.plogin.lastCheckAccount || pt.plogin.account == "") {
            return
        }
        pt.plogin.lastCheckAccount = pt.plogin.account;
        var c = pt.ptui.appid;
        var a = pt.plogin.getCheckUrl(pt.plogin.at_account, c);
        pt.plogin.isCheckTimeout = false;
        clearTimeout(pt.plogin.checkClock);
        pt.plogin.checkClock = setTimeout("pt.plogin.checkTimeout();", 5000);
        $.http.loadScript(a);
        pt.plogin.check.cb = b
    },
    getCheckUrl: function(b, c) {
        var a = pt.plogin.checkUrl + "?regmaster=" + pt.ptui.regmaster + "&pt_tea=1&pt_vcode=" + pt.ptui.pt_vcode_v1 + "&";
        a += "uin=" + b + "&appid=" + c + "&js_ver=" + pt.ptui.ptui_version + "&js_type=" + pt.plogin.js_type + "&login_sig=" + pt.ptui.login_sig + "&u1=" + encodeURIComponent(pt.ptui.s_url) + "&r=" + Math.random();
        return a
    },
    getSubmitUrl: function(b) {
        var a = pt.plogin.loginUrl + b + "?";
        var d = {};
        if (b == "login") {
            d.u = encodeURIComponent(pt.plogin.at_account);
            d.verifycode = $("verifycode").value;
            if (pt.plogin.needShowNewVc) {
                d.pt_vcode_v1 = 1
            } else {
                d.pt_vcode_v1 = 0
            }
            d.pt_verifysession_v1 = pt.plogin.pt_verifysession || $.cookie.get("verifysession");
            d.p = $.Encryption.getEncryption($("p").value, pt.plogin.salt, d.verifycode);
            d.pt_randsalt = pt.plogin.isRandSalt || 0
        }
        d.ptredirect = pt.ptui.target;
        d.u1 = encodeURIComponent(pt.ptui.s_url);
        d.h = 1;
        d.t = 1;
        d.g = 1;
        d.from_ui = 1;
        d.ptlang = pt.ptui.lang;
        d.action = pt.plogin.action.join("-") + "-" + (new Date() - 0);
        d.js_ver = pt.ptui.ptui_version;
        d.js_type = pt.plogin.js_type;
        d.login_sig = pt.ptui.login_sig;
        d.pt_uistyle = pt.ptui.style;
        if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable) {
            d.low_login_enable = 1;
            d.low_login_hour = pt.plogin.low_login_hour
        }
        if (pt.ptui.csimc != "0") {
            d.csimc = pt.ptui.csimc;
            d.csnum = pt.ptui.csnum;
            d.authid = pt.ptui.authid
        }
        d.aid = pt.ptui.appid;
        if (pt.ptui.daid) {
            d.daid = pt.ptui.daid
        }
        if (pt.ptui.pt_3rd_aid != "0") {
            d.pt_3rd_aid = pt.ptui.pt_3rd_aid
        }
        if (pt.ptui.regmaster) {
            d.regmaster = pt.ptui.regmaster
        }
        if (pt.ptui.mibao_css) {
            d.mibao_css = pt.ptui.mibao_css
        }
        if (pt.ptui.pt_qzone_sig == "1") {
            d.pt_qzone_sig = 1
        }
        if (pt.ptui.pt_light == "1") {
            d.pt_light = 1
        }
        for (var c in d) {
            a += (c + "=" + d[c] + "&")
        }
        return a
    },
    submit: function(a) {
        a && a.preventDefault();
        if (pt.plogin.lastCheckAccount != pt.plogin.account && !pt.plogin.hasCheck) {
            pt.plogin.check(arguments.callee);
            return
        }
        if (!pt.plogin.ptui_onLogin(document.loginform)) {
            return false
        } else {
            $.cookie.set("ptui_loginuin", escape(document.loginform.u.value), pt.ptui.domain, "/", 24 * 30)
        }
        if (pt.plogin.checkRet == -1 || pt.plogin.checkRet == 3) {
            pt.plogin.show_err(pt.plogin.checkErr[pt.ptui.lang]);
            pt.plogin.lastCheckAccount = "";
            pt.plogin.domFocus($("p"));
            return
        }
        clearTimeout(pt.plogin.loginClock);
        pt.plogin.loginClock = setTimeout("pt.plogin.loginTimeout();", 5000);
        var b = pt.plogin.getSubmitUrl("login");
        $.winName.set("login_href", encodeURIComponent(pt.ptui.href));
        pt.plogin.showLoading();
        $.http.loadScript(b);
        return false
    },
    webLoginReport: function() {
        window.setTimeout(function() {
            try {
                var d = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
                var g = {};
                var c = window.performance ? window.performance.timing: null;
                if (c) {
                    var h = c[d[0]];
                    for (var b = 1,
                    a = d.length; b < a; b++) {
                        if (c[d[b]]) {
                            g[b] = c[d[b]] - h
                        }
                    }
                    if (loadJs && loadJs.onloadTime) {
                        g[b++] = loadJs.onloadTime - h
                    }
                    if ((c.domContentLoadedEventEnd - c.navigationStart > pt.plogin.delayTime) && c.navigationStart > 0) {
                        $.report.nlog("访问ui延时超过" + pt.plogin.delayTime / 1000 + "s:delay=" + (c.domContentLoadedEventEnd - c.navigationStart) + ";domContentLoadedEventEnd=" + c.domContentLoadedEventEnd + ";navigationStart=" + c.navigationStart + ";clientip=" + pt.ptui.clientip + ";serverip=" + pt.ptui.serverip, pt.plogin.delayMonitorId, 1)
                    }
                    if (c.connectStart <= c.connectEnd && c.responseStart <= c.responseEnd) {
                        pt.plogin.ptui_speedReport(g)
                    }
                }
            } catch(f) {}
        },
        1000)
    },
    ptui_speedReport: function(d) {
        if ($.browser("type") != "msie" && $.browser("type") != "webkit") {
            return
        }
        var b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=1";
        if (pt.ptui.isHttps) {
            if (Math.random() > 1) {
                return
            }
            if ($.browser("type") == "msie") {
                if ($.check.isSsl()) {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=3"
                } else {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=2"
                }
            } else {
                if ($.check.isSsl()) {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=6"
                } else {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=5"
                }
            }
        } else {
            if (Math.random() > 0.2) {
                return
            }
            if ($.browser("type") == "msie") {
                b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=1"
            } else {
                b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=4&flag3=4"
            }
        }
        for (var c in d) {
            if (d[c] > 15000 || d[c] < 0) {
                continue
            }
            b += "&" + c + "=" + d[c] || 1
        }
        var a = new Image();
        a.src = b
    },
    resultReport: function(b, a, f) {
        var d = "http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=" + b + "&flag2=" + a + "&flag3=" + f;
        var c = new Image();
        c.src = d
    },
    crossMessage: function(b) {
        if (pt.plogin.isUIStyle) {
            pt.plogin.uistyleCM(b)
        }
        if (typeof window.postMessage != "undefined") {
            window.parent.postMessage($.str.json2str(b), "*")
        } else {
            if (!pt.ptui.proxy_url) {
                try {
                    navigator.ptlogin_callback($.str.json2str(b))
                } catch(c) {
                    $.report.nlog("ptlogin_callback " + c.message)
                }
            } else {
                var d = pt.ptui.proxy_url + "#";
                for (var a in b) {
                    d += (a + "=" + b[a] + "&")
                }
                $("proxy") && ($("proxy").innerHTML = '<iframe src="' + encodeURI(d) + '"></iframe>')
            }
        }
    },
    uistyleCM: function(c) {
        var f = /^https:\/\/ssl./.test(location.href);
        var d = encodeURIComponent($.str.json2str(c));
        var a = document.location.protocol + "//" + (f ? "ssl.": "") + "ui.ptlogin2." + pt.ptui.domain + "/cross_proxy.html#" + d;
        var b = $("proxy");
        if (b) {
            b.innerHTML = '<iframe  allowtransparency="true" scrolling="no" frameborder="0" width="1" height="1" src="' + a + '">'
        }
    },
    ptui_notifyClose: function(a) {
        a && a.preventDefault();
        var b = {};
        b.action = "close";
        pt.plogin.crossMessage(b);
        pt.plogin.set_qrlogin_invalid()
    },
    ptui_notifySize: function(c) {
        var b = $(c);
        var a = {};
        a.action = "resize";
        a.width = b.offsetWidth || 1;
        a.height = b.offsetHeight || 1;
        pt.__cache = pt.__cache || {
            resize: {
                w: 0,
                h: 0
            }
        };
        if (pt.__cache.resize.w == a.width && pt.__cache.resize.h == a.height) {
            return
        }
        pt.__cache.resize = {
            w: a.width,
            h: a.height
        };
        pt.plogin.crossMessage(a)
    },
    ptui_onLogin: function(b) {
        var a = true;
        a = pt.plogin.checkValidate(b);
        return a
    },
    ptui_uin: function(a) {},
    is_mibao: function(a) {
        return /^http(s)?:\/\/ui.ptlogin2.(\S)+\/cgi-bin\/mibao_vry/.test(a)
    },
    get_qrlogin_pic: function() {
        var b = "ptqrshow";
        var a = (pt.ptui.isHttps ? "https://ssl.": "http://") + "ptlogin2." + pt.ptui.domain + "/" + b + "?";
        if (pt.ptui.regmaster == 2) {
            a = "http://ptlogin2.function.qq.com/" + b + "?regmaster=2&"
        } else {
            if (pt.ptui.regmaster == 3) {
                a = "http://ptlogin2.crm2.qq.com/" + b + "?regmaster=3&"
            } else {
                if (pt.ptui.regmaster == 4) {
                    a = "https://ssl.ptlogin2.mail.qq.com/" + b + "?regmaster=4&"
                }
            }
        }
        a += "appid=" + pt.ptui.appid + "&e=2&l=M&s=4&d=72&v=4&t=" + Math.random();
        if (pt.ptui.daid) {
            a += "&daid=" + pt.ptui.daid
        }
        return a
    },
    go_qrlogin_step: function(a) {
        switch (a) {
        case 1:
            pt.plogin.begin_qrlogin();
            $.css.hide($("qrlogin_step2"));
            if (pt.plogin.loginState == pt.LoginState.PLogin) {
                $("q_low_login_box") && $.css.hide($("q_low_login_box"))
            } else {
                $("q_low_login_box") && $.css.show($("q_low_login_box"))
            }
            break;
        case 2:
            $("qrlogin_step2").style.height = ($("login").offsetHeight - 10) + "px";
            $.css.show($("qrlogin_step2"));
            $("q_low_login_box") && $.css.hide($("q_low_login_box"));
            break;
        default:
            break
        }
    },
    begin_qrlogin: function() {
        pt.plogin.cancle_qrlogin();
        $.css.hide($("qr_invalid"));
        $("qr_img").src = pt.plogin.get_qrlogin_pic();
        pt.plogin.qrlogin_clock = window.setInterval("pt.plogin.qrlogin_submit();", 3000);
        pt.plogin.qrlogin_timeout = window.setTimeout(function() {
            pt.plogin.set_qrlogin_invalid()
        },
        pt.plogin.qrlogin_timeout_time)
    },
    cancle_qrlogin: function() {
        window.clearInterval(pt.plogin.qrlogin_clock);
        window.clearTimeout(pt.plogin.qrlogin_timeout)
    },
    set_qrlogin_invalid: function() {
        pt.plogin.cancle_qrlogin();
        $.css.show($("qr_invalid"))
    },
    loadQrTipsPic: function(b) {
        var a = $("qr_tips_pic");
        var d = "chs";
        switch (b + "") {
        case "2052":
            d = "chs";
            break;
        case "1033":
            d = "en";
            break;
        case "1028":
            d = "cht";
            break
        }
        $.css.addClass(a, "qr_tips_pic_" + d)
    },
    showQrTips: function() {
        $.css.show($("qr_tips"));
        $("qr_tips_pic").style.opacity = 0;
        $("qr_tips_pic").style.filter = "alpha(opacity=0)";
        $("qr_tips_menban").className = "qr_tips_menban";
        $.animate.fade("qr_tips_pic", 100, 2, 20);
        pt.plogin.hideQrTipsClock = window.setTimeout("pt.plogin.hideQrTips()", 5000);
        $.report.monitor("331286", 0.05)
    },
    hideQrTips: function() {
        window.clearTimeout(pt.plogin.hideQrTipsClock);
        $("qr_tips_menban").className = "";
        $.animate.fade("qr_tips_pic", 0, 5, 20,
        function() {
            $.css.hide($("qr_tips"))
        })
    },
    qr_load: function(a) {},
    qr_error: function(a) {
        pt.plogin.set_qrlogin_invalid()
    },
    qrlogin_submit: function() {
        var a = pt.plogin.getSubmitUrl("ptqrlogin");
        $.winName.set("login_href", encodeURIComponent(pt.ptui.href));
        $.http.loadScript(a);
        return
    },
    force_qrlogin: function() {},
    no_force_qrlogin: function() {},
    redirect: function(b, a) {
        switch (b + "") {
        case "0":
            location.href = a;
            break;
        case "1":
            top.location.href = a;
            break;
        default:
            top.location.href = a
        }
    }
};
pt.plogin.auth();
function ptuiCB(h, k, b, g, d, a) {
    var j = pt.plogin.at_account && $("p").value;
    clearTimeout(pt.plogin.loginClock);
    function f() {
        if (pt.plogin.is_mibao(b)) {
            b += ("&style=" + pt.ptui.style + "&proxy_url=" + encodeURIComponent(pt.ptui.proxy_url));
            b += "#login_href=" + encodeURIComponent(pt.ptui.href)
        }
        pt.plogin.redirect(g, b)
    }
    if (j) {
        pt.plogin.lastCheckAccount = ""
    }
    pt.plogin.hasSubmit = true;
    var c = false;
    switch (h) {
    case "0":
        if (!j && !pt.plogin.is_mibao(b)) {
            window.clearInterval(pt.plogin.qrlogin_clock);
            f()
        } else {
            f()
        }
        break;
    case "3":
        $("p").value = "";
        pt.plogin.domFocus($("p"));
        pt.plogin.passwordErrorNum++;
        if (k == "101" || k == "102" || k == "103") {
            pt.plogin.showVC()
        }
        pt.plogin.check();
        break;
    case "4":
        pt.plogin.check();
        break;
    case "65":
        pt.plogin.set_qrlogin_invalid();
        return;
    case "66":
        return;
    case "67":
        pt.plogin.go_qrlogin_step(2);
        return;
    case "10005":
        pt.plogin.force_qrlogin();
    case "12":
    case "51":
        c = true;
        break;
    default:
        if (pt.plogin.needVc) {
            pt.plogin.changeVC()
        } else {
            pt.plogin.check()
        }
        break
    }
    if (h != 0 && j) {
        pt.plogin.show_err(d, c)
    }
    if (!pt.plogin.hasCheck && j) {
        if (!pt.plogin.needShowNewVc) {
            pt.plogin.showVC()
        }
        $("verifycode").focus();
        $("verifycode").select()
    }
}
function ptui_checkVC(a, d, b, f, c) {
    clearTimeout(pt.plogin.checkClock);
    pt.plogin.isRandSalt = c;
    pt.plogin.salt = b;
    pt.plogin.checkRet = a;
    if (a == "2") { (pt.plogin.loginState == pt.LoginState.PLogin) && pt.plogin.show_err(pt.str.inv_uin)
    } else {
        if (a == "3") {} else {
            if (!pt.plogin.hasSubmit) {}
        }
    }
    switch (a + "") {
    case "0":
    case "2":
    case "3":
        pt.plogin.hideVC();
        if (pt.ptui.pt_vcode_v1 == "1") {
            pt.plogin.needShowNewVc = false
        }
        $("verifycode").value = d || "abcd";
        pt.plogin.needVc = false;
        $.report.monitor("330321", 0.05);
        break;
    case "1":
        pt.plogin.cap_cd = d;
        if (pt.ptui.pt_vcode_v1 == "1") {
            pt.plogin.needShowNewVc = true
        } else {
            pt.plogin.showVC();
            $.css.show($("vc_tips"))
        }
        pt.plogin.needVc = true;
        $.report.monitor("330320", 0.05);
        break;
    default:
        break
    }
    pt.plogin.pt_verifysession = f;
    pt.plogin.domFocus($("p"));
    pt.plogin.hasCheck = true;
    pt.plogin.check.cb && pt.plogin.check.cb()
}
function ptui_auth_CB(c, b) {
    switch (parseInt(c)) {
    case 0:
        pt.plogin.authUin = $.cookie.get("superuin").replace(/^o0*/, "");
        pt.plogin.authSubmitUrl = b;
        pt.plogin.init(b);
        break;
    case 1:
        pt.plogin.init();
        break;
    case 2:
        var a = b + "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(pt.ptui.s_url);
        if (pt.ptui.pt_light == "1") {
            a += "&pt_light=1"
        }
        pt.plogin.redirect(pt.ptui.target, a);
        break;
    default:
        pt.preload.init()
    }
};
/*  |xGv00|97d6211dc6cb1cfa4d4e66e262679f87 */
