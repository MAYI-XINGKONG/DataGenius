import * as XLSX from "xlsx";

function importExcel(file:any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e:any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            // 获取字段名
            const headers:any = jsonData[0];
            // 将数据内容与字段名结合生成 JSON 数据
            const records = jsonData.slice(2).map((row:any) => {
              const record:any = {};
              headers.forEach((header:any, index:number) => {
                record[header] = row[index];
              });
              return record;
            }); 
            resolve(records);   
    };
    reader.onerror = (e) => {
      reject(e);
    };
    
    reader.readAsArrayBuffer(file);
  });
}


function exportExcelTable(json:any, name:string, titleArr:string[], sheetName:string,fields:string[]) {
    //列表变量名、文件名、第一行标题、表名、字段名
    let data = new Array();
    if (!Array.isArray(json)) return console.warn('数据请传入数组');
    if (!Array.isArray(titleArr)) return console.warn('标题请传入数组');
    if (!Array.isArray(fields)) return console.warn('字段请传入数组');
    data=json.map(obj=>{
      return fields.map(field=>{
        return obj[field]
      })
    })
    data.splice(0, 0,  titleArr);
    // fields为英文字段表头,一般不需要，需要直接把下面注释打开即可
    data.splice(0, 0, fields);
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    // 此处隐藏英文字段表头
    let wsrows = [{ hidden: true }];
    ws['!rows'] = wsrows; // ws - worksheet
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    /* generate file and send to client */
    XLSX.writeFile(wb, name+".xlsx");
  }


  export{
    importExcel,
    exportExcelTable
  }
