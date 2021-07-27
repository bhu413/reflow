(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{262:function(e,t,a){},291:function(e,t,a){},424:function(e,t,a){},428:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),c=a(20),o=a.n(c),r=(a(262),a(8)),s=a(10),l=a(16),d=a(14),j=a(13),h=a(218),b=a.n(h).a.connect(),u=i.a.createContext(),p=(a(291),a(130)),O=(a(397),a(2));var x=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(e){var n;Object(r.a)(this,a),(n=t.call(this,e)).componentDidMount=n.componentDidMount.bind(Object(l.a)(n));var i=1;return n.props.draggable&&(i=30),n.options={maintainAspectRatio:!0,responsive:!0,pointHitRadius:i,animation:{duration:0},scales:{y:{min:0,max:300,stepSize:1,title:{text:"Temperature (\xb0C)",display:!0,color:"rgba(41, 216, 255, 0.7)",font:{size:20}}},x:{min:0,max:400,stepSize:1,title:{text:"Time (Seconds)",display:!0,color:"rgba(41, 216, 255, 0.7)",font:{size:20}}}},plugins:{dragData:{round:0,dragX:!0,onDrag:function(e,t,a,n){},onDragStart:function(e,t){},onDragEnd:function(t,a,n,i){e.arrayUpdater[n]=i}},zoom:{wheel:{enabled:!0},pinch:{enabled:!0},mode:"xy"},tooltip:{xAlign:"right",yAlign:"bottom",displayColors:!1,caretPadding:30,caretSize:10,bodySpacing:20},legend:{display:!1},title:{display:!1}}},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return Object(O.jsx)(O.Fragment,{children:Object(O.jsx)(p.b,{data:{datasets:[{label:"Profile",data:this.props.profile.datapoints,showLine:!0,backgroundColor:"rgba(42, 216, 255, 0.2)",borderColor:"rgba(42, 216, 255, 1)",borderWidth:1,pointRadius:5,hoverRadius:10,dragData:this.props.draggable},{label:"Historic Temerature",data:this.props.historicTemps,showLine:!0,backgroundColor:"rgba(233, 236, 0, 0.2)",borderColor:"rgba(233, 236, 0, 1)",borderWidth:1,pointRadius:1,hoverRadius:2,dragData:!1,borderDash:[10,5],fill:0}]},options:this.options})})}}]),a}(n.Component),f=a(126),m=a.n(f),v=a(81),g=a(488),C=a(484),k=a(46),y=a(42),w=a.n(y),D=a(225),P=a.n(D),S=a(123),I=a.n(S),L=a(480),_=a(483),F=a(91),M=a(80),N=a(160),W=a.n(N),T=a(222),R=a.n(T),B=a(223),U=a.n(B),A=a(224),E=a.n(A),z=a(498),H=a(435),G=a(436),J=a(486),V=a(487),X=a(485),q=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(){var e;return Object(r.a)(this,a),(e=t.call(this)).componentDidMount=e.componentDidMount.bind(Object(l.a)(e)),e.componentWillUnmount=e.componentWillUnmount.bind(Object(l.a)(e)),e.drawerChange=e.drawerChange.bind(Object(l.a)(e)),e.stop=e.stop.bind(Object(l.a)(e)),e.state={drawer:!1,percentage:0,temperature:0,status:"Ready",address:":",currentProfile:""},e}return Object(s.a)(a,[{key:"stop",value:function(){w.a.post("/api/stop",{reason:"test"}).then((function(e){}))}},{key:"componentDidMount",value:function(){var e=this;b.on("status_update",(function(t){e.setState({percentage:t.percent,temperature:t.temperature,status:t.status,currentProfile:t.current_profile})})),fetch("/api/server_address").then((function(e){return e.json()})).then((function(t){e.setState({address:t.Ethernet[0]})}))}},{key:"drawerChange",value:function(){this.state.drawer?this.setState({drawer:!1}):this.setState({drawer:!0})}},{key:"componentWillUnmount",value:function(){b.off("status_update")}},{key:"render",value:function(){return Object(O.jsxs)(O.Fragment,{children:[Object(O.jsxs)(L.a,{position:"static",children:[Object(O.jsxs)(_.a,{children:[Object(O.jsx)(M.a,{edge:"start",color:"inherit","aria-label":"menu",onClick:this.drawerChange,children:Object(O.jsx)(W.a,{})}),Object(O.jsxs)(C.a,{container:!0,spacing:5,children:[Object(O.jsx)(C.a,{item:!0,children:Object(O.jsxs)(F.a,{children:["Address: ",this.state.address]})}),Object(O.jsx)(C.a,{item:!0,children:Object(O.jsxs)(F.a,{children:[this.state.temperature," \xb0C"]})}),Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(F.a,{children:this.state.status})}),Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(F.a,{children:this.state.currentProfile.name})})]}),Object(O.jsx)("div",{style:{marginLeft:"auto"},children:"Ready"!==this.state.status&&Object(O.jsx)(v.a,{onClick:this.stop,startIcon:Object(O.jsx)(I.a,{}),variant:"contained",color:"secondary",children:"Stop"})})]}),Object(O.jsx)(X.a,{variant:"determinate",value:this.state.percentage})]}),Object(O.jsxs)(z.a,{open:this.state.drawer,onClose:this.drawerChange,children:[Object(O.jsx)(H.a,{button:!0,onClick:this.drawerChange,children:Object(O.jsx)(G.a,{children:Object(O.jsx)(W.a,{})})},"menu"),Object(O.jsx)(J.a,{}),Object(O.jsxs)(H.a,{button:!0,component:k.b,onClick:this.drawerChange,to:"/",children:[Object(O.jsx)(G.a,{children:Object(O.jsx)(R.a,{})}),Object(O.jsx)(V.a,{children:"Home"})]},"Home"),Object(O.jsxs)(H.a,{button:!0,component:k.b,onClick:this.drawerChange,to:"/profileList",children:[Object(O.jsx)(G.a,{children:Object(O.jsx)(U.a,{})}),Object(O.jsx)(V.a,{children:"Profile List"})]},"ProfileList"),Object(O.jsxs)(H.a,{button:!0,component:k.b,onClick:this.drawerChange,to:"/settings",children:[Object(O.jsx)(G.a,{children:Object(O.jsx)(E.a,{})}),Object(O.jsx)(V.a,{children:"Settings"})]},"Settings")]})]})}}]),a}(n.Component),K=a(217),Q=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(){var e;return Object(r.a)(this,a),(e=t.call(this)).StartButton=Object(K.a)(v.a)({background:"#3dd900","&:hover":"#3dd900"}),e.runProfile=e.runProfile.bind(Object(l.a)(e)),e.stop=e.stop.bind(Object(l.a)(e)),e.state={currentProfile:"",historicTemperature:[],percentDone:0,status:"Ready"},e}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch("/api/current_profile").then((function(e){return e.json()})).then((function(t){e.setState({currentProfile:t.current_profile})})),b.on("status_update",(function(t){e.setState({currentProfile:t.current_profile,historicTemperature:t.historic_temperature,status:t.status})}))}},{key:"componentWillUnmount",value:function(){b.off("status_update")}},{key:"runProfile",value:function(){w.a.post("/api/run",{profile_name:this.state.currentProfile.name}).then((function(e){}))}},{key:"stop",value:function(){w.a.post("/api/stop",{reason:"test"}).then((function(e){}))}},{key:"render",value:function(){var e;return e="Ready"!==this.state.status?Object(O.jsx)(v.a,{onClick:this.stop,startIcon:Object(O.jsx)(I.a,{}),variant:"contained",color:"secondary",children:"Stop"}):Object(O.jsx)(this.StartButton,{onClick:this.runProfile,startIcon:Object(O.jsx)(P.a,{}),variant:"contained",color:"primary",children:"Start"}),Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(q,{}),Object(O.jsx)("div",{style:{paddingTop:"30px",width:"82%",margin:"0 auto"},children:Object(O.jsx)(x,{draggable:!1,profile:this.state.currentProfile,historicTemps:this.state.historicTemperature})}),Object(O.jsx)(g.a,{maxWidth:!1,children:Object(O.jsxs)(C.a,{container:!0,spacing:3,alignItems:"center",justify:"center",children:[Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(v.a,{component:k.b,to:{pathname:"/editProfile",state:{profile:this.state.currentProfile}},startIcon:Object(O.jsx)(m.a,{}),variant:"contained",color:"primary",children:"Edit Current Profile"})}),Object(O.jsx)(C.a,{item:!0,children:e})]})})]})}}]),a}(n.Component),Y=a(497),Z=a(490),$=a(489),ee=a(101),te=a.n(ee),ae=a(132),ne=a(61),ie=a(102),ce=a(437),oe=a(166),re=a(168),se=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(){var e;return Object(r.a)(this,a),(e=t.call(this)).handleChange=e.handleChange.bind(Object(l.a)(e)),e.currentlyExpanded="",e.state={expanded:""},e}return Object(s.a)(a,[{key:"handleChange",value:function(e){this.currentlyExpanded=e}},{key:"render",value:function(){return Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(q,{}),Object(O.jsxs)(g.a,{maxWidth:!1,children:[Object(O.jsxs)(Y.a,{children:[Object(O.jsx)($.a,{expandIcon:Object(O.jsx)(te.a,{}),"aria-controls":"panel1bh-content",id:"panel1bh-header",children:Object(O.jsx)(F.a,{children:"Network"})}),Object(O.jsxs)(Z.a,{children:[Object(O.jsx)(F.a,{children:"Note: changes will be applied on server restart."}),Object(O.jsx)(ce.a,{checked:!1,name:"checkedA",inputProps:{"aria-label":"secondary checkbox"}})]})]}),Object(O.jsxs)(Y.a,{children:[Object(O.jsx)($.a,{expandIcon:Object(O.jsx)(te.a,{}),"aria-controls":"panel2bh-content",id:"panel2bh-header",children:Object(O.jsx)(F.a,{children:"PID"})}),Object(O.jsxs)(Z.a,{children:[Object(O.jsx)(oe.a,{variant:"outlined",label:"Proportional",value:50}),Object(O.jsx)(oe.a,{variant:"outlined",label:"Integral",value:50}),Object(O.jsx)(oe.a,{variant:"outlined",label:"Derivative",value:50})]})]}),Object(O.jsxs)(Y.a,{children:[Object(O.jsx)($.a,{expandIcon:Object(O.jsx)(te.a,{}),"aria-controls":"panel3bh-content",id:"panel3bh-header",children:Object(O.jsx)(F.a,{children:"Hardware"})}),Object(O.jsxs)(Z.a,{children:[Object(O.jsxs)(ie.a,{children:[Object(O.jsx)(re.a,{children:"Relay GPIO Pin"}),Object(O.jsxs)(ae.a,{value:27,children:[Object(O.jsx)(ne.a,{value:5,children:"5 (pin 29)"}),Object(O.jsx)(ne.a,{value:6,children:"6 (pin 31)"}),Object(O.jsx)(ne.a,{value:16,children:"16 (pin 36)"}),Object(O.jsx)(ne.a,{value:17,children:"17 (pin 11)"}),Object(O.jsx)(ne.a,{value:22,children:"22 (pin 15)"}),Object(O.jsx)(ne.a,{value:23,children:"23 (pin 16)"}),Object(O.jsx)(ne.a,{value:24,children:"24 (pin 18)"}),Object(O.jsx)(ne.a,{value:25,children:"25 (pin 22)"}),Object(O.jsx)(ne.a,{value:26,children:"26 (pin 37)"}),Object(O.jsx)(ne.a,{value:27,children:"27 (pin 13)"})]})]}),Object(O.jsxs)(ie.a,{children:[Object(O.jsx)(re.a,{children:"Fan GPIO Pin"}),Object(O.jsxs)(ae.a,{value:22,children:[Object(O.jsx)(ne.a,{value:5,children:"5 (pin 29)"}),Object(O.jsx)(ne.a,{value:6,children:"6 (pin 31)"}),Object(O.jsx)(ne.a,{value:16,children:"16 (pin 36)"}),Object(O.jsx)(ne.a,{value:17,children:"17 (pin 11)"}),Object(O.jsx)(ne.a,{value:22,children:"22 (pin 15)"}),Object(O.jsx)(ne.a,{value:23,children:"23 (pin 16)"}),Object(O.jsx)(ne.a,{value:24,children:"24 (pin 18)"}),Object(O.jsx)(ne.a,{value:25,children:"25 (pin 22)"}),Object(O.jsx)(ne.a,{value:26,children:"26 (pin 37)"}),Object(O.jsx)(ne.a,{value:27,children:"27 (pin 13)"})]})]})]})]}),Object(O.jsxs)(Y.a,{children:[Object(O.jsx)($.a,{expandIcon:Object(O.jsx)(te.a,{}),"aria-controls":"panel4bh-content",id:"panel4bh-header",children:Object(O.jsx)(F.a,{children:"Appearance"})}),Object(O.jsxs)(Z.a,{children:[Object(O.jsx)(F.a,{children:"Under Construction"}),Object(O.jsxs)(ie.a,{children:[Object(O.jsx)(re.a,{children:"Theme"}),Object(O.jsxs)(ae.a,{value:"Dark",children:[Object(O.jsx)(ne.a,{value:"Dark",children:"Dark"}),Object(O.jsx)(ne.a,{value:"Light",children:"Light"})]})]}),Object(O.jsxs)(ie.a,{children:[Object(O.jsx)(re.a,{children:"Temperature Units"}),Object(O.jsxs)(ae.a,{value:"Celcius",children:[Object(O.jsx)(ne.a,{value:"Celcius",children:"Celcius"}),Object(O.jsx)(ne.a,{value:"Fahrenheit",children:"Fahrenheit"})]})]})]})]})]})]})}}]),a}(n.Component),le=a(493),de=a(494),je=a(495),he=a(496),be=a(227),ue=(a(424),a(25)),pe=a(129),Oe=a.n(pe),xe=a(231),fe=a.n(xe),me=a(232),ve=a.n(me),ge=a(230),Ce=a.n(ge),ke=a(229),ye=a.n(ke),we=a(226),De=a.n(we),Pe=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(){var e;return Object(r.a)(this,a),(e=t.call(this)).MyDataGrid=Object(K.a)(be.a)({color:"white",height:550}),e.SelectButton=Object(K.a)(v.a)({background:"#3dd900","&:hover":"#3dd900"}),e.columns=[{field:"name",headerName:"Profile Name",width:200},{field:"last_run",headerName:"Last Loaded",width:200,editable:!1},{field:"date_created",headerName:"Date Created",width:200,editable:!1}],e.state={profiles:[],activeItem:"",dialog:!1,forceLoadDialog:!1},e.componentDidMount=e.componentDidMount.bind(Object(l.a)(e)),e.loadClicked=e.loadClicked.bind(Object(l.a)(e)),e.forceLoadClicked=e.forceLoadClicked.bind(Object(l.a)(e)),e.handleItemClick=e.handleItemClick.bind(Object(l.a)(e)),e.handleDialogClose=e.handleDialogClose.bind(Object(l.a)(e)),e.downloadProfile=e.downloadProfile.bind(Object(l.a)(e)),e.fileChanged=e.fileChanged.bind(Object(l.a)(e)),e.handleForceDialogClose=e.handleForceDialogClose.bind(Object(l.a)(e)),e}return Object(s.a)(a,[{key:"handleItemClick",value:function(e){this.setState({activeItem:e.row}),this.setState({dialog:!0})}},{key:"handleDialogClose",value:function(){this.setState({dialog:!1})}},{key:"handleForceDialogClose",value:function(){this.setState({forceLoadDialog:!1})}},{key:"componentDidMount",value:function(){this.getData()}},{key:"getData",value:function(){var e=this;fetch("/api/reflow_profiles/all").then((function(e){return e.json()})).then((function(t){t.forEach((function(e){e.id=e.name,e.date_created=new Date(e.date_created).toLocaleString(),e.last_run=new Date(e.last_run).toLocaleString()})),e.setState({profiles:t})}))}},{key:"loadClicked",value:function(){var e=this;w.a.post("/api/reflow_profiles/load",{profile_name:this.state.activeItem.name,force_load:!1}).then((function(t){if(200===t.data.status){var a=e.props.history;a&&a.push("/")}else 409===t.data.status&&(console.log("got 409"),e.setState({forceLoadDialog:!0}))}))}},{key:"forceLoadClicked",value:function(){var e=this;w.a.post("/api/reflow_profiles/load",{profile_name:this.state.activeItem.name,force_load:!0}).then((function(t){if(200===t.data.status){var a=e.props.history;a&&a.push("/")}}))}},{key:"downloadProfile",value:function(){var e=new Blob([JSON.stringify(this.state.activeItem,null,3)],{type:"text/plain;charset=utf-8"});De.a.saveAs(e,this.state.activeItem.name+".json")}},{key:"fileChanged",value:function(e){var t=this;console.log(e.target.files[0]),w.a.post("/api/reflow_profiles/save",e.target.files[0]).then((function(e){t.getData()}))}},{key:"render",value:function(){return Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(q,{}),Object(O.jsxs)(le.a,{onClose:this.handleDialogClose,open:this.state.dialog,fullWidth:!0,maxWidth:"sm",children:[Object(O.jsxs)(de.a,{children:[this.state.activeItem.name,Object(O.jsx)(M.a,{"aria-label":"close",onClick:this.handleDialogClose,children:Object(O.jsx)(ye.a,{})})]}),Object(O.jsx)(je.a,{children:Object(O.jsx)(x,{draggable:!1,profile:this.state.activeItem,historicTemps:[]})}),Object(O.jsxs)(he.a,{children:[Object(O.jsx)(v.a,{startIcon:Object(O.jsx)(Ce.a,{}),variant:"contained",color:"primary",onClick:this.downloadProfile,children:"Download"}),Object(O.jsx)(v.a,{component:k.b,to:{pathname:"/editProfile",state:{profile:this.state.activeItem}},startIcon:Object(O.jsx)(m.a,{}),variant:"contained",color:"primary",children:"Edit Profile"}),Object(O.jsx)(this.SelectButton,{onClick:this.loadClicked,startIcon:Object(O.jsx)(fe.a,{}),variant:"contained",children:"Load"})]})]}),Object(O.jsxs)(le.a,{open:this.state.forceLoadDialog,children:[Object(O.jsx)(de.a,{children:"Oven Currently Running"}),Object(O.jsx)(je.a,{children:"Stop oven and load profile?"}),Object(O.jsxs)(he.a,{children:[Object(O.jsx)(v.a,{onClick:this.handleForceDialogClose,color:"primary",children:"Cancel"}),Object(O.jsx)(v.a,{onClick:this.forceLoadClicked,color:"primary",autoFocus:!0,children:"Force Load"})]})]}),Object(O.jsx)(g.a,{maxWidth:!1,children:Object(O.jsx)(C.a,{container:!0,direction:"row",align:"center",justifyContent:"center",spacing:2,children:Object(O.jsx)(C.a,{item:!0,xs:12,md:8,lg:6,children:Object(O.jsx)(this.MyDataGrid,{rows:this.state.profiles,columns:this.columns,pageSize:5,checkboxSelection:!1,disableMultipleSelection:!0,onRowClick:this.handleItemClick,autoHeight:!0})})})}),Object(O.jsx)(g.a,{maxWidth:!1,children:Object(O.jsxs)(C.a,{container:!0,spacing:3,alignItems:"center",justify:"center",children:[Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(v.a,{component:k.b,to:"/",startIcon:Object(O.jsx)(Oe.a,{}),variant:"contained",color:"primary",children:"Cancel"})}),Object(O.jsx)(C.a,{item:!0,children:Object(O.jsxs)(v.a,{startIcon:Object(O.jsx)(ve.a,{}),variant:"contained",color:"primary",component:"label",children:["Upload",Object(O.jsx)("input",{type:"file",accept:".json",hidden:!0,onChange:this.fileChanged})]})})]})})]})}}]),a}(n.Component),Se=Object(ue.f)(Pe),Ie=a(491),Le=(a(426),a(427),a(233)),_e=a.n(Le),Fe=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).componentDidMount=n.componentDidMount.bind(Object(l.a)(n)),n.saveProfile=n.saveProfile.bind(Object(l.a)(n)),n.handleInputChange=n.handleInputChange.bind(Object(l.a)(n)),n.goBack=n.goBack.bind(Object(l.a)(n)),n.loadClicked=n.loadClicked.bind(Object(l.a)(n)),n.forceLoadClicked=n.forceLoadClicked.bind(Object(l.a)(n)),n.cancelClicked=n.cancelClicked.bind(Object(l.a)(n)),n.state={loadDialog:!1,forceLoadDialog:!1,enterNameDialog:!1},n.newDatapoints=n.props.location.state.profile.datapoints,n.newName=n.props.location.state.profile.name,n}return Object(s.a)(a,[{key:"handleInputChange",value:function(e){this.newName=e.target.value}},{key:"componentDidMount",value:function(){}},{key:"goBack",value:function(){this.props.history.goBack()}},{key:"loadClicked",value:function(){var e=this;w.a.post("/api/reflow_profiles/load",{profile_name:this.newName,force_load:!1}).then((function(t){if(200===t.data.status){var a=e.props.history;a&&a.push("/")}else 409===t.data.status&&(e.setState({loadDialog:!1}),e.setState({forceLoadDialog:!0}))}))}},{key:"forceLoadClicked",value:function(){var e=this;w.a.post("/api/reflow_profiles/load",{profile_name:this.newName,force_load:!0}).then((function(t){if(200===t.data.status){var a=e.props.history;a&&a.push("/")}}))}},{key:"cancelClicked",value:function(){this.setState({loadDialog:!1,forceLoadDialog:!1,enterNameDialog:!1})}},{key:"saveProfile",value:function(){var e=this,t={};t.name=this.newName,t.date_created=Date.now(),t.last_run=0,t.datapoints=this.newDatapoints,w.a.post("/api/reflow_profiles/save",t).then((function(t){e.setState({loadDialog:!0})}))}},{key:"render",value:function(){return Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(q,{}),Object(O.jsxs)(le.a,{open:this.state.loadDialog,children:[Object(O.jsx)(de.a,{children:"Profile saved"}),Object(O.jsx)(je.a,{children:"Would you like to load the profile now?"}),Object(O.jsxs)(he.a,{children:[Object(O.jsx)(v.a,{onClick:this.cancelClicked,color:"primary",children:"Don't Load"}),Object(O.jsx)(v.a,{onClick:this.loadClicked,color:"primary",autoFocus:!0,children:"Load"})]})]}),Object(O.jsxs)(le.a,{open:this.state.forceLoadDialog,children:[Object(O.jsx)(de.a,{children:"Oven Currently Running"}),Object(O.jsx)(je.a,{children:"Stop oven and load profile?"}),Object(O.jsxs)(he.a,{children:[Object(O.jsx)(v.a,{onClick:this.cancelClicked,color:"primary",children:"Cancel"}),Object(O.jsx)(v.a,{onClick:this.forceLoadClicked,color:"primary",autoFocus:!0,children:"Force Load"})]})]}),Object(O.jsx)("div",{style:{paddingTop:"30px",width:"82%",margin:"0 auto"},children:Object(O.jsx)(x,{draggable:!0,profile:this.props.location.state.profile,arrayUpdater:this.newDatapoints})}),Object(O.jsx)(g.a,{maxWidth:!1,children:Object(O.jsxs)(C.a,{container:!0,spacing:3,alignItems:"center",justify:"center",children:[Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(v.a,{onClick:this.goBack,startIcon:Object(O.jsx)(Oe.a,{}),variant:"contained",color:"primary",children:"Cancel"})}),Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(v.a,{onClick:this.saveProfile,startIcon:Object(O.jsx)(_e.a,{}),variant:"contained",color:"primary",children:"Save"})}),Object(O.jsx)(C.a,{item:!0,children:Object(O.jsx)(Ie.a,{style:{color:"white"},onChange:this.handleInputChange,label:"Profile Name",defaultValue:this.newName})})]})})]})}}]),a}(n.Component),Me=Object(ue.f)(Fe),Ne=function(e){Object(d.a)(a,e);var t=Object(j.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).componentWillUnmount=n.componentWillUnmount.bind(Object(l.a)(n)),n}return Object(s.a)(a,[{key:"componentWillUnmount",value:function(){b.disconnect()}},{key:"render",value:function(){return Object(O.jsx)("div",{className:"App",children:Object(O.jsx)(k.a,{children:Object(O.jsx)(u.Provider,{value:b,children:Object(O.jsxs)(ue.c,{children:[Object(O.jsx)(ue.a,{exact:!0,path:"/",component:Q}),Object(O.jsx)(ue.a,{path:"/editProfile",component:Me}),Object(O.jsx)(ue.a,{path:"/profileList",component:Se}),Object(O.jsx)(ue.a,{path:"/settings",component:se})]})})})})}}]),a}(n.Component),We=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,500)).then((function(t){var a=t.getCLS,n=t.getFID,i=t.getFCP,c=t.getLCP,o=t.getTTFB;a(e),n(e),i(e),c(e),o(e)}))},Te=!1;"localhost"!==window.location.hostname&&"127.0.0.1"!==window.location.hostname&&""!==window.location.hostname||(Te=!0),o.a.render(Object(O.jsx)(i.a.StrictMode,{children:Object(O.jsx)(Ne,{isLocal:Te})}),document.getElementById("root")),We()}},[[428,1,2]]]);
//# sourceMappingURL=main.c4422cec.chunk.js.map