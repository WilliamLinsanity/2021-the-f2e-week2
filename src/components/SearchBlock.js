import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector  } from 'react-redux';
import styled from "@emotion/styled";
import { ReactComponent as Union } from '../assets/images/union.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';
import Select from 'react-select'
import jsSHA from 'jssha';

const SearchContainer = styled.div`
min-width: 350px;
background-color: #FFFFFF;
display: flex;
flex-direction: column;
padding:24px 24px 16px 24px;
`

const SearchWrapper = styled.div`
flex:0;
box-sizing: border-box;
box-shadow: 0px 0px 10px rgba(38, 38, 38, 0.25);
border-radius: 8px;
position: relative;
`

const SearchBar = styled.div`
background-color: #FFFFFF;
border-radius: 8px;
text-align: left;
font-weight: bold;
padding: 16px;
font-size: 32px;
color: #0A4259;

    .union {
        width: 24px;
        height: 24px;
        margin-left: 16px;
        & > path {
            fill: #0E5978;       
        }
    }
  
`
const SearchTop = styled.div`
width: 100%;
padding: 0;
background: #0E5978;
height: 24px;
border-radius: 8px 8px 0 0;
`

const SearchResult = styled.div`
flex:1;
margin-top: 6px;
padding: 0 24px;
box-sizing: border-box;
overflow-x: hidden;
overflow-y: scroll;
height: 80%;
`

const SearchResultItem = styled.div`
cursor: pointer;
background: #F6F6F6;
border-radius: 8px;
padding: 16px 8px;
margin: 6px 0;
`

const SerachInput = styled.input`
width: calc(100% - 48px);
height: 40px;
padding-left: 38px;
border-radius: 4px;
border: 1px solid #0E5978;
color: #676767;
font-size: 16px;
`
const SearchFooter = styled.div`
display: flex;
padding: 12px 24px 20px 24px;
`
const SearchCountyList = styled.div`
width: 100%;
margin-right: 12px;
`

const SearchBtn = styled.button`
width: 100%;
background-color: #0E5978;
color: #FFFFFF;
cursor: pointer;
`

const SearchPagination = styled.div`
position: sticky;
display: flex;
justify-content: center;
align-items: center;
margin:20px 0;
`

const Pagination = styled.div`
background: #F6F6F6;
border: 1px solid #A5A5A5;
font-size:14px;
padding: 10px 12px 9px; 
border-radius: 4px;
`

const CarouselArrowRight = styled.div`
border-radius: 50%;

    &:after{
        content: '';
        display: inline-block;
        margin-top: 0.8em;
        margin-left: 0.6em;
        width: 1em;
        height: 1em;
        border-top: 0.5em solid #cccccc;
        border-right: 0.5em solid #cccccc;
        transform: rotate(45deg);
        color:#cccccc;
    }
`

const CarouselArrowLeft = styled.div`
border-radius: 50%;

    &:after{
        content: '';
        display: inline-block;
        margin-top: 0.8em;
        margin-left: 0.6em;
        width: 1em;
        height: 1em;
        border-top: 0.5em solid #cccccc;
        border-right: 0.5em solid #cccccc;
        transform: rotate(-135deg);
        color:#cccccc;
    }
`

