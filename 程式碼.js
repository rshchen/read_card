function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}



//新增 PicSee 短網址功能
function getPicseeShortUrl(longUrl) {
  const token = 'YOUR_PICSEE_API_TOKEN'; // <-- 替換為你的 PicSee Token
  const apiUrl = 'https://api.pics.ee/v1/shorten';

  const payload = {
    url: longUrl,
    title: '自動產生表單',
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const result = JSON.parse(response.getContentText());

  if (result.success) {
    return result.data.short_url;
  } else {
    Logger.log('PicSee 縮網址失敗：' + result.message);
    return null;
  }
}



// 從表單送出的資料來建立表單
function createScantronFormWithData(data) {
  const formTitle = data.formTitle;
  const questions =  data.questions.split(',').map(Number); // 字串轉陣列
  const classNum =  data.classNum.split(',');
  const useShortUrl = data.useShortUrl === 'true'; // 新增參數
  const form = FormApp.create(formTitle);

  let item = form.addMultipleChoiceItem();
  item.setTitle("班級")
      .setChoices(classNum.map(num => item.createChoice(String(num))))
      .setRequired(true);

  form.addTextItem().setTitle("座號").setRequired(true);
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
form.addPageBreakItem().setTitle("單選題");
const singleChoiceQuestions = parseInt(questions[0]);
const singleChoiceOptions = ["A", "B", "C", "D", "E"];
const singleNumbers = Array.from({ length: singleChoiceQuestions }, (_, i) => i + 1);
const singleChunks = chunkEndAtMultipleOf5(singleNumbers);

singleChunks.forEach((group, index) => {
  const rows = group.map(num => `${num}`);
  form.addGridItem()
      .setTitle(`一、單選題`)
      .setRows(rows)
      .setColumns(singleChoiceOptions);
});

// 多選題
form.addPageBreakItem().setTitle("多選題");
const multipleChoiceQuestions = parseInt(questions[1]);
const multipleChoiceOptions = ["A", "B", "C", "D", "E"];
const multiStart = singleChoiceQuestions + 1;
const multiNumbers = Array.from({ length: multipleChoiceQuestions }, (_, i) => i + multiStart);
const multiChunks = chunkEndAtMultipleOf5(multiNumbers);

multiChunks.forEach((group, index) => {
  const rows = group.map(num => `${num}`);
  form.addCheckboxGridItem()
      .setTitle(`二、多選題`)
      .setRows(rows)
      .setColumns(multipleChoiceOptions);
});

  // 選填題
  const optionalQuestionsGrids = questions.slice(2);
  const optionalOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "±", "-"];
  form.addPageBreakItem().setTitle("選填題");

  let currentQuestionIndex = singleChoiceQuestions + multipleChoiceQuestions + 1;
  let currentRowIndex = currentQuestionIndex;
  for (let i = 0; i < optionalQuestionsGrids.length; i++) {
    let gridItem = form.addCheckboxGridItem()
                      .setTitle(`三、選填題`);

    let rowCount = optionalQuestionsGrids[i];
    let rowLabels = [];
    for (let j = 0; j < rowCount; j++) {
      rowLabels.push(`${currentRowIndex}`);
      currentRowIndex++;
    }
    gridItem.setRows(rowLabels).setColumns(optionalOptions);
    currentQuestionIndex++;
  }

  const url = form.getPublishedUrl();

  if (useShortUrl) {
    const shortUrl = getPicseeShortUrl(url); // PicSee 縮網址
    return shortUrl || url; // 若失敗則回傳原始網址
  } else {
    return url;
  }
}
