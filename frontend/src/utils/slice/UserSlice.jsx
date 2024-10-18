import {createSlice} from "@reduxjs/toolkit"

const initialState={
   isAuthenticated:false,
   token:localStorage.getItem("authToken"),
   userInfo:null,
   loading:false,
   error:null,
}


const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        loginRequest:(state)=>{
            state.loading=true;
            state.error=null
        },
        loginSuccess:(state,action)=>{
            state.loading=false;
            state.token=action.payload.token;
            state.userInfo=action.payload.userInfo;
            state.isAuthenticated=true;

            localStorage.setItem("authToken",action.payload.token);
        },
        loginFailure:(state,action)=>{
            state.loading=false;
            state.error=true;
        },
        logout:(state)=>{
            state.isAuthenticated=false;
            state.token=null;
            state.userInfo=null;
            state.loading=false;
            state.error=null;

            localStorage.removeItem("authToken");
        }
    }

})

export const {loginRequest,loginSuccess,loginFailure,logout} = userSlice.actions;
export default userSlice.reducer;
