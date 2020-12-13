'use strict';

const fs = require('fs');

const forms = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);

const yesCounts = forms.map((form) => {
  const rows = form.split('\n').filter(Boolean);
  const allAnswers = rows.join('').split('');
  const answersObj = allAnswers.reduce((obj, question) => { obj[question] = true; return obj; }, {});

  return Object.keys(answersObj).filter(answer => rows.every(row => row.split('').includes(answer))).length;
});

console.log(yesCounts.reduce((total, count) => { return total + count; }, 0));
