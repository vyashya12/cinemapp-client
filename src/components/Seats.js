import React, { useEffect, useState, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom'
import '../styles/seats.css'
function Seats({movieId}) {
    const [seats, setSeats] = useState([])
    let styles = {
        marginLeft: "180px"
    }

    let navigate = useNavigate()

    let getSeats = useCallback(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/seats/${movieId}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setSeats(data[0])
        })
    }, [movieId])
    
    useEffect( () => {
        getSeats()
    }, [getSeats])

    let styleseat = {
        backgroundColor: "black",
    }

    let user = null
    if(localStorage.hasOwnProperty('userData')) {
        user = JSON.parse(localStorage.getItem('userData'))
    } else {
        user = null
    }

   
    let seatHold = {
        seats: [],
        booked: 0
    }

    let pusher = (seatNum) => {
        seatHold.seats.push(seatNum)
        seatHold.booked = seatHold.seats.length
    }

    let seatHandler = () => {
        fetch(`http://${process.env.REACT_APP_API_URL}/booking/${user.sub}`, {
            method: "PUT",
            headers: {
                "x-auth-token": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(seatHold)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
            navigate('/food')
        })
    }
    

    let showSeats = seats.seats?.map(seat => {
        return(
            <a style={{cursor: "pointer", align: "center"}} onClick={(e) => pusher(seat.seatNumber)} key={seat.seatId}><img src="https://img.icons8.com/ultraviolet/30/000000/theatre-seat.png" id={seat.seatNumber} alt={seat.seatNumber} style={styleseat} /></a>
        )
    })

    let bottomSpace = {
        marginBottom: "20%"
    }

    return(
        <div className="parent" style={styles}>
            <Container style={bottomSpace}>
                <h1 style={{textAlign: "center", marginBottom: "20px"}}>Book Your Seats</h1>
                <div className="screen-side">
                    <div className="screen">Screen</div>
                    <h3 className="select-text">Please Select your Seats</h3>
                </div>
                <div className="seats">
                    <Row>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                        {
                            seats?
                            showSeats
                            : null
                        }
                        </div>
                    </Row>
                    <Button style={{display: "block", marginLeft: "50%", marginRight: "50%", marginTop: "30px"}} color="green" onClick={seatHandler}>Book</Button>
                </div>
            </Container>
        </div>
    )
}

export default Seats