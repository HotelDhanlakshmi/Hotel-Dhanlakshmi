import { categories } from './categories.js';
import { pizzaBurgerItems } from './pizzaBurger.js';
import { chickenItems } from './chicken.js';
import { muttonItems } from './mutton.js';
import { fishItems } from './fish.js';
import { riceRotiItems } from './riceRoti.js';
import { parathaItems } from './paratha.js';
import { startersItems } from './starters.js';
import { biryaniItems } from './biryani.js';
import { chineseVegItems } from './chineseVeg.js';
import { chineseNonVegItems } from './chineseNonVeg.js';
import { vegMainCourseItems } from './vegMainCourse.js';
import { tandooriKababItems } from './tandooriKabab.js';
import { spThaliItems } from './spThali.js';
import { beveragesItems } from './beverages.js';
import { soupsItems } from './soups.js';

// Combine all menu items
export const allMenuItems = [
  ...pizzaBurgerItems,
  ...chickenItems,
  ...muttonItems,
  ...fishItems,
  ...riceRotiItems,
  ...parathaItems,
  ...startersItems,
  ...biryaniItems,
  ...chineseVegItems,
  ...chineseNonVegItems,
  ...vegMainCourseItems,
  ...tandooriKababItems,
  ...spThaliItems,
  ...beveragesItems,
  ...soupsItems
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
