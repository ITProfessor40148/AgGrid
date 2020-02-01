let createCode = "DROP TABLE IF EXISTS code;\nCREATE TABLE code ( account integer, model integer, hierarchy integer, active integer, date_created text, code_type string, string_val string, int_val integer);\n";
let createTree = "DROP TABLE IF EXISTS tree;\nCREATE TABLE ​tree​ (account integer,model integer,hierarchy integer,attribute1 integer,attribute2 integer,attribute3 integer,attribute4 integer,attribute5 integer,attribute6 integer,attribute7 integer,attribute8 integer,attribute9 integer,attribute10 integer,channel1 integer,channel2 integer,channel3 integer,property integer,value float,value_date text,date_created text,user integer,active integer,tag integer,change integer);\n";
let joiningSQL = "SELECT * FROM (SELECT * FROM (SELECT * FROM property WHERE property1 NOT IN (    SELECT property1 FROM property LIMIT (1))), (SELECT * FROM channel WHERE channel1 NOT IN (  SELECT channel1 FROM channel LIMIT (1)))),(SELECT * FROM product WHERE attribute1 NOT IN ( SELECT attribute1 FROM product LIMIT (1)))";

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
    let cmmn = "INSERT INTO code VALUES (0, 0, 1, 0, '2020-02-03', ";
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
    let createChannel = "DROP TABLE IF EXISTS channel;\nCREATE TABLE channel (channel1 string, channel2 string, channel3 string);\n";
    let createProduct = "DROP TABLE IF EXISTS product;\nCREATE TABLE product (attribute1 string, attribute2 string, attribute3 string, attribute4 string, attribute5 string, attribute6 string, attribute7 string, attribute8 string, attribute9 string, attribute10 string);";
    let createProperty = "DROP TABLE IF EXISTS property;\nCREATE TABLE property (property1 string, property2 string, property3 string, property4 string);\n";
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