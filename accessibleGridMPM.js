/*
* AccessibleGrid() - Constructor function to creat an accessible HTML grid object.
*                    Note: this constructor does NOT populate the grid with data.
*
* Parameters: oConfig (configuration object)
* Options in oConfig:
*     divId      - id of the <div> in which to create the table
*     tableId    - id of the <table> to be created
*     ariaLive   - value of aria-live attribute of the <div>; defaults to 'assertive'
*     summary    - string for summary attribute of the <table>
*     caption    - string for the <caption>
*     colDesc    - columns descriptor object
*
* Options in columns descriptor object:
*     header     - column header text
*     dataIndex  - name of field in input data object to be mapped to this column
*     renderer   - user-provided function to call to render data value (optional)
*
* VERSION = 0.03, 09 May 2012
*/
function AccessibleGrid(oConfig)  {
	this.$divId = $('#' + oConfig.divId); // the jQuery object for the div into which to place the table
	this.tableId = oConfig.tableId;
	this.theadId = oConfig.tableId + '_head';
	this.tbodyId = oConfig.tableId + '_body';
	this.colDesc = oConfig.colDesc;
	this.nRows = 0; // Number of rows in the body of the table.
	
	var szCaption = oConfig.caption || '';
	var szSummary = oConfig.summary || '';
	var szAriaLive = oConfig.ariaLive || 'assertive';
  
	var szTemp = '';
	var i;
  
//	szTemp  = '<table id="' + this.tableId + '"' + ' summary="' + szSummary + '"' + ' aria-live="' + szAriaLive + '"' + ' role="grid">';  //  NOTE: LEAVE OUT the Aria-Live stuff and the 'grid'--if you leave them in, JAWS won't recognize table.  MPM, 8/1/13
    szTemp  = '<table id="' + this.tableId + '"' + ' summary="' + szSummary + '">';
	szTemp += '<caption>' + szCaption + '</caption>';
  
	szTemp += '<thead id="' + this.theadId + '"><tr>';
	for (i = 0; i < this.colDesc.length; i++) {
		szTemp += '<th id="' + this.tableId + '_' + this.colDesc[i].dataIndex + '"' + ' scope="col" role="gridcell" width="' + this.colDesc[i].width + '">';  
		szTemp += this.colDesc[i].header + '</th>';
	}
	szTemp += '</tr></thead>';
  
	szTemp += '<tbody ' + 'id="' + this.tableId + '_body">';
	szTemp += '</tbody>';
	szTemp += '</table>';

	$(szTemp).prependTo(this.$divId);
  
	this.$id = $('#' + this.tableId);                  // the jQuery object for the table
	this.$thead = $('#' + this.theadId);               // the jQuery object for the table header
	this.$headers = $('#' + this.theadId).find('th');  // an array of jquery objects for the header cells
	this.$data = $('#' + this.tbodyId);                // the jQuery object for the table body
}; // end AccessibleGrid() constructor

/*
* loadArrayData() - Method to load the <tbody> of an AccessibleGrid object from a JavaScript array of objects.
*                   Ensures that the <tbody> of the table is empty before loading the data.
* 
* Parameters: data - JavaScript array of objects.
*
* @return N/A
*/
AccessibleGrid.prototype.loadArrayData = function(aData) {

	var thisObj = this;
	var szRowId;
	var szRow;
	var count;
	
	// Remove any child nodes of the <tbody> element.
	thisObj.$data.empty();
	
	// Iterate over each record in the array, i.e., each row in the table.
	count = 0;
	$.each(aData, function(ndx, record) {
		count = count + 1;
		var szRow = '<tr>';
		var szRowId = thisObj.tableId + '_row_' + count;
		var i;
		var szTd;
		var szHeaders;
		var tmp;

		// Iterate over the columns in a row.
		for (i = 0; i < thisObj.colDesc.length; i++) {
			if (i === 0) {
				szTd = '<td id="' + szRowId + '"' + ' scope="row" role="gridcell">';    
			} else {
				szHeaders = thisObj.tableId + '_' + thisObj.colDesc[i].dataIndex + ' ' + szRowId;
				szTd = '<td headers="' + szHeaders + '" role="gridcell" '  + thisObj.colDesc[i].style + '>';      //NOTE:  'style' item added here by me to right-align text.  MPM  
			}
			szRow += szTd;  
			szRow += (thisObj.colDesc[i].renderer === undefined) ? record[thisObj.colDesc[i].dataIndex] 
			                                                     : thisObj.colDesc[i].renderer(record[thisObj.colDesc[i].dataIndex]);
			szRow += '</td>';
		} // for loop over columns
		szRow += '</tr>'; 
		thisObj.$data.append(szRow);
	});
	this.nRows = count;
}; // end loadArrayData()

/*
* clearBody() - Method to remove the entire contents of the <tbody> of an AccessibleGrid.
* 
* Parameters: none.
*
* @return N/A
*/
AccessibleGrid.prototype.clearBody = function() {
	this.$data.empty();
	this.nRows = 0;
}; // end clearBody()



