import {observer} from "mobx-react-lite";
import {Col, Form, Image} from "react-bootstrap";
import mep from '../m.png'
import React, {useContext, useEffect} from "react";
import {Context} from "../index";
import {getAllTable} from "../http/convAPI";


const AlgDescType = observer(() => {

    const {queries} = useContext(Context)

    useEffect(() => {
        getAllTable().then(data => queries.setTables(data))
    }, [queries])

        const getTabMark = () => {
        let str = queries.type.replace(/,/g,'/')
            str = str.replace(/ AS /ig,'/')
            str = str.replace(/ /g,'')
            str = str.split('/')
            queries.setNameTablesMarks(str)

        }


    return (
        <Form className="mt-3">
            <Form.Row>

                <Form.Group as={Col}>
                    <Form.Label>Описание запроса</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Введите описание запроса"
                        type="text"
                        value={queries.desc}
                        onChange={e => {queries.setDesc(e.target.value)
                            queries.setShow(false)}}/>
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Label>Типы переменных</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Введите типы переменных"
                        type="text"
                        id="TypeV"
                        value={queries.type}
                        onChange={e => {
                            queries.setType(e.target.value)
                            queries.setShow(false)
                            for (let i=0; i<queries.tables.length; ++i){
                            if (queries.type.indexOf(queries.tables[i]) !== -1)
                            getTabMark()
                            }
                        }}
                    />
                    <Col md={5} className="ml-auto">

                        <Form.Control className="mt-1"
                            as="select"
                            defaultValue="..."
                            size="sm"
                            value={queries.selectedTable}
                            onChange={(e) => {
                                queries.setShow(false)
                                if (queries.type === '')
                                    queries.setType(e.target.value + ' AS ')
                                else queries.setType(queries.type + ', ' + e.target.value + ' AS ')
                                for (let i=0; i<queries.tables.length; ++i){
                                    if (queries.type.indexOf(queries.tables[i]) !== -1)
                                        getTabMark()}
                            }}
                            id="SH">
                            <option>Выберите таблицу</option>
                            {queries.tables.map(table =>
                                <option
                                    key={table}
                                onClick={() => queries.setSelectedTable(table)}>

                                    {table}
                                </option>
                            )}

                        </Form.Control>
                    </Col>
                </Form.Group>
            </Form.Row>
        </Form>
    )
}
)


export default AlgDescType;