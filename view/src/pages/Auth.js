import React, {useContext, useState} from 'react';
import {Container, Form, Image} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useHistory} from "react-router-dom";
import {ALG_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import arrow from "../arrow.jpg";


const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history = useHistory()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [gr, setGr] = useState('')

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);

            } else {
                data = await registration(email, password, surname, name, patronymic, gr);
            }
            user.setUser(data)
            user.setIsAuth(true)
            history.push(ALG_ROUTE)
        } catch (e) {
            alert(e?.response?.data?.message)
        }

    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 100}}
        >

            <Card style={{width: 600}} className="p-5">
                <Row className="d-flex justify-content-between pl-3 mb-4">
                    <Image onClick={() => history.push(ALG_ROUTE)} width={19} height={13} src={arrow}/>
                </Row>
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                <Form className="d-flex flex-column mt-4">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {isLogin ?
                        ""
                        :
                        <div>
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите фамилию"
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                            type="surname"
                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите имя"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        type="name"
                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите отчество"
                        value={patronymic}
                        onChange={e => setPatronymic(e.target.value)}
                        type="patronymic"
                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите группу"
                        value={gr}
                        onChange={e => setGr(e.target.value)}
                        type="gr"
                        />
                        </div>
                    }
                    <Row className="d-flex justify-content-between mt-4 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>


                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
