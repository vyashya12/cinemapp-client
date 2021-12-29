import React, { useEffect, useState } from "react";
import AddMovie from "./forms/AddMovie";
import Movie from "./Movie";


function Home() {
    const [movies, setMovies] = useState([])

    
    let styles = {}
    if(localStorage.hasOwnProperty('userData')) {
        styles = {
            "marginLeft": '180px',
        }
    }

    let getMovies = () => {
        fetch(`https://${process.env.REACT_APP_API_URL}/movies`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setMovies(data)
        })
    }

    useEffect( () => {
        getMovies()
    }, []) 
    let admin = JSON.parse(localStorage.getItem('userData'))
    if(admin != null) {
        admin = admin.isAdmin
    } else {
        admin = false
    }
    
    let showMovies = movies.map(movie => <Movie key={movie._id} data={movie} getMovies={getMovies} />)


    return(
        <div style={styles}>
            <h1 style={{textAlign: "center"}}>Home</h1>
            {
                admin ?
                <AddMovie getMovies={getMovies}/>
                : null
            }
            {showMovies}
        </div>
    )
}

export default Home