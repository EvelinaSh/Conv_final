import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Dropdown, Form, Pagination, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom"
import {Context} from "../index";
import {getAlg, getAlgUser} from "../http/convAPI";
import {check} from "../http/userAPI";
import {logOut} from "./AlgButtons";



const AlgGroupFioQuery = observer(() => {
    const history = useHistory() //для перехода на другую страницу
    const {queries, user} = useContext(Context)

    useEffect(() => {
    if (user.isAuth === true)
        check().then(data => {
            user.setUser(data)
            if (data.role === "ADMIN") getAlg().then(data => queries.setAlgs(data))
            else
            getAlgUser(data.id).then(data => {queries.setAlgs(data)})
        })
        queries.setSelectedAlg("Новый запрос")

    }, [queries])

    return (
        <Row className="mt-3">
            <Col className="ml-4 p-2" >
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label  column sm="1.2">
                            Номер запроса
                        </Form.Label>
                        <Col style={{minWidth:'20vh', maxWidth:'20vh'}}>
                            <Form.Control
                                type="text"
                                value={queries.nom}
                                onChange={e => {queries.setNom(e.target.value)
                                    queries.setShow(false)}}/>
                        </Col>
                    </Form.Group>
                </Form>
            </Col>

            <Col className="ml-2 p-2">
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm="1.2">Сохраненный запрос</Form.Label>
                        <Col>

                            <Dropdown size="sm" >
                                <Dropdown.Toggle style={{backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#c0c0c0', minWidth:'20vh', maxWidth:'50vh'}}>{queries.selectedAlg.query_name || "Новый запрос"}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {queries.algs.map(alg =>
                                        <Dropdown.Item
                                            onClick={() => queries.setSelectedAlg(alg)}
                                            key={alg.query_name}
                                        >
                                            {alg.query_name}
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>


                        </Col>
                    </Form.Group>
                </Form>
            </Col>

        </Row>
    );
});

export default AlgGroupFioQuery;
