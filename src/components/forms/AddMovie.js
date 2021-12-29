import React, {useState} from "react";
import Swal from "sweetalert2";
import {Button, Form} from 'semantic-ui-react'

function AddMovie({getMovies}) {
    const [addMovie, setAddMovie] = useState({})

    let onChangeHandler = (e) => {
        setAddMovie({...addMovie, [e.target.name]: e.target.value})
    }
    let onSubmitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', addMovie.title)
        formData.append('description', addMovie.description)
        formData.append('image', addMovie.image)
        formData.append('price', addMovie.price)
        formData.append('description', addMovie.description)
        formData.append('endDate', addMovie.endDate)
        formData.append('genre', addMovie.genre)
        formData.append('trailer', addMovie.trailer)
        fetch(`${process.env.REACT_APP_API_URL}movies/`, {
            method: "POST",
            headers: {
                "x-auth-token": localStorage.getItem('token')
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
            getMovies()
            e.target.reset()
        })
    }

    let photoHandler = (e) => {
        e.preventDefault()
        setAddMovie({...addMovie, image: e.target.files[0]})
    }
    return(
        <div>
                <h1>Add A Movie</h1>
                <Form method="POST" onSubmit={onSubmitHandler} encType="multipart/form-data">
                    <Form.Field>
                        <label>Title</label>
                        <input placeholder="Title" name="title" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input placeholder="Description" name='description' onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Image</label>
                        <input type="file" placeholder="Image" name="image" onChange={photoHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Price</label>
                        <input type='number' placeholder="Price" name="price" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>End Date</label>
                        <input placeholder="End Date" name="endDate" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Genre</label>
                        <input placeholder="Genre" name="genre" onChange={onChangeHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Trailer URL</label>
                        <input placeholder="Trailer URL" name="trailer" onChange={onChangeHandler} />
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                </Form>
        </div>
    )
}

export default AddMovie