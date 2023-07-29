const initialState = {
  loading: false,
  totalSupply: 0,
  getTotalTicketCount: 0,
  tokenURI: "",
  cost: 0,
  error: false,
  errorMsg: "",
  getCredit: 0,
  xNFT: 0,
  getDataByMap: "",
  getWinAdd: "",
  getPlayerByMap: 0,
  getDataWin: "",


};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        getTotalTicketCount: action.payload.getTotalTicketCount,
        tokenURI: action.payload.tokenURI,
        getCredit: action.payload.getCredit,
        xNFT: action.payload.xNFT,
        getDataByMap: action.payload.getDataByMap,
        getWinAdd: action.payload.getWinAdd,
    
        
 
        // cost: action.payload.cost,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
