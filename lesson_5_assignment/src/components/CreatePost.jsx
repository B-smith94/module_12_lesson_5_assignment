import { Col, Form, Button, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

const newPost = async (post) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to create post');
    }
    return response.json();
}

const CreatePost = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessALert] = useState(false);
    const navigate = useNavigate();

    const { mutate, isError, error } = useMutation({
        mutationFn: newPost,
        onSuccess: (data) => {
            setShowSuccessALert(true);
            console.log('Created Post ID:', data.id);
            queryClient.invalidateQueries(['posts']);
            setTimeout(() => setShowSuccessALert(false), 5000);
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const post = {
            title: formData.get('title'),
            body: formData.get('body'),
            userId: formData.get('userId')
        };
        mutate(post);
        event.target.reset();
    };



    return (
        <div>
            {isError && <Alert variant="danger">An error occurred: {error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Post created successfully</Alert>}
            <h3>Create Post</h3>
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter post title" name="title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control name="body" as='textarea' rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="number" placeholder="Enter User ID Number" name="userId" required />
                        <Button variant="success" type="submit">Create Post</Button>
                        <Button variant="primary" onClick={() => navigate('/')}>View Posts</Button>
                    </Form.Group>
                </Form>
            </Col>
        </div>
    )
};

export default CreatePost;