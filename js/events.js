async function loadStandard() {
	// 
    await loadInitData();
    document.getElementById("genSQL").disabled = false;
    let base = genSQLForBaseData() + 
	    "SELECT * FROM channel;\n" + 
	    "SELECT * FROM product;\n" + 
	    "SELECT * FROM property;\n";
    editor.getDoc().setValue(base);
    execute(editor.getValue() + ';');
}

function generateSQL() {
    let genCodeSQL = "";
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfChannel, "channel"));
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfProduct, "attribute"));
    genCodeSQL += genSQLFromCodeId(getCodeId(initialData.csvDataOfPropertise, "property"));
    genCodeSQL += "SELECT * FROM code;"
    editor.getDoc().setValue(createCode + genCodeSQL);
    execute(editor.getValue() + ';');
}