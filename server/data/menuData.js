// Hotel Dhanlakshmi Menu Data
const menuData = {
  categories: [
    { id: 'pizza-burger', name: 'Pizza/Burger', icon: '🍕', marathi: 'पिझ्झा/बर्गर' },
    { id: 'chicken', name: 'Chicken', icon: '🍗', marathi: 'चिकन' },
    { id: 'mutton', name: 'Mutton', icon: '🍖', marathi: 'मटण' },
    { id: 'fish', name: 'Fish', icon: '🐟', marathi: 'मासे' },
    { id: 'rice-roti', name: 'Rice/Roti', icon: '🍚', marathi: 'भात/रोटी' },
    { id: 'paratha', name: 'Paratha', icon: '🫓', marathi: 'पराठा' },
    { id: 'starters', name: 'Starters', icon: '🥗', marathi: 'स्टार्टर्स' },
    { id: 'biryani', name: 'Biryani', icon: '🍛', marathi: 'बिर्याणी' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', marathi: 'पेय' },
  ],
  
  items: [
    // Pizza/Burger Items
    { id: 'pb1', name: 'Veg Cheese Pizza', marathiName: 'व्हेज चीज पिझ्झा', price: 169, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
    { id: 'pb2', name: 'Cheese Burst Pizza', marathiName: 'चीज बースト पिझ्झा', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
    { id: 'pb3', name: 'Margarita Pizza', marathiName: 'मार्गारिटा पिझ्झा', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop' },
    { id: 'pb4', name: 'Paneer Tikka Pizza', marathiName: 'पनीर टिक्का पिझ्झा', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop' },
    { id: 'pb5', name: 'Mushroom Pizza', marathiName: 'मशरूम पिझ्झा', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop' },
    { id: 'pb6', name: 'Cheese Pizza Puff', marathiName: 'चीज पिझ्झा पफ', price: 99, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop' },
    { id: 'pb7', name: 'Schezwan Pizza', marathiName: 'शेजवान पिझ्झा', price: 149, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },
    { id: 'pb8', name: 'Classic Onion', marathiName: 'क्लासिक ओनियन', price: 149, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&h=300&fit=crop' },
    
    // Beverages
    { id: 'bv1', name: 'Fresh Lime Soda', marathiName: 'फ्रेश लाइम सोडा', price: 49, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop' },
    { id: 'bv2', name: 'Lassi (Sweet/Salt)', marathiName: 'लस्सी (गोड/मीठी)', price: 59, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1553787499-6d7ad2b8b3e4?w=400&h=300&fit=crop' },
    { id: 'bv3', name: 'Masala Chai', marathiName: 'मसाला चहा', price: 29, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop' },
    { id: 'bv4', name: 'Fresh Fruit Juice', marathiName: 'ताज्या फळांचा ज्यूस', price: 69, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop' },

    // Chicken Items
    { id: 'ch1', name: 'Egg Curry', marathiName: 'अंडा करी', price: 119, category: 'chicken', type: 'egg', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop' },
    { id: 'ch2', name: 'Egg Masala', marathiName: 'अंडा मसाला', price: 139, category: 'chicken', type: 'egg', image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop' },
    { id: 'ch3', name: 'Chicken Curry', marathiName: 'चिकन करी', price: 179, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop' },
    { id: 'ch4', name: 'Chicken Roast', marathiName: 'चिकन रोस्ट', price: 165, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop' },
    { id: 'ch5', name: 'Chicken Fry', marathiName: 'चिकन फ्राय', price: 169, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop' },
    { id: 'ch6', name: 'Chicken Tawa', marathiName: 'चिकन तवा', price: 189, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop' },
    { id: 'ch7', name: 'Chicken 2 Piaz', marathiName: 'चिकन २ प्याझ', price: 449, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop' },
    { id: 'ch8', name: 'Chicken Kharda', marathiName: 'चिकन खर्डा', price: 179, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&h=300&fit=crop' },
    { id: 'ch9', name: 'Chicken Tikka Masala', marathiName: 'चिकन टिक्का मसाला', price: 219, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    { id: 'ch10', name: 'Chicken Dahiwala', marathiName: 'चिकन दहीवाला', price: 279, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
    { id: 'ch11', name: 'Butter Chicken Curry', marathiName: 'बटर चिकन करी', price: 229, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop' },
    { id: 'ch12', name: 'Chicken Handi Half', marathiName: 'चिकन हंडी (हाफ)', price: 349, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop' },
    { id: 'ch13', name: 'Chicken Malvani Full', marathiName: 'चिकन मालवणी (फुल)', price: 749, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
    { id: 'ch14', name: 'Chicken Malvani Half', marathiName: 'चिकन मालवणी (हाफ)', price: 399, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    { id: 'ch15', name: 'Chicken Handi Full', marathiName: 'चिकन हंडी (फुल)', price: 699, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },

    // Mutton Items
    { id: 'mt1', name: 'Mutton Fry', marathiName: 'मटण फ्राय', price: 250, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
    { id: 'mt2', name: 'Mutton Roast', marathiName: 'मटण रोस्ट', price: 250, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop' },
    { id: 'mt3', name: 'Mutton Kadhai', marathiName: 'मटण कढाई', price: 379, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
    { id: 'mt4', name: 'Mutton Mughlai', marathiName: 'मटण मुघलई', price: 379, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
    { id: 'mt5', name: 'Mutton Curry', marathiName: 'मटण करी', price: 260, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop' },
    { id: 'mt6', name: 'Mutton Dahiwala', marathiName: 'मटण दहीवाला', price: 320, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop' },
    { id: 'mt7', name: 'Mutton Bhuna', marathiName: 'मटण भुना', price: 330, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
    { id: 'mt8', name: 'Mutton Do Pyaaz', marathiName: 'मटण दो प्याझ', price: 360, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    { id: 'mt9', name: 'Mutton Keema', marathiName: 'मटण कीमा', price: 350, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&h=300&fit=crop' },
    { id: 'mt10', name: 'Mutton Malvani Half', marathiName: 'मटण मालवणी (हाफ)', price: 549, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop' },
    { id: 'mt11', name: 'Mutton Tikka Masala', marathiName: 'मटण टिक्का मसाला', price: 320, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    { id: 'mt12', name: 'Mutton Handi Half', marathiName: 'मटण हंडी (हाफ)', price: 450, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop' },

    // Fish Items
    { id: 'f1', name: 'Fish Tawa Fry', marathiName: 'फिश तवा फ्राय', price: 159, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop' },
    { id: 'f2', name: 'Fish Roast', marathiName: 'फिश रोस्ट', price: 159, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop' },
    { id: 'f3', name: 'Fish Curry', marathiName: 'फिश करी', price: 169, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
    { id: 'f4', name: 'Fish Malvani Half', marathiName: 'फिश मालवणी (हाफ)', price: 449, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&h=300&fit=crop' },
    { id: 'f5', name: 'Fish Handi Half', marathiName: 'फिश हंडी (हाफ)', price: 350, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop' },
    { id: 'f6', name: 'Fish Handi Full', marathiName: 'फिश हंडी (फुल)', price: 649, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop' },

    // Biryani Items
    { id: 'b1', name: 'Egg Dum Biryani', marathiName: 'अंडा दम बिर्याणी', price: 199, category: 'biryani', type: 'egg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop' },
    { id: 'b2', name: 'Veg Dum Biryani', marathiName: 'व्हेज दम बिर्याणी', price: 219, category: 'biryani', type: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    { id: 'b3', name: 'Chicken Dum Biryani', marathiName: 'चिकन दम बिर्याणी', price: 250, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop' },
    { id: 'b4', name: 'Chicken Hyderabadi Biryani', marathiName: 'चिकन हैदराबादी बिर्याणी', price: 280, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop' },
    { id: 'b5', name: 'Chicken Arabian Biryani', marathiName: 'चिकन अरेबियन बिर्याणी', price: 799, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop' },
    { id: 'b6', name: 'Chicken Tikka Biryani', marathiName: 'चिकन टिक्का बिर्याणी', price: 599, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop' },
    { id: 'b7', name: 'Chicken Biryani 1kg', marathiName: 'चिकन बिर्याणी (१ किलो)', price: 999, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop' },
    { id: 'b8', name: 'Chicken Biryani 500gm', marathiName: 'चिकन बिर्याणी (५०० ग्रॅम)', price: 549, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop' },
    { id: 'b9', name: 'Mutton Dum Biryani', marathiName: 'मटण दम बिर्याणी', price: 349, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop' },
    { id: 'b10', name: 'Mutton Tikka Biryani', marathiName: 'मटण टिक्का बिर्याणी', price: 900, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop' },
    { id: 'b11', name: 'Mutton Hyderabadi Biryani', marathiName: 'मटण हैदराबादी बिर्याणी', price: 390, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop' },
    { id: 'b12', name: 'Mutton Arabic Biryani', marathiName: 'मटण अरबी बिर्याणी', price: 3499, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop' },
    { id: 'b13', name: 'Mutton Biryani 500gm', marathiName: 'मटण बिर्याणी (५०० ग्रॅम)', price: 819, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop' },
    { id: 'b14', name: 'Mutton Biryani 1kg', marathiName: 'मटण बिर्याणी (१ किलो)', price: 1549, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop' }
  ]
};

module.exports = menuData;