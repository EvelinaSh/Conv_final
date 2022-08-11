var os = require("os");

function TupleCalculusQuery (query_object) {

    this.title = query_object.title;
    this.alias = query_object.alias;
    this.target_list = query_object.target_list;
    this.query_body = query_object.query_body;
    this.description = query_object.description || "";
    this.sql = "";

    //вспомогательные поля
    //таблицы, атрибуты которых попали в целевой список
    this.outer_tables = [];
}




TupleCalculusQuery.prototype.make_sql = function() {
    let sql = "";
    console.log('herTCQ');

    return new Promise(function(resolve, reject) {
        let w;
        const inTables = {};
        const wVarInList = {};
        const wStrIn = this.alias;
        let lastComma = -2;
        let pos = -1;

//       // составляется ассоциативный массив , ключи которого - переменные, элементы - строка типа "студенты as x"
        let wVar;
        let wTabl;
        while ((pos = this.alias.indexOf(",", pos + 1)) !== -1) {

            wVar = this.alias.charAt(pos - 1);
            wTabl = this.alias.substring(lastComma + 2, pos);
            inTables[wVar] = wTabl;
            lastComma = pos;            // позиция предыдущей запятой

        }
        wVar = this.alias.charAt(this.alias.length-1);
          wTabl = this.alias.substring(lastComma+2);
          inTables[wVar] = wTabl;

         // составляется ассоциативный массив , ключи которого - j, элементы - переменная таблицы
        let wStrVar = "";       // строка из всех (уникальных) переменных
        let j = 0;
        lastComma = -2;
        pos = -1;
        let flg = 1;
// var t = ((pos = targetList.indexOf(",", pos + 1)) != -1 )|| (flg == 1);
// alert (t);

    while (((pos = this.target_list.indexOf(",", pos + 1)) !== -1 )|| (flg === 1)) {

      if (pos === -1) {flg = 0;}       // дошли до последнего выражения в целевом списке

      wVar = this.target_list.charAt(lastComma+2);     // находим переменную

      if (inTables[wVar]){          // если переменная объявлена в типах переменных
        
        if (pos !== -1) { lastComma = pos;}

        if (wStrVar.indexOf(wVar) === -1){     // если в строке из переменных целевого списка нет найденной переменной
          
          wStrVar = wStrVar + wVar;           // добавляем ее в строку переменых из целевого списка
          wVarInList[j] = wVar;               // добавляем в ассоциатвный массив из переменных целевого списка
          j=j+1;

        } 
      }
      else  {
          const errorMsg = "Невозможно определить, какая таблица соответствует переменной " + wVar;
          break;}

    }

        let srcQueryBody = this.query_body.trim();
        const w1 = srcQueryBody.replace(/\(/, "");
        const w2 = srcQueryBody.replace(/\)/, "");
        if (w1.length !== w2.length) {
       reject(new Error("Проверьте парность КРУГЛЫХ скобок !"));
    }

    // scrQueryBody.DoQuote(scrQueryBody);
    // // scrQueryBody.K_Prepare(scrQueryBody);
    // scrQueryBody = scrQueryBody.replace("~", " ");
    sql = "SELECT DISTINCT " + this.target_list + " FROM ";

        let i = 0;
        let q = wVarInList[i];

    while (i < j-1){
            
            sql = sql + inTables[q]+', ';
            i = i + 1;
            q = wVarInList[i];
        }
      // q = wVarInList[i];
      sql = sql + inTables[q] + '\n' + '  WHERE ';


        let qtyFORALL = 0;
        let posFORALL = srcQueryBody.search(/FORALL/);
  while ( posFORALL >= 0){
       
       
      srcQueryBody =  srcQueryBody.substring(0, posFORALL) + "NOT EXISTS " + srcQueryBody.charAt(posFORALL + 7) + " NOT (" + srcQueryBody.substring(posFORALL + 10);
      srcQueryBody = srcQueryBody.replace(/NOT \(NOT /, '(');
        // console.log('ПЕРЕМЕННАЯ КВАНТОРА  wVarTable', wVarTable);
       qtyFORALL = qtyFORALL + 1;
        // console.log('ПОСЛЕ ОБРАБОТКИ', wVarTable);
        posFORALL = srcQueryBody.indexOf("FORALL");
   }


  if (qtyFORALL === 1){
    srcQueryBody = srcQueryBody.replace(/NOT \(/, '(NOT (') + ")";
  } else{
    srcQueryBody = srcQueryBody.replace(/NOT \(/, '(NOT (');
  }

        let posIMPLY = srcQueryBody.search(/IMPLY/);
  if (posIMPLY > 0){
      w = srcQueryBody.indexOf("NOT (");
      srcQueryBody = srcQueryBody.substring(0, w) + srcQueryBody.substring( w + 5);
    srcQueryBody = srcQueryBody.replace(/IMPLY/, 'AND NOT');
  }

        let qtyOpenBracket = srcQueryBody.length - (srcQueryBody.replace(/\(/g, "")).length;
        let qtyCloseBracket = srcQueryBody.length - (srcQueryBody.replace(/\)/g, "")).length;

  if (qtyOpenBracket !== qtyCloseBracket){
    srcQueryBody = srcQueryBody.slice(0,-1);
  }

        let posEXISTS;
        let wVarTable;
        while (srcQueryBody.search(/EXISTS/) >= 0) {
            posEXISTS = srcQueryBody.indexOf("EXISTS");
            wVarTable = srcQueryBody.charAt(posEXISTS + 7);
            w = inTables[wVarTable];
            // console.log('ПЕРЕМЕННАЯ КВАНТОРА  wVarTable', wVarTable);
            sql = sql + srcQueryBody.substring(0, posEXISTS + 6) + "\n" + "(SELECT * FROM " + w + "\n" + "    WHERE ";


            srcQueryBody = srcQueryBody.substring(posEXISTS + 10);
            // console.log('ПОСЛЕ ОБРАБОТКИ', wVarTable);

        }

    sql = sql + srcQueryBody + ";";
  
    sql = sql.replace("^", ".")

    sql = sql.replace(/\"/g, "'");
    this.sql = sql;
    resolve();
        
        // reject("failure reason");
  }.bind(this));
};

export function convert_to_sql(query_object) {
    console.log('hereTCA');
    const query = new TupleCalculusQuery(query_object);

    return new Promise(function(resolve, reject) {
        console.log('объект', query);
        query.make_sql()
            .then(function() {
                //console.log('res convert to sql res', res);
                console.log('query after finish convert 1', query);
                query_object.processed_query_body = query.query_body;
                query_object.sql = query.sql;
                const q = query.sql;
                resolve(query.sql);
                console.log('из convert_to_sql', q);
            }).catch(function(err) {
            reject(err);
        });
    });
}

export default convert_to_sql;