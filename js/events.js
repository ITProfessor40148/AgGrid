async function loadStandard() {
	// 
    await loadInitData();
    document.getElementById("genSQL").disabled = false;
    let base = genSQLForBaseData() + 
	    "SELECT * FROM channel;\n" + 
	    "SELECT * FROM product;\n" + 
	    "SELECT * FROM property;\n";
    let genCodeSQL = "";
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfChannel, "channel"));
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfProduct, "attribute"));
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfPropertise, "property"));
    genCodeSQL += "SELECT * FROM code;"
    editor.getDoc().setValue(createCode + base + genCodeSQL);
    execute(editor.getValue());
    // editor.getDoc().setValue(genCodeSQL);
    // execute(editor.getValue());
}

function generateSQL() {
    execute(editor.getValue());
	worker.postMessage({ action: 'exec', sql: joiningSQL });
    worker.onmessage = function (event) {
		let results = event.data.results;
		if (!results) {
			error({message: event.data.error});
			return;
		}
		let res = generate_SQL_Statement(results, "2020-11-20", "2020-11-23");
		editor.getDoc().setValue(createTree + res.join("") + "\nSELECT * FROM tree;");
	}
}