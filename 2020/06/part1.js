'use strict';

const fs = require('fs');

const forms = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);

const yesCounts = forms.map((form) => {
  const allAnswers = form.split('\n').join('').split('');
  const answersObj = allAnswers.reduce((obj, question) => { obj[question] = true; return obj; }, {});
  return Object.keys(answersObj).length;
});

console.log(yesCounts.reduce((total, count) => { return total + count; }, 0));
