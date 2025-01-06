import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Spinner, Alert, Row, Col, Card, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';

const ViewPosts = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState('');


    const fetchPosts = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    };

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    const deletePost = async (id) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete post');
        return id;
    };

    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: (deletedId) => {
            queryClient.setQueryData(["posts"], (oldPosts) =>
                oldPosts.filter((post) => post.id !== deletedId)
            );
        },
    });

    // Task 1
    const filteredPosts = useMemo(() => {
        if (!userId) return posts;
        return posts.filter((post) => post.userId === parseInt(userId));
    }, [posts, userId]);
    // Task 2
    const selectPostUpdate = useCallback((id) => {
        navigate(`/update-post/${id}`)
    }, [navigate]);

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (error) return <Alert variant='danger'>{error.message}</Alert>

    return (
        <div>
            <h2>Posts</h2>
            <Button variant='primary' onClick={() => navigate('/new-post')} className='mb-2'>Create Post</Button>
            <Form.Group controlId='searchPosts' className='mb-3'>
                <Form.Control
                type='number'
                placeholder='Search posts by User Id'
                onChange={(e) => setUserId(e.target.value)}
                />
            </Form.Group>
            <Row xs={1} md={4}>
                {filteredPosts.map(post => (
                    <Col key={post.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Post {post.id} - {post.title}</Card.Title>
                                <Card.Text> {post.body} <br />-User ID {post.userId}</Card.Text>
                                <Button variant='primary' onClick={() => selectPostUpdate(post.id)}>Edit</Button>
                                <Button variant='danger' onClick={() => deletePostMutation.mutate(post.id)}
                                disabled={deletePostMutation.isLoading && deletePostMutation.variables === post.id}>
                                    {deletePostMutation.isLoading && deletePostMutation.variables === post.id ? 
                                    "Deleting..." : "Delete"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default ViewPosts;