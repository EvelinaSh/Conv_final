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
            if (data.role === "ADMIN") getAlg().then(data => queries.setAlgs(data))
            else
            getAlgUser(data.id).then(data => {queries.setAlgs(data)})
        })
        queries.setSelectedAlg("Новый запрос")

    }, [queries])

    return (
        <Row className="mt-5">



            <Col md={2} className="p-3">
                <Form>
                    <Form.Check
                        onClick={() => {history.push('/tuples')
                            queries.setQuerySQL('')
                            queries.setNamesCol(null)}}
                        type="radio"
                        label="Алгебра"
                        id="alg"
                        name="flag"
                    />
                </Form>
            </Col>


               <Col  md={2} className="p-2">
                   <Form>
                     <Form.Group as={Row}>
                         <Form.Label column sm="1.2">
                                Группа
                         </Form.Label>
                            <Col sm="6">
                              <Form.Control
                                  size="sm"
                                  value={queries.group}
                                  type="text"
                                  onChange={e => queries.setGroup(e.target.value)}
                              />
                         </Col>
                        </Form.Group>
                    </Form>
               </Col>

                <Col md={2} className="p-2">
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="1.2">
                                Фамилия
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    value={queries.fam}
                                    onChange={e => queries.setFam(e.target.value)}/>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>

            <Col md={2} className="p-2">
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label  column sm="1.2">
                            Номер запроса
                        </Form.Label>
                        <Col sm="5">
                            <Form.Control
                                size="sm"
                                type="text"
                                value={queries.nom}
                                onChange={e => queries.setNom(e.target.value)}/>
                        </Col>
                    </Form.Group>
                </Form>
            </Col>

            <Col md={3} className="ml-4 p-2">
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm="1.2">Сохраненный запрос</Form.Label>
                        <Col sm="6">

                            <Dropdown size="sm">
                                <Dropdown.Toggle style={{backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#c0c0c0'}}>{queries.selectedAlg.query_name || "Новый запрос"}</Dropdown.Toggle>
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

/*  <div>
         <Pagination style={{backgroundColor: '#fff6e8'}}>
             <Pagination.Item key={1} active={1}>
             {1}
         </Pagination.Item>
             <Pagination.Item key={2} >
                 {2}
             </Pagination.Item>
             <Pagination.Item key={3} >
                 {3}
             </Pagination.Item>
             <Pagination.Item key={4} >
                 {4}
             </Pagination.Item>
             <Pagination.Item key={5} >
                 {5}
             </Pagination.Item>
             <Pagination.Item key={6} >
                 {6}
             </Pagination.Item>
             <Pagination.Item key={7} >
                 {7}
             </Pagination.Item>
         </Pagination>
         <br />
     </div>
     */
