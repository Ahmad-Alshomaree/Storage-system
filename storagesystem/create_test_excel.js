
const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.utils.book_new();
const wsData = [
    ["List No", "Shop No", "Item No", "Picture", "Ctn", "Pcs/Ctn", "QTY", "Price", "T/Price", "CBM/Cnt", "T/CBM", "Deposit"],
    [6647, 18667, "test-box-1", "", 5, 20, 100, 10, 1000, 0.5, 2.5, ""],
    [6648, "stock", "test-box-2", "", 2, 50, 100, 5, 500, 0.2, 0.4, ""]
];
const ws = XLSX.utils.aoa_to_sheet(wsData);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, "test.xlsx");
console.log("test.xlsx created");
