(this.webpackJsonpmysite=this.webpackJsonpmysite||[]).push([[3],{36:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){},39:function(e,t,n){},40:function(e,t,n){},41:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var a=n(14);function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],a=!0,r=!1,c=void 0;try{for(var o,l=e[Symbol.iterator]();!(a=(o=l.next()).done)&&(n.push(o.value),!t||n.length!==t);a=!0);}catch(i){r=!0,c=i}finally{try{a||null==l.return||l.return()}finally{if(r)throw c}}return n}}(e,t)||Object(a.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var c=n(0),o=n.n(c);n(20),n(36);var l=function(e){var t=e.children,n=e.href,a=e.onClick,r=e.className,c=void 0===r?"":r,l=n||"#",i=n?"noopener noreferrer":"";return o.a.createElement("a",{className:"".concat(c," Button"),rel:i,href:l,onClick:function e(t){e&&(a(),t.preventDefault())}},t)};n(37);var i=function(e){var t=e.children;return o.a.createElement("h1",{className:"Title"},t)};n(38);var s=function(e){var t=e.children;return o.a.createElement("article",{className:"Article"},t)};n(39);var u=function(e){var t=e.children,n=e.onMouseLeave,a=e.component,l=void 0===a?"div":a,i=e.show,s=void 0!==i&&i,u=e.className,m=void 0===u?"":u,f=l,p=Object(c.useRef)(null),h=r(Object(c.useState)(0),2),b=h[0],d=h[1],E="scale(1) translate(-".concat(b,"px, 0)"),v="scale(0) translate(-".concat(b,"px, 40px)"),k=s?E:v,w=s?"Tooltip-show":"",y="".concat(m," Tooltip ").concat(w);return Object(c.useEffect)((function(){d(p.current.offsetWidth/2)}),[]),o.a.createElement(c.Fragment,null,o.a.createElement(f,{ref:p,onClick:n,onMouseLeave:n,className:y,role:"tooltip",style:{transform:k}},t))},m=(n(40),[{name:"LinkedIn",url:"https://www.linkedin.com/in/jeancarlosudi/",icon:"fab fa-linkedin"},{name:"Instagram",url:"https://www.instagram.com/jeancosouza/",icon:"fab fa-instagram"},{name:"Spotify",url:"https://open.spotify.com/user/jeancosouza",icon:"fab fa-spotify"},{name:"Steam",content:"jeanrnk",icon:"fab fa-steam"},{name:"Switch Friend Code",content:"1749 2384 1794",icon:"fas fa-gamepad"},{name:"Discord",content:"jeanrnk#5682",icon:"fab fa-discord"},{name:"Xbox gamertag",content:"jeanrnk",icon:"fab fa-xbox"},{name:"PSN ID",content:"jeanrnk",icon:"fab fa-playstation"},{name:"Source for this website",url:"https://github.com/jeancarlos/jeansouza.dev",icon:"fab fa-github"}]);var f=function(e){var t=e.open,n=r(Object(c.useState)([]),2),a=n[0],i=n[1],s=t?"SociaLinks-open":"";Object(c.useEffect)((function(){i(m.map((function(){return!1})))}),[]);var f=function(e){return o.a.createElement("i",{className:"Social__Bullet ".concat(e)})};return o.a.createElement("ul",{className:"SociaLinks ".concat(s)},m.map((function(e,t){var n=e.name,r=e.url,c=e.content,s=e.icon,m=void 0===s?"fas fa-link":s,p=n.replace(/\s/g,"");return o.a.createElement("li",{key:p,className:"SociaLinks--ListItem"},c?[o.a.createElement(l,{key:"".concat(p,"Bt"),onClick:function(){return function(e){return i((function(t){return t.map((function(t,n){return e===n?!t:t}))}))}(t)},className:a[t]?"Button-focus":""},f(m)," ",n),o.a.createElement(u,{key:"".concat(p,"Tooltip"),onMouseLeave:function(){i((function(e){return e.map((function(){return!1}))}))},component:"span",show:a[t]},c)]:o.a.createElement(l,{rel:"noopener noreferrer",href:r},f(m)," ",n))})))};n(41);t.default=function(){var e=r(Object(c.useState)(!1),2),t=e[0],n=e[1];return o.a.createElement("div",{className:"Home"},o.a.createElement("header",null,o.a.createElement(i,null,"Hi, I'm ",o.a.createElement("strong",null,"Jean"),", ",o.a.createElement("span",{className:"Home--TitleMyRole"},"Front-End Engineer"),o.a.createElement("span",{className:"Home--TitlePonctuation"},"."))),o.a.createElement(s,null,o.a.createElement("p",null,"I'm a specialist in the technologies that involves the creation of websites and web applications.",o.a.createElement("br",null),"I like cats \ud83d\udc31, video games \ud83c\udfae, exchanging ideas \ud83d\udcad and I talk a lot \ud83c\udf99\ufe0f."),o.a.createElement("p",null,"Find where I am at the links bellow:")),o.a.createElement("ul",{className:"Home--Links"},o.a.createElement("li",null,o.a.createElement(l,{href:"https://twitch.tv/jeanrnk"},o.a.createElement("i",{className:"Social__Bullet fab fa-twitch"})," Live Code")),o.a.createElement("li",null,o.a.createElement(l,{href:"https://github.com/jeancarlos"},o.a.createElement("i",{className:"Social__Bullet fab fa-github"})," GitHub")),o.a.createElement("li",null,o.a.createElement(l,{href:"https://twitter.com/jeancarlos/"},o.a.createElement("i",{className:"Social__Bullet fab fa-twitter"})," Twitter"))),o.a.createElement("button",{className:"Home--BtMore",onClick:function(){return n(!t)}},o.a.createElement("span",{className:"Home--BtMoreText"},"More links"),o.a.createElement("i",{className:"Home--BtMoreIcon fas fa-angle-double-down"})),o.a.createElement(f,{open:t}))}}}]);
//# sourceMappingURL=3.c94480dd.chunk.js.map