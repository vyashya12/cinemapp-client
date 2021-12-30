import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import Swal from 'sweetalert2'

function Reservation() {
    const [reserved, setReserved] = useState([])
    const [receipt, setReceipt] = useState({})
    const [id, setId] = useState()

    let buttonStyle = {
        display: "block",
        textAlign: "center",
        marginLeft: "50%",
        marginRight: "50%"
    }

    let getReserve = () => {
        fetch(`${process.env.REACT_APP_API_URL}booking`, {
            method: "GET",
        })
        .then(res => res.json())
        .then(data => {
            setReserved(data)
        })
    }

    useEffect( () => {
        getReserve()
    }, [])

    let user = null
    if(localStorage.hasOwnProperty('userData')) {
        user = JSON.parse(localStorage.getItem('userData'))
    } else {
        user = null
    }

    // if(reserved) {
        // setReceipt({
        //     userId: user.sub,
        //     title: reserved.movie,
        //     total: reserved.total,
        //     seats: reserved.seats
        // })
    // }

    let deleteHandler = () => {
        fetch(`${process.env.REACT_APP_API_URL}booking/${id}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": localStorage.getItem('token'),
            }
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
        })
    }

    let payHandler = () => {
        setReceipt({
            userId: user.sub,
            title: reserved[0].movie,
            total: reserved[0].total,
            seats: reserved[0].seats
        })
        fetch(`${process.env.REACT_APP_API_URL}receipt/`, {
            method: "POST",
            headers: {
                "x-auth-token": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(receipt)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
        })
    }
    console.log(receipt)


    let showReserve = reserved?.map(reservation => {
        setId(reservation._id)
        reservation.d = reservation.date.split("T")
        reservation.date = reservation.d[0]
        return(
            <Table.Row key={reservation._id}>
                <Table.Cell>{reservation.movie}</Table.Cell>
                <Table.Cell>{reservation.date}</Table.Cell>
                <Table.Cell>{reservation.time}</Table.Cell>
                <Table.Cell>{reservation.seats}</Table.Cell>
                <Table.Cell>{reservation.total}</Table.Cell>
            </Table.Row>
)
    })

    let styles = {
        "marginLeft": "180px",
        marginBottom: "19%"
    }
    return(
        <div style={styles}>
            <h1 style={{textAlign: "center"}}>Reservations</h1>
            {
                user ?
                <Table celled>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Movie</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Seats</Table.HeaderCell>
                        <Table.HeaderCell>Total</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            reserved ?
                            showReserve
                            : null
                        }
                    </Table.Body>
                </Table>
                : null
            }
            {/* {qrCoder} */}
            <div  style={buttonStyle}>
                {
                    user.isAdmin ?
                    <Button onClick={(e) => deleteHandler(e,id)} color='red'>Delete</Button>
                    : null
                }
                {
                    user ?
                    <Button onClick={payHandler}  color="orange">Pay</Button>
                    : null
                }
            </div>
        </div>
    )
}

export default Reservation
