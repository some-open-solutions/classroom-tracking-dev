function doGet(e){
  return initiate(e);
}

function doPost(e){
  return initiate(e);
}

function initiate(e) {
  var response = e.parameter;                                                       // e.parameter is basically the student's responses
  
  var response_sheet_id = response.response_id;
  var response_sheet    = SpreadsheetApp.openById(response_sheet_id);
  var response_sheet    = response_sheet.getSheetByName('Sheet1');
  
  switch(response.action) {    
    case "student_start":                                                           // add the student code to the response sheet
      var new_row  = response_sheet.getLastRow()+1;                                 // work out the last row
      if(new_row == 1){                                                             // i.e. a blank sheet
        new_row = 2;                                                                // in case a student signs up before the teacher has clicked "start".
      }
      response_sheet.getRange(new_row, 1).setValue(response.participant_code);      // put in the code where the above code has identified
      return valid_return("start student");                                         // if all has gone well, send this message
      break;
    case "student_respond":
      var student_row = rowOfValue(response_sheet,                                  // looking within this
                                   response.participant_code,                       // looking for this
                                   0);                                              // looking in this column
      var this_col = parseFloat(response.question_no) + 1;                          // i.e. the question number the student said they were answering
      response_sheet.getRange(student_row, this_col).setValue(response.response);   // store the response where we've identified relates to the student and the question
      return valid_return("student voting");                                        // if all has gone well, send this message
      break;    
  }  
}

function col_no(this_sheet,row_no,this_val){      
  var data = this_sheet.getDataRange().getValues();  
  for(var i = 0; i < data[row_no].length; i++){
    if(data[row_no][i] == this_val){
      return i + 1;
    }
  }
}

//based on Stéphane's solution at https://stackoverflow.com/questions/32565859/find-cell-matching-value-and-return-rownumber/32567126
function maxRowOfValue(this_sheet,cell_value,column_index){  
  var data = this_sheet.getDataRange().getValues();  
  var max_row = 1;
  for(var i = 0; i<data.length;i++){
    if(data[i][column_index] == cell_value){
      max_row = i+1;
    }
  }
  return max_row;
}

//based on Stéphane's solution at https://stackoverflow.com/questions/32565859/find-cell-matching-value-and-return-rownumber/32567126
function rowOfValue(this_sheet,cell_value,column_index){  
  var data = this_sheet.getDataRange().getValues();  
  for(var i = 0; i<data.length;i++){
    if(data[i][column_index] == cell_value){
      return i+1;
    }
  }
}

function valid_return(content){
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JAVASCRIPT); 
}