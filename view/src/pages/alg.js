import React from 'react';
import {Container, Col, Row, Navbar, Nav, NavDropdown, Table} from "react-bootstrap";
import AlgButtons from "../components/AlgButtons";
import AlgGroupFioQuery from "../components/AlgGroupFioQuery";
import AlgDescType from "../components/AlgDescType";
import AlgGoalList from "../components/AlgGoalList";
import AlgBodyQuerySQL from "../components/AlgBodyQuerySQL";
import TableResult from "../components/TableResult";
import m from "../m.png";

const Alg = () => {

    return (

        <Container fluid style={{backgroundColor: '#fff6e8', minHeight:'100vh', maxHeight:'100%'}}>

            <Row className="d-flex justify-content-between ml-1 mr-1">
                <Col md={10}>
                <AlgGroupFioQuery/>
                <AlgDescType/>
                <AlgGoalList/>
                <AlgBodyQuerySQL/>
            </Col>
            <Col md={2}>
                <AlgButtons/>
            </Col>
            </Row>
            <Row className="ml-1 mr-1 mt-3" >
                <Col>
                <TableResult/>
                </Col>
            </Row>
            </Container>
    )
};


export default Alg;

/*     <Navbar bg="light" expand="lg" sticky="top" variant="light">
                <Container fluid>
                    <Navbar.Brand href="#home">
                        <img
                            src={m}
                            width="50"
                            height="50"
                            alt="logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                        <Nav className="justify-content-end">
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

<Table striped bordered hover size="sm" style={{backgroundColor: '#FFFFFF'}}>
    <thead>
    <tr>
        <th>
            {"№"}
        </th>
        <th>
            {"Запрос студента"}
        </th>
        <th>
            {"Эталонный запрос"}
        </th>
        <th>
            {"Балл"}
        </th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            {"1"}
        </td>
        <td>
            {"(Z[Z.full_name=\"Chantale Haynes\" AND Z.id_employee=Y.id_employee]Y)"}
        </td>
        <td>
            {"(Z[Z.full_name=\"Chantale Haynes\" AND Z.id_employee=Y.id_employee]Y)"}
        </td>
        <td>
            {"1/1"}
        </td>

    </tr>

    <tr>
        <td>
            {"2"}
        </td>
        <td>
            {"((X[(X.date_of_completion-X.deadline)>7 AND X.id_employee=Y.id_employee]Y)[X.id_project=Z.id_project]Z)"}
        </td>
        <td>
            {"((X[(X.date_of_completion-X.deadline)>7 AND X.id_employee=Y.id_employee]Y)[X.id_project=Z.id_project]Z)"}
        </td>
        <td>
            {"2/2"}
        </td>

    </tr>

    <tr>
        <td>
            {"3"}
        </td>
        <td>
            {"(((X[X.id_employee=Z.id_employee]Z)[X.id_employee])INTERSECT((Y[Y.id_employee=Z.id_employee]Z)[Y.id_employee]))"}
        </td>
        <td>
            {"(((X[X.id_employee=Z.id_employee]Z)[X.id_employee])INTERSECT((Y[Y.id_employee=Z.id_employee]Z)[Y.id_employee]))"}
        </td>
        <td>
            {"3/3"}
        </td>

    </tr>
    </tbody>
</Table>
*/