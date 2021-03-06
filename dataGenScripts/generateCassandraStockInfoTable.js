const fs = require('fs');
const { Readable } = require('stream');
const faker = require('faker');

const letters = 'ABCDEFGFIJKLMNOPQRSTUVWXYZ'
let generateTicker = (i) => {
  let remainder = i;
  let place390625 = Math.trunc(remainder / 390625); 
  remainder -= 390625 * place390625
  let place15625 = Math.trunc(remainder / 15625);
  remainder -= 15625 * place15625
  let place625 = Math.trunc(remainder / 625);
  remainder -= 625 * place625;
  let place25 = Math.trunc(remainder/ 25);
  remainder -= 25 * place25
  let place1 = remainder;

  return letters[place390625] + letters[place15625] + letters[place625] + letters[place25] + letters[place1];
}

let generateRow = (i) => {
  return `${generateTicker(i)}|${faker.company.companyName()}|[${faker.lorem.word()}, ${faker.lorem.word()}]|` +
  `${faker.random.number({min: 100, max: 10000})}|${faker.random.number({min: 0, max: 100})}|` +
  `${faker.random.number({min: 1, max: 5000})}|${faker.random.number({min: 0, max: 100})}`
}

let generateRows = (i) => {
  let row = '';
  let buckets = ['day', 'week', 'month', 'threeMonth', 'year', 'fiveYear'];
  let rowStatic = generateRow();
  for (let j = 0; j < buckets.length; j++) {
    for (let i = 0; i < 100; i++) {
      row += `${rowStatic}|${buckets[j]}|${faker.random.number({min: 1, max: 5000})}\n`
    }
  }
  return row;
}

const inStream = new Readable({
  read() {
    this.push(generateRows(this.count--));
    if (this.count === 0) {
      this.push(null);
    }
  }
 });

inStream.count = 1e4;
inStream.pipe(fs.createWriteStream('./cassandraStocks.txt'));