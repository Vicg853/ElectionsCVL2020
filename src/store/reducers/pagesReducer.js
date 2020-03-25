const initialState = {
    Active_Election_ID: "",
    Active_Election_Name: "",
    Active_Election_EndDate: "",
    Active_Election_IMG_URL: "",
    Active_Election_Number_Of_Votes: 0,
};

export const pagesReducer = (state = initialState, action) => {
    switch(action.type){
        case "SET_ELECTION_INFO": return {...state, 
            Active_Election_ID: action.ElectionIDValue ,
            Active_Election_Name: action.ElectionNameValue,
            Active_Election_EndDate: action.ElectionEndDateValue,
            Active_Election_IMG_URL: action.ElectionImgURLValue,
            Active_Election_Number_Of_Votes: action.ElectionNumberOfVotesValue};
        default: return state;
    }
};