import React, { useEffect, useState } from 'react'
import './App.css'
import Receptionist from './pages/Receptionist/Receptionist'
import NursePage from './pages/nurse/NursePage'
import '../src/pages/Allstyling.css'
import LabPage from './pages/laboratory/LabPage'
import DoctorPage from './pages/doctor/DoctorPage'
import PharmacyPage from './pages/pharmacy/PharmacyPage'
import Login from './Login'
import { toast, ToastContainer } from 'react-toastify'
// import { setUplistiners } from './socketClient
import  io from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { setips } from './features/ipSlice'
import chime from './img/chime.dat'
import { setreloads } from './features/reloadSlice'
import AdminPage from './pages/Admin/AdminPage'
import { useSelector } from 'react-redux'
import { selectip } from './features/ipSlice'
import Loader from './Loader'
import Connection from './Connection'
import Network from './Network'


function App({serverIP}) {
  //axios.defaults.withCredentials = true
  
  const ip = useSelector(selectip)
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    if (ip?.ip) {
      const newSocket = io(`http://localhost:7700`);
      setSocket(newSocket);      

      return () => newSocket.disconnect();
    }
  }, [ip, serverIP]);

  const staffID = sessionStorage.getItem('staffID')
  const getDep = JSON.parse(staffID)
  const dispatch = useDispatch()
  
  
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      alert(data.message);
    });

    socket.on("message", (data) => {
      const audio = new Audio(chime);
      audio.play();
      toast.warning(data);
      dispatch(setreloads({ msg: data }));
    });

    return () => {
      socket.off("message");
      socket.off("receive_message");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket || !getDep?.title) return;
    socket.emit("join_room", getDep.title);
  }, [socket, getDep]);

  const [ipLoaded, setIpLoaded] = useState(false);
  const [connection, setconnection] = useState(false);
  const [network, setnetwork] = useState(false);
  
  useEffect(() => {
    const getIP = async () => {
      let ip = null;
      try {
        // Try discovering the server via Bonjour first
        if (window.electronAPI?.getLocalIP) {
          ip = await window.electronAPI.getLocalIP();
          dispatch(setreloads({ msg: 'data' }));
          // console.log('Discovered Server IP:', ip);
          setnetwork(false)
        }

        // // Fallback to local IP if needed
        if (!ip && !window.electronAPI?.getLocalIP) {
          setnetwork(true)
        }

          if (ip) {
          dispatch(
            setips({
              ip
            })
          );
        } else {
          console.warn('No IP address found.');
          setconnection(true)
        }
      } catch (err) {
        console.error('IP discovery error:', err);
        setconnection(true)
      } finally {
        setIpLoaded(true);
        setconnection(false)
      }
    };

    getIP();
  }, [dispatch]);





  const [reload, setreload] = useState(0)
  const [login, setlogin] = useState('')

  useEffect(()=>{
    const func=()=>{
      setlogin(getDep)
      setreload(0)
    }
    func()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reload])

  const log = localStorage.getItem('log')
  const getvalues =JSON.parse(log)

  return (
    <>
      <ToastContainer/>
      { connection ?
        <Connection/>
        :
        !ipLoaded ?
          <Loader/>
        :
        getvalues?.set ?
          <AdminPage/> 
        : <Login/>
      }
    </>
  )
}

export default App