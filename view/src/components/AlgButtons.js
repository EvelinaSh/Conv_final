import React, {useContext, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Col, Overlay, Tooltip} from "react-bootstrap";
import {Context} from "../index";
import {check} from "../http/userAPI";
import {
    createAlg,
    deleteAlg,
    execute,
    executeAlg,
    generateAlg,
    getAlg,
    getAlgUser,
    updateAlg,
    view
} from "../http/convAPI";
import convert_to_sql from "./RelationalAlgebraQuery";
import {useHistory} from "react-router-dom";

let complexity

const AlgButtons = observer(() => {

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
        queries.setShow(false)
    }, [queries])

    const saveQ = () => {
        let nameQ = queries.group + '_' + queries.nom + '_' + queries.fam;
        if (!nameQ || !queries.desc || !queries.type || !queries.goal || !queries.query || !queries.nom || !queries.group || !queries.fam) {
            queries.setShow(true)
        } else {
        createAlg({
            query_name: nameQ,
            desc_query: queries.desc,
            table_var: queries.type,
            goal_list: queries.goal,
            query_body: queries.query,
            nom_query: queries.nom,
            nom_qr: queries.group,
            first_name: queries.fam,
            userId: user.user.id,
            complexity: complexity
        }).then(() => {
            updateSaveQuery()
            queries.setSelectedAlg(nameQ)
        })
    }
    }

    const updateSaveQuery = () => {
        if (user.user.role === "ADMIN")
        getAlg().then(data => queries.setAlgs(data))
        else
        getAlgUser(user.user.id).then(data => {queries.setAlgs(data)})
    }
    const getQ = () => {
        queries.setGroup(queries.selectedAlg.nom_qr)
            queries.setFam(queries.selectedAlg.first_name)
            queries.setNom(queries.selectedAlg.nom_query)
            queries.setDesc(queries.selectedAlg.desc_query)
            queries.setType(queries.selectedAlg.table_var)
            queries.setGoal(queries.selectedAlg.goal_list)
            queries.setQuery(queries.selectedAlg.query_body)
        queries.setQuerySQL('')
        queries.setNamesCol(null)
        }
    const updateQ = () => {
        console.time("Update")
        updateAlg({query_name: queries.selectedAlg.query_name,
            desc_query: queries.desc,
            table_var: queries.type,
            goal_list: queries.goal,
            query_body: queries.query,
            nom_query: queries.nom,
            nom_qr: queries.group,
            first_name: queries.fam,
            userId: user.user.id,
            complexity: complexity
        }).then(() => {
            updateSaveQuery()
            let nameQ = queries.group + '_' + queries.nom + '_' + queries.fam
            queries.setSelectedAlg(nameQ)
        })
        console.timeEnd("Update")
    }
    const deleteQ = () => {
        deleteAlg(queries.selectedAlg.query_name).then(() => {
            queries.setGroup('')
            queries.setFam('')
            queries.setNom('')
            queries.setDesc('')
            queries.setType('')
            queries.setGoal('')
            queries.setQuery('')
            updateSaveQuery()
            queries.setSelectedAlg("Новый запрос")
        })
    }

    const executeQ = () => {
        executeAlg({query_sql: queries.querySQL}).then(r => {queries.setResultQuery(r)
            queries.setNamesCol(Object.keys(queries.resultQuery[0]))
            console.log(r)
            console.log(queries.resultQuery)
        })
    }

    const generateQ = () => {
        const query_object = {
            alias: queries.type,
            target_list: queries.goal,
            query_body: queries.query,
            description: queries.desc
        }
        generateAlg({query_object: query_object}).then(r => {
                queries.setQuerySQL(r)
            console.log(r)
            let chSELECT = 0
            let chDISTINCT = 0
            let chFROM = 0
            let chWHERE = 0
            let chMore = 0
            let chLess = 0
            let chEqual = 0
            let chNotEqual = 0
            let chMoreEqual = 0
            let chLessEqual = 0
            let chAND = 0
            let chOR = 0
            let chNOT = 0
            let chEXISTS = 0
            let chTable = 0
            let chAttribute = 0
            let chStar = 0
            let chNumber = 0
            let chString = 0
            let chWhereEl = 0
            let chJoin = 0
            let pos = -1

            while ((pos = r.indexOf("SELECT", pos + 1)) !== -1){
                chSELECT = chSELECT + 1
            }
            while ((pos = r.indexOf("DISTINCT", pos + 1)) !== -1){
                chDISTINCT = chDISTINCT + 1
            }
            while ((pos = r.indexOf("FROM", pos + 1)) !== -1){
                chFROM = chFROM + 1
            }
            while ((pos = r.indexOf("WHERE", pos + 1)) !== -1){
                chWHERE = chWHERE + 1
            }
            while ((pos = r.indexOf(">", pos + 1)) !== -1){
                chMore = chMore + 1
            }
            while ((pos = r.indexOf("<", pos + 1)) !== -1){
                chLess = chLess + 1
            }
            while ((pos = r.indexOf("=", pos + 1)) !== -1){
                chEqual = chEqual + 1
            }
            while ((pos = r.indexOf("<>", pos + 1)) !== -1){
                chNotEqual = chNotEqual + 1
            }
            while ((pos = r.indexOf(">=", pos + 1)) !== -1){
                chMoreEqual = chMoreEqual + 1
            }
            while ((pos = r.indexOf("<=", pos + 1)) !== -1){
                chLessEqual = chLessEqual + 1
            }
            while ((pos = r.indexOf("AND", pos + 1)) !== -1){
                chAND = chAND + 1
            }
            while ((pos = r.indexOf("OR", pos + 1)) !== -1){
                chOR = chOR + 1
            }
            while ((pos = r.indexOf("NOT", pos + 1)) !== -1){
                chNOT = chNOT + 1
            }
            while ((pos = r.indexOf("EXISTS", pos + 1)) !== -1){
                chEXISTS = chEXISTS + 1
            }
            while ((pos = r.indexOf("*", pos + 1)) !== -1){
                chStar = chStar + 1
            }

            while ((pos = regexIndexOf(r, /\d+/g, pos + 1)) !== -1){
                    chNumber = chNumber + 1
            }
            while ((pos = regexIndexOf(r, /'[\p{Alpha}+]' /gu, pos + 1)) !== -1){
                chString = chString + 1
            }

            for (let i=0; i<queries.tables.length; i++) {
                while ((pos = r.indexOf(' '+queries.tables[i]+' ', pos + 1)) !== -1){
                    chTable = chTable + 1
                }
            }

            while ((pos = r.indexOf(".", pos + 1)) !== -1){
                chAttribute = chAttribute + 1
            }

            while ((pos = regexIndexOf(r, /\w\.\w+\s*=\s*\w\.\w+/, pos + 1)) !== -1){
                chJoin = chJoin + 1
            }

            let chGoal = queries.goal.split(" ").length

            let logic = chMore+chLess+chEqual+chNotEqual+chMoreEqual+chLessEqual+chAND+chOR+chNOT
            let symbol = chStar + chString + chNumber
            chWhereEl = chAttribute - chGoal - chJoin * 2

            console.log(chAttribute)
            console.log(chSELECT)
            console.log(chDISTINCT)
            console.log(chFROM)
            console.log(chWHERE)
            console.log(logic)
            console.log(chEXISTS)
            console.log(chTable)
            console.log(symbol)
            console.log(chWhereEl)
            console.log(chJoin)
            console.log(chGoal)
            complexity = chSELECT * 2 + chDISTINCT * 2 + chFROM * 2 + chWHERE * 2 + logic * 3 + chEXISTS * 10 + chTable * 5 + symbol + chWhereEl * 4 + chJoin * 7 + chGoal * 2
           })
    }

    function regexIndexOf(text, re, i) {
        let indexInSuffix = text.slice(i).search(re);
        return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + i;
    }

    const viewQ = () => {
        let nameQ = queries.group + '_' + queries.nom + '_' + queries.fam;
        view({query_name:nameQ, query_sql:queries.querySQL}).then()
    }

    const testQ = () => {
        queries.setDesc("Вывести итоги отчетов, выполненных отделом разработки")
        queries.setType("reports AS X, employees AS Y, departments AS Z, tasks AS F")
        queries.setGoal("F.name_task, X.text_report, Y.full_name")
        queries.setQuery("(X[X.id_employee=Y.id_employee AND Y.id_department=Z.id_department AND F.id_task=X.id_task AND Z.name_department=\"Отдел разработки\"]Z)")
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

export default AlgButtons;