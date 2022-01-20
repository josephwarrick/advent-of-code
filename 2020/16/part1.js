'use strict';

const fs = require('fs');

const sections = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);
const rules = parseRules(sections[0].split('\n'));
const myTicket = sections[1].split('\n')[1].split(',').map(Number);
const nearbyTickets = sections[2].split('\n').slice(1).map(ticket => ticket.split(',').map(Number));

function parseRules(lines) {
  return lines.reduce((rules, line) => {
    const ruleName = line.split(': ')[0];
    const ruleRange = line.split(': ')[1].split(' or ').map(rangePart => rangePart.split('-').map(Number));

    rules[ruleName] = ruleRange;

    return rules;
  }, {});
}

function isValidForRule(value, rule) {
  return rule.some((range) => {
    return value >= range[0] && value <= range[1];
  });
}

function isValidForAnyRule(value) {
  return Object.values(rules).some(rule => isValidForRule(value, rule));
}

const invalidTicketValues = nearbyTickets.map((ticket) => {
  return ticket.filter(field => isValidForAnyRule(field) === false);
});

const sumOfInvalidTicketValues = invalidTicketValues.reduce((sum, ticket) => {
  return ticket.reduce((innerSum, value) => {
    return innerSum + value;
  }, sum);
}, 0);

console.log(sumOfInvalidTicketValues);
