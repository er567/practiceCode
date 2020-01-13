const xlsx = require('node-xlsx');
const fs = require('fs');
const sheets = xlsx.parse('./1.xlsx');
var str = '';
var options = process.argv;
var time = options[2]

sheets.forEach(function(sheet){
  for(var rowId in sheet['data']){
      if (rowId != 0) {
        var row = sheet['data'][rowId];
        str += `
interface ${row[1]}
ipv6 nd ra prefix ${row[0].replace('::1','::')}
ipv6 address ${row[0]}
ipv6 nd ns retrans-timer ${time}
quit
`
      }
  }
});

fs.writeFile("test.txt", str, function(err) {
  if(err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});