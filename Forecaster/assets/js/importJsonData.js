import data from "./data.json" assert {type : "json"};

export default data;

var entries = Object.entries(data);

console.log(entries);