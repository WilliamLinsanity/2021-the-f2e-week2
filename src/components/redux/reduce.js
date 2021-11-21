const GET_BIKES_INFORMATION_LIST = 'GET_BIKES_INFORMATION_LIST';
const SET_CURRENT_STATION = 'SET_CURRENT_STATION';

const initState = {
  bikesInfoList: [],
  bikesAvailableList:[]
};

const reduce = (state = initState, action) => {
  switch (action.type) {
    case GET_BIKES_INFORMATION_LIST: {
      let arr = [];
      action.payload.bikesInfoList.forEach((item)=>{
         const idx = action.payload.bikesAvailableList.findIndex((element)=>element.StationUID === item.StationUID)
        if(idx !== -1){
          arr.push({...item,...action.payload.bikesAvailableList[idx]})
        }
      })
      return {
        ...state,
        stations: [
          ...arr
        ],
      };
    }
    case SET_CURRENT_STATION:{
      return{
        currentStationInfo: action.payload.currentStationInfo
      }
    }
    default:
      return state;
  }
};
export default reduce;