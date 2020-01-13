/*
 * Developed by Gleb Iakovlev on 4/2/19 2:45 PM.
 * Last modified 4/2/19 2:45 PM.
 * Copyright (c) 2019 . All rights reserved.
 */
import Game from "./Game.js";

export default  class testGame{

    constructor(document) {

        this.export_arr = [];
        this.trialType = 'demo';
        this.demoObstructions =  [
            0,
            2,
            2
        ];
        this.demoTrajectories =  [
            1,
            5,
            9
        ];



        this.baseDir = 'https://piproject.s3.us-east-2.amazonaws.com';
        this.trialsNumber = 2;
        this.document = document;
    }

    exportToCSV(){

        this.jsonToCSVConvertor(this.export_arr,"Data",true);

    }


    jsonToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        JSONData = JSON.stringify(JSONData);
        let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

        let CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            let row = "";

            //This loop will extract the label from 1st index of on array
            for (let index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (let i = 0; i < arrData.length; i++) {
            let row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (let index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV === '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        let fileName = "Report_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");

        //Initialize file format you want csv or xls
        //let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        let blob = new Blob([CSV], { type: 'text/csv;charset=utf-8;' });
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    init() {

        new Game(this,this.document,3);
    }

}
