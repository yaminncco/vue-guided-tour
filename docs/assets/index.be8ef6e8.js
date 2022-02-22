var Me=Object.defineProperty,We=Object.defineProperties;var Xe=Object.getOwnPropertyDescriptors;var ye=Object.getOwnPropertySymbols;var Ye=Object.prototype.hasOwnProperty,Ve=Object.prototype.propertyIsEnumerable;var we=(e,o,r)=>o in e?Me(e,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[o]=r,k=(e,o)=>{for(var r in o||(o={}))Ye.call(o,r)&&we(e,r,o[r]);if(ye)for(var r of ye(o))Ve.call(o,r)&&we(e,r,o[r]);return e},ne=(e,o)=>We(e,Xe(o));import{r as de,o as E,c as T,a as A,w as Le,F as fe,b as me,d as be,n as pe,e as Z,f as _e,u as K,t as he,g as C,h as ee,i as W,j as je,k as re,l as ge,m as te,T as Se,p as N,q as j,s as le,v as Fe,x as De,y as Ge,z as Oe,A as Ke,B as xe,C as Ce,D as se,E as Ne}from"./vendor.a53440cc.js";const qe=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))n(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerpolicy&&(s.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?s.credentials="include":l.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(l){if(l.ep)return;l.ep=!0;const s=r(l);fetch(l.href,s)}};qe();var ae=(e,o)=>{const r=e.__vccOpts||e;for(const[n,l]of o)r[n]=l;return r};const Ue={name:"App",data(){return{currentStepIndex:-1,steps:[{target:".step-1",title:"Hello world",content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit.",popover:{placement:"start",position:"right"}},{target:".step-2",title:"Hello world 2",content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit.",popover:{placement:"end",position:"right"}},{target:".step-3",content:"Hello world 3",popover:{placement:"center",position:"left"}},{target:".step-4",content:"Hello world 4",popover:{placement:"center",position:"top"}},{target:".step-5",content:"Hello world 5",popover:{placement:"start",position:"left"}},{target:".step-6",content:"Hello world 6",popover:{placement:"center",position:"right"}},{target:".step-7",content:"Hello world 7",popover:{placement:"center",position:"left"}}]}},methods:{start(){this.$vgt.start(0)},onAfterStart(){},onAfterEnd(){},onAfterMove(){}}},Je={class:"app"},Qe={class:"demo"},Ze=A("h1",{class:"demo-title"}," Vue Guided Tour ",-1),et=A("p",null,"a vue.js 3 component to guide your visitors",-1),tt={class:"demo-grid"};function ot(e,o,r,n,l,s){const i=de("vue-guided-tour");return E(),T(fe,null,[A("div",Je,[A("div",Qe,[Ze,et,A("a",{href:"#",class:"demo-btn",onClick:o[0]||(o[0]=Le((...c)=>s.start&&s.start(...c),["prevent"]))}," Start the tour ")]),A("div",tt,[(E(!0),T(fe,null,me(l.steps,(c,d)=>(E(),T("div",{key:d,class:pe(`step step-${d+1}`)},null,2))),128))])]),be(i,{stepIndex:l.currentStepIndex,"onUpdate:stepIndex":o[1]||(o[1]=c=>l.currentStepIndex=c),steps:l.steps,onAfterStart:s.onAfterStart,onAfterEnd:s.onAfterEnd,onAfterMove:s.onAfterMove},null,8,["stepIndex","steps","onAfterStart","onAfterEnd","onAfterMove"])],64)}var nt=ae(Ue,[["render",ot]]);const ke={allowOverlayClose:{type:Boolean,default:!0},allowEscClose:{type:Boolean,default:!0},allowInteraction:{type:Boolean,default:!0}},Ee={arrow:{type:Boolean,default:!0},offset:{type:Number,default:0},position:{type:String,default:"bottom",validator:function(e){return["top","left","right","bottom"].indexOf(e)!==-1}},placement:{type:String,default:"start",validator:function(e){return["start","center","end"].indexOf(e)!==-1}},autoAdjust:{type:Boolean,default:!0}},rt=k(k({steps:{type:Array,required:!0,default:()=>[]},stepIndex:{type:Number,default:-1},padding:{type:Number,default:0},useOverlay:{type:Boolean,default:!0},pagination:{type:Boolean,default:!0},closeBtn:{type:Boolean,default:!0},allowKeyboardEvent:{type:Boolean,default:!0}},Ee),ke),lt=k({rect:{type:Object,default(){return{top:0,left:0,width:0,height:0}}}},ke),st=k({rect:{type:Object,default(){return{top:0,left:0,width:0,height:0}}}},Ee);function D(e,o,r,n){let l;const s=()=>{l&&(l.removeEventListener(o,r,n),l=void 0)},i=Z(()=>K(e),d=>{s(),!!d&&(l=d,d.addEventListener(o,r,n))},{immediate:!0,flush:"post"}),c=()=>{i(),s()};return _e(c),c}const Re=(e,o=0)=>({top:e.top-o,right:e.right+o,bottom:e.bottom+o,left:e.left-o,width:e.width+o*2,height:e.height+o*2}),at=({top:e,left:o,bottom:r,right:n})=>{const{innerWidth:l,innerHeight:s}=window;return e>=0&&o>=0&&n<=l&&r<=s},Ae=({top:e,left:o,bottom:r,right:n})=>{const{innerWidth:l,innerHeight:s}=window;return{top:e<0,left:o<0,right:n>l,bottom:r>s}},B=e=>e==="top"||e==="bottom",Te=e=>{let o,r;return(...n)=>{r=n,!o&&(o=requestAnimationFrame(()=>{o=null,e(...r)}))}};const it={name:"VueGuidedOverlay",inheritAttrs:!1,props:k({},lt),emits:["overlay-click","update:rect"],setup(e,{emit:o}){const{rect:r,allowInteraction:n,allowOverlayClose:l,allowEscClose:s}=he(e),i=C(!1),c=C(!1),d={top:0,left:0,width:0,height:0},y=ee(k({},d)),P=ee(k({},d)),v=ee({width:0,height:0}),R=C([]),X={width:0,height:0,x:0,y:0,scaleX:1,scaleY:1},m=ee(Object.fromEntries(["top","left","bottom","right","center"].map(t=>[t,k({},X)]))),x=300,I=300,Y="cubic-bezier(.65,.05,.36,1)",_=W(()=>({width:`${v.width}px`,height:`${v.height}px`,overflow:"hidden",position:"absolute",top:"0px",left:"0px",opacity:i.value?"0.65":"0",visibility:i.value?"visible":"hidden","pointer-events":n.value?"none":null,transition:`${x}ms opacity, ${x}ms visibility`})),w=W(()=>t=>{const a=m[t];if(!a)return null;const u={position:"absolute"};let p=null;return t==="bottom"?(u.bottom="0px",p="bottom left"):t==="right"?(u.right="0px",p="top right"):(u.top="0px",u.left="0px",p="top left"),ne(k({width:`${a.width}px`,height:`${a.height}px`,transform:`translate3d(${a.x}px, ${a.y}px, 0) scale3d(${a.scaleX}, ${a.scaleY}, 1)`},u),{transformOrigin:p})}),f=(t,{top:a=0,left:u=0,width:p=0,height:Q=0})=>{t.top=a,t.left=u,t.width=p,t.height=Q,t.bottom=Q+a,t.right=p+u},g=({top:t,left:a,right:u,bottom:p,width:Q,height:ve})=>{const L=v.width,G=v.height,O=200,He={width:O,height:O,x:0,y:t+window.scrollY<0?-O+t+window.scrollY:0,scaleX:L/O,scaleY:t+window.scrollY<0?1:(t+window.scrollY)/O},Be={width:O,height:O,x:a+window.scrollX<0?-O+a+window.scrollX:0,y:0,scaleX:a+window.scrollX<0?1:(a+window.scrollX)/O,scaleY:G/O},Ie={width:O,height:O,x:u+window.scrollX>L?-(L-(u+window.scrollX))+O:0,y:0,scaleX:u+window.scrollX>L?1:(L-(u+window.scrollX))/O,scaleY:G/O},ze={width:O,height:O,x:0,y:p+window.scrollY>G?-(G-(p+window.scrollY))+O:0,scaleX:L/O,scaleY:p+window.scrollY>G?1:(G-(p+window.scrollY))/O},$e={width:Q,height:ve,x:a+window.scrollX,y:t+window.scrollY,scaleX:1,scaleY:1};return{top:He,left:Be,right:Ie,bottom:ze,center:$e}},S=()=>{const t=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight),a=Math.max(document.body.scrollWidth,document.documentElement.scrollWidth,document.body.offsetWidth,document.documentElement.offsetWidth,document.body.clientWidth,document.documentElement.clientWidth);v.width=a,v.height=t},h=()=>{v.width=0,v.height=0},b=()=>{const t=g(y);for(const a in m){const u=m[a];u.width=t[a].width,u.height=t[a].height,u.x=t[a].x,u.y=t[a].y,u.scaleX=t[a].scaleX,u.scaleY=t[a].scaleY}},z=()=>{const t=g(P),a=g(y);for(const u in m){const p=m[u];u==="center"?(p.x+=t[u].x-a[u].x,p.y+=t[u].y-a[u].y,p.scaleX=t[u].width/a[u].width,p.scaleY=t[u].height/a[u].height):(p.x=t[u].x,p.y=t[u].y,p.scaleX=t[u].scaleX,p.scaleY=t[u].scaleY)}},$=(t=void 0)=>{for(const a in m)R.value[a].style.transition=`${I}ms transform ${Y}`;b(),setTimeout(()=>{f(y,r.value),b();for(const a in m)R.value[a].style.transition="";c.value=!1,t&&t()},I)},H=()=>{!i.value||c.value||(h(),N(()=>{S(),f(y,r.value),b()}))},V=(t=void 0)=>{H(),c.value=!0,setTimeout(()=>{c.value=!1,t&&t()},x)},M=(t=void 0)=>{setTimeout(()=>{h(),t&&t()},x)},oe=t=>{c.value=!0,h(),N(()=>{S(),f(P,R.value.center.getBoundingClientRect()),b(),z(),setTimeout(()=>{$(t)},16)})},F=t=>{i.value||U(r.value,t)},q=t=>{!i.value||c.value||U(void 0,t)},ie=(t,a)=>{!i.value||c.value||!t||(o("update:rect",t),U(t,a,!0))},U=(t,a,u=!1)=>{if(!t){i.value=!1,M(a);return}f(P,y),f(y,t),i.value=!0,u?oe(a):V(a)},J=Te(H);je(()=>{R.value=[]});const ue=()=>{!l.value||(o("overlay-click"),q())},ce=t=>{t.key!=="Escape"||!s.value||(o("overlay-click"),q())};return Z(()=>r.value,()=>{J()},{deep:!0}),D(window,"scroll",J),D(window,"resize",J),D(window,"keyup",ce),{active:i,overlaysRef:R,overlaysRect:m,overlaysRectStyle:w,overlayWrapperStyle:_,onOverlayClick:ue,overlayStart:F,overlayClose:q,overlayMoveTo:ie}}};function ut(e,o,r,n,l,s){return E(),re(Se,{to:"body"},[A("div",te({class:"vue-guided-overlay"},e.$attrs),[A("div",{class:"vgo__wrapper",style:ge(n.overlayWrapperStyle)},[(E(!0),T(fe,null,me(n.overlaysRect,(i,c)=>(E(),T("div",{key:c,ref_for:!0,ref:d=>{d&&(n.overlaysRef[c]=d)},class:pe(`vgo__overlay vgo__overlay--${c}`),style:ge(n.overlaysRectStyle(c)),onClick:o[0]||(o[0]=(...d)=>n.onOverlayClick&&n.onOverlayClick(...d))},null,6))),128))],4)],16)])}var ct=ae(it,[["render",ut]]);function Pe(e,o,r={}){let n;const l=()=>{n&&(n.disconnect(),n=void 0)},s=Z(()=>K(e),c=>{l(),!!c&&(n=new window.ResizeObserver(o),n.observe(c,r))},{immediate:!0,flush:"post"}),i=()=>{s(),l()};return _e(i),i}const vt={name:"VueGuidedPopover",inheritAttrs:!1,props:k({},st),setup(e){const o=C(null),{rect:r,position:n}=he(e),l=C(n.value),s=C(0),i=C(0),c=W(()=>({transform:`translateX(${s.value}px) translateY(${i.value}px)`})),{arrowStyle:d,arrowRect:y,initArrowPositionCoord:P}=dt(e,s,i,o,l,r);Z(()=>r.value,()=>{N(()=>{v()})},{deep:!0,immediate:!0});const v=()=>{!o.value||(X(),R(),N(()=>{m(),P()}))};Pe(o,v);const R=()=>{const{height:_,width:w}=o.value.getBoundingClientRect(),f=l.value,g=e.placement,S=e.offset+y.value.height;let h=0,b=0;switch(f){case"bottom":h=r.value.left,b=r.value.height+r.value.top+S;break;case"top":h=r.value.left,b=r.value.top-_-S;break;case"right":h=r.value.width+r.value.left+S,b=r.value.top;break;case"left":h=r.value.left-w-S,b=r.value.top;break}switch(g){case"end":B(f)?h=h-w+r.value.width:b=b-_+r.value.height;break;case"center":B(f)?h=h-w/2+r.value.width/2:b=b-_/2+r.value.height/2;break}s.value=h,i.value=b},X=()=>{if(!!e.autoAdjust)if(x(e.position))l.value=e.position;else{if(x(l.value))return;const _=Y();l.value=_}},m=()=>{if(!e.autoAdjust)return;const{innerWidth:_,innerHeight:w}=window,f=o.value.getBoundingClientRect(),g=Ae(f),S=y.value.height+y.value.offset,h=r.value.top+S,b=r.value.height+r.value.top-S,z=r.value.left+S,$=r.value.width+r.value.left-S,H=Ae({top:b,bottom:h,left:$,right:z}),V=H.left||H.right,M=H.top||H.bottom;B(l.value)?g.left?s.value=V?$:0:g.right&&(s.value=V?-f.width+z:_-f.width):g.top?i.value=M?b:0:g.bottom&&(i.value=M?-f.height+h:w-f.height)},x=_=>{const w=I()[_],{height:f,width:g}=o.value.getBoundingClientRect(),S=B(_)?f:g,h=e.offset+y.value.height;return w>=S+h},I=()=>{const{innerWidth:_,innerHeight:w}=window;return{bottom:w-(r.value.height+r.value.top),top:r.value.top,right:_-(r.value.width+r.value.left),left:r.value.left}},Y=()=>{const _=I();return Object.keys(_).sort((w,f)=>x(w)?-1:x(f)?1:_[f]-_[w])[0]};return{rect:r,popoverRef:o,currentPosition:l,popoverStyle:c,arrowStyle:d}}};function dt(e,o,r,n,l,s){const i=C(0),c=C(0),d=14,y=Math.sqrt(2)*d/2,P=6,v=W(()=>({size:e.arrow?d:0,height:e.arrow?y:0,offset:e.arrow?P:0}));return{arrowStyle:W(()=>({width:`${v.value.size}px`,height:`${v.value.size}px`,left:B(l.value)?"0px":null,top:B(l.value)?null:"0px",[l.value]:"100%",transform:`translateX(${i.value}px) translateY(${c.value}px) rotate(45deg)`})),arrowRect:v,initArrowPositionCoord:()=>{if(!e.arrow)return;const{height:m,width:x}=n.value.getBoundingClientRect(),I=e.placement,Y=v.value.offset,w=(2*v.value.height-v.value.size)/2+Y;let f=0,g=0;switch(B(l.value)?g=l.value==="bottom"?v.value.size/2:-(v.value.size/2):f=l.value==="right"?v.value.size/2:-(v.value.size/2),I){case"center":B(l.value)?f=s.value.left-o.value+s.value.width/2-v.value.size/2:g=s.value.top-r.value+s.value.height/2-v.value.size/2;break;case"start":B(l.value)?f=s.value.left-o.value+w:g=s.value.top-r.value+w;break;case"end":B(l.value)?f=s.value.width+s.value.left-o.value-v.value.size-w:g=s.value.height+s.value.top-r.value-v.value.size-w;break}const S=w,h=$=>$-v.value.height*2+w,b=h(x),z=h(m);B(l.value)?f>b?f=b:f<S&&(f=S):g>z?g=z:g<S&&(g=S),i.value=f,c.value=g}}}const ft={class:"vgp__body"};function pt(e,o,r,n,l,s){return E(),T("div",te({ref:"popoverRef",class:"vue-guided-popover",style:n.popoverStyle},e.$attrs),[e.arrow?(E(),T("div",{key:0,class:pe(`vgp__arrow vgp__arrow--${n.currentPosition}`),style:ge(n.arrowStyle)},null,6)):j("",!0),A("div",ft,[le(e.$slots,"default")])],16)}var ht=ae(vt,[["render",pt]]);function gt(e){const o=ee({top:0,left:0,width:0,height:0,bottom:0,right:0}),r=()=>{const l=K(e);if(!l){s({});return}s(l.getBoundingClientRect());function s({top:i=0,left:c=0,width:d=0,height:y=0}){o.top=i,o.left=c,o.width=d,o.height=y,o.bottom=y+i,o.right=d+c}},n=Te(r);return Z(()=>K(e),()=>{r()},{immediate:!0}),D(window,"resize",n),D(window,"scroll",n),Pe(e,n),{rect:o}}function yt(e){const o=C(!1),r=C([]),n=i=>{if(!(!o.value||!K(e)||!(i.key==="Tab"||i.keyCode===9)))if(r.value.length===0)i.preventDefault();else{const d=r.value[0],y=r.value[r.value.length-1];i.shiftKey?document.activeElement===d&&(y.focus(),i.preventDefault()):document.activeElement===y&&(d.focus(),i.preventDefault())}},l=()=>{o.value=!0,r.value=wt(K(e)),r.value.length>0&&r.value[0].focus()},s=()=>{o.value=!1};return D(e,"keydown",n),{active:Fe(o),enableTrap:l,disableTrap:s}}function wt(e){if(!e)return;const o="button, [href], input, select, textarea, [tabindex]";return[...e.querySelectorAll(o)].filter(n=>{if(parseInt(n.getAttribute("tabindex"),10)<0||n.disabled)return!1;for(;n;){if(getComputedStyle(n).display==="none"||getComputedStyle(n).visibility==="hidden")return!1;n=n.parentElement}return!0})}const mt={name:"VueGuidedTour",components:{"vgt-overlay":ct,"vgt-popover":ht},inheritAttrs:!1,props:k({},rt),emits:["update:stepIndex","afterStart","afterEnd","afterMove"],setup(e,{emit:o}){const{stepIndex:r,steps:n,allowKeyboardEvent:l,useOverlay:s}=he(e),i=C(null),c=C(null),d=Ke("$vgt",{}),y=Math.random().toString(36).substring(2),P=C(!1),v=C(-1);v.value=r.value;const R=C(null),X=C(null),m=C(!1),x=C(!1),{enableTrap:I}=yt(i);let Y;const{getHighlightEl:_,addHighlight:w,removeHighlight:f}=bt(),{rect:g}=gt(R),S=W(()=>{const t=h.value.padding||e.padding;return Re(g,t)}),h=W(()=>{var a,u,p;if(v.value<0)return{};const t=n.value[v.value];return t?ne(k({},t),{popover:ne(k({},t.popover),{role:"dialog",id:((a=t.popover)==null?void 0:a.id)||`popover-${y}`,"aria-labelledby":t.title?`${((u=t.popover)==null?void 0:u.id)||y}-title`:null,"aria-describedby":t.content?`${((p=t.popover)==null?void 0:p.id)||y}-desc`:null}),overlay:k({},t.overlay)}):{}}),b=W(()=>v.value===0),z=W(()=>v.value===n.value.length-1);De(()=>{d.start=$,d.next=H,d.prev=V,d.end=M,d.move=oe});const $=(t=0)=>{m.value||F(t)},H=()=>{if(!m.value||x.value)return;const t=v.value+1;t>n.value.length-1||F(t)},V=()=>{if(!m.value||x.value)return;const t=v.value-1;t<0||F(t)},M=()=>{if(!m.value||x.value)return;F(-1)},oe=(t=0)=>{t===v.value||!m.value||x.value||F(t)},F=t=>{if(t<-1||t>n.value.length-1||t===v.value)return;const a=_(t,n.value);if(!(!a&&t!==-1)){if(P.value=!1,f(),U(t,a),t===-1){ie();return}q()}},q=()=>{const t=R.value,a=!!X.value;m.value=!0,x.value=!0,s.value?a?(()=>{const ve=h.value.padding||e.padding,L=Re(R.value.getBoundingClientRect(),ve);c.value.overlayMoveTo(L,u)})():(()=>{Y=document.activeElement,c.value.overlayStart(u)})():N(()=>{u()});function u(){at(t.getBoundingClientRect())||t.scrollIntoView({block:"center"}),P.value=!0,w(R.value),x.value=!1,N(()=>{I()}),o(a?"afterMove":"afterStart")}},ie=()=>{P.value=!1,f(),s.value?t():a();function t(){c.value.overlayClose(a)}function a(){m.value=!1,x.value=!1,Y.focus({preventScroll:!0}),o("afterEnd")}},U=(t=-1,a)=>{v.value=t,o("update:stepIndex",v.value),t===-1?(X.value=null,R.value=null):(X.value=R.value,R.value=a)},J=t=>{if(!(!m.value||!l.value))switch(t.key){case"ArrowLeft":V();break;case"ArrowRight":H();break}},ue=()=>{M()},ce=()=>{M()};return D(window,"keyup",J),{vgtRef:i,vgtOverlay:c,active:m,showPopover:P,currentStepIndex:v,currentStepRect:S,currentStep:h,isFirstStep:b,isLastStep:z,start:$,next:H,prev:V,end:M,move:oe,onOverlayClick:ue,onCloseClick:ce}}};function bt(){const e="vgt__target--highlighted";return{getHighlightEl:(l,s)=>{if(typeof l!="number"||l<0||l>s.length-1)return;const i=s[l].target,c=document.querySelector(`${i}`);if(i){if(!c){console.warn(`[vue-guided-tour] : Target to highlight "${i}" not found`);return}}else{console.warn(`[vue-guided-tour] : Target is required in step ${l}`);return}return c},addHighlight:l=>{l.classList.add(e)},removeHighlight:()=>{document.querySelectorAll(`.${e}`).forEach(s=>{s.classList.remove(e)})}}}const _t={class:"vgt__body"},St=["id"],Ot=["id"],xt={class:"vgt__footer"},Ct={key:0,class:"vgt__pages"},kt={class:"vgt__nav"};function Et(e,o,r,n,l,s){const i=de("vgt-overlay"),c=de("vgt-popover");return E(),re(Se,{to:"body"},[A("div",te({ref:"vgtRef",class:"vue-guided-tour"},e.$attrs),[e.useOverlay?(E(),re(i,te({key:0,ref:"vgtOverlay",rect:n.currentStepRect,"allow-overlay-close":e.allowOverlayClose,"allow-esc-close":e.allowEscClose,"allow-interaction":e.allowInteraction},k({},n.currentStep.overlay),{onOverlayClick:n.onOverlayClick}),null,16,["rect","allow-overlay-close","allow-esc-close","allow-interaction","onOverlayClick"])):j("",!0),n.showPopover&&(n.currentStep.title||n.currentStep.content||e.$slots.content)?(E(),re(Ge,{key:1,name:"popover-appear",appear:""},{default:Oe(()=>[be(c,te({rect:n.currentStepRect,arrow:e.arrow,offset:e.offset,position:e.position,placement:e.placement,"auto-adjust":e.autoAdjust},k({},n.currentStep.popover)),{default:Oe(()=>[e.closeBtn?le(e.$slots,"close",{key:0},()=>[A("button",{class:"vgt__close-btn","aria-label":"close Tour",onClick:o[0]||(o[0]=(...d)=>n.onCloseClick&&n.onCloseClick(...d))}," \xD7 ")]):j("",!0),A("div",_t,[le(e.$slots,"content",xe(Ce({stepIndex:n.currentStepIndex})),()=>[n.currentStep.title?(E(),T("h3",{key:0,id:n.currentStep.popover["aria-labelledby"],class:"vgt__title"},se(n.currentStep.title),9,St)):j("",!0),n.currentStep.content?(E(),T("div",{key:1,id:n.currentStep.popover["aria-describedby"],class:"vgt__content"},se(n.currentStep.content),9,Ot)):j("",!0)])]),A("div",xt,[e.pagination?(E(),T("div",Ct,se(n.currentStepIndex+1)+" / "+se(e.steps.length),1)):j("",!0),le(e.$slots,"nav",xe(Ce({isFirstStep:n.isFirstStep,isLastStep:n.isLastStep})),()=>[A("div",kt,[n.isFirstStep?j("",!0):(E(),T("button",{key:0,class:"vgt__btn vgt__btn--secondary vgt__prev-btn",onClick:o[1]||(o[1]=(...d)=>n.prev&&n.prev(...d))}," Prev ")),n.isLastStep?(E(),T("button",{key:1,class:"vgt__btn vgt__btn--primary vgt__end-btn",onClick:o[2]||(o[2]=(...d)=>n.end&&n.end(...d))}," End ")):(E(),T("button",{key:2,class:"vgt__btn vgt__btn--primary vgt__next-btn",onClick:o[3]||(o[3]=(...d)=>n.next&&n.next(...d))}," Next "))])])])]),_:3},16,["rect","arrow","offset","position","placement","auto-adjust"])]),_:3})):j("",!0)],16)])}var Rt=ae(mt,[["render",Et]]);const At={install(e){const o={};e.config.globalProperties.$vgt=o,e.provide("$vgt",o),e.component("VueGuidedTour",Rt)}};Ne(nt).use(At).mount("#app");
