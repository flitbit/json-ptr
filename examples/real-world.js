/**
 * @hidden
 * @packageDocumentation
 */
const { JsonPointer } = require('../');
const bent = require('bent');
const fs = require('fs');
const getJSON = bent('json');
const url =
  'https://data.ct.gov/api/views/rybz-nyjw/rows.json?accessType=DOWNLOAD';
const datasetName = new JsonPointer('/meta/view/name');
const datasetColumns = new JsonPointer('/meta/view/columns');
const datasetData = new JsonPointer('/data');
const ColumnsOfInterest = [
  'date',
  'age',
  'sex',
  'race',
  'deathcity',
  'descriptionofinjury',
  'cod',
];
const dataColumns = [];
async function run() {
  const data = await getJSON(url);
  console.log(`Report: ${datasetName.get(data)}`);
  const columns = datasetColumns.get(data);
  // positions are offset by metadata.
  let i = -1;
  for (const c of columns) {
    ++i;
    const idx = ColumnsOfInterest.indexOf(c.fieldName);
    if (idx !== -1) {
      dataColumns[idx] = i;
    }
  }
  const rows = datasetData.get(data);
  for (const row of rows) {
    console.log(
      `${row[dataColumns[0]]} "${row[dataColumns[3]]}" ${row[dataColumns[2]]} ${
        row[dataColumns[1]]
      }yo died in ${row[dataColumns[4]]} of ${row[dataColumns[6]]} ${
        row[dataColumns[5]] && row[dataColumns[5]] !== 'null'
          ? '(' + row[dataColumns[5]] + ')'
          : ''
      }`,
    );
  }
}
run().catch((e) => {
  console.error(`Got error: ${e.stack || e}`);
});
