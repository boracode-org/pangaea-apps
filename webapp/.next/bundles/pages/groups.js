
          window.__NEXT_REGISTER_PAGE('/groups', function() {
            var comp = module.exports=webpackJsonp([7],{1019:function(e,t,n){e.exports=n(1020)},1020:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){return Number(Math.round(e+"e"+t)+"e-"+t)}function a(e){return(e.getHours()<10?"0":"")+e.getHours()+":"+(e.getMinutes()<10?"0":"")+e.getMinutes()}var l=n(157),i=(o(l),n(41)),u=o(i),s=n(23),c=o(s),d=n(5),f=o(d),p=n(19),h=o(p),m=n(7),g=o(m),w=n(8),v=o(w),k=n(29),y=o(k),E=n(48),b=o(E),x=n(37),C=o(x),M=n(133),I=o(M),G=function(e,t,n,o){var r,a=arguments.length,l=a<3?t:null===o?o=(0,I.default)(t,n):o;if("object"===("undefined"==typeof Reflect?"undefined":(0,C.default)(Reflect))&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(l=(a<3?r(l):a>3?r(t,n,l):r(t,n))||l);return a>3&&l&&(0,b.default)(t,n,l),l},_=function(e,t,n,o){return new(n||(n=y.default))(function(r,a){function l(e){try{u(o.next(e))}catch(e){a(e)}}function i(e){try{u(o.throw(e))}catch(e){a(e)}}function u(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(l,i)}u((o=o.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});var A=n(0),P=n(54),W=n(159),D=(n(193),n(112)),F=n(134),N=n(24),S=n(83),V=n(83),j=(V.Polyline,n(83)),O=n(72),T=n(291);t.round=r;var L=function(e){function t(){(0,f.default)(this,t);var e=(0,g.default)(this,(t.__proto__||(0,c.default)(t)).apply(this,arguments));return e.markers=[],e.onMarkerClick=function(t,n,o){console.log("marker clicked",{marker:n,props:t,e:o}),e.setState({selectedPlace:t,activeMarker:n,showingInfoWindow:!0})},e.state={activeMarker:null,selectedPlace:{name:"Cool",route:null},device:null,showingInfoWindow:!1},e.clearMarkers=function(){for(var t=0;t<e.markers.length;t++){var n=e.markers[t];try{n.setMap(null),window.google.maps.event.removeListener(n,"click")}catch(e){}}e.markers=new Array},e}return(0,v.default)(t,e),(0,h.default)(t,[{key:"onInfoWindowClose",value:function(){}},{key:"componentDidMount",value:function(){this.updateMap(this.props)}},{key:"updateMap",value:function(e){return _(this,void 0,void 0,u.default.mark(function t(){var n,o,r,l,i,s=this;return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.device,this.setState({device:n}),this.refs.map){t.next=4;break}return t.abrupt("return");case 4:o=N.findDOMNode(this.refs.map),console.log({device:n,mapref:o,refmap:this.refs.map}),r=this.refs.map.map,r.setCenter({lat:parseFloat(n.location.latitude),lng:parseFloat(n.location.longitude)}),this.clearMarkers(),l=n.routes,l.length>0?(i=l.map(function(e){return{lat:parseFloat(e.location.latitude),lng:parseFloat(e.location.longitude)}}),l.forEach(function(e){var t={position:{lat:parseFloat(e.location.latitude),lng:parseFloat(e.location.longitude)},route:e,map:r,label:a(new Date(e.createdAt)),animation:window.google.maps.Animation.DROP,name:"<b style='color:black;'>"+a(new Date(e.createdAt))+"</b>"},n=new window.google.maps.Marker(t);window.google.maps.event.addListener(n,"click",function(e){return s.onMarkerClick(t,n,e)}),s.markers.push(n)}),console.log({flightPlanCoordinates:i}),this.flightPath=new window.google.maps.Polyline({path:i,geodesic:!0,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:2}),this.flightPath.setMap(r)):this.flightPath.setMap(null);case 11:case"end":return t.stop()}},t,this)}))}},{key:"componentWillReceiveProps",value:function(e){this.updateMap(e)}},{key:"render",value:function(){var e=this.state.device;return e?A.createElement(j.default,{ref:"map",google:this.props.google,zoom:12,style:{width:"100%",height:600,bottom:0},initialCenter:{lat:e.latitude,lng:e.longitude}},A.createElement(S.Marker,{onClick:this.onMarkerClick,name:(e.vehicle_no||e.uuid)+" , "+e.address,title:e.address,position:{lat:e.location.latitude,lng:e.location.longitude}}),A.createElement(S.InfoWindow,{marker:this.state.activeMarker,visible:this.state.showingInfoWindow,onClose:this.onInfoWindowClose},A.createElement("div",null,A.createElement("h1",{dangerouslySetInnerHTML:{__html:this.state.selectedPlace.name}}),this.state.selectedPlace.route&&this.state.selectedPlace.route.photo?A.createElement("img",{style:{height:50,width:50},src:this.state.selectedPlace.route.photo.url}):null))):A.createElement("div",{style:{width:"100%",height:600,bottom:0}},"Loading Map...")}}]),t}(A.Component),R=(S.GoogleApiWrapper({apiKey:"AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"})(L),function(e){function t(){(0,f.default)(this,t);var e=(0,g.default)(this,(t.__proto__||(0,c.default)(t)).apply(this,arguments));return e.state={activeMarker:null,showingInfoWindow:!1,selectedPlace:{name:"Cool"}},e.onMarkerClick=function(t,n,o){e.setState({selectedPlace:t,activeMarker:n,showingInfoWindow:!0})},e}return(0,v.default)(t,e),(0,h.default)(t,[{key:"onInfoWindowClose",value:function(){alert("onInfoWindowClose")}},{key:"render",value:function(){var e=this,t=this.props.devices;return A.createElement(j.default,{google:this.props.google,zoom:12,style:{width:"100%",height:500},initialCenter:{lat:.347596,lng:32.58252}},t.map(function(t){return A.createElement(S.Marker,{name:(t.vehicle_no||t.uuid)+", "+t.address,onClick:e.onMarkerClick,title:"The marker`s title will appear as a tooltip.",position:{lat:t.location.latitude,lng:t.location.longitude}})}),A.createElement(S.InfoWindow,{marker:this.state.activeMarker,visible:this.state.showingInfoWindow,onClose:this.onInfoWindowClose},A.createElement("div",null,A.createElement("h1",null,this.state.selectedPlace.name))))}}]),t}(A.Component)),Y=(S.GoogleApiWrapper({apiKey:"AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"})(R),{uuid:null,updatedAt:null,vehicle_no:null,address:null,photo:{url:null},snapshotsEnabled:!1,objectId:null}),z=function(e){function t(){(0,f.default)(this,t);var e=(0,g.default)(this,(t.__proto__||(0,c.default)(t)).apply(this,arguments));return e.LIQ_API_KEY="9afb27b67fe07f",e.addYo=D.action(function(){e.props.app.appName+="YOOO TO MA"}),e.setCurrentGroup=function(t){return _(e,void 0,void 0,u.default.mark(function e(){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.setState({currentGroup:t,currentGroupName:t.name});case 1:case"end":return e.stop()}},e,this)}))},e.state={groups:[],currentRoute:{photo:{}},currentGroup:Y,currentGroupName:null},e.saveGroup=function(){return _(e,void 0,void 0,u.default.mark(function e(){var t,n,o;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.state,n=t.currentGroupName,o=t.currentGroup,!n){e.next=12;break}return e.prev=2,e.next=5,O.Database.saveGroup(o.objectId,n);case 5:return this.setState({currentGroup:Y}),e.next=8,this.getGroups();case 8:e.next=12;break;case 10:e.prev=10,e.t0=e.catch(2);case 12:case"end":return e.stop()}},e,this,[[2,10]])}))},e}return(0,v.default)(t,e),(0,h.default)(t,[{key:"getGroups",value:function(){return _(this,void 0,void 0,u.default.mark(function e(){var t;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O.Database.fetchGroups();case 2:t=e.sent,this.setState({groups:t});case 4:case"end":return e.stop()}},e,this)}))}},{key:"componentDidMount",value:function(){this.getGroups()}},{key:"render",value:function(){var e=this,t=this.state,n=(t.groups,t.currentGroup),o=t.currentGroupName;return A.createElement(P.View,null,A.createElement(P.View,{style:{flex:1,flexDirection:"row"}},A.createElement(P.View,{className:"",style:{height:30,flexDirection:"row",width:"60%",alignItems:"center",backgroundColor:"black",padding:5}},A.createElement(P.View,{style:{flex:1.5,color:"white"}},A.createElement(P.Text,null,"Group ID")),A.createElement(P.View,{style:{flex:1,color:"white"}},A.createElement(P.Text,null,"Name")),A.createElement(P.View,{style:{flex:1,color:"white"}},A.createElement(P.Text,null,"Last Updated"))),A.createElement(P.View,{className:"",style:{height:30,flexDirection:"row",width:"60%",alignItems:"center",backgroundColor:"darkblue",padding:5}},A.createElement(P.View,{style:{flex:1.5,color:"white"}},A.createElement(P.Text,null,"Group Information")))),A.createElement(P.View,{className:"container-fluid",style:{height:"auto",overflow:"hidden",padding:2,flex:.5,flexDirection:"row"}},A.createElement(P.View,{className:"col-md-8",style:{flex:.6}},A.createElement(P.View,{style:{float:"none",width:"auto",overflow:"scroll",height:"90%",backgroundColor:"#FAFAFA"}},A.createElement(P.ScrollView,{style:{flex:1,width:"100%",height:800}},this.state.groups.map(function(t){return A.createElement(P.View,{key:t.objectId,style:{backgroundColor:t.objectId==n.objectId?"lightgray":"",flexDirection:"row",flex:1,margin:2,justifyContent:"space-between"},onClick:function(){return e.setCurrentGroup(t)}},A.createElement("th",{scope:"row",style:{textAlign:"left",flex:1.5}},t.objectId),A.createElement("th",{scope:"row",style:{textAlign:"left",flex:1.5}},t.name),A.createElement("td",{style:{textAlign:"left",flex:1}},new Date(t.updatedAt).toLocaleString()))}),A.createElement(T.Button,{color:"green",content:"New Group",size:"small",onClick:function(){return e.setCurrentGroup({updatedAt:new Date,name:"New Group"})}})))),n&&n.updatedAt?A.createElement(P.View,{style:{backgroundColor:"#EFEFEF",flex:.4}},A.createElement(P.Text,null,A.createElement(T.Segment,null,A.createElement(T.Form,null,A.createElement("legend",null,"Edit Group"),A.createElement(T.Form.Field,null,A.createElement("label",null,"name"),A.createElement("input",{value:o,onChange:function(t){return e.setState({currentGroupName:t.target.value})}})),A.createElement(T.Button,{disabled:!o,primary:!0,type:"submit",content:"Save",onClick:this.saveGroup}))))):null))}}]),t}(A.Component);z=G([F.observer],z),t.default=F.observer(W.ComposedComponent(z))}},[1019]);
            return { page: comp.default }
          })
        