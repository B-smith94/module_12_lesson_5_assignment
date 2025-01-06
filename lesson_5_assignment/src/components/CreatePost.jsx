import { Col, Form, Button, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import '../i18n';
import { useTranslation } from "react-i18next";

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
    const [t] = useTranslation();
    const [submitted, setSubmitted] = useState(false)
    const [validId, setValidId] = useState(true);

    const checkValidId = (event) => {
        if (event.target.value > 0 && event.target.value <= 10) {
            setValidId(true);
        } else {
            setValidId(false);
        }
    }

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
        setSubmitted(true);
    };



    return (
        
        <div>
            <NavigationBar />
            {isError && <Alert variant="danger">{t('errorMessage')} {error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">{t('createSuccessMessage')}</Alert>}
            <h3>{t('createPage')}</h3>
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>{t('title')}</Form.Label>
                        <Form.Control
                         type="text"
                         placeholder={t('titlePlaceholder')} 
                         name="title" 
                         aria-label={t('title')}
                         required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>{t('body')}</Form.Label>
                        <Form.Control name="body" as='textarea' rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>{t('userId')}</Form.Label>
                        <Form.Control
                         type="number" 
                         placeholder={t('userIdPlaceholder')} 
                         name="userId" 
                         onChange={(e) => checkValidId(e)}
                         isInvalid={submitted && !validId}
                         aria-describedby="userIdHelpBlock"
                         required />
                         <Form.Control.Feedback type="invalid" id="userIdHelpBlock">
                            User ID Must be a number between 1 and 10
                         </Form.Control.Feedback>
                        <Button variant="success" type="submit" className="m-3">{t('createPage')}</Button>
                        <Button variant="primary" onClick={() => navigate('/')} className="m-3">{t('viewPage')}</Button>
                    </Form.Group>
                </Form>
            </Col>
        </div>
    )
};

export default CreatePost;