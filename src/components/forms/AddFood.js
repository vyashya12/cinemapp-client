import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import Swal from 'sweetalert2'

function AddFood({getFood}) {
    const [snack, setSnack] = useState({
        isSoldOut: false
    })

    let onChangeHandler = (e) => {
        setSnack({...snack, [e.target.name]: e.target.value})
    }

    let photoHandler = (e) => {
        setSnack({...snack, image: e.target.files[0]})
    }

    let onSubmitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData() 
        formData.append('name', snack.name)
        formData.append('type', snack.type)
        formData.append('image', snack.image)
        formData.append('description', snack.description)
        formData.append('price', snack.price)
        formData.append('isSoldOut', snack.isSoldOut)
        fetch(`http://${process.env.REACT_APP_API_URL}/snacks`, {
            method: "POST",
            headers: {
                "x-auth-token": localStorage.getItem('token')
            },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(data.msg)
            getFood()
            e.target.reset()
        })
    }

    return(
        <Form method="POST" onSubmit={onSubmitHandler} encType="multipart/form-data">
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
                    <Form.Field>
                        <input hidden name='isSoldOut' value='false' onChange={onChangeHandler} />
                    </Form.Field>
                    <Button type="submit">Submit</Button>
                </Form>
    )
}

export default AddFood