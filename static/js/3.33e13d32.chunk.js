(this.webpackJsonpmysite=this.webpackJsonpmysite||[]).push([[3],{40:function(e,a,t){},41:function(e,a,t){},42:function(e,a,t){},43:function(e,a,t){},44:function(e,a,t){},45:function(e,a,t){},46:function(e,a,t){"use strict";t.r(a);var n=t(36),c=t(0),o=t.n(c),r=t(37);t(20),t(40);var l=function(e){var a=e.children,t=e.href,n=e.onClick,c=e.className,r=void 0===c?"":c,l=t||"#",i=t?"noopener noreferrer":"";return o.a.createElement("a",{className:"".concat(r," Button"),rel:i,href:l,onClick:function e(a){e&&(n(),a.preventDefault())}},a)};t(41);var i=function(e){var a=e.children;return o.a.createElement("h1",{className:"Title"},a)};t(42);var s=function(e){var a=e.children;return o.a.createElement("article",{className:"Article"},a)};t(43);var m=function(e){var a=e.children,t=e.onMouseLeave,r=e.component,l=void 0===r?"div":r,i=e.show,s=void 0!==i&&i,m=e.className,u=void 0===m?"":m,f=l,p=Object(c.useRef)(null),E=Object(c.useState)(0),h=Object(n.a)(E,2),b=h[0],d=h[1],v="scale(1) translate(-".concat(b,"px, 0)"),k="scale(0) translate(-".concat(b,"px, 40px)"),w=s?v:k,j=s?"Tooltip-show":"",g="".concat(u," Tooltip ").concat(j);return Object(c.useEffect)((function(){d(p.current.offsetWidth/2)}),[]),o.a.createElement(c.Fragment,null,o.a.createElement(f,{ref:p,onClick:t,onMouseLeave:t,className:g,role:"tooltip",style:{transform:w}},a))},u=(t(44),[{name:"LinkedIn",url:"https://www.linkedin.com/in/jeancarlosudi/",icon:"fab fa-linkedin"},{name:"Instagram",url:"https://www.instagram.com/jeancosouza/",icon:"fab fa-instagram"},{name:"Spotify",url:"https://open.spotify.com/user/jeancosouza",icon:"fab fa-spotify"},{name:"Steam",content:"jeanrnk",icon:"fab fa-steam"},{name:"Switch Friend Code",content:"1749 2384 1794",icon:"fas fa-gamepad"},{name:"Discord",content:"jeanrnk#5682",icon:"fab fa-discord"},{name:"Xbox gamertag",content:"jeanrnk",icon:"fab fa-xbox"},{name:"PSN ID",content:"jeanrnk",icon:"fab fa-playstation"},{name:"Source for this website",url:"https://github.com/jeancarlos/jeansouza.dev",icon:"fab fa-github"}]);var f=function(e){var a=e.open,t=Object(c.useState)([]),r=Object(n.a)(t,2),i=r[0],s=r[1],f=a?"SociaLinks-open":"";Object(c.useEffect)((function(){s(u.map((function(){return!1})))}),[]);var p=function(e){return o.a.createElement("i",{className:"Social__Bullet ".concat(e)})};return o.a.createElement("ul",{className:"SociaLinks ".concat(f)},u.map((function(e,a){var t=e.name,n=e.url,c=e.content,r=e.icon,u=void 0===r?"fas fa-link":r,f=t.replace(/\s/g,"");return o.a.createElement("li",{key:f,className:"SociaLinks--ListItem"},c?[o.a.createElement(l,{key:"".concat(f,"Bt"),onClick:function(){return function(e){return s((function(a){return a.map((function(a,t){return e===t&&!a}))}))}(a)},className:i[a]?"Button-focus":""},p(u)," ",t),o.a.createElement(m,{key:"".concat(f,"Tooltip"),onMouseLeave:function(){s((function(e){return e.map((function(){return!1}))}))},component:"span",show:i[a]},c)]:o.a.createElement(l,{rel:"noopener noreferrer",href:n},p(u)," ",t))})))};t(45);a.default=function(){var e=Object(c.useState)(!1),a=Object(n.a)(e,2),t=a[0],m=a[1];return o.a.createElement("div",{className:"Home"},o.a.createElement(r.a,null,o.a.createElement("title",null,"Jean Souza - Front-End Engineer"),o.a.createElement("meta",{name:"description",content:"Specialist in technologies for the creation of web applications."}),o.a.createElement("link",{rel:"canonical",href:"https://jeansouza.dev"})),o.a.createElement("header",null,o.a.createElement(i,null,"Hi, I'm ",o.a.createElement("strong",null,"Jean"),", ",o.a.createElement("span",{className:"Home--TitleMyRole"},"Front-End Engineer"),o.a.createElement("span",{className:"Home--TitlePonctuation"},"."))),o.a.createElement(s,null,o.a.createElement("p",null,"I'm a specialist in the technologies for the creation of web applications.",o.a.createElement("br",null),"I like cats \ud83d\udc31, video games \ud83c\udfae, exchanging ideas \ud83d\udcad and I talk a lot \ud83c\udf99\ufe0f."),o.a.createElement("p",null,"Find where I am at the links bellow:")),o.a.createElement("ul",{className:"Home--Links"},o.a.createElement("li",null,o.a.createElement(l,{href:"https://twitch.tv/jeanrnk"},o.a.createElement("i",{className:"Social__Bullet fab fa-twitch"})," Live Code")),o.a.createElement("li",null,o.a.createElement(l,{href:"https://github.com/jeancarlos"},o.a.createElement("i",{className:"Social__Bullet fab fa-github"})," GitHub")),o.a.createElement("li",null,o.a.createElement(l,{href:"https://twitter.com/jeancarlos/"},o.a.createElement("i",{className:"Social__Bullet fab fa-twitter"})," Twitter"))),o.a.createElement("button",{className:"Home--BtMore",onClick:function(){return m(!t)}},o.a.createElement("span",{className:"Home--BtMoreText"},"More links"),o.a.createElement("i",{className:"Home--BtMoreIcon fas fa-angle-double-down"})),o.a.createElement(f,{open:t}))}}}]);
//# sourceMappingURL=3.33e13d32.chunk.js.map