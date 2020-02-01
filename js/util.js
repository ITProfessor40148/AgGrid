function removeDuplicateElement(arr) {
    let unique = [...new Set(arr)];
    return unique;
}

function array2SQL(data) {
    return data.toString().split(";").join(";\n").split("\n,").join("\n");
}