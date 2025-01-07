// Task 3
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            mainTitle: "Blog Platform",
            welcomeMessage: "Welcome to our Blogging Website!",
            postPage: "Posts",
            edit: "Edit",
            delete: 'Delete',
            deleting: 'Deleting...',
            createPage: 'Create Post',
            title: 'Title',
            body: 'Body',
            userId: 'User ID',
            viewPage: 'View Posts',
            update: 'Update Post',
            updating: 'Updating...',
            editPage: 'Edit Post',
            errorMessage: 'An error has occured:',
            updateSuccessMessage: 'Post updated successfully',
            createSuccessMessage: 'Post created successsfully',
            navBrand: 'Lesson 5 Assignment',
            newPost: 'Make a New Post',
            searchPlaceholder: 'Search posts by User ID',
            titlePlaceholder: 'Enter post title',
            userIdPlaceholder: 'Enter User ID Number',
            comments: "Comments",
            enterComment: "Enter Comment",
            filterByUser: "View Posts by User ID",
            showAll: "Show All"
        },
    },
    fr: {
        translation: {
            mainTitle: "Platform de Blogs",
            welcomeMessage: "Bienvenue dans notre site de blog!",
            postPage: "Publications",
            edit: "Modifier",
            delete: 'Supprimer',
            deleting: 'Suppression...',
            createPage: 'Publier',
            title: 'Titre',
            body: 'Corps',
            userId: "ID de l'utilisateur",
            viewPage: 'Regarde les Publications',
            update: 'Mettre à jour Une Publication',
            updating: 'Met à jour...',
            editPage: 'Modifier La Publication',
            errorMessage: "Une erreur s'est produite:",
            updateSuccessMessage: 'Publication mis à jour avec succès',
            createSuccessMessage: 'Publié avec succès',
            navBrand: 'Affectation de Leçon 5',
            newPost: "Faire une Publications Nouveau",
            searchPlaceholder: "Rechercher des publications par ID d'utilisateur",
            titlePlaceholder: "Tapez le Titre",
            userIdPlaceholder: "tapez le numéro d'identification de l'utilisateur",
            comments: "Commentaires",
            enterComment: "Tapez un Commentaire",
            filterByUser: "Regardez les Publications par ID d'Utilisateur",
            showAll: "Tout Afficher"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        keySeparator: false,
        interpolation: {
            excapevalue: false,
        }
    });

export default i18n