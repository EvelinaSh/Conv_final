import React, {useContext, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Col, Overlay, Tooltip} from "react-bootstrap";
import {Context} from "../index";
import {check} from "../http/userAPI";
import {
    createTup,
    deleteTup,
    executeTup, generateTup,
    getTup, getTupUser,
    updateTup,
    view
} from "../http/convAPI";

import {LOGIN_ROUTE} from "../utils/consts";
import {useHistory} from "react-router-dom";


const TupButtons = observer(() => {

    const {queries, user} = useContext(Context)
    const history = useHistory()
    const target = useRef(null)
    useEffect(() => {
        queries.setGroup('')
        queries.setFam('')
        queries.setNom('')
        queries.setDesc('')
        queries.setType('')
        queries.setGoal('')
        queries.setQuery('')
        queries.setQuerySQL('')
    }, [queries])

    const saveQ = () => {
        let nameQ = queries.group + '_' + queries.nom + '_' + queries.fam;
        createTup({query_name: nameQ,
            desc_query: queries.desc,
            table_var: queries.type,
            goal_list: queries.goal,
            query_body: queries.query,
            nom_query: queries.nom,
            nom_qr: queries.group,
            first_name: queries.fam,
            userId: user.user.id}).then(() => {
            updateSaveQuery()
            queries.setSelectedTup(nameQ)
        })
    }

    const updateSaveQuery = () => {
        check().then(data => {
            if (data.role === "ADMIN") getTup().then(data => queries.setTuples(data))
            else
                getTupUser(data.id).then(data => {queries.setTuples(data)})
        })
    }

    const getQ = () => {
        queries.setGroup(queries.selectedTup.nom_qr)
        queries.setFam(queries.selectedTup.first_name)
        queries.setNom(queries.selectedTup.nom_query)
        queries.setDesc(queries.selectedTup.desc_query)
        queries.setType(queries.selectedTup.table_var)
        queries.setGoal(queries.selectedTup.goal_list)
        queries.setQuery(queries.selectedTup.query_body)
        queries.setQuerySQL('')
        queries.setNamesCol(null)
    }
    const updateQ = () => {
        updateTup({query_name: queries.selectedTup.query_name,
            desc_query: queries.desc,
            table_var: queries.type,
            goal_list: queries.goal,
            query_body: queries.query,
            nom_query: queries.nom,
            nom_qr: queries.group,
            first_name: queries.fam,
            userId: user.user.id}).then(() => {
            updateSaveQuery()
            let nameQ = queries.group + '_' + queries.nom + '_' + queries.fam
            queries.setSelectedTup(nameQ)
        })
    }
    const deleteQ = () => {
        deleteTup(queries.selectedTup.query_name).then(() => {
            queries.setGroup('')
            queries.setFam('')
            queries.setNom('')
            queries.setDesc('')
            queries.setType('')
            queries.setGoal('')
            queries.setQuery('')
            updateSaveQuery()
            queries.setSelectedTup("Новый запрос")
        })
    }

    const executeQ = () => {
        executeTup({query_sql: queries.querySQL}).then(r => {queries.setResultQuery(r)
            queries.setNamesCol(Object.keys(queries.resultQuery[0]))
        })
    }

    const generateQ = () => {
        const query_object = {
            alias: queries.type,
            target_list: queries.goal,
            query_body: queries.query,
            description: queries.desc
        }
        generateTup({query_object: query_object}).then(r => queries.setQuerySQL(r))
    }


    const viewQ = () => {
        let nameQ = queries.group + '_' + queries.nom + '_' + queries.fam;
        view({query_name:nameQ, query_sql:queries.querySQL}).then()
    }

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        queries.setTuples([])
        queries.setGroup('')
        queries.setFam('')
        queries.setNom('')
        queries.setDesc('')
        queries.setType('')
        queries.setGoal('')
        queries.setQuery('')
        queries.setQuerySQL('')
    }

    const testQ = () => {
        queries.setDesc("Вывести список просроченных задач сотрудников с просрочкой более недели")
        queries.setType("tasks AS X, employees AS Y, projects AS Z")
        queries.setGoal("Y.full_name, X.name_task, X.deadline, Z.name_project")
        queries.setQuery("X.date_of_completion-X.deadline>7 AND X.id_employee=Y.id_employee AND X.id_project=Z.id_project")
    }
    return (
        user.isAuth ?
            <Col className="p-2 mt-3 d-flex flex-column">
                <Button className="p-2 mb-4  border" variant="light" onClick={getQ}>Принять запрос</Button>
                <><Button ref={target} className="p-2 mb-4 border" variant="light" onClick={saveQ}>Сохранить запрос</Button>
                    <Overlay target={target.current} show={queries.show} placement="left">
                        {(props) => (
                            <Tooltip id="overlay-example" {...props}>
                                Не все поля заполнены
                            </Tooltip>
                        )}
                    </Overlay>
                </>
                <Button className="p-2 mb-4 border" variant="light" onClick={updateQ}>Изменить запрос</Button>
                <Button className="p-2 mb-4 border" variant="light" onClick={deleteQ}>Удалить запрос</Button>
                <Button className="p-2 mb-4 border" variant="light" onClick={generateQ}>Генерировать SQL</Button>
                <Button className="p-2 mb-4 border" variant="light" onClick={executeQ}>Выполнить SQL</Button>
                <Button className="p-2 border" variant="light" onClick={viewQ}>Создать View</Button>
            </Col>
            :
            <Col className="p-2 mt-3 d-flex flex-column">
                <Button className="p-2 mb-4 border" variant="light" onClick={testQ}>Пример запроса</Button>
                <Button className="p-2 mb-4 border" variant="light" onClick={generateQ}>Генерировать SQL</Button>
                <Button className="p-2 mb-4 border" variant="light" onClick={executeQ}>Выполнить SQL</Button>
            </Col>
    );
});

export default TupButtons;