async function loadStandard() {
	// 
    await loadInitData();
    document.getElementById("genSQL").disabled = false;
    let base = genSQLForBaseData() + 
	    "SELECT * FROM channel;\n" + 
	    "SELECT * FROM product;\n" + 
	    "SELECT * FROM property;\n";
    editor.getDoc().setValue(base);
    execute(editor.getValue());
}

function generateSQL() {
    let genCodeSQL = "";
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfChannel, "channel"));
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfProduct, "attribute"));
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfPropertise, "property"));
    genCodeSQL += "SELECT * FROM code;"
    editor.getDoc().setValue(createCode + genCodeSQL);
    execute(editor.getValue());
    let c = getChannelCode(1, "Costco");
	worker.postMessage({ action: 'exec', sql: joiningSQL });
    worker.onmessage = function (event) {
		let results = event.data.results;
		if (!results) {
			error({message: event.data.error});
			return;
		}
		// console.log(results[0].columns.toString());
		let res = generate_SQL_Statement(results, "2020-02-22", "2020-02-23");
		editor.getDoc().setValue(createTree + res.join(""));
	}
}