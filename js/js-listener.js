/* Matomo code */
let _paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  let u = "https://webanalytics.nga.mil/";
  _paq.push(["setTrackerUrl", u + "piwik.php"]);
  _paq.push(["setSiteId", "782"]);
  let d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.type = "text/javascript";
  g.async = true;
  g.defer = true;
  g.src = u + "piwik.js";
  s.parentNode.insertBefore(g, s);
})();

/* Catch XHR requests */
(function (XHR) {
  "use strict";

  const open = XHR.prototype.open;
  const send = XHR.prototype.send;

  XHR.prototype.open = function (method, url, async, user, pass) {
    url = addTransactionId(url);
    this._url = url;
    open.call(this, method, url, async, user, pass);
  };

  XHR.prototype.send = function (data) {
    const self = this;
    let oldOnReadyStateChange;
    const url = this._url;
    this._url = addTransactionId(this._url);

    function onReadyStateChange() {
      if (self.readyState == 4 /* complete */) {
        trackLink(url);
      }

      if (oldOnReadyStateChange) {
        oldOnReadyStateChange();
      }
    }

    /* Set xhr.noIntercept to true to disable the interceptor for a particular call */
    if (!this.noIntercept) {
      if (this.addEventListener) {
        this.addEventListener("readystatechange", onReadyStateChange, false);
      } else {
        oldOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = onReadyStateChange;
      }
    }

    send.call(this, data);
  };
})(XMLHttpRequest);

/* Catch fetch requests */
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  let [resource, config] = args;
  resource = addTransactionId(resource);

  trackLink(resource);

  const response = await originalFetch(resource, config);
  return response;
};

/* Websocket interceptor */
const WebSocketProxy = new Proxy(window.WebSocket, {
  construct(target, args) {
    const ws = new target(...args);

    // Configurable hooks
    ws.hooks = {
      beforeSend: () => null,
      beforeReceive: () => null,
    };

    // Intercept send
    const sendProxy = new Proxy(ws.send, {
      apply(target, thisArg, args) {
        if (ws.hooks.beforeSend(args) === false) {
          return;
        }
        return target.apply(thisArg, args);
      },
    });
    ws.send = sendProxy;

    // Intercept events
    const addEventListenerProxy = new Proxy(ws.addEventListener, {
      apply(target, thisArg, args) {
        if (args[0] === "message" && ws.hooks.beforeReceive(args) === false) {
          return;
        }
        return target.apply(thisArg, args);
      },
    });
    ws.addEventListener = addEventListenerProxy;

    Object.defineProperty(ws, "onmessage", {
      set(func) {
        const onmessage = function onMessageProxy(event) {
          let payload = JSON.parse(event.data);
          if (payload.transactionId === undefined) return;

          let url = event.currentTarget.url;
          if (url.indexOf("?") > -1) {
            url += "&transactionId=";
          } else {
            url += "?transactionId=";
          }

          url += payload.transactionId + "";

          trackLink(url);

          if (ws.hooks.beforeReceive(event) === false) {
            return;
          }
          func.call(this, event);
        };
        addEventListenerProxy.apply(this, ["message", onmessage, false]);
      },
    });

    // Save reference
    window._websockets = window._websockets || [];
    window._websockets.push(ws);

    return ws;
  },
});

window.WebSocket = WebSocketProxy;

// Usage
// After a websocket connection has been created:
window._websockets[0].hooks = {
  // Just log the outgoing request
  beforeSend: (data) => console.log(data),
  // Return false to prevent the on message callback from being invoked
  beforeReceive: (data) => false,
};

/* Track the supplied link */
function trackLink(url) {
  _paq.push([
    "trackLink",
    (url.startsWith("http") || url.startsWith("ws")
      ? ""
      : window.location.origin) + url,
    "link",
  ]);
}

/* Check to see if a transaction id is part of the url and add if absent */
function addTransactionId(url) {
  if (url == null || url.length == 0) return url;

  if (url.indexOf("transactionId") == -1) {
    url +=
      (url.indexOf("?") == -1 ? "?" : "&") + "transactionId=" + createUUID();
  }
  return url;
}

/* Create a UUID for the transactionId */
function createUUID() {
  let dt = new Date().getTime();
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
