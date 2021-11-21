import React,{useEffect,useRef,useState} from 'react'
import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/dist/styles.min.css';
import L from "leaflet";
import "leaflet.markercluster";
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet'
import constants from '../constants';
import MarkerClusterGroup from "react-leaflet-markercluster";
import {useSelector} from 'react-redux'


const Map = () =>{
    // const [stationsList,getStationsList] = useState([])
    // const [hasLocation, setHasLocation] = useState(false)
    // const [nearbyLocationList, getNearbyLocationList] = useState([])
    const [currentLocation, setCurrentLocation] = useState([51.505, -0.09])
    let [markers, setMarkers] = useState(null);
    const zoom = 13
    const stations = useSelector(state => state.stations)
    const currentStationInfo = useSelector(state => state.currentStationInfo)
    const statusList = [{code:0, status:'停止營運'},{code:1, status:'正常營運'},{code:2, status:'暫停營運'}]
    const mapRef = useRef()   
    const popupRef = useRef() 
        // 定位
        useEffect(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position =>{
                    setCurrentLocation([position.coords.latitude, position.coords.longitude])
                }) 
            }
        }, []);

    const createClusterCustomIcon = function (cluster) {
        return L.divIcon({
          html: `<span>${cluster.getChildCount()}</span>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(40, 40, true),
        });
      }           

    // 取得目前位置後，在地圖上maker及取得附近1公里的自行車站點
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
         //把取得的站點資訊放入popup中  
        if(stations && stations.length){
            setMarkers(stations.map(item=>(
                <Marker position={[item.StationPosition.PositionLat,item.StationPosition.PositionLon]} icon={constants.spotIcon}  key={item.StationUID}>
                    <Popup ref={popupRef}>
                        <div className="station-name">{item.StationName.Zh_tw}</div>
                        <div className="station-address">{item.StationAddress.Zh_tw}</div>
                        <div className="station-updated-time">{item.UpdateTime.slice(0,-9).replace("T", " ")}</div>
                        <div className={'station-status' + (item.ServiceStatus === 2 ? "closed " : "") + (item.ServiceStatus === 0 ? 'stop ' : '')}>{statusList.find(element=>element.code === item.ServiceStatus).status}</div>
                        <div className="station-availability">
                            <div className="rent">
                                <div className="name">可借單車</div> 
                                <div className="number">{item.AvailableRentBikes}</div>
                            </div>
                            <div className="return">
                                <div className="name">可停空位</div>
                                <div className="number">{item.AvailableReturnBikes}</div>
                            </div>                                             
                        </div>
                    </Popup>
                </Marker>
            )))                 
        }
    }, [stations]);

    //根據搜尋結果移至目標位置
    useEffect(() => {
        if(mapRef && mapRef.current && stations && stations.length){
            mapRef.current.flyTo([stations[0].StationPosition.PositionLat,stations[0].StationPosition.PositionLon], 15) 
        }
    }, [markers,stations]);

    //根據點選的站點讓地圖移動到該點
    useEffect(() => {
        if(currentStationInfo){
            setMarkers(
                <Marker position={[currentStationInfo.StationPosition.PositionLat,currentStationInfo.StationPosition.PositionLon]} icon={constants.spotIcon}  key={currentStationInfo.StationUID}>
                    <Popup ref={popupRef} open={true}>
                        <div className="station-name">{currentStationInfo.StationName.Zh_tw}</div>
                        <div className="station-address">{currentStationInfo.StationAddress.Zh_tw}</div>
                        <div className="station-updated-time">{currentStationInfo.UpdateTime.slice(0,-9).replace("T", " ")}</div>
                        <div className={'station-status' + (currentStationInfo.ServiceStatus === 2 ? "closed " : "") + (currentStationInfo.ServiceStatus === 0 ? 'stop ' : '')}>{statusList.find(element=>element.code === currentStationInfo.ServiceStatus).status}</div>
                        <div className="station-availability">
                            <div className="rent">
                                <div className="name">可借單車</div> 
                                <div className="number">{currentStationInfo.AvailableRentBikes}</div>
                            </div>
                            <div className="return">
                                <div className="name">可停空位</div>
                                <div className="number">{currentStationInfo.AvailableReturnBikes}</div>
                            </div>                                             
                        </div>
                    </Popup>
                </Marker>                
            )
            popupRef.current.setLatLng([currentStationInfo.StationPosition.PositionLat,currentStationInfo.StationPosition.PositionLon])
            console.log(popupRef);
            // popupRef.current.leafletElement.openPopup()
        }
    }, [currentStationInfo]);

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