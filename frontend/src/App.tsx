// import { useState } from 'react'
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet } from "react-router";
import "./App.css";
import {  useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/Store/Store'
import { login, logout } from "./Store/AuthSlice";
import { getCurrentUser } from "./api/index.ts";


function App() {
const dispatch = useAppDispatch();
const [loading,setloading] = useState(true)
const userdata = useAppSelector((state)=>state.Auth.user) 
console.log("Authstatus in app", userdata);
// const Experience = userid.Experience
useEffect(() => {
  getCurrentUser()
    .then((res) => {
      console.log(res);
      if(res){
         dispatch(login(res.data.data));
        }
        else{
          dispatch(logout())
        }
      })
      .catch((err) => {
        console.log(`error while fetching user ${err}`);
    }).finally(()=>setloading(false))
}, []);


  return ( !loading?
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
    </div>:<h1>Loading...</h1>
  );
}

export default App;