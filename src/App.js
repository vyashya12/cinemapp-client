import React, { useEffect, useState } from "react"
import Navbar from './partials/Navbar'
import {Routes, Route} from 'react-router-dom'
import Home from "./components/Home";
import Cinema from "./components/Cinema";
import Food from "./components/Food";
import Seats from "./components/Seats";
import Reservation from "./components/Reservation";
import Footer from "./partials/Footer";
import "./App.css"
require('dotenv').config()

function App() {
  // let styles = {
  //   backgroundImage: url("./images/bg-image.png")
  // }
  const [movieId, setMovieId] = useState(null)

  let userId = ""
  if(localStorage.hasOwnProperty('userData')) {
    let user = JSON.parse(localStorage.getItem('userData'))
    userId = user.sub
  }

  let getBooking = () => {
    fetch(`http://${process.env.REACT_APP_API_URL}/booking/`, {
        method: "GET",
        params: {
            id: userId
        }
    })
    .then(res => res.json())
    .then(data => {
        setMovieId(data[0].movieId)
    })
}

useEffect( () => {
  getBooking()
}, )

  return (
    <div className="App">
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cinema' element={<Cinema />} />
          {
            movieId ?
            <Route path='/seats' element={<Seats movieId={movieId} />} />
            : null
          }
          <Route path='/food' element={<Food />} />
          <Route path='/reservations' element={<Reservation />} />
        </Routes>

        <Footer />
    </div>
  );
}

export default App;