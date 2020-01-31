function createDB() {
	let config = {
      locateFile: filename => `/dist/aa.txt`
    }
	let db = new SQL.Database();
	return db;
}

function getDB() {
	console.log(createDB());
}