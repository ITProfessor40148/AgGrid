let createCode = "DROP TABLE IF EXISTS code;\nCREATE TABLE code ( account INTEGER, model INTEGER, hierarchy INTEGER, active INTEGER, date_created TEXT, code_type STRING, string_val STRING, int_val INTEGER);\n";
let createTree = "DROP TABLE IF EXISTS tree;\nCREATE TABLE tree (account INTEGER,model INTEGER,hierarchy INTEGER,attribute1 INTEGER,attribute2 INTEGER,attribute3 INTEGER,attribute4 INTEGER,attribute5 INTEGER,attribute6 INTEGER,attribute7 INTEGER,attribute8 INTEGER,attribute9 INTEGER,attribute10 INTEGER,channel1 INTEGER,channel2 INTEGER,channel3 INTEGER,property INTEGER,value float,value_date TEXT,date_created TEXT,user INTEGER,active INTEGER,tag INTEGER,change INTEGER);\n";
let joiningSQL = "SELECT * FROM (SELECT * FROM (SELECT property1 AS property FROM property WHERE property1 NOT IN ( SELECT property1 FROM property LIMIT (1))), (SELECT * FROM channel WHERE channel1 NOT IN ( SELECT channel1 FROM channel LIMIT (1)))),(SELECT * FROM product WHERE attribute1 NOT IN ( SELECT attribute1 FROM product LIMIT (1)));";

function getCommonCodeSQL(code_type, channel_num, value_string) {
    return "SELECT int_val FROM code WHERE code_type = '" + code_type + channel_num + "' AND string_val = '" + value_string + "';";
}

function getChannelCode(channel_num, value_string) {
    let sqls123 = getCommonCodeSQL("channel", channel_num, value_string);
    let ret;
    worker.postMessage({ action: 'exec', sql: sqls123 });
    worker.onmessage = function (event) {
        let results = event.data.results;
        if (!results) {
            error({message: event.data.error});
            return;
        }
        ret = results;
        console.log(ret);
    }
    return ret;
}

function getCodeId(data, prefix) {
    let tmp = [];
    let tmp1 = {};
    if (prefix == "property") {
        data.map((items, ids) => {
            if (ids !== 0) {
                tmp.push(items[0]);
            }
        })
        tmp.map((item, id) => {
            if (item.length !== 0) tmp1[prefix + (id + 1)] = item;
        });
        return tmp1;
    }

    data.map((item, id) => {
        if (id !== 0 && item[0] !== "") {
            item.map((item1, id1) => {
                if (tmp[id1] == null) tmp.push([]);
                tmp[id1].push(item1);
            })
        }
    })

    tmp.map((item, id) => {
        if (item.length !== 0) tmp1[prefix + (id + 1)] = (removeDuplicateElement(item));
    });
    return tmp1;
}

function genSQLFromCodeId(data) {
    let sqls = [];
    let cmmn = "INSERT INTO code VALUES (0, 0, 1, 0, '" + getTodayDate() + "', ";
    Object.keys(data).map((key, id) => {
        let sql = "";
        if (key.includes("property")) {
            sql = cmmn + "'" + key + "'" + ", '" + data[key] + "', " + id + ");\n";
            sqls.push(sql);
        } else {
            data[key].map((items, ids) => {
                sql = cmmn + "'" + key + "'" + ",";
                sql += "'" + items + "'" + "," + (ids + 1) + ");\n";
                sqls.push(sql);
            })
        }
    })
    return sqls.join("");
    // editor.getDoc().setValue(array2SQL(sqls));
}

function genSQLForBaseData() {
    let createChannel = "DROP TABLE IF EXISTS channel;\nCREATE TABLE channel (channel1 STRING, channel2 STRING, channel3 string);\n";
    let createProduct = "DROP TABLE IF EXISTS product;\nCREATE TABLE product (attribute1 STRING, attribute2 STRING, attribute3 STRING, attribute4 STRING, attribute5 STRING, attribute6 STRING, attribute7 STRING, attribute8 STRING, attribute9 STRING, attribute10 string);";
    let createProperty = "DROP TABLE IF EXISTS property;\nCREATE TABLE property (property1 STRING, property2 STRING, property3 STRING, property4 string);\n";
    let insertChannelData = [];
    let insertProductData = [];
    let insertPropertyData = [];
    let commonChannelData = "INSERT INTO channel VALUES (";
    let commonPropertyData = "INSERT INTO property VALUES (";
    let commonProductData = "INSERT INTO product VALUES (";
    initialData.csvDataOfChannel.map((item, id) => {
        insertChannelData.push(commonChannelData + "'" + item[0] + "', " + "'" + item[1] + "', " + "'" + item[2] + "');\n");
    });
    initialData.csvDataOfProduct.map(item => {
        let tmp = "";
        for (let i = 0; i < 9; i++)
            tmp += "'" + item[i] + "', ";
        insertProductData.push(commonProductData + tmp + "'" + item[9] + "');\n");
    })
    initialData.csvDataOfPropertise.map(item => {
        let tmp = "";
        for (let i = 0; i < 3; i++)
            tmp += "'" + item[i] + "', ";
        insertPropertyData.push(commonPropertyData + tmp + "'" + item[3] + "');\n");
    })
    let res = createChannel + insertChannelData.join("") + createProduct + insertProductData.join("") + createProperty + insertPropertyData.join("");
    return res;
    // console.log(insertChannelData);
    // console.log(insertProductData);
    // console.log(insertPropertyData);
}

function generate_SQL_Statement(codes, start_date, end_date) {
    let today = getTodayDate();
    // console.log(codes[0].columns.toString());
    let start_date_tmp = start_date.split("-");
    let end_date_tmp = end_date.split("-");
    let res = [];
    for(let i = new Date(start_date); i <= new Date(end_date); i.setDate(i.getDate() + 1)){
        let tmp = i.getFullYear() + "-" + (i.getMonth() + 1) + "-" + i.getDate();
        codes[0].values.map((stmt, id) => {
            let each = stmt + " , " + tmp + " , " + today + ", 0, 0, 1, 0";
            let sql = "";
            sql = "INSERT INTO tree (" + codes[0].columns.toString() + ", value_date, date_created, account, model, hierarchy, active, user, tag, change, value" + ") VALUES (";
            stmt.map((field, id) => {
                let r = "";
                if(id === 0) {
                    // r = getPropertyCode(id + 1);
                } else if (id < 4) {
                    // r = getChannelCode(id + 1);
                } else {
                    // r = getProductCode(id + 1);
                }
                sql += "'" + r + "', ";
            })
            sql += "'" + tmp + "', '" + today + "', " + "0, 0, 1, 0, 2, 2, 2, 2" + Math.floor(Math.random() * 100) + ");\n";
            res.push(sql);
        })
    }
    return res;
}