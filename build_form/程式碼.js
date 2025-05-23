function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// 從表單送出的資料來建立表單
function createScantronFormWithData(data) {
  const formTitle = data.formTitle;
  // 將 questions 字串直接分割成數字陣列，不再處理多層結構
  const questions =  data.questions.split(',').map(Number);
  const classNum =  data.classNum.split(',');

  const form = FormApp.create(formTitle);

  let item = form.addMultipleChoiceItem();
  item.setTitle("班級")
      .setChoices(classNum.map(num => item.createChoice(String(num))))
      .setRequired(true);

  var seatNumberItem = form.addTextItem()
                           .setTitle("座號")
                           .setRequired(true); // 設置為必填項

  // 設置數字格式驗證
  var seatNumberValidation = FormApp.createTextValidation()
                                   .requireNumber() // 只允許數字
                                   .setHelpText('請輸入有效的座號') // 輸入無效時顯示的提示訊息
                                   .build();
  
  seatNumberItem.setValidation(seatNumberValidation); // 為座號欄位設置驗證規則
  
  form.addTextItem().setTitle("姓名").setRequired(true);

  // 工具函式：依 5 的倍數結尾分段
  function chunkEndAtMultipleOf5(lst) {
    const result = [];
    let i = 0;
    while (i < lst.length) {
      let j = i;
      while (j < lst.length && lst[j] % 5 !== 0) {
        j++;
      }
      if (j < lst.length) {
        result.push(lst.slice(i, j + 1)); // 包含 j
        i = j + 1;
      } else {
        result.push(lst.slice(i));
        break;
      }
    }
    return result;
  }

  // 單選題
  form.addPageBreakItem().setTitle("單選題"); // 添加標題
  const singleChoiceQuestions = questions[0];
  const singleChoiceOptions = ["A", "B", "C", "D", "E"];
  const singleNumbers = Array.from({ length: singleChoiceQuestions }, (_, i) => i + 1);
  const singleChunks = chunkEndAtMultipleOf5(singleNumbers);

  singleChunks.forEach((group) => {
    const rows = group.map(num => `${num}`);
    form.addGridItem() // GridItem 預設就是單選
        .setTitle(`一、單選題`)
        .setRows(rows)
        .setColumns(singleChoiceOptions);
  });

  // 多選題
  form.addPageBreakItem().setTitle("多選題"); // 添加標題
  const multipleChoiceQuestions = questions[1];
  const multipleChoiceOptions = ["A", "B", "C", "D", "E"];
  const multiStart = singleChoiceQuestions + 1;
  const multiNumbers = Array.from({ length: multipleChoiceQuestions }, (_, i) => i + multiStart);
  const multiChunks = chunkEndAtMultipleOf5(multiNumbers);

  multiChunks.forEach((group) => {
    const rows = group.map(num => `${num}`);
    form.addCheckboxGridItem() // CheckboxGridItem 是多選
        .setTitle(`二、多選題`)
        .setRows(rows)
        .setColumns(multipleChoiceOptions);
  });

  // 選填題 (MultipleChoiceGridItem)
  const optionalQuestionsGrids = questions.slice(2);  // 選填題數量
  const optionalOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "±", "-"];
  form.addPageBreakItem().setTitle("選填題");

  let currentRowIndex = singleChoiceQuestions + multipleChoiceQuestions + 1;
  optionalQuestionsGrids.forEach((rowCount) => {
    let gridItem = form.addGridItem() // GridItem 預設就是單選
                          .setTitle(`三、選填題`);

    let rowLabels = [];
    for (let j = 0; j < rowCount; j++) {
      rowLabels.push(`${currentRowIndex}`);
      currentRowIndex++;
    }
    gridItem.setRows(rowLabels).setColumns(optionalOptions);
  });

  const formURL = form.getPublishedUrl();

  Logger.log(`表單 URL: ${formURL}`);

  return formURL; // 直接返回表單 URL
}