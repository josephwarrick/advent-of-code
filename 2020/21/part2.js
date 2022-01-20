'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);
const foods = lines.map((line) => {
  const [ match, ingredients, allergens ] = /(.+) \(contains (.+)\)/.exec(line);
  return {
    ingredients: ingredients.split(' '),
    allergens: allergens.split(', ')
  };
});

function discoverIngredientsToAllergens() {
  const possibleIngredients = foods.reduce((possibleIngredients, food) => {
    return food.allergens.reduce((possibleIngredients, allergen) => {
      if (possibleIngredients[allergen] === undefined) {
        possibleIngredients[allergen] = new Set(food.ingredients);
      } else {
        possibleIngredients[allergen].forEach((possibleIngredient) => {
          if (food.ingredients.includes(possibleIngredient) === false) possibleIngredients[allergen].delete(possibleIngredient);
        });
      }
  
      return possibleIngredients;
    }, possibleIngredients);
  }, {});

  let ingredients = {};

  while(Object.keys(ingredients).length < Object.keys(possibleIngredients).length) {
    Object.keys(possibleIngredients).forEach((allergen) => {
      if (possibleIngredients[allergen].size === 1) {
        const ingredient = [...possibleIngredients[allergen]].pop();
        ingredients[allergen] = ingredient;
        Object.values(possibleIngredients).forEach(possibleIngredientList => possibleIngredientList.delete(ingredient));
      }
    });
  }

  return ingredients;
}


const allergensToIngredient = discoverIngredientsToAllergens();

const ingredientList = Object.keys(allergensToIngredient).sort().map(allergen => allergensToIngredient[allergen]).join(',');
console.log(ingredientList);
