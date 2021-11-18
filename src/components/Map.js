import React,{useEffect,useRef,useState} from 'react'
import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/dist/styles.min.css';
import L from "leaflet";
import jsSHA from 'jssha';
import "leaflet.markercluster";
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet'
import constants from '../constants';
import MarkerClusterGroup from "react-leaflet-markercluster";

const Map = () =>{
    const [stationsList,getStationsList] = useState([])
    const [zoom, setZoom] = useState(13)
    const [hasLocation, setHasLocation] = useState(false)
    const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]);
    let [markers, setMarkers] = useState(null);
    const mapRef = useRef()    
        useEffect(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position =>{
                        setCurrentLocation([position.coords.latitude, position.coords.longitude])                                      
                    })
            }
        }, []);

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
    const createClusterCustomIcon = function (cluster) {
        return L.divIcon({
          html: `<span>${cluster.getChildCount()}</span>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(40, 40, true),
        });
      }
    useEffect(() => {
        // 一開始的搜尋
        fetch('https://ptx.transportdata.tw/MOTC/v2/Bike/Station/Taoyuan?$top=100&$format=JSON',
        {
           headers: getAuthorizationHeader()
        }).then(res=>res.json())
        .then(function (response) {
            getStationsList(response)
        })
        .catch(function (error) {
          console.log(error);
        }); 
        // fetch(`https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$top=30&$spatialFilter=nearby(${currentLocation}%2C%20100)&$format=JSON`,
        // {
        //    headers: getAuthorizationHeader()
        // }).then(res=>res.json())
        // .then(function (response) {
            
        //     console.log(response.data);
        // })
        // .catch(function (error) {
        //   console.log(error);
        // }); 

    }, [currentLocation]);     

    
    useEffect(() => {
        if(mapRef.current){
            mapRef.current.setView(
                currentLocation,
                zoom
              );
              const userMarker = L.marker(currentLocation, {
                icon:constants.positionIcon,
              });
              mapRef.current.addLayer(userMarker);
        }
    }, [currentLocation,zoom]);

    useEffect(() => {              
        setMarkers(stationsList.map(item=>(
              <Marker position={[item.StationPosition.PositionLat,item.StationPosition.PositionLon]} icon={constants.spotIcon}  key={item.StationUID}>
                <Popup>You are here</Popup>
              </Marker>
            )))           
    }, [hasLocation,stationsList]);
    return(
        <MapContainer className="map markercluster-map" ref={mapRef} useFlyTo={true} zoom={zoom} center={currentLocation} scrollWheelZoom whenCreated={mapInstance => { mapRef.current = mapInstance }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                {markers}    
            </MarkerClusterGroup>   
        </MapContainer>
    );
}
export default Map;