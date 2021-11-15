import React,{useEffect, useState} from 'react'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jsSHA from 'jssha';
import "leaflet.markercluster";

const Map = () =>{
    const [stationsList,getStationsList] = useState([])
    // let mymap = useRef(null)
    // const mymap = L.map("mapId").setView([25.03418, 121.564517], 17);

    // const OSMUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    // const customIcon = (color) =>{
    //     return L.icon({
    //       ...settings.icon,
    //       iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    //     });
    //   }
    const handleSearch = ()=>{
        fetch('https://ptx.transportdata.tw/MOTC/v2/Bike/Station/Taichung?$top=30&$format=JSON',
        {
           headers: getAuthorizationHeader()
        }).then(res=>res.json())
        .then(function (response) {
            getStationsList(response)
        })
        .catch(function (error) {
          console.log(error);
        });     
    }

    const handleCustomIcon = (markers, feature, latLng) =>{
        // let prop = feature.properties;
        // let range = prop.mask_adult + prop.mask_child;
        let rangeIcon = this.icons.green;
        
        markers.addLayer(
          L.marker(latLng, { icon: rangeIcon })
        );
  
        return markers;
      }

    const getAuthorizationHeader = () =>{
        const AppID = '675dad84079841b3a881006714b3d91e'
        const AppKey= 'D0MV31l-dasLMnv5qe9Ly56Rm6Y'       
        let GMTString = new Date().toGMTString();
        let ShaObj = new jsSHA('SHA-1', 'TEXT');
        ShaObj.setHMACKey(AppKey, 'TEXT');
        ShaObj.update('x-date: ' + GMTString);
        let HMAC = ShaObj.getHMAC('B64');
        let Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';
        return { 'Authorization': Authorization, 'X-Date': GMTString }; 
    }
    useEffect(() => {
        handleSearch()

    }, []);
    useEffect(() => {
        
       
        const mymap = L.map("mapId").setView([25.03418, 121.564517], 17);

        const OSMUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    
        L.tileLayer(OSMUrl).addTo(mymap);
    
        // 使用 leaflet-color-markers ( https://github.com/pointhi/leaflet-color-markers ) 當作 marker
        // const greenIcon = new L.Icon({
        //   iconUrl:
        //     "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        //   shadowUrl:
        //     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        //   iconSize: [25, 41],
        //   iconAnchor: [12, 41],
        //   popupAnchor: [1, -34],
        //   shadowSize: [41, 41]
        // });
    
        // const marker = L.marker([25.03418, 121.564517], { icon: greenIcon }).addTo(
        //   mymap
        // );
     
    
        const marker = new L.MarkerClusterGroup().addTo(mymap);
  
        // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        for (let i = 0; stationsList.length > i; i++) {
            handleCustomIcon(marker,stationsList[i], [
                stationsList[i].StationPosition.PositionLon,
                stationsList[i].StationPosition.PositionLat,
            ]);
          }
        // L.circle([25.03418, 121.564517], {
        //   color: "red",
        //   fillColor: "#f03",
        //   fillOpacity: 0.5,
        //   radius: 10
        // }).addTo(mymap);
        console.log(stationsList);
    },[stationsList])
    useEffect(() => {
        // handleSearch()
        //  mymap.current = L.map("mapId").setView([25.03418, 121.564517], 17);

        // const OSMUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        // L.tileLayer(OSMUrl).addTo(mymap.current);
        // // let markers = new L.MarkerClusterGroup().addTo(mymap.current);
       
       
    }, [stationsList]);
    return(
        <div id="mapId" style={{ height: "100vh", width: "100vw" }} />
    );
}
export default Map;