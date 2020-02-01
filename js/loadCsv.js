var initialData = {};

async function loadInitData() {
    let file_channel = "\\datas\\channel_hierarchy.csv";
    let file_product = "\\datas\\product_hierarchy.csv";
    let file_propertise = "\\datas\\properties.csv";
    await $.get(file_channel, function (data) {
        initialData["csvDataOfChannel"] = Papa.parse(data).data;
    });
    await $.get(file_product, function (data) {
        initialData["csvDataOfProduct"] = Papa.parse(data).data;
    });
    await $.get(file_propertise, function (data) {
        initialData["csvDataOfPropertise"] = Papa.parse(data).data;
    });
    // genSQLForBaseData();
    // genSQLFromCodeId(getCodeId(initialData.csvDataOfChannel, "channel"));
    // genSQLFromCodeId(getCodeId(initialData.csvDataOfProduct, "attribute"));
    // genSQLFromCodeId(getCodeId(initialData.csvDataOfPropertise, "property"));
}