var Spotlight=(window.webpackJsonpSpotlight=window.webpackJsonpSpotlight||[]).push([[10],{0:function(t,e){t.exports=React},15:function(t,e){t.exports=ReactDOM},210:function(t,e,n){"use strict";var o=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.SnftPreloadedTokens=e.SnftWalletInfo=e.SnftFrontCtx=e.feed=e.init=void 0;const r=o(n(0)),i=o(n(15)),a=n(59),f=n(13),s=n(206),d=n(211),l=n(20),u=n(335);function c(t={}){const e=document.getElementsByClassName("nft-gallery");for(let n=0,o=e.length||0;n<o;++n){const o=p(e[n],t);o&&(window.SpotlightNfts.instances[n]=o)}}function p(t,n={}){const o=t.getAttribute("data-gallery-var"),c=(p=o,e.SnftFrontCtx[p]=e.SnftFrontCtx.hasOwnProperty(p)?e.SnftFrontCtx[p]:S("snft__f__"+p));var p;const w=function(t){return e.SnftWalletInfo[t]=e.SnftWalletInfo.hasOwnProperty(t)?e.SnftWalletInfo[t]:S("snft__w__"+t)}(o),_=function(t){return e.SnftPreloadedTokens[t]=e.SnftPreloadedTokens.hasOwnProperty(t)?e.SnftPreloadedTokens[t]:S("snft__t__"+t)}(o);if(o&&"object"==typeof c&&Array.isArray(w)){if(!(t.children.length>0)){const e=l.Responsive.getDevice(s.getWindowSize());let n=new f.FeedState(c,e,f.FeedEntityResolver.forFrontApp(w));u.isObjectEmpty(_)||([n]=n.load(_));const o={run(){const e=r.default.createElement(d.FrontApp,{feedState:n});i.default.render(e,t)}};return a.runWhenDomReady(()=>o.run()),o}n.silent}return null}function S(t){const e=document.getElementById(t);return e&&e.hasAttribute("data-json")?JSON.parse(e.getAttribute("data-json")):null}e.init=c,e.feed=p,window.SnftFrontCtx||(window.SnftFrontCtx={}),window.SnftWalletInfo||(window.SnftWalletInfo={}),window.SnftPreloadedTokens||(window.SnftPreloadedTokens={}),window.SpotlightNfts||(window.SpotlightNfts={instances:[],init:c,feed:p}),e.SnftFrontCtx=window.SnftFrontCtx,e.SnftWalletInfo=window.SnftWalletInfo,e.SnftPreloadedTokens=window.SnftPreloadedTokens},211:function(t,e,n){"use strict";var o=this&&this.__createBinding||(Object.create?function(t,e,n,o){void 0===o&&(o=n),Object.defineProperty(t,o,{enumerable:!0,get:function(){return e[n]}})}:function(t,e,n,o){void 0===o&&(o=n),t[o]=e[n]}),r=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),i=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)"default"!==n&&Object.hasOwnProperty.call(t,n)&&o(e,t,n);return r(e,t),e};Object.defineProperty(e,"__esModule",{value:!0}),e.FrontApp=void 0;const a=i(n(0));n(212);const f=n(140);e.FrontApp=function({feedState:t}){const[e,n]=a.useState(t);return a.default.createElement("div",{className:"snft-app"},a.default.createElement(f.TokenFeed,{state:e,onUpdateState:n,autoDevice:!0,autoLoad:!0}))}},212:function(t,e,n){t.exports={"snft-app":"snft-app"}},814:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const o=n(210);document.addEventListener("DOMContentLoaded",o.init)}},[[814,3,1,2,0]]]);