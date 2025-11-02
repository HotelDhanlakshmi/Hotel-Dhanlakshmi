import { categories } from './categories.js';
import { pizzaBurgerItems } from './pizzaBurger.js';
import { chickenItems } from './chicken.js';
import { muttonItems } from './mutton.js';
import { fishItems } from './fish.js';
import { riceRotiItems } from './riceRoti.js';
import { parathaItems } from './paratha.js';
import { startersItems } from './starters.js';
import { biryaniItems } from './biryani.js';

// Combine all menu items
export const allMenuItems = [
  ...pizzaBurgerItems,
  ...chickenItems,
  ...muttonItems,
  ...fishItems,
  ...riceRotiItems,
  ...parathaItems,
  ...startersItems,
  ...biryaniItems
];

export { categories };

// Helper functions
export const getItemsByCategory = (categoryId) => {
  return allMenuItems.filter(item => item.category === categoryId);
};

export const getItemById = (itemId) => {
  return allMenuItems.find(item => item.id === itemId);
};

export const searchItems = (query) => {
  return allMenuItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
};
