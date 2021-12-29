import React, { useEffect, useState } from "react";
import Snack from "./Snack";
import {Container, Row} from 'react-bootstrap'
import AddFood from "./forms/AddFood";
function Food() {
    const [foods, setFood] = useState([])
    

    let styles = {
        "marginLeft": "180px"
    }

    let stylesRow = {
        display: "flex"
    }
   
    let getFood = () => {
        fetch(`https://${process.env.REACT_APP_API_URL}/snacks`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setFood(data)
        })
    }

    useEffect( () => {
        getFood()
    }, [])

    let showFood = foods.map(food => <Snack key={food._id} data={food} getFood={getFood} />)

    let admin = JSON.parse(localStorage.getItem('userData'))
    return(
        <div style={styles}>
            <h1 style={{textAlign: "center"}}>Order your Food</h1>
            {
                admin.isAdmin ?
                <AddFood getFood={getFood}/>
                :
                null
            }
            <Container fluid >
                <Row style={stylesRow}>
                    {showFood}
                </Row>
            </Container>
        </div>
    )
}

export default Food