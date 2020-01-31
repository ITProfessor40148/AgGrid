var initialData = {};
var primaryKeys = {};

function removeDuplicateElement(arr) {
    let unique = [...new Set(arr)];
    return unique;
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
    getCodeId(initialData.csvDataOfChannel, "channel");
    getCodeId(initialData.csvDataOfProduct, "attribute");
    getCodeId(initialData.csvDataOfPropertise, "property");
    getDB();
    
}

function getCodeId(data, prefix) {
    let code_row_common = [0, 0, 1, 0,"2020-01-03"];
    let code_row_data = [];
    let channel = {};
    let tmp = [];
    let tmp1 = {};
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
    code_row_common.push(tmp1);
}