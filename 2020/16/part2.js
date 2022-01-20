'use strict';

const fs = require('fs');

const sections = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);
const rules = parseRules(sections[0].split('\n'));
const myTicket = sections[1].split('\n')[1].split(',').map(Number);
const nearbyTickets = sections[2].split('\n').slice(1).map(ticket => ticket.split(',').map(Number));

const rulesToColumn = Object.keys(rules).reduce((rulesToColumn, ruleName) => {
  rulesToColumn[ruleName] = null;
  return rulesToColumn;
}, {});

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

function getColumnsForRule(rule, tickets) {
  return tickets[0].map((column, i) => {
    const everyTicketIsValidForRule = tickets.every(ticket => isValidForRule(ticket[i], rule));
    if (everyTicketIsValidForRule === false) return false;
    return i;
  }).filter(column => column !== false);
}

const validTickets = nearbyTickets.filter((ticket) => {
  return ticket.every(field => isValidForAnyRule(field));
});


while (Object.values(rulesToColumn).includes(null)) {
  Object.keys(rulesToColumn).forEach((ruleName) => {
    if (rulesToColumn[ruleName]) return;

    const possibleColumns = getColumnsForRule(rules[ruleName], validTickets);
    const unusedPossibleColumns = possibleColumns.filter(possibleColumn => Object.values(rulesToColumn).includes(possibleColumn) === false);

    if (unusedPossibleColumns.length === 1) rulesToColumn[ruleName] = unusedPossibleColumns[0];
  });
}

const departureColumns = Object.keys(rules).filter(ruleName => /^departure/.test(ruleName)).map(ruleName => rulesToColumn[ruleName]);
const myDepartureValues = departureColumns.map(column => myTicket[column]);
const productOfMyDepartureValues = myDepartureValues.reduce((sum, value) => { return sum * value; }, 1);

console.log(productOfMyDepartureValues);
