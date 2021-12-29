import React, {useState} from "react";
import { Card, Image, Icon, Button, Form, Input} from "semantic-ui-react";
import {Col, Modal} from 'react-bootstrap'
import Swal from "sweetalert2";

function Snack({data, getFood}) {
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [handleBook, setBook] = useState(false)
    const [food, setFood] = useState({})
    const [edit, setEdit] = useState({
        id: data._id,
        isSoldOut: false
    })

    const openBook = () => setBook(true)
    const closeBook = () => setBook(false)

    const handleOpen = () => setOpen(true)
    const notOpen = () => setOpen(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let styles = {
        height: "400px",
        marginTop: "20px",
        width: "290px"
    }
    let imageStyle = {
        "height": "215px"
    }


    let deleteHandler = (id, handleClose) => {
        fetch(`http://${process.env.REACT_APP_API_URL}/snacks/`+id, {
            method: "DELETE",
            headers: {
                "x-auth-token": localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => {
            handleClose()
            Swal.fire(data.msg)
            getFood()
        })
    }

    let onChangeHandler = (e) => {
        setEdit({...edit, [e.target.name]: parseInt(e.target.value)})
    }

    let photoHandler = (e) => {
        setEdit({...edit, image: e.target.files[0]})
    }

    let onSubmitHandler =(e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.set('name', edit.name)
        formData.set('type', edit.type)
        formData.set('image', edit.image)
        formData.set('description', edit.description)
        formData.set('price', edit.price)
        formData.set('isSoldOut', edit.isSoldOut)
        fetch(`http://${process.env.REACT_APP_API_URL}/snacks/${edit.id}`, {
            method: "PUT",
            headers: {
                "x-auth-token": localStorage.getItem('token')
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
            getFood()
            notOpen()
        })
    }

    let user = null
    if(localStorage.hasOwnProperty('userData')) {
        user = JSON.parse(localStorage.getItem('userData'))
    } else {
        user = null
    }

    let bookChanges = (e) => {
        setFood({...food, [e.target.name]: e.target.value})
    }
    let settingData = (price, name) => {
        setFood({...food, price, name})
    }

    let bookHandler = (e) => {
        e.preventDefault()
        fetch(`http://${process.env.REACT_APP_API_URL}/booking/${user.sub}`, {
            method: "POST",
            headers: {
                "x-auth-token": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(food)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
            console.log(data)
            closeBook()
        })
    } 

    let admin = JSON.parse(localStorage.getItem('userData'))
    return(
                <Col>
                    <Card style={styles}>
                        <Image style={imageStyle} src={`http://${process.env.REACT_APP_API_URL}/${data.image.split('/')[2]}`} alt={data.name} />
                        <Card.Content>
                            <Card.Header>{data.name}</Card.Header>
                            <Card.Description>
                                {data.description}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='money' />
                            <span>RM: {data.price}</span>
                        </Card.Content>
                        <Card.Content extra>
                            {
                                admin.isAdmin ?
                                <Button onClick={handleOpen} color="yellow">Edit</Button>
                                : null
                            }
                            <Modal centered show={open} onHide={notOpen}>
                                <Modal.Header closeButton>
                                <Modal.Title>Edit {data.name}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={onSubmitHandler} method="PUT" encType="multipart/form-data">
                                        <Form.Field>
                                            <label>Name</label>
                                            <input type="text" placeholder="Name" name='name' onChange={onChangeHandler} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Type</label>
                                            <input type="text" placeholder="Type" name='type' onChange={onChangeHandler} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Image</label>
                                            <input type="file" name='image' onChange={photoHandler} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Description</label>
                                            <input type="text" placeholder="Description" name='description' onChange={onChangeHandler} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Price</label>
                                            <input type='number' placeholder="Price" name='price' onChange={onChangeHandler} />
                                        </Form.Field>
                                        <Button color="grey" onClick={notOpen} type="button">Close</Button>
                                        <Button color="green" type="submit">Submit</Button>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                            {
                                admin.isAdmin ?
                                <Button color="red" onClick={handleShow}>Delete</Button>
                                : null
                            }
                            <Modal centered show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                <Modal.Title>Delete {data.name}</Modal.Title>
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
                            {
                                localStorage.hasOwnProperty('userData') ?
                                <Button color="green" onClick={openBook}>Book</Button>
                                : null
                            }
                            <Modal centered show={handleBook} onHide={closeBook}>
                                <Modal.Header closeButton>
                                <Modal.Title>Order {data.name}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Are you sure you want to Order?
                                <Form method="POST" onSubmit={(e) => bookHandler(e)}>
                                    <Form.Field>
                                        <Input min="1" type="number" name="quantity" onChange={bookChanges} />
                                    </Form.Field>
                                    <Button type='submit' onClick={() => settingData(data.price, data.name)}>Book</Button>
                                </Form>
                                </Modal.Body>
                            </Modal>
                        </Card.Content>
                    </Card>
                </Col>
    )
}

export default Snack