const SearchBlock = () =>{
    const dispatch = useDispatch()
    const [keyword, setKeyword] = useState('')
    const [bikesInfoList, getBikesInfoList] = useState([])
    const [bikesAvailableList, getBikeAvailableList] = useState([])
    const [selectedCounty, handleSelect] = useState({label:'?????????',value:'Taipei'})
    const [stationsList,getStationsList] = useState([])
    const [arrowNumber,handleArrow] = useState(0)
    const [isLeftArrowVisible,handleLeftArrowVisible] = useState(false)
    const [isRightArrowVisible,handleRightArrowVisible] = useState(true)
    const blockSelected = useRef('')
    const stations = useSelector(state => state.stations)

    const cityList =[
        {label:'?????????',value:'Taipei'},
        {label:'?????????',value:'NewTaipei'},
        {label:'?????????',value:'Taoyuan'},
        {label:'?????????',value:'MiaoliCounty'},
        {label:'?????????',value:'Hsinchu'},
        {label:'?????????',value:'Taichung'},
        {label:'?????????',value:'Tainan'},
        {label:'?????????',value:'Chiayi'},
        {label:'?????????',value:'Kaohsiung'},
        {label:'?????????',value:'PingtungCounty'},
        {label:'?????????',value:'KinmenCounty'},
    ]
    const statusList = [{code:0, status:'????????????'},{code:1, status:'????????????'},{code:2, status:'????????????'}]
    const ptxURL = 'https://ptx.transportdata.tw/MOTC/v2/Bike'
    
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

    const handleSearch = async () =>{
        // ????????????????????????????????????????????????
       await fetch(`${ptxURL}/Station/${selectedCounty.value}?$top=30&$filter=contains(StationName/Zh_tw,'${keyword}')&$format=JSON`,
        {
           headers: getAuthorizationHeader()
        }).then(res=>res.json())
        .then(function (response) {
            getBikesInfoList(response)          
        })
        .catch(function (error) {
            console.log(error);
        });

         // ??????????????????????????????(?????????????????????)
        fetch(`${ptxURL}/Availability/${selectedCounty.value}?$top=30&$format=JSON`,
        {
            headers: getAuthorizationHeader()
        }).then(res=>res.json())
        .then(function (response) {
            getBikeAvailableList(response)                             
        })
        .catch(function (error) {
            console.log(error);
        });            
    }

    // ??????????????????????????????state????????????components??????
    useEffect(() => {
        dispatch({
            type: 'GET_BIKES_INFORMATION_LIST',
            payload: { bikesInfoList, bikesAvailableList },
        });
    }, [bikesInfoList, bikesAvailableList, dispatch]);

    // ????????????????????????
    useEffect(() => {
        handleArrow(0)
    }, [stations]);

    useEffect(() => {        
        const splitArray =[]
        if(stations && stations.length){
            for(let i= 0, len= stations.length; i< len; i+=6){
                splitArray.push(stations.slice(i,i+6));
             }          
             getStationsList(splitArray)  
        }
    }, [stations]);

    // ????????????
    useEffect(() => {
        if(arrowNumber <= 0){
            handleLeftArrowVisible(false)
            handleRightArrowVisible(true)
        }else if(arrowNumber === stationsList.length -1){
            handleRightArrowVisible(false)
        }else{
            handleLeftArrowVisible(true)
            handleRightArrowVisible(true)
        }
    }, [arrowNumber,stations]);

    // ????????????
    const handleNumberChange = (value) =>{
        if(value + arrowNumber < stationsList.length){
            handleArrow(value + arrowNumber)
        } 
    } 

    const handleClick = (item) =>{
        dispatch({
            type: 'SET_CURRENT_STATION',
            payload: { currentStationInfo:item },
        });
    }

    return(
        <>
            <SearchContainer className="search-container">
                <SearchWrapper>
                    <SearchTop/>
                    <SearchBar>
                        ????????????<Union className="union"/>
                    </SearchBar>
                    <div className="search-input">    
                        <Search className="search"/>
                        <SerachInput defaultValue={keyword} placeholder="??????????????????" onChange={e => setKeyword(e.target.value)}>
                        </SerachInput>
                    </div>
                    <SearchFooter>
                        <SearchCountyList>
                            <Select options={cityList} defaultValue={cityList[0]}  onChange={e => handleSelect({label: e.label, value: e.value})}/>
                        </SearchCountyList>
                        <SearchBtn onClick={()=> handleSearch()}>
                            ??????
                        </SearchBtn>
                    </SearchFooter>
                </SearchWrapper>
                <SearchResult className={stationsList && stationsList.length?'':'display-none'}>   
                {
                    stationsList && stationsList.length && stationsList[arrowNumber].map(item=>{
                        return(
                            <SearchResultItem key={item.StationName.Zh_tw} onClick={()=> handleClick(item)}> 
                                <div className="station-name">{item.StationName.Zh_tw}</div>
                                <div className="search-station-address">{item.StationAddress.Zh_tw}</div>
                                <div className={'station-status' + (item.ServiceStatus === 2 ? "closed " : "") + (item.ServiceStatus === 0 ? 'stop ' : '')}>{statusList.find(element=>element.code === item.ServiceStatus).status}</div>
                            </SearchResultItem>
                        )
                    })
                }
                </SearchResult>
                <SearchPagination>
                    <CarouselArrowLeft isArrowVisible={true} ref={blockSelected} onClick={(event)=> handleNumberChange(-1)} 
                    style= {{display: isLeftArrowVisible ? 'inline-block':'none'}} className={stationsList && stationsList.length?'':'display-none'}/>
                    <Pagination className={stationsList && stationsList.length?'':'display-none'}>
                        {arrowNumber + 1}/ {stationsList.length}
                    </Pagination>
                    <CarouselArrowRight ref={blockSelected}  onClick={()=> handleNumberChange(1)}
                    style={{display: isRightArrowVisible && stationsList && stationsList.length ? 'inline-block':'none'}} className={stationsList && stationsList.length?'':'display-none'}/>
                </SearchPagination>
            </SearchContainer>
        </>
    )
}
export default SearchBlock;