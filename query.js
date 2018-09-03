const Vertica = require('vertica');
const XLSX = require('xlsx');

const keys = require('./config');

//get today's date
function getToday() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

//Calculate the date 7 days ago
function getPastDate() {
  const oneWeekAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
    pastDay = oneWeekAgo.getDate(),
    pastMonth = oneWeekAgo.getMonth() + 1,
    pastYear = oneWeekAgo.getFullYear();

  return `${pastYear}-${pastMonth}-${pastDay}`;
}

const connectionOpts = {
  user: keys.DB_USER,
  host: keys.DB_HOST_SERVER,
  password: keys.DB_PASSWORD,
  port: '5433',
  database: keys.DB_NAME
};

//query DB and save results to .xlsx file
function generateFile() {
  const connection = Vertica.connect(connectionOpts, (err, connection) => {
    if (err) console.log(err);
  });

  connection
    .query(
      `SELECT CAST(f.Logtime AS DATE) as Date,
       f.ID_InventorySources as InventoryID,
       SUM(f.Impressions) as Impressions,
       SUM(f.WinningPriceInSspPartyCurrency) as Revenue

FROM Cubes.web_inventoryStats f

WHERE
       f.ID_SSpParties = 3
       AND f.LogtimeCET >= '${getPastDate()}'
       AND f.LogtimeCET < '${getToday()}'
GROUP BY Date, InventoryID
ORDER BY Date`,
      (err, results) => {
        //set "headers" (collumn names)
        results.rows.unshift([
          'Date',
          'Inventory ID',
          'Impressions',
          'MediaSpend'
        ]);

        // create excel workbook and sheet
        function make_book() {
          var ws = XLSX.utils.aoa_to_sheet(results.rows);
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          return wb;
        }

        //write to excel workbook
        XLSX.writeFileAsync(
          'C:/Users/p.kascionis/Desktop/autosender/excel/Daily report for BSW + SSP sources.xlsx',
          make_book(),
          err => {
            if (!err) {
              console.log('SuCCess');
            } else {
              return;
            }
          }
        );
      }
    )
    .on('end', status => connection.disconnect());
}

module.exports = generateFile;
