(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{160:function(e,t,n){},211:function(e,t,n){},240:function(e,t,n){},374:function(e,t,n){},376:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),i=n(55),r=n.n(i),c=(n(211),n(4)),s=n(5),l=n(13),u=n(10),d=n(9),h=n(192),p=n.n(h).a.connect(),j=a.a.createContext(),f=(n(240),n(88),n(160),n(2)),b=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={temperature:0},e.componentDidMount=e.componentDidMount.bind(Object(l.a)(e)),e.componentWillUnmount=e.componentWillUnmount.bind(Object(l.a)(e)),e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){var e=this;fetch("/temperature").then((function(e){return e.json()})).then((function(t){e.setState({temperature:t.temperature})})),this.context.on("temperature_update",(function(t){e.setState({temperature:t.temperature})}))}},{key:"componentWillUnmount",value:function(){this.context.off("temperature_update")}},{key:"render",value:function(){return Object(f.jsxs)("div",{className:"component",children:[Object(f.jsx)("h1",{children:"Temperature"}),Object(f.jsxs)("h3",{children:[this.state.temperature," C"]})]})}}]),n}(o.Component);b.contextType=j;var m=b,O=n(116);n(347);var v=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;Object(c.a)(this,n),(o=t.call(this,e)).componentDidMount=o.componentDidMount.bind(Object(l.a)(o));var a=1;return o.props.draggable&&(a=30),o.options={pointHitRadius:a,animation:{duration:0},scales:{y:{min:0,max:300,stepSize:1,title:{text:"Temperature",display:!0,color:"rgba(41, 216, 255, 0.7)",font:{size:20}}},x:{min:0,max:400,stepSize:1,title:{text:"Time (Seconds)",display:!0,color:"rgba(41, 216, 255, 0.7)",font:{size:20}}}},plugins:{dragData:{round:0,dragX:!0,onDrag:function(e,t,n,o){},onDragStart:function(e,t){},onDragEnd:function(t,n,o,a){e.arrayUpdater[o]=a}},zoom:{wheel:{enabled:!0},pinch:{enabled:!0},mode:"xy"},tooltip:{xAlign:"right",yAlign:"bottom",displayColors:!1,caretPadding:30,caretSize:10,bodySpacing:20},legend:{display:!1},title:{display:!0,text:o.props.profile.name}}},o}return Object(s.a)(n,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return Object(f.jsx)(f.Fragment,{children:Object(f.jsx)(O.b,{data:{datasets:[{label:"Profile",data:this.props.profile.datapoints,showLine:!0,backgroundColor:"rgba(42, 216, 255, 0.2)",borderColor:"rgba(42, 216, 255, 1)",borderWidth:1,pointRadius:10,hoverRadius:20,dragData:this.props.draggable},{label:"Historic Temerature",data:this.props.historicTemps,showLine:!0,backgroundColor:"rgba(233, 236, 0, 0.2)",borderColor:"rgba(233, 236, 0, 1)",borderWidth:1,pointRadius:1,hoverRadius:2,dragData:!1,borderDash:[10,5]}]},options:this.options})})}}]),n}(o.Component),x=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={status:"Ready"},e.componentDidMount=e.componentDidMount.bind(Object(l.a)(e)),e.componentWillUnmount=e.componentWillUnmount.bind(Object(l.a)(e)),e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){var e=this;fetch("/status").then((function(e){return e.json()})).then((function(t){console.log(t),e.setState({status:t.status})})),this.context.on("status_update",(function(t){e.setState({status:t.new_status})}))}},{key:"componentWillUnmount",value:function(){this.context.off("status_update")}},{key:"render",value:function(){return Object(f.jsxs)("div",{className:"component",children:[Object(f.jsx)("h1",{children:"Status"}),Object(f.jsx)("h3",{children:this.state.status})]})}}]),n}(o.Component);x.contextType=j;var g=x,y=n(377),C=n(40),k=n(63),D=n.n(k),w=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).runProfile=e.runProfile.bind(Object(l.a)(e)),e.state={currentProfile:"",historicTemperature:[],percentDone:0},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){var e=this;fetch("/current_profile").then((function(e){return e.json()})).then((function(t){e.setState({currentProfile:t.current_profile})})),p.on("new_profile",(function(t){e.setState({currentProfile:t.current_profile})})),p.on("historic_temperature_update",(function(t){e.setState({historicTemperature:t.historic_temperature,percentDone:t.percent})}))}},{key:"componentWillUnmount",value:function(){p.off("new_profile"),p.off("historic_temperature_update")}},{key:"runProfile",value:function(){D.a.post("/run",{profile_name:this.state.currentProfile.name}).then((function(e){console.log(e)}))}},{key:"render",value:function(){return Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)(m,{}),Object(f.jsx)(g,{}),Object(f.jsx)(v,{draggable:!1,profile:this.state.currentProfile,historicTemps:this.state.historicTemperature}),Object(f.jsx)(y.a,{as:C.b,to:"/profileList",inverted:!0,color:"blue",children:"Past Profiles"}),Object(f.jsx)(y.a,{as:C.b,to:{pathname:"/editProfile",state:{profile:this.state.currentProfile}},inverted:!0,color:"blue",children:"Edit Profile"}),Object(f.jsx)(y.a,{onClick:this.runProfile,inverted:!0,color:"green",children:"Start"})]})}}]),n}(o.Component),_=n(397),P=n(393),S=n(395),M=(n(374),n(15)),I=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={profiles:[],activeItem:""},e.componentDidMount=e.componentDidMount.bind(Object(l.a)(e)),e.loadClicked=e.loadClicked.bind(Object(l.a)(e)),e.handleItemClick=e.handleItemClick.bind(Object(l.a)(e)),e}return Object(s.a)(n,[{key:"handleItemClick",value:function(e){var t=this;fetch("/reflow_profiles/"+e.target.innerText).then((function(e){return e.json()})).then((function(e){t.setState({activeItem:e})}))}},{key:"componentDidMount",value:function(){var e=this;fetch("/reflow_profiles/list").then((function(e){return e.json()})).then((function(t){e.setState({profiles:t}),fetch("/reflow_profiles/"+e.state.profiles[0]).then((function(e){return e.json()})).then((function(t){e.setState({activeItem:t})}))}))}},{key:"loadClicked",value:function(){var e=this;D.a.post("/reflow_profiles/load",{profile_name:this.state.activeItem.name}).then((function(t){if(200===t.status){var n=e.props.history;n&&n.push("/")}}))}},{key:"render",value:function(){var e=this;return Object(f.jsxs)(f.Fragment,{children:[Object(f.jsxs)(_.a,{centered:!0,columns:2,children:[Object(f.jsx)(_.a.Column,{children:Object(f.jsxs)(P.a,{children:[Object(f.jsx)(v,{draggable:!1,profile:this.state.activeItem,historicTemps:[]}),Object(f.jsxs)("h3",{children:["Date Created: ",new Date(this.state.activeItem.date_created).toLocaleString()]}),Object(f.jsxs)("h3",{children:["Last Loaded: ",new Date(this.state.activeItem.last_run).toLocaleString()]})]})}),Object(f.jsx)(_.a.Column,{children:Object(f.jsx)("div",{className:"list",children:Object(f.jsx)(S.a,{divided:!0,inverted:!0,relaxed:!0,children:this.state.profiles.map((function(t){return Object(f.jsx)(S.a.Item,{onClick:e.handleItemClick,children:Object(f.jsx)(S.a.Content,{children:Object(f.jsx)(S.a.Header,{children:t})})},t)}))})})})]}),Object(f.jsx)(y.a,{as:C.b,to:"/",inverted:!0,color:"red",children:"Cancel"}),Object(f.jsx)(y.a,{onClick:this.loadClicked,inverted:!0,color:"green",children:"Load"})]})}}]),n}(o.Component),T=Object(M.f)(I),L=n(394),U=n(197),W=n.n(U),N=(n(375),function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).componentDidMount=o.componentDidMount.bind(Object(l.a)(o)),o.saveProfile=o.saveProfile.bind(Object(l.a)(o)),o.handleInputChange=o.handleInputChange.bind(Object(l.a)(o)),o.newDatapoints=o.props.location.state.profile.datapoints,o.newName=o.props.location.state.profile.name,o}return Object(s.a)(n,[{key:"handleInputChange",value:function(e){this.newName=e.target.value}},{key:"componentDidMount",value:function(){}},{key:"saveProfile",value:function(){var e={};e.name=this.newName,e.date_created=Date.now(),e.last_run=0,e.datapoints=this.newDatapoints,D.a.post("/reflow_profiles/save",e).then((function(e){console.log(e)}));var t=this.props.history;t&&t.push("/")}},{key:"render",value:function(){return Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)(v,{draggable:!0,profile:this.props.location.state.profile,arrayUpdater:this.newDatapoints}),Object(f.jsx)(y.a,{as:C.b,to:"/",inverted:!0,color:"red",children:"Cancel"}),Object(f.jsx)(y.a,{onClick:this.saveProfile,inverted:!0,color:"green",children:"Save"}),Object(f.jsx)(L.a,{onChange:this.handleInputChange,label:"Profile Name",defaultValue:this.newName}),Object(f.jsx)(W.a,{theme:"hg-theme-default"})]})}}]),n}(o.Component)),F=Object(M.f)(N),z=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).componentDidMount=o.componentDidMount.bind(Object(l.a)(o)),o.componentWillUnmount=o.componentWillUnmount.bind(Object(l.a)(o)),o}return Object(s.a)(n,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){p.disconnect()}},{key:"render",value:function(){return Object(f.jsx)(j.Provider,{value:p,children:Object(f.jsx)("div",{className:"App",children:Object(f.jsx)(C.a,{children:Object(f.jsxs)(M.c,{children:[Object(f.jsx)(M.a,{exact:!0,path:"/",children:Object(f.jsx)(w,{})}),Object(f.jsx)(M.a,{path:"/editProfile",children:Object(f.jsx)(F,{})}),Object(f.jsx)(M.a,{path:"/profileList",children:Object(f.jsx)(T,{})})]})})})})}}]),n}(o.Component),R=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,398)).then((function(t){var n=t.getCLS,o=t.getFID,a=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),o(e),a(e),i(e),r(e)}))},A=!1;"localhost"!==window.location.hostname&&"127.0.0.1"!==window.location.hostname&&""!==window.location.hostname||(A=!0),r.a.render(Object(f.jsx)(a.a.StrictMode,{children:Object(f.jsx)(z,{isLocal:A})}),document.getElementById("root")),R()}},[[376,1,2]]]);
//# sourceMappingURL=main.c5c43756.chunk.js.map