(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{433:function(s,t,n){"use strict";n.r(t);var a=n(45),e=Object(a.a)({},(function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"configuration"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#configuration"}},[s._v("#")]),s._v(" Configuration")]),s._v(" "),n("p",[s._v("On this page, you find information on how to configure ALEX.\nBelow, the exemplary "),n("code",[s._v("docker-compose.production.yml")]),s._v(" file is shown.")]),s._v(" "),n("div",{staticClass:"language-yaml line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-yaml"}},[n("code",[n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("version")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'3.7'")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("services")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("selenium-hub")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" selenium/hub"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\n  \n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# By default, there is one chrome and one firefox browser available")]),s._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("chrome-node")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" selenium/node"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("chrome"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("debug"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("shm_size")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'2gb'")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("depends_on")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" selenium"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("hub\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("environment")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" HUB_HOST=selenium"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("hub\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" HUB_PORT=4444\n\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("firefox-node")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" selenium/node"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("firefox"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("debug"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("shm_size")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'2gb'")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("depends_on")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" selenium"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("hub\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("environment")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" HUB_HOST=selenium"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("hub\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" HUB_PORT=4444\n\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Add more Selenium nodes here that you want to use in ALEX.")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Ensure that HUB_HOST is set to 'selenium-hub'.")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Ensure that HUB_PORT is set to '4444'.")]),s._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("alex-database")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" postgres"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("environment")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Set stronger credentials for the database.")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Leave the POSTGRES_DB variable untouched to 'alex'.")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Leave the database port untouched to '5432'")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" POSTGRES_HOST_AUTH_METHOD=trust\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" POSTGRES_USER=sa\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" POSTGRES_DB=alex\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("volumes")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" alex"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("database"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("/var/lib/postgresql\n\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("alex-frontend")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ghcr.io/learnlib/alex/alex"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("frontend"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("unstable\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("environment")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Update ALEX_BACKEND_ADDRESS to the production URL.")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Update ALEX_BACKEND_PORT to the production port. ")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" ALEX_BACKEND_ADDRESS=http"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("//localhost\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" ALEX_BACKEND_PORT=8000\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ports")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# The default port of the frontend is 80.")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" 80"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("4200")]),s._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("alex-backend")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ghcr.io/learnlib/alex/alex"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("backend"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("unstable\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("depends_on")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" alex"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("database\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" selenium"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("hub\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("volumes")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" alex"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("database"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("/var/alex/backend/target/postgresql\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("environment")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" REMOTE_DRIVER=http"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("//selenium"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("hub"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("4444/wd/hub\n    "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ports")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# The default port of the backend API is 8000.")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# If you change this value, update the ALEX_BACKEND_PORT ")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# variable in the 'alex-frontend' service.")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" 8000"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("8000")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("volumes")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("alex-database")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br"),n("span",{staticClass:"line-number"},[s._v("35")]),n("br"),n("span",{staticClass:"line-number"},[s._v("36")]),n("br"),n("span",{staticClass:"line-number"},[s._v("37")]),n("br"),n("span",{staticClass:"line-number"},[s._v("38")]),n("br"),n("span",{staticClass:"line-number"},[s._v("39")]),n("br"),n("span",{staticClass:"line-number"},[s._v("40")]),n("br"),n("span",{staticClass:"line-number"},[s._v("41")]),n("br"),n("span",{staticClass:"line-number"},[s._v("42")]),n("br"),n("span",{staticClass:"line-number"},[s._v("43")]),n("br"),n("span",{staticClass:"line-number"},[s._v("44")]),n("br"),n("span",{staticClass:"line-number"},[s._v("45")]),n("br"),n("span",{staticClass:"line-number"},[s._v("46")]),n("br"),n("span",{staticClass:"line-number"},[s._v("47")]),n("br"),n("span",{staticClass:"line-number"},[s._v("48")]),n("br"),n("span",{staticClass:"line-number"},[s._v("49")]),n("br"),n("span",{staticClass:"line-number"},[s._v("50")]),n("br"),n("span",{staticClass:"line-number"},[s._v("51")]),n("br"),n("span",{staticClass:"line-number"},[s._v("52")]),n("br"),n("span",{staticClass:"line-number"},[s._v("53")]),n("br"),n("span",{staticClass:"line-number"},[s._v("54")]),n("br"),n("span",{staticClass:"line-number"},[s._v("55")]),n("br"),n("span",{staticClass:"line-number"},[s._v("56")]),n("br"),n("span",{staticClass:"line-number"},[s._v("57")]),n("br"),n("span",{staticClass:"line-number"},[s._v("58")]),n("br"),n("span",{staticClass:"line-number"},[s._v("59")]),n("br"),n("span",{staticClass:"line-number"},[s._v("60")]),n("br"),n("span",{staticClass:"line-number"},[s._v("61")]),n("br"),n("span",{staticClass:"line-number"},[s._v("62")]),n("br"),n("span",{staticClass:"line-number"},[s._v("63")]),n("br"),n("span",{staticClass:"line-number"},[s._v("64")]),n("br"),n("span",{staticClass:"line-number"},[s._v("65")]),n("br"),n("span",{staticClass:"line-number"},[s._v("66")]),n("br"),n("span",{staticClass:"line-number"},[s._v("67")]),n("br"),n("span",{staticClass:"line-number"},[s._v("68")]),n("br"),n("span",{staticClass:"line-number"},[s._v("69")]),n("br"),n("span",{staticClass:"line-number"},[s._v("70")]),n("br")])]),n("h2",{attrs:{id:"docker-environment-variables"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#docker-environment-variables"}},[s._v("#")]),s._v(" Docker environment variables")]),s._v(" "),n("h3",{attrs:{id:"backend"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#backend"}},[s._v("#")]),s._v(" Backend")]),s._v(" "),n("p",[s._v("The following environment variables can be passed to the "),n("strong",[s._v("alex-backend")]),s._v(" service:")]),s._v(" "),n("table",[n("thead",[n("tr",[n("th",[s._v("Name")]),s._v(" "),n("th",[s._v("Description")])])]),s._v(" "),n("tbody",[n("tr",[n("td",[n("code",[s._v("REMOTE_DRIVER")])]),s._v(" "),n("td",[s._v("The URI to the remote Selenium server")])])])]),s._v(" "),n("h3",{attrs:{id:"frontend"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#frontend"}},[s._v("#")]),s._v(" Frontend")]),s._v(" "),n("p",[s._v("The following environment variables can be passed to the "),n("strong",[s._v("alex-frontend")]),s._v(" service:")]),s._v(" "),n("table",[n("thead",[n("tr",[n("th",[s._v("Name")]),s._v(" "),n("th",[s._v("Description")])])]),s._v(" "),n("tbody",[n("tr",[n("td",[n("code",[s._v("ALEX_BACKEND_ADDRESS")])]),s._v(" "),n("td",[s._v("The URI to the ALEX API in production")])]),s._v(" "),n("tr",[n("td",[n("code",[s._v("ALEX_BACKEND_PORT")])]),s._v(" "),n("td",[s._v("The port of the ALEX API in production")])])])])])}),[],!1,null,null,null);t.default=e.exports}}]);