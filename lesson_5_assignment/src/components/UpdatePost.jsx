import { Col, Form, Button, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react'
import React from "react";
import { useNavigate, useParams} from "react-router-dom";
import '../i18n';
import { useTranslation } from "react-i18next";
import NavigationBar from "./NavigationBar";

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
    const [t] = useTranslation()
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

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
            <NavigationBar />
             {mutation.isError && <Alert variant="danger">{t('errorMessage')} {mutation.error.message}</Alert>}
             {showSuccessAlert && <Alert variant="success">{t('updateSuccessMessage')}</Alert>}
             <h3>{t('editPage')} {id}</h3>
             <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>{t('title')}</Form.Label>
                        <Form.Control
                         type="text" 
                         value={title} 
                         name="title" 
                         onChange={(e) => setTitle(e.target.value)}
                         disabled={mutation.isLoading}
                         aria-label={t('title')}
                          />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>{t('body')}</Form.Label>
                        <Form.Control
                         name="body"
                         as='textarea'
                         rows={3}
                         value={body}
                         onChange={(e) => setBody(e.target.value)}
                         disabled={mutation.isLoading}
                         aria-label={t('body')}
                         />
                    </Form.Group>
                    <Button variant="success" type="submit" disabled={mutation.isLoading}>
                        {mutation.isLoading ? t('updating') : t('update')}
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/')}>{t('viewPage')}</Button>
                </Form>
            </Col>
        </div>
    )
}
            
export default React.memo(UpdatePostMutation);