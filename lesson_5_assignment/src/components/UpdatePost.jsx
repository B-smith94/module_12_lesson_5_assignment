import { Col, Form, Button, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react'
import React from "react";
import { useNavigate, useParams} from "react-router-dom";

const UpdatePost = async (post) => {
    const resopnse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!resopnse.ok) {
        throw new Error('Failed to update post');
    }
    return resopnse.json();
}

const UpdatePostMutation = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        const cachedPosts = queryClient.getQueryData(["posts"]);
        const post = cachedPosts?.find(p => p.id === parseInt(id, 10));
        if (post) {
            setTitle(post.title);
            setBody(post.body);
        }
    }, [id, queryClient]);

    const mutation = useMutation({
        mutationFn: UpdatePost, 
        onSuccess: (updatedPost) => {
            queryClient.invalidateQueries(["posts"]);
            queryClient.setQueryData(["posts"], (oldPosts) =>
                oldPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
            );
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ id: parseInt(id, 10), title, body })
    };

    return (
        <div>
             {mutation.isError && <Alert variant="danger">An error occurred: {mutation.error.message}</Alert>}
             {showSuccessAlert && <Alert variant="success">Post updated successfully</Alert>}
             <h3>Edit Post {id}</h3>
             <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                         type="text" 
                         value={title} 
                         name="title" 
                         onChange={(e) => setTitle(e.target.value)}
                         disabled={mutation.isLoading}
                          />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control
                         name="body"
                         as='textarea'
                         rows={3}
                         value={body}
                         onChange={(e) => setBody(e.target.value)}
                         disabled={mutation.isLoading}
                         />
                    </Form.Group>
                    <Button variant="success" type="submit" disabled={mutation.isLoading}>
                        {mutation.isLoading ? 'Updating...' : 'Update Post'}
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/')}>View Posts</Button>
                </Form>
            </Col>
        </div>
    )
}
                // Task 4
export default React.memo(UpdatePostMutation);