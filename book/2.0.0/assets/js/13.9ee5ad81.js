(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{357:function(e,t,s){e.exports=s.p+"assets/img/webhooks-1.f162c9e3.jpg"},358:function(e,t,s){e.exports=s.p+"assets/img/webhooks-2.3c5fd584.jpg"},424:function(e,t,s){"use strict";s.r(t);var n=s(42),o=Object(n.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"integrations"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#integrations"}},[e._v("#")]),e._v(" Integrations")]),e._v(" "),n("p",[e._v("ALEX offers some ways for integration in third party applications.")]),e._v(" "),n("h2",{attrs:{id:"webhooks"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#webhooks"}},[e._v("#")]),e._v(" Webhooks")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://en.wikipedia.org/wiki/Webhook",target:"_blank",rel:"noopener noreferrer"}},[e._v("Webhooks"),n("OutboundLink")],1),e._v(" are a way to let third party applications know about events that happen in a system.\nThese applications have to register a hook by specifying a URL.\nWhen an internal event occurs, e.g. a learning process is finished, ALEX sends an HTTP request to the registered URL.\nIf a body is send along the HTTP request, it is formatted as JSON object.")]),e._v(" "),n("div",{staticClass:"alert alert-info"},[e._v("\n    Currently, if the target server cannot be reached within 3 seconds, the request is cancelled.\n    ALEX also does not provide a retry mechanism at the moment.\n")]),e._v(" "),n("p",[n("img",{attrs:{src:s(357),alt:"Webhooks"}})]),e._v(" "),n("p",[e._v("Webhooks are managed under the "),n("strong",[e._v("Integrations > Webhooks")]),e._v(" item in the sidebar.\nOn the page a list of registered webhooks is displayed.")]),e._v(" "),n("p",[n("img",{attrs:{src:s(358),alt:"Webhooks"}})]),e._v(" "),n("p",[e._v("To create a new webhook, click on the "),n("strong",[e._v("Create")]),e._v("-button.\nIn the dialog, specify the following properties in the modal dialog:")]),e._v(" "),n("table",[n("thead",[n("tr",[n("th",[e._v("Property")]),e._v(" "),n("th",[e._v("Description")]),e._v(" "),n("th",[e._v("Required")])])]),e._v(" "),n("tbody",[n("tr",[n("td",[e._v("Name")]),e._v(" "),n("td",[e._v("The name of the webhook, e.g. the name of the service.")]),e._v(" "),n("td",[e._v("no")])]),e._v(" "),n("tr",[n("td",[e._v("URL")]),e._v(" "),n("td",[e._v("The URL where events are send to.")]),e._v(" "),n("td",[e._v("yes")])]),e._v(" "),n("tr",[n("td",[e._v("Events")]),e._v(" "),n("td",[e._v("The list of subscribed events.")]),e._v(" "),n("td",[e._v("yes")])])])]),e._v(" "),n("p",[e._v("There are numerous events for all kind of actions that are performed in ALEX internally.\nThe names of the events should be self explaining.\nFor almost all events, the corresponding entity that the event deals with is send as a JSON object to the registered endpoint.\nOnly for "),n("em",[e._v("... deleted")]),e._v(" events, the ID of the entity is send to the client.")])])}),[],!1,null,null,null);t.default=o.exports}}]);