async function loadInitData() {
    var file_channel = "\\datas\\channel_hierarchy.csv";
    var file_product = "\\datas\\product_hierarchy.csv";
    var file_propertise = "\\datas\\properties.csv";
    var csvDataOfChannel, csvDataOfProduct, csvDataOfPropertise;
    await $.get(file_channel, function (data) {
        csvDataOfChannel = Papa.parse(data);
    });
    await $.get(file_product, function (data) {
        csvDataOfProduct = Papa.parse(data);
    });
    await $.get(file_propertise, function (data) {
        csvDataOfPropertise = Papa.parse(data);
    });
    
}