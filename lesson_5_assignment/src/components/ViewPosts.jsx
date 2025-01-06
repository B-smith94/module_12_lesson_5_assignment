import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Spinner, Alert, Row, Col, Card, Button, Form, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import NavigationBar from './NavigationBar';
import '../i18n';
import { useTranslation } from 'react-i18next';


const ViewPosts = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [t] = useTranslation();

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

    const filteredPosts = useMemo(() => {
        if (!userId) return posts;
        return posts.filter((post) => post.userId === parseInt(userId));
    }, [posts, userId]);

    const selectPostUpdate = useCallback((id) => {
        navigate(`/update-post/${id}`)
    }, [navigate]);

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (error) return <Alert variant='danger'>{error.message}</Alert>

    return (
        <div>
            <NavigationBar />
            <h1>{t('mainTitle')}</h1>
            <p>{t('welcomeMessage')}</p>
            <hr />
            <h2>{t('postPage')}</h2>
            <Button variant='primary' onClick={() => navigate('/new-post')} className='mb-2'>{t('createPage')}</Button>
            <Form.Group controlId='formSearchPosts' className='mb-3'>
                <Form.Control
                type='number'
                placeholder={t('searchPlaceholder')}
                onChange={(e) => {setUserId(e.target.value); setSubmitted(true)}}
                />
            </Form.Group>
            <Row xs={1} md={4}>
                {filteredPosts.map(post => (
                    <Col key={post.id}>
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Post {post.id} - {post.title}</Card.Title>
                                <Card.Text> {post.body} <br />-{t('userId')} {post.userId}</Card.Text>
                                <Button variant='primary' onClick={() => selectPostUpdate(post.id)}>{t('edit')}</Button>
                                <Button variant='danger' onClick={() => deletePostMutation.mutate(post.id)}
                                disabled={deletePostMutation.isLoading && deletePostMutation.variables === post.id}>
                                    {deletePostMutation.isLoading && deletePostMutation.variables === post.id ? 
                                    t('deleting') : t("delete")}
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