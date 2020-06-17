function doGet(e){
  return initiate(e);
}

function doPost(e){
  return initiate(e);
}


function initiate(e) {
  var response = e.parameter;
  
  var question_sheet_id = response.question_id;
  var question_sheet    = SpreadsheetApp.openById(question_sheet_id);
  var question_sheet    = question_sheet.getSheetByName('Sheet1');
  var response_sheet_id = response.response_id;
  var response_sheet    = SpreadsheetApp.openById(response_sheet_id);
  var response_sheet    = response_sheet.getSheetByName('Sheet1');
  var complete_col = col_no(question_sheet,0,"complete");
  
  
  var example_var = 3;
  
  if(typeof(complete_col) == "undefined"){
    complete_col = question_sheet.getDataRange().getValues()[0].length + 1;
  }
  
  /*
  question_sheet.getRange(1,10).setValue("complete_col = " + complete_col);
  question_sheet.getRange(1,9).setValue("example_var = " + example_var);
  */
  
  switch(response.action) {
    case "start":
      
      //identify the "complete" column
      
      
      question_sheet.getRange(1, complete_col, question_sheet.getMaxRows(), complete_col).clearContent();
      question_sheet.getRange(1, complete_col).setValue("complete");
      
      response_sheet.getRange(1, 1).setValue("participant_code"); //this can be hard coded
      response_sheet.getRange(1, 2).setValue("q1_resp"); //this can be hard coded
      
      break;
    case "start_student":
      
      //add the student code to the response sheet
      //work out the last row
      var new_row  = response_sheet.getLastRow()+1;
      if(new_row == 1){
        new_row = 2; //in case a student signs up before the teacher has clicked "start".
      }
      response_sheet.getRange(new_row, 1).setValue(response.participant_code); //this can be hard coded
      
      
      break;
    case "vote":
      
      var student_row = rowOfValue(response_sheet,            //looking within this
                                   response.participant_code, //looking for this
                                   0);                        //looking in this column
      var this_col = parseFloat(response.question_no) + 2;
      response_sheet.getRange(student_row, this_col).setValue(response.response);
      
      break;
    case "next":
      
      var quest_no = maxRowOfValue(question_sheet,"yes",complete_col - 1);
      //count how many "yes"s in the complete column
      
      question_sheet.getRange(quest_no + 1, complete_col).setValue("yes");
      
      break;
    case "previous":
      
      //count how many "yes"s in the complete column
      var quest_no = maxRowOfValue(question_sheet,"yes",complete_col - 1);
      question_sheet.getRange(quest_no , complete_col).setValue("");
      
      
      
      break;
    default:
      // code block
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