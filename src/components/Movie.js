import React, {useEffect, useState} from "react";
import {Row, Col, Image} from 'react-bootstrap'
import {Button, Form, Icon, Input} from 'semantic-ui-react'
import {Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

function Movie({data, getMovies}) {
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [book, setBook] = useState(false)
    const [reserve, setReserve] = useState({
        movieId: data._id
    })
    const [edit, setEdit] = useState({
        id: data._id
    })
    const [cinema, setCinema] = useState([])

    const openBook = () => setBook(true)
    const closeBook = () => setBook(false)

    const handleOpen = () => setOpen(true)
    const notOpen = () => setOpen(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let navigate = useNavigate()

    let rowStyle = {
        marginBottom: "30px",
        border: "2px solid black",
        borderRadius: "10px",
        marginLeft: "15%",
        marginRight: "15%"
    }

    let admin = JSON.parse(localStorage.getItem('userData'))
    if(admin != null) {
        admin = admin.isAdmin
    } else {
        admin = false
    }

    let getCinema = () => {
        fetch(`${process.env.REACT_APP_API_URL}cinema`)
        .then(res => res.json())
        .then(data => {
            setCinema(data)
        })
    }

    useEffect( () => {
        getCinema()
    }, [])
    
    let showCinema = cinema?.map(location => {
        return(
            <option key={location._id} value={location.name}>{location.name}</option>
        )
    })

    let deleteHandler = (id, handleClose) => {
        fetch(`${process.env.REACT_APP_API_URL}movies/${id}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => {
            handleClose()
            Swal.fire(data.msg)
            getMovies()
        })
    }

    let onChangeHandler = (e) => {
        setEdit({...edit, [e.target.name]: e.target.value})
    }

    let photoHandler = (e) => {
        setEdit({...edit, image: e.target.files[0]})
    }


    let onSubmitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.set('title', edit.title)
        formData.set('description', edit.description)
        formData.set('image', edit.image)
        formData.set('price', edit.price)
        formData.set('description', edit.description)
        formData.set('endDate', edit.endDate)
        formData.set('genre', edit.genre)
        formData.set('trailer', edit.trailer)
        fetch(`${process.env.REACT_APP_API_URL}movies/${edit.id}`, {
            method: "PUT",
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
            notOpen()
        })
    }

    let bookHandler = (e) => {
        setReserve({...reserve, [e.target.name]: e.target.value})
    }

    

    let bookMovieHandler = (e,closeBook) => {
        e.preventDefault()
        fetch(`${process.env.REACT_APP_API_URL}booking`, {
            method: "POST",
            headers: {
                "x-auth-token": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserve)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
            closeBook()
            navigate("/seats")
        })
    }
    return(
        <Row style={rowStyle}>
            <Col>
                <Image style={{height: "200px", width: "400px"}} fluid src={`${process.env.REACT_APP_API_URL}${data.image.split('/')[2]}`} alt={data.title} />
            </Col>
            <Col>
                <h3>{data.title}</h3>
                <h5>{data.description}</h5>
                <p>Genre: {data.genre}</p>
                <div>
                    <a style={{textDecoration: "none", color: "red", fontSize: "18px"}} href={data.trailer} target="_blank" rel="noreferrer">Trailer</a>
                </div>
                <Icon name='money' />
                <span>RM: {data.price}</span> <br/>
                {
                    localStorage.hasOwnProperty('userData') && localStorage.hasOwnProperty('token') ?
                <Button onClick={openBook} color="green">
                    Book
                </Button>
                : null
                }
                <Modal centered show={book} onHide={closeBook}>
                    <Modal.Header closeButton>
                    <Modal.Title>Book {data.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to Book {data.title}?
                    <Form method="POST" onSubmit={(e) => bookMovieHandler(e,closeBook)}>
                        <Form.Field>
                            <Input list='cinema' placeholder="Pick your Theatre" name='cinema' onChange={bookHandler} />
                            <datalist id="cinema">
                                {showCinema}
                            </datalist>
                        </Form.Field>
                        <Form.Field>
                            <Input list='time' placeholder="Time" name='time' onChange={bookHandler} />
                            <datalist id="time">
                                <option value="12.00pm">12.00pm</option>
                                <option value="3.00pm">3.00pm</option>
                                <option value="6.00pm">6.00pm</option>
                                <option value="9.00pm">9.00pm</option>
                            </datalist>
                        </Form.Field>
                        <DatePicker 
                        selected={reserve.date} 
                        onChange={date => setReserve({...reserve, date: date})} 
                        minDate={new Date()}
                        />
                        <Button color='green' type='submit'>Book</Button>
                    </Form>
                    </Modal.Body>
                </Modal>
                {
                    admin ?
                    <>
                    <Button onClick={handleOpen} color="yellow">Edit</Button>
                    <Modal centered show={open} onHide={notOpen}>
                                <Modal.Header closeButton>
                                <Modal.Title>Edit {data.title}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <Form method="PUT" onSubmit={onSubmitHandler} encType="multipart/form-data">
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
                                </Modal.Body>
                            </Modal>
                    <Button onClick={handleShow} color="red">Delete</Button>
                    <Modal centered show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Delete {data.title}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to DELETE?</Modal.Body>
                            <Modal.Footer>
                            <Button color="grey" onClick={handleClose}>
                                No
                            </Button>
                            <Button color="red" onClick={((e) => deleteHandler(data._id, handleClose))}>
                                Yes
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                    : null
                }
            </Col>
        </Row>
    )
}

export default Movie