/**
 * @hidden
 * @packageDocumentation
 */


import { JsonPointer } from '../src';
import * as bent from 'bent';

const url = 'https://data.ct.gov/api/views/rybz-nyjw/rows.json?accessType=DOWNLOAD';

const datasetName = new JsonPointer('/meta/view/name');
const datasetColumns = new JsonPointer('/meta/view/columns');
const datasetData = new JsonPointer('/data');

const ColumnsOfInterest = ['Date', 'Age', 'Sex', 'Race', 'DeathCity', 'DescriptionofInjury', 'COD'];
interface Column {
  name: string;
  position: number;
}
const dataColumns: number[] = [];

const getJSON = bent('json');
getJSON(url)
  .then((data: unknown) => {
    console.log(`Report: ${datasetName.get(data)}`);

    const columns = datasetColumns.get(data) as Column[];
    // positions are offset by metadata.
    let i = -1;
    for (const c of columns) {
      ++i;
      const idx = ColumnsOfInterest.indexOf(c.name);
      if (idx !== -1) {
        dataColumns[idx] = i;
      }
    }

    const rows = datasetData.get(data) as Record<string, unknown>[];
    for (const row of rows) {
      console.log(
        `${row[dataColumns[0]]} "${row[dataColumns[3]]}" ${row[dataColumns[2]]} ${row[dataColumns[1]]}yo died in ${
        row[dataColumns[4]]
        } of ${row[dataColumns[6]]} ${
        row[dataColumns[5]] && row[dataColumns[5]] !== 'null' ? '(' + row[dataColumns[5]] + ')' : ''
        }`
      );
    }
  })
  .catch((e: Error) => {
    console.error(`Got error: ${e.stack || e}`);
  });
