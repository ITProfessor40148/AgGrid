var initialData = {};
var primaryKeys = {};

function removeDuplicateElement(arr) {
    let unique = [...new Set(arr)];
    return unique;
}

function array2SQL(data) {
    return data.toString().split(";").join(";\n").split("\n,").join("\n");
}

async function loadInitData() {
    let file_channel = "\\datas\\channel_hierarchy.csv";
    let file_product = "\\datas\\product_hierarchy.csv";
    let file_propertise = "\\datas\\properties.csv";
    await $.get(file_channel, function (data) {
        initialData.csvDataOfChannel = Papa.parse(data).data;
    });
    await $.get(file_product, function (data) {
        initialData.csvDataOfProduct = Papa.parse(data).data;
    });
    await $.get(file_propertise, function (data) {
        initialData.csvDataOfPropertise = Papa.parse(data).data;
    });
    genSQLForBaseData();
    genSQLFromCodeId(getCodeId(initialData.csvDataOfChannel, "channel"));
    genSQLFromCodeId(getCodeId(initialData.csvDataOfProduct, "attribute"));
    genSQLFromCodeId(getCodeId(initialData.csvDataOfPropertise, "property"));
}

function getCodeId(data, prefix) {
    let tmp = [];
    let tmp1 = {};
    if(prefix == "property") {
        data.map((items, ids) => {
            if(ids !== 0) {
                tmp.push(items[0]); 
            }
        })
        tmp.map((item, id) => {
            if(item.length !== 0) tmp1[prefix + (id + 1)] = item;
        });
        return tmp1;
    }

    data.map((item, id) => {
        if(id !== 0 && item[0] !== ""){
            item.map((item1, id1) => {
                if(tmp[id1] == null) tmp.push([]);
                tmp[id1].push(item1);
            })
        }
    })

    tmp.map((item, id) => {
        if(item.length !== 0) tmp1[prefix + (id + 1)] = (removeDuplicateElement(item));
    });
    return tmp1;
}

function genSQLFromCodeId(data) {
    let sqls = [];
    let cmmn = "INSERT INTO code VALUES (0, 0, 1, 0, '2020-02-03', ";
    Object.keys(data).map((key, id) => {
        let sql = "";
        if(key.includes("property")) {
            sql = cmmn + "'" + key + "'" + ", " + data[key] + ", " + id + ");";
                sqls.push(sql);
        } else {
            data[key].map((items, ids) => {
                sql = cmmn + "'" + key + "'" + ",";
                sql += "'" + items + "'" + "," + (ids + 1) + ");";
                sqls.push(sql);
            })
        }
    })
    document.getElementById("sql").append(array2SQL(sqls));
}

function genSQLForBaseData() {
    let createCode = "DROP TABLE IF EXISTS code;CREATE TABLE code ( account integer, model integer, hierarchy integer, active integer, date_created text,                    code_type string, string_val string, int_val integer);";
    let createTree = "DROP TABLE IF EXIST tree;CREATE TABLE ​tree​ (account integer,model integer,hierarchy integer,attribute1 integer,attribute2 integer,attribute3 integer,attribute4 integer,attribute5 integer,attribute6 integer,attribute7 integer,attribute8 integer,attribute9 integer,attribute10 integer,channel1 integer,channel2 integer,channel3 integer,property integer,value float,value_date text,date_created text,user integer,active integer,tag integer,change integer);";
    let createChannel = "DROP TABLE IF EXIST channel;CREATE TABLE channel (channel1 string, channel2 string, channel3 string);";
    let createProduct = "DROP TABLE IF EXIST product;CREATE TABLE product (attribute1 string, attribute2 string, attribute3 string, attribute4 string, attribute5 string, attribute6 string, attribute7 string, attribute8 string, attribute9 string, attribute10 string);";
    let createProperty = "DROP TABLE IF EXIST property;CREATE TABLE property (property1 string, property2 string, property3 string, property4 string);";
    let insertChannelData = [];
    let insertProductData = [];
    let insertPropertyData = [];
    let commonChannelData = "INSERT INTO channel VALUES (";
    let commonPropertyData = "INSERT INTO property VALUES (";
    let commonProductData = "INSERT INTO product VALUES (";
    initialData.csvDataOfChannel.map((item, id) => {
        insertChannelData.push(commonChannelData + "'" + item[0] + "', " + "'" + item[1] + "', " + "'" + item[2] + "');");
    });
    initialData.csvDataOfProduct.map(item => {
        let tmp = "";
        for(let i = 0; i < 9; i++) 
            tmp += "'" + item[i] + "', ";
        insertProductData.push(commonProductData + tmp + "'" + item[9] + "');");
    })
    initialData.csvDataOfPropertise.map(item => {
        let tmp = "";
        for(let i = 0; i < 3; i++)
            tmp += "'" + item[i] + "', ";
        insertPropertyData.push(commonPropertyData + tmp + "'" + item[3] + "');");
    })
    // console.log(insertChannelData);
    // console.log(insertProductData);
    // console.log(insertPropertyData);
}