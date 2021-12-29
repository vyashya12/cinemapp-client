import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form} from 'semantic-ui-react'
import Swal from 'sweetalert2'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

function Cinema() {
    const [cinema, setCinema] = useState()
    const [currentPosition, setCurrentPosition] = useState({})
    const [, setMarkers] = useState([])
    const [locations, setLocations] = useState([])
    let mapStyles = {
        height: "100vh",
        width: "80vw"
    }
    


    const getPosition = position => {
        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition)
    }

    let getLocation = () => {
        fetch(`https://${process.env.REACT_APP_API_URL}/cinema`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setLocations(data)
        })
    }

    useEffect( () => {
        navigator.geolocation.getCurrentPosition(getPosition)
        getLocation()
    }, [])

    // console.log(location)

    

    const onClickHandler = (e) => {
        setMarkers( current => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date()
            }
        ])
    }

    const onDragEndMarker = (e) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setCurrentPosition({lat, lng})
    }

    let onChangeHandler = (e) => {
        setCinema({...cinema, [e.target.name]: e.target.value})
    }

    let onSubmitHandler = (e) => {
        e.preventDefault()
        fetch(`https://${process.env.REACT_APP_API_URL}/cinema/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify(cinema)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
        })
    }

    let styles = {
        "marginLeft": "180px"
    }

    let admin = JSON.parse(localStorage.getItem('userData'))
    return(
        <div style={styles}>
            <h1 style={{textAlign: "center"}}>Nearest Cinema</h1>
            {
                admin.isAdmin ?
                <>
                <h1>Add A Cinema</h1>
                <Form onSubmit={onSubmitHandler}>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder="Name" name="name" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Longitude</label>
                        <input placeholder="Longitude" name='longitude' onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Latitude</label>
                        <input placeholder="Latitude" name="latitude" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Room</label>
                        <input type='number' placeholder="Room" name="room" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox label='Hitting Submit will publish the Cinema' />
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                </Form>
                </>
                :
                null
            }
            {/* AIzaSyByaLmiGQbQefsxhdhAbnX_z5jlIH6AySo */}
            <LoadScript googleMapsApiKey="AIzaSyByaLmiGQbQefsxhdhAbnX_z5jlIH6AySo">
                <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={currentPosition} onClick={onClickHandler}>
                    {
                        currentPosition.lat ?
                        <Marker position={currentPosition} onDragEnd={(e) => onDragEndMarker} draggable={true} /> : null
                    }
                        {
                            locations.map(place => {
                                return(
                                    <Marker key={place.name} position={{lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }}  />
                                )
                            })
                        }
                </GoogleMap>
            </LoadScript>
        </div>
    )
}

export default Cinema