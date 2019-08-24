import fs from 'fs';
import path from 'path';

class CirclePositionData {
  constructor(
    public space: string,
    public name: string,
    public url: string,
    public siteInfo: string,
    public meta: string,
  ) {}
}

class CircleCheckData {
  constructor(
    public priorityLabel: string,
    public prefix: string,
    public number: string,
    public suffix: string,
    public name: string,
    public author: string,
    public url: string,
    public circleMsUrl: string,
    public memo: string,
  ) {}
}

function toCsvString(check: CircleCheckData, circle: CirclePositionData) {
  return `${check.priorityLabel},${circle.space},${check.name},${check.author},${check.url},${check.memo}`;
}

function parseCirclePostionList() {
  const [header, ...circleListRow] = fs
    .readFileSync(path.resolve(__dirname, './comitia129.csv'))
    .toString()
    .split('\n');
  const circleData = circleListRow.map(
    row => new CirclePositionData(...(row.split(',') as [string, string, string, string, string])),
  );

  return circleData;
}

function parseCheckList() {
  const [header, ...checkListRow] = fs
    .readFileSync(path.resolve(__dirname, './check-comitia128.csv'))
    .toString()
    .split('\n');
  const circleData = checkListRow.map(row => {
    const items = row.split(',') as [string, string, string, string, string, string, string, string, string];

    return new CircleCheckData(...items);
  });

  return circleData;
}
function main() {
  const circleData = parseCirclePostionList();
  const checkData = parseCheckList();

  const matchedItems = circleData
    .map(circle => {
      const check = checkData.find(check => {
        if (circle.name === check.name) return true;
        if (circle.url === check.url && circle.url !== '') return true;
        if (circle.url === check.circleMsUrl && circle.url !== '') return true;
      });
      return check ? { circle, check } : undefined;
    })
    .filter(item => item) as { circle: CirclePositionData; check: CircleCheckData }[];
  const csvString = matchedItems.map(({ check, circle }) => toCsvString(check, circle)).join('\n');
  console.log(csvString);
  // console.log(`length: ${matchedItems.length}`);
}

main();
