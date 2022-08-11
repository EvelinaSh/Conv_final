import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Container, Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Context} from "../index";
import {useHistory} from "react-router-dom";
import {LOGIN_ROUTE} from "../utils/consts"
import {ALG_ROUTE} from "../utils/consts"
import {TUPLES_ROUTE} from "../utils/consts"
import m from "../m.png";

const Navnav = observer(() => {
    const history = useHistory()
    const {queries, user} = useContext(Context)
    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        queries.setAlgs([])
        queries.setGroup('')
        queries.setFam('')
        queries.setNom('')
        queries.setDesc('')
        queries.setType('')
        queries.setGoal('')
        queries.setQuery('')
        queries.setQuerySQL('')
    }
    let navnav = null
    {
        navnav = (
            <Navbar expand="lg"  style={{backgroundColor: '#FFFFFF'}}>
                <Container fluid>
                    <Navbar.Brand onClick={() => history.push(ALG_ROUTE)}>
                        <img
                            src={m}
                            width="50"
                            height="50"
                            alt="logo"
                            className="ml-3"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-2">
                            {user.isAuth ?
                            <Nav.Link className="ml-2" onClick={() => logOut()}>Выйти</Nav.Link>
                                :
                                <Nav.Link className="ml-2" onClick={() => history.push(LOGIN_ROUTE)}>Войти</Nav.Link>
                            }
                            <Nav.Link className="ml-2" onClick={() => history.push(ALG_ROUTE)}>Реляционная алгебра</Nav.Link>
                            <Nav.Link className="ml-2" onClick={() => history.push(TUPLES_ROUTE)}>Исчисление кортежей</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }

    return navnav

});

export default Navnav;