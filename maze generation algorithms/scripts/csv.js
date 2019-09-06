//converts nXn array into a csv file, where each row in the array is a row in the spreadsheet
function downloadExcel(points) {
    var tableHeaders = ["x", "y"];

    //now a container for the excel data i.e. tableHeaders+datacreated:
    var dataTable = new Array();
    dataTable.push(tableHeaders);

    //now looping around the data
    points.forEach(function (col) {
        dataTable.push(col);
    });

    //now converting the array given into a `csv` content
    let csvContent = "data:text/csv;charset=utf-8,";
    dataTable.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    //calling the csv download via anchor tag(link) so we can provide a name for the file
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.style.display = 'none';
    link.setAttribute("download", "myCSV.csv"); //change it to give your own name
    link.innerHTML = "Click Here to download";
    document.body.appendChild(link); // Required for FF

    link.click();
    link.remove(); //removing the link after the download
}