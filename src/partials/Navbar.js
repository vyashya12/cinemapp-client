import React, { useState, useEffect, useRef} from 'react'
import { Icon, Menu, Sidebar, Image} from 'semantic-ui-react'
import axios from "axios"
import jwt_decode from 'jwt-decode'
import './Navbar.css'
import {Link, useNavigate} from 'react-router-dom'
require('dotenv').config()

// TODO: Update <Search> usage after its will be implemented

function Navbar() {
  const [gsiLoaded, setGsiLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const btnDivRef = useRef()
  const clientId = "162553669038-muoofacesll5s71p3mtvdfp421u29mre.apps.googleusercontent.com"
  let navigate = useNavigate()
  useEffect( () => {
    const handleGoogleSignIn = async res => {
      const decoded = jwt_decode(res.credential)
      let userData;
      if(decoded.sub === "114736766002906300609") {
        userData = {
          name: decoded.name,
          sub: decoded.sub,
          url: decoded.picture,
          isAdmin: true
        }
      } else {
        userData = {
          name: decoded.name,
          sub: decoded.sub,
          url: decoded.picture,
          isAdmin: false
        }
      }
      setUser(decoded)
      localStorage.setItem('userData', JSON.stringify(userData))

      const {data} = await axios.post(`http://${process.env.REACT_APP_API_URL}/login`, {credential:res.credential})
      setUser(data.payload)
      localStorage.setItem('token', data.token)
      window.location.reload()
    }

    const initializeGsi = () => {
      if(!window.google || gsiLoaded) return;
      setGsiLoaded(true)

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSignIn
      });
      window.google.accounts.id.renderButton(
        btnDivRef.current,
        { theme: "outlined", size: "medium" }  // customization attributes
      );
    }
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client"
    script.onload = initializeGsi
    script.async = true;
    script.id = "google-script"
    document.querySelector('head')?.appendChild(script)

    return () => {
      document.getElementById('google-script')?.remove()
      window.google?.accounts.id.cancel();
    }
  }, [gsiLoaded])

  const onSignOut = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    navigate('/')
    window.google.accounts.id.disableAutoSelect()
    window.location.reload()
  }

  let avatarItem = JSON.parse(localStorage.getItem('userData'))
    return(
        <div>
        {
            user || localStorage.hasOwnProperty('userData')?
            <>
            <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            vertical
            visible
            width='thin'
            >
              {
                localStorage.hasOwnProperty('userData') ?
              <Menu.Item disabled>
              <Image src={avatarItem.url} avatar />
              <p style={{"color": "white"}}>{avatarItem.name}</p>
              </Menu.Item>
              :
              null
              }
              <Menu.Item as={Link} to='/'>
                <Icon name='home' />
                Home
              </Menu.Item>
              <Menu.Item as={Link} to='/cinema'>
                <Icon name='location arrow' />
                Cinema
              </Menu.Item>
              <Menu.Item as={Link} to='/seats'>
                <Icon name='users' />
                Seats
              </Menu.Item>
              <Menu.Item as={Link} to='/food'>
                <Icon name='food' />
                Snacks
              </Menu.Item>
              <Menu.Item as={Link} to='/reservations'>
                <Icon name='ticket' />
                Reservations
              </Menu.Item>
              <Menu.Item onClick={onSignOut}>
                <Icon name='log out' />
                Sign Out
              </Menu.Item>
            </Sidebar>
            </>
            :
            <Menu attached='top' className='navbar'>
              <Menu.Item style={{color: "black"}} disabled>
                    Sign In First
                  </Menu.Item>
            <Menu.Menu position='right'>
                <div className='ui right aligned category search item'>
                <div className='ui transparent icon input'>
                </div>
                    <div id="buttonDiv" ref={btnDivRef}></div>
                </div>
            </Menu.Menu>
            </Menu>
        }
        </div>
    )
}

export default Navbar