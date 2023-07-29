// log
import store from "../store";
const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (tokenId) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      const smartContract = store.getState().blockchain.smartContract;
      const bcacc =  store.getState().blockchain.account;
      if (smartContract !== null) {
        let totalSupply = await smartContract.methods.totalSupply().call();
        let getTotalTicketCount = await smartContract.methods.getTotalTicketCount().call();
        let tokenURI = await smartContract.methods.tokenURI(tokenId).call();
        let getDataByMap = await smartContract.methods.getPlayerAddress(tokenId).call();
        let getCredit = await smartContract.methods.getCreditAmount(bcacc).call();
        let getWinAdd = await smartContract.methods.getWinnersByMapId(tokenId).call();
        let getBalance = await smartContract.methods.getBalance(bcacc).call();
       
        if (tokenURI !== null) {
          dispatch(
            fetchDataSuccess({
              totalSupply,
              getTotalTicketCount,
              tokenURI,
              getDataByMap,
              getCredit,
              getWinAdd,
              getBalance,
      
            })
          );
        } else {
          dispatch(fetchDataFailed("Token URI is null."));
        }
      } else {
        dispatch(fetchDataFailed("Smart contract instance is null."));
      }
    } catch (err) {
      
    }
  };
};
