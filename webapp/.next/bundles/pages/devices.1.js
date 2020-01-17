
          window.__NEXT_REGISTER_PAGE('/devices.1', function() {
            var comp = module.exports=webpackJsonp([9],{764:function(e,t,n){e.exports=n(765)},765:function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Number(Math.round(e+"e"+t)+"e-"+t)}function a(e){return(e.getHours()<10?"0":"")+e.getHours()+":"+(e.getMinutes()<10?"0":"")+e.getMinutes()}function r(e){var t=e.currentDevice,n=e.devices,l=e.currentRoute,o=e.changeRoute,a=e.toggleSnapshots,r=e.updateVehicleName;return S.createElement(V.View,{style:{backgroundColor:"#EFEFEF",flex:.4}},t.uuid?S.createElement(V.View,null,S.createElement(V.View,{style:{backgroundColor:"#EFEFEF",flex:1,flexDirection:"row"}},S.createElement(V.View,{style:{flex:1,padding:5}},S.createElement("b",null,"Device:"),S.createElement("p",null,t.uuid),S.createElement("b",null,"Vehicle:"),S.createElement("p",null,S.createElement(P.default,{activeClassName:"editing",text:t.vehicle_no,paramName:"message",onSelect:function(){},change:function(e){r(e.message)},style:{backgroundColor:"gray",color:"white",display:"inline-block",margin:0,padding:10,fontSize:15,outline:0,border:0}})),S.createElement("b",null,"Last Address:"),S.createElement("p",null,t.address),S.createElement("b",null,"Latest Snap: "),t.photo?S.createElement("p",null,S.createElement("img",{style:{width:100,height:100},src:t.photo.url}),S.createElement("p",null,new Date(t.updatedAt).toTimeString())):null,S.createElement("p",null,S.createElement("b",null,"Toggle Snapshots:"),S.createElement("p",{style:{width:50,height:20,backgroundColor:t.snapshotsEnabled?"green":"red",borderBottomLeftRadius:5,borderTopRightRadius:5,borderBottomRightRadius:5,borderTopLeftRadius:5,padding:5,color:"white",textAlign:"center",cursor:"pointer"},onClick:a},t.snapshotsEnabled?"ON":"OFF"))),S.createElement(V.View,{style:{flex:1,borderLeftStyle:"solid",borderLeftWidth:2,padding:5}},S.createElement(V.Text,null,S.createElement("p",null,S.createElement("b",null,"Movement & Snapshots"))),S.createElement("p",null,S.createElement("select",{onChange:function(e){return o(JSON.parse(e.target.value))},value:l.objectId},S.createElement("option",null," -- Select -- "),t.routes.map(function(e){return S.createElement("option",{value:(0,c.default)(e)},new Date(e.createdAt).toTimeString())}),";")),S.createElement("b",null,"Location: "),S.createElement(V.Text,null,l.actualLocation," "),S.createElement("img",{src:l&&l.photo?l.photo.url:"",style:{width:"100%"}}))),S.createElement(V.View,{style:{flex:1}},S.createElement(z,{device:t}))):S.createElement("div",{style:{backgroundColor:"#EFEFEF"}},S.createElement(V.Text,null,"ALL DEVICES -- Last Location"),S.createElement(q,{devices:n})))}var i=n(157),c=l(i),s=n(41),u=l(s),d=n(23),f=l(d),h=n(5),p=l(h),m=n(19),g=l(m),v=n(7),w=l(v),E=n(8),k=l(E),y=n(29),b=l(y),x=n(48),C=l(x),D=n(37),M=l(D),I=n(133),_=l(I),A=function(e,t,n,l){var o,a=arguments.length,r=a<3?t:null===l?l=(0,_.default)(t,n):l;if("object"===("undefined"==typeof Reflect?"undefined":(0,M.default)(Reflect))&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,l);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(r=(a<3?o(r):a>3?o(t,n,r):o(t,n))||r);return a>3&&r&&(0,C.default)(t,n,r),r},F=function(e,t,n,l){return new(n||(n=b.default))(function(o,a){function r(e){try{c(l.next(e))}catch(e){a(e)}}function i(e){try{c(l.throw(e))}catch(e){a(e)}}function c(e){e.done?o(e.value):new n(function(t){t(e.value)}).then(r,i)}c((l=l.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});var S=n(0),V=n(54),L=n(159),P=n(193),W=n(112),R=n(134),T=n(24),N=n(83),j=n(83),O=(j.Polyline,n(83)),Y=n(72);t.round=o;var K=function(e){function t(){(0,p.default)(this,t);var e=(0,w.default)(this,(t.__proto__||(0,f.default)(t)).apply(this,arguments));return e.markers=[],e.onMarkerClick=function(t,n,l){console.log("marker clicked",{marker:n,props:t,e:l}),e.setState({selectedPlace:t,activeMarker:n,showingInfoWindow:!0})},e.state={activeMarker:null,selectedPlace:{name:"Cool",route:null},device:null,showingInfoWindow:!1},e.clearMarkers=function(){for(var t=0;t<e.markers.length;t++){var n=e.markers[t];try{n.setMap(null),window.google.maps.event.removeListener(n,"click")}catch(e){}}e.markers=new Array},e}return(0,k.default)(t,e),(0,g.default)(t,[{key:"onInfoWindowClose",value:function(){}},{key:"componentDidMount",value:function(){this.updateMap(this.props)}},{key:"updateMap",value:function(e){return F(this,void 0,void 0,u.default.mark(function t(){var n,l,o,r,i,c=this;return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.device,this.setState({device:n}),this.refs.map){t.next=4;break}return t.abrupt("return");case 4:l=T.findDOMNode(this.refs.map),console.log({device:n,mapref:l,refmap:this.refs.map}),o=this.refs.map.map,o.setCenter({lat:parseFloat(n.location.latitude),lng:parseFloat(n.location.longitude)}),this.clearMarkers(),r=n.routes,r.length>0?(i=r.map(function(e){return{lat:parseFloat(e.location.latitude),lng:parseFloat(e.location.longitude)}}),r.forEach(function(e){var t={position:{lat:parseFloat(e.location.latitude),lng:parseFloat(e.location.longitude)},route:e,map:o,label:a(new Date(e.createdAt)),animation:window.google.maps.Animation.DROP,name:"<b style='color:black;'>"+a(new Date(e.createdAt))+"</b>"},n=new window.google.maps.Marker(t);window.google.maps.event.addListener(n,"click",function(e){return c.onMarkerClick(t,n,e)}),c.markers.push(n)}),console.log({flightPlanCoordinates:i}),this.flightPath=new window.google.maps.Polyline({path:i,geodesic:!0,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:2}),this.flightPath.setMap(o)):this.flightPath.setMap(null);case 11:case"end":return t.stop()}},t,this)}))}},{key:"componentWillReceiveProps",value:function(e){this.updateMap(e)}},{key:"render",value:function(){var e=this.state.device;return e?S.createElement(O.default,{ref:"map",google:this.props.google,zoom:12,style:{width:"100%",height:600,bottom:0},initialCenter:{lat:e.latitude,lng:e.longitude}},S.createElement(N.Marker,{onClick:this.onMarkerClick,name:(e.vehicle_no||e.uuid)+" , "+e.address,title:e.address,position:{lat:e.location.latitude,lng:e.location.longitude}}),S.createElement(N.InfoWindow,{marker:this.state.activeMarker,visible:this.state.showingInfoWindow,onClose:this.onInfoWindowClose},S.createElement("div",null,S.createElement("h1",{dangerouslySetInnerHTML:{__html:this.state.selectedPlace.name}}),this.state.selectedPlace.route&&this.state.selectedPlace.route.photo?S.createElement("img",{style:{height:50,width:50},src:this.state.selectedPlace.route.photo.url}):null))):S.createElement("div",{style:{width:"100%",height:600,bottom:0}},"Loading Map...")}}]),t}(S.Component),z=N.GoogleApiWrapper({apiKey:"AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"})(K),Q=function(e){function t(){(0,p.default)(this,t);var e=(0,w.default)(this,(t.__proto__||(0,f.default)(t)).apply(this,arguments));return e.state={activeMarker:null,showingInfoWindow:!1,selectedPlace:{name:"Cool"}},e.onMarkerClick=function(t,n,l){e.setState({selectedPlace:t,activeMarker:n,showingInfoWindow:!0})},e}return(0,k.default)(t,e),(0,g.default)(t,[{key:"onInfoWindowClose",value:function(){alert("onInfoWindowClose")}},{key:"render",value:function(){var e=this,t=this.props.devices;return S.createElement(O.default,{google:this.props.google,zoom:12,style:{width:"100%",height:500},initialCenter:{lat:.347596,lng:32.58252}},t.map(function(t){return S.createElement(N.Marker,{name:(t.vehicle_no||t.uuid)+", "+t.address,onClick:e.onMarkerClick,title:"The marker`s title will appear as a tooltip.",position:{lat:t.location.latitude,lng:t.location.longitude}})}),S.createElement(N.InfoWindow,{marker:this.state.activeMarker,visible:this.state.showingInfoWindow,onClose:this.onInfoWindowClose},S.createElement("div",null,S.createElement("h1",null,this.state.selectedPlace.name))))}}]),t}(S.Component),q=N.GoogleApiWrapper({apiKey:"AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"})(Q),G=function(e){function t(){(0,p.default)(this,t);var e=(0,w.default)(this,(t.__proto__||(0,f.default)(t)).apply(this,arguments));return e.LIQ_API_KEY="9afb27b67fe07f",e.addYo=W.action(function(){e.props.app.appName+="YOOO TO MA"}),e.setCurrentDevice=function(t){return F(e,void 0,void 0,u.default.mark(function e(){var n,l,o=this;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log({device:t}),t.routes){e.next=5;break}return e.next=4,Y.Database.getRouteToday(t.objectId);case 4:t.routes=e.sent;case 5:n=new window.google.maps.Geocoder,console.log({geocoder:n}),l={lat:parseFloat(t.latitude),lng:parseFloat(t.longitude)},t.address?this.setState({currentDevice:t}):n.geocode({location:l},function(e,n){t.address=e[0]?e[0].formatted_address:"",o.setState({currentDevice:t})});case 9:case"end":return e.stop()}},e,this)}))},e.state={devices:[],currentRoute:{photo:{}},currentDevice:{uuid:null,updatedAt:null,vehicle_no:null,address:null,photo:{url:null},snapshotsEnabled:!1,objectId:null}},e}return(0,k.default)(t,e),(0,g.default)(t,[{key:"getDevices",value:function(){return F(this,void 0,void 0,u.default.mark(function e(){var t;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Y.Database.fetchDevices();case 2:t=e.sent,this.setState({devices:t});case 4:case"end":return e.stop()}},e,this)}))}},{key:"componentDidMount",value:function(){this.getDevices()}},{key:"render",value:function(){var e=this,t=this.state,n=t.devices,l=t.currentDevice;return S.createElement(V.View,null,S.createElement(V.View,{style:{flex:1,flexDirection:"row"}},S.createElement(V.View,{className:"",style:{height:30,flexDirection:"row",width:"60%",alignItems:"center",backgroundColor:"black",padding:5}},S.createElement(V.View,{style:{flex:1.5,color:"white"}},S.createElement(V.Text,null,"Device ID")),S.createElement(V.View,{style:{flex:1,color:"white"}},S.createElement(V.Text,null,"Last Online")),S.createElement(V.View,{style:{flex:.5,color:"white"}},S.createElement(V.Text,null,"Vehicle")),S.createElement(V.View,{style:{flex:1,color:"white"}},S.createElement(V.Text,null," Last Location (Lng,Lat)"))),S.createElement(V.View,{className:"",style:{height:30,flexDirection:"row",width:"60%",alignItems:"center",backgroundColor:"darkblue",padding:5}},S.createElement(V.View,{style:{flex:1.5,color:"white"}},S.createElement(V.Text,null,"Device Information")))),S.createElement(V.View,{className:"container-fluid",style:{height:"auto",overflow:"hidden",padding:2,flex:.5,flexDirection:"row"}},S.createElement(V.View,{className:"col-md-8",style:{flex:.6}},S.createElement(V.View,{style:{float:"none",width:"auto",overflow:"scroll",height:"90%",backgroundColor:"#FAFAFA"}},S.createElement(V.ScrollView,{style:{flex:1,width:"100%",height:800}},this.state.devices.map(function(t){return S.createElement(V.View,{key:t.uuid,style:{backgroundColor:t.uuid==l.uuid?"lightgray":"",flexDirection:"row",flex:1,margin:2,justifyContent:"space-between"},onClick:function(){return e.setCurrentDevice(t)}},S.createElement("th",{scope:"row",style:{textAlign:"left",flex:1.5}},t.uuid),S.createElement("td",{style:{textAlign:"left",flex:1}},new Date(t.updatedAt).toLocaleString()),S.createElement("td",{style:{textAlign:"center",flex:.5,backgroundColor:"darkgreen",color:"white",borderRadius:15,height:30,padding:5}},t.vehicle_no),S.createElement("td",{style:{textAlign:"center",flex:1}},o(t.location.longitude,2),",",o(t.location.latitude,2)),S.createElement("td",null))})))),S.createElement(r,{currentDevice:l,devices:n,currentRoute:this.state.currentRoute,updateVehicleName:function(t){var n=e.state.currentDevice;n.vehicle_no=t,Y.Database.setVehicle(n.objectId,t),e.setCurrentDevice(n)},toggleSnapshots:function(){var t=e.state.currentDevice;t.snapshotsEnabled=!t.snapshotsEnabled,Y.Database.setSnaphots(t.objectId,t.snapshotsEnabled),e.setCurrentDevice(t)},changeRoute:function(t){return F(e,void 0,void 0,u.default.mark(function e(){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://locationiq.org/v1/reverse.php?format=json&key="+this.LIQ_API_KEY+"&lat="+t.location.latitude+"&lon="+t.location.longitude).then(function(e){return e.json()});case 2:n=e.sent,t.actualLocation=n.display_name,this.setState({currentRoute:t});case 5:case"end":return e.stop()}},e,this)}))}})))}}]),t}(S.Component);G=A([R.observer],G),t.default=R.observer(L.ComposedComponent(G))}},[764]);
            return { page: comp.default }
          })
        