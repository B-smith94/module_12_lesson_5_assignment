import { Container, Navbar, Nav } from "react-bootstrap";   
import { useTranslation } from 'react-i18next';
import "../i18n";

const NavigationBar = () => {
    // Task 3
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }
    // Task 1
    return (
        <>
            <Navbar bg='light' expand='lg' as='header' role='navigation'>
                <Navbar.Brand href="/">{t('navBrand')}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" as='nav' role="menubar">
                        <Nav.Link href="/" role="menuitem">{t('viewPage')}</Nav.Link>
                        <Nav.Link href="/new-post" role="menuitem">{t('newPost')}</Nav.Link>
                    </Nav>
                    <Nav className="mr-auto" as='nav' role="menubar">
                        <Nav.Link onClick={() => changeLanguage('en')}>English</Nav.Link>
                        <Nav.Link onClick={() => changeLanguage('fr')}>Français</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavigationBar;