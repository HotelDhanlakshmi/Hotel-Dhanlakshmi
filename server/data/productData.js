// Complete product data with updated image URLs
const productData = [
  // Pizza & Burger Items
  { id: 'pb1', name: 'Veg Cheese Pizza', price: 169, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', description: 'Delicious cheese pizza with fresh vegetables' },
  { id: 'pb2', name: 'Cheese Burst Pizza', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', description: 'Pizza with cheese burst crust' },
  { id: 'pb3', name: 'Margarita Pizza', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', description: 'Classic Italian margarita pizza' },
  { id: 'pb4', name: 'Paneer Tikka Pizza', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop', description: 'Pizza topped with paneer tikka' },
  { id: 'pb5', name: 'Mushroom Pizza', price: 199, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop', description: 'Fresh mushroom pizza' },
  { id: 'pb6', name: 'Cheese Pizza Puff', price: 99, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop', description: 'Crispy cheese pizza puff' },
  { id: 'pb7', name: 'Schezwan Pizza', price: 149, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', description: 'Spicy schezwan flavored pizza' },
  { id: 'pb8', name: 'Classic Onion', price: 149, category: 'pizza-burger', type: 'veg', image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&h=300&fit=crop', description: 'Classic onion pizza' },

  // Starters
  { id: 's1', name: 'Roast Papad', price: 15, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Crispy roasted papad' },
  { id: 's2', name: 'Masala Papad', price: 35, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Papad with onion and spices' },
  { id: 's3', name: 'Nachani Roast', price: 20, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Roasted nachani snack' },
  { id: 's4', name: 'Nachani Fry Papad', price: 30, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Fried nachani papad' },
  { id: 's5', name: 'Papad Chutney', price: 80, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Papad with special chutney' },
  { id: 's6', name: 'Finger Chips', price: 99, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', description: 'Crispy golden finger chips' },
  { id: 's7', name: 'Cheese Corn Ball', price: 179, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Cheesy corn balls' },
  { id: 's8', name: 'Chana Fry', price: 119, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Spicy fried chickpeas' },
  { id: 's9', name: 'Soyabin Fry', price: 119, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Fried soybean snack' },
  { id: 's10', name: 'Veg Salad', price: 49, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', description: 'Fresh vegetable salad' },
  { id: 's11', name: 'Veg Sandwich', price: 59, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop', description: 'Grilled vegetable sandwich' },
  { id: 's12', name: 'Soyabin Roast', price: 120, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Roasted soybean' },
  { id: 's13', name: 'Chana Koliwada', price: 150, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Koliwada style chickpeas' },
  { id: 's14', name: 'Veg Pakoda', price: 140, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Mixed vegetable pakoda' },
  { id: 's15', name: 'Paneer Pakoda', price: 199, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Crispy paneer pakoda' },
  { id: 's16', name: 'Aloo Pakoda', price: 110, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Potato pakoda' },
  { id: 's17', name: 'Onion Pakoda', price: 110, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', description: 'Crispy onion pakoda' },
  { id: 's18', name: 'Palak Pakoda', price: 130, category: 'starters', type: 'veg', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: 'Spinach pakoda' },

  // Mutton Items
  { id: 'mt1', name: 'Mutton Fry', price: 250, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', description: 'Spicy mutton fry' },
  { id: 'mt2', name: 'Mutton Roast', price: 250, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', description: 'Roasted mutton with spices' },
  { id: 'mt3', name: 'Mutton Kadhai', price: 379, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Mutton cooked in kadhai' },
  { id: 'mt4', name: 'Mutton Mughlai', price: 379, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', description: 'Rich Mughlai mutton curry' },
  { id: 'mt5', name: 'Mutton Curry', price: 260, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop', description: 'Traditional mutton curry' },
  { id: 'mt6', name: 'Mutton Dahiwala', price: 320, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Mutton in yogurt gravy' },
  { id: 'mt7', name: 'Mutton Bhuna', price: 330, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Dry mutton bhuna' },
  { id: 'mt8', name: 'Mutton Do Pyaaz', price: 360, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Mutton with double onions' },
  { id: 'mt9', name: 'Mutton Keema', price: 350, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&h=300&fit=crop', description: 'Spiced mutton keema' },
  { id: 'mt10', name: 'Mutton Malvani Half', price: 549, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', description: 'Malvani style mutton curry' },
  { id: 'mt11', name: 'Mutton Tikka Masala', price: 320, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', description: 'Mutton tikka in masala gravy' },
  { id: 'mt12', name: 'Mutton Handi Half', price: 450, category: 'mutton', type: 'non-veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop', description: 'Mutton cooked in handi' },

  // Fish Items
  { id: 'f1', name: 'Fish Tawa Fry', price: 159, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop', description: 'Fish fried on tawa' },
  { id: 'f2', name: 'Fish Roast', price: 159, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', description: 'Roasted fish with spices' },
  { id: 'f3', name: 'Fish Curry', price: 169, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', description: 'Traditional fish curry' },
  { id: 'f4', name: 'Fish Malvani Half', price: 449, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&h=300&fit=crop', description: 'Malvani style fish curry' },
  { id: 'f5', name: 'Fish Handi Half', price: 350, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop', description: 'Fish cooked in handi' },
  { id: 'f6', name: 'Fish Handi Full', price: 649, category: 'fish', type: 'non-veg', image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop', description: 'Full portion fish handi' },

  // Rice & Roti Items
  { id: 'rr1', name: 'Tandoori Roti', price: 15, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', description: 'Fresh tandoori roti' },
  { id: 'rr2', name: 'Chapati', price: 20, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Soft wheat chapati' },
  { id: 'rr3', name: 'Bhakri', price: 20, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', description: 'Traditional bhakri' },
  { id: 'rr4', name: 'Garlic Butter Naan', price: 69, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Naan with garlic and butter' },
  { id: 'rr5', name: 'Butter Naan', price: 49, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Soft butter naan' },
  { id: 'rr6', name: 'Butter Tandoori Roti', price: 25, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', description: 'Tandoori roti with butter' },
  { id: 'rr7', name: 'Butter Chapati', price: 25, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Chapati with butter' },
  { id: 'rr8', name: 'Kulcha', price: 29, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Soft kulcha bread' },
  { id: 'rr9', name: 'Laccha Paratha', price: 59, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Layered laccha paratha' },
  { id: 'rr10', name: 'Paneer Stuffed Naan', price: 149, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', description: 'Naan stuffed with paneer' },
  { id: 'rr11', name: 'Steam Rice Full', price: 119, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', description: 'Full portion steamed rice' },
  { id: 'rr12', name: 'Steam Rice Half', price: 69, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', description: 'Half portion steamed rice' },
  { id: 'rr13', name: 'Lemon Rice', price: 149, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', description: 'Tangy lemon flavored rice' },
  { id: 'rr14', name: 'Jeera Rice Full', price: 129, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', description: 'Full portion cumin rice' },
  { id: 'rr15', name: 'Jeera Rice Half', price: 79, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', description: 'Half portion cumin rice' },
  { id: 'rr16', name: 'Curd Rice', price: 159, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', description: 'Rice with yogurt' },
  { id: 'rr17', name: 'Veg Pulao', price: 189, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop', description: 'Vegetable pulao' },
  { id: 'rr18', name: 'Mushroom Pulao', price: 219, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop', description: 'Mushroom flavored pulao' },
  { id: 'rr19', name: 'Kashmiri Pulao', price: 249, category: 'rice-roti', type: 'veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop', description: 'Sweet Kashmiri pulao' },

  // Paratha Items
  { id: 'p1', name: 'Paneer Paratha', price: 159, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Paratha stuffed with paneer' },
  { id: 'p2', name: 'Aloo Paratha', price: 89, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Potato stuffed paratha' },
  { id: 'p3', name: 'Laccha Paratha', price: 49, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', description: 'Layered laccha paratha' },
  { id: 'p4', name: 'Mix Paratha', price: 149, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Mixed vegetable paratha' },
  { id: 'p5', name: 'Methi Paratha', price: 139, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Fenugreek leaves paratha' },
  { id: 'p6', name: 'Cheese Paratha', price: 169, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Cheese stuffed paratha' },
  { id: 'p7', name: 'Gobi Paratha', price: 119, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', description: 'Cauliflower stuffed paratha' },
  { id: 'p8', name: 'Palak Paratha', price: 129, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Spinach paratha' },
  { id: 'p9', name: 'Schezwan Paratha', price: 159, category: 'paratha', type: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Spicy schezwan paratha' },

  // Chinese Veg Items
  { id: 'cv1', name: 'Veg Hakka Noodles', price: 149, category: 'chinese-veg', type: 'veg', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', description: 'Stir-fried noodles with vegetables' },
  { id: 'cv2', name: 'Veg Fried Rice', price: 139, category: 'chinese-veg', type: 'veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', description: 'Wok-fried rice with vegetables' },
  { id: 'cv3', name: 'Gobi Manchurian', price: 159, category: 'chinese-veg', type: 'veg', image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop', description: 'Crispy cauliflower in Manchurian sauce' },
  { id: 'cv4', name: 'Paneer Chilli', price: 179, category: 'chinese-veg', type: 'veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Paneer in spicy chilli sauce' },

  // Chinese Non-Veg Items
  { id: 'cnv1', name: 'Chicken Hakka Noodles', price: 179, category: 'chinese-non-veg', type: 'non-veg', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', description: 'Noodles with chicken pieces' },
  { id: 'cnv2', name: 'Chicken Fried Rice', price: 169, category: 'chinese-non-veg', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', description: 'Fried rice with chicken' },
  { id: 'cnv3', name: 'Chicken Manchurian', price: 189, category: 'chinese-non-veg', type: 'non-veg', image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop', description: 'Chicken in Manchurian sauce' },
  { id: 'cnv4', name: 'Chicken Chilli', price: 199, category: 'chinese-non-veg', type: 'non-veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Spicy chicken chilli' },

  // Veg Main Course Items
  { id: 'vmc1', name: 'Dal Tadka', price: 129, category: 'veg-main-course', type: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', description: 'Tempered yellow lentils' },
  { id: 'vmc2', name: 'Paneer Butter Masala', price: 179, category: 'veg-main-course', type: 'veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Paneer in rich tomato gravy' },
  { id: 'vmc3', name: 'Palak Paneer', price: 169, category: 'veg-main-course', type: 'veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', description: 'Paneer in spinach gravy' },
  { id: 'vmc4', name: 'Mix Veg Curry', price: 149, category: 'veg-main-course', type: 'veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Mixed vegetable curry' },

  // Tandoori & Kabab Items
  { id: 'tk1', name: 'Chicken Tandoori', price: 249, category: 'tandoori-kabab', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', description: 'Marinated chicken cooked in tandoor' },
  { id: 'tk2', name: 'Chicken Tikka', price: 219, category: 'tandoori-kabab', type: 'non-veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Boneless chicken tikka' },
  { id: 'tk3', name: 'Seekh Kabab', price: 199, category: 'tandoori-kabab', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82605b9aa?w=400&h=300&fit=crop', description: 'Spiced minced meat kabab' },
  { id: 'tk4', name: 'Paneer Tikka', price: 189, category: 'tandoori-kabab', type: 'veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Marinated paneer tikka' },

  // Special Thali Items
  { id: 'st1', name: 'Maharashtrian Thali', price: 299, category: 'sp-thali', type: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', description: 'Traditional Maharashtrian meal' },
  { id: 'st2', name: 'Non-Veg Thali', price: 349, category: 'sp-thali', type: 'non-veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Complete non-veg meal' },
  { id: 'st3', name: 'Punjabi Thali', price: 319, category: 'sp-thali', type: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', description: 'North Indian thali' },
  { id: 'st4', name: 'South Indian Thali', price: 279, category: 'sp-thali', type: 'veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', description: 'Authentic South Indian meal' },

  // Soups
  { id: 'sp1', name: 'Tomato Soup', price: 79, category: 'soups', type: 'veg', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', description: 'Classic tomato soup' },
  { id: 'sp2', name: 'Hot & Sour Soup', price: 89, category: 'soups', type: 'veg', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', description: 'Spicy and tangy soup' },
  { id: 'sp3', name: 'Chicken Soup', price: 99, category: 'soups', type: 'non-veg', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', description: 'Hearty chicken soup' },
  { id: 'sp4', name: 'Manchow Soup', price: 95, category: 'soups', type: 'veg', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', description: 'Thick Chinese soup' },

  // Beverages
  { id: 'bv1', name: 'Fresh Lime Soda', price: 49, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop', description: 'Refreshing lime soda' },
  { id: 'bv2', name: 'Lassi (Sweet/Salt)', price: 59, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1553787499-6d7ad2b8b3e4?w=400&h=300&fit=crop', description: 'Traditional yogurt drink' },
  { id: 'bv3', name: 'Masala Chai', price: 29, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', description: 'Spiced Indian tea' },
  { id: 'bv4', name: 'Fresh Fruit Juice', price: 69, category: 'beverages', type: 'veg', image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop', description: 'Seasonal fresh fruit juice' },

  // Biryani Items
  { id: 'b1', name: 'Egg Dum Biryani', price: 199, category: 'biryani', type: 'egg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop', description: 'Aromatic egg biryani' },
  { id: 'b2', name: 'Veg Dum Biryani', price: 219, category: 'biryani', type: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', description: 'Vegetable biryani' },
  { id: 'b3', name: 'Chicken Dum Biryani', price: 250, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop', description: 'Classic chicken biryani' },
  { id: 'b4', name: 'Chicken Hyderabadi Biryani', price: 280, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', description: 'Hyderabadi style chicken biryani' },
  { id: 'b5', name: 'Chicken Arabian Biryani', price: 799, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop', description: 'Arabian style chicken biryani' },
  { id: 'b6', name: 'Chicken Tikka Biryani', price: 599, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop', description: 'Chicken tikka biryani' },
  { id: 'b7', name: 'Chicken Biryani 1kg', price: 999, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop', description: '1kg chicken biryani' },
  { id: 'b8', name: 'Chicken Biryani 500gm', price: 549, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', description: '500gm chicken biryani' },
  { id: 'b9', name: 'Mutton Dum Biryani', price: 349, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop', description: 'Mutton dum biryani' },
  { id: 'b10', name: 'Mutton Tikka Biryani', price: 900, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop', description: 'Mutton tikka biryani' },
  { id: 'b11', name: 'Mutton Hyderabadi Biryani', price: 390, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop', description: 'Hyderabadi mutton biryani' },
  { id: 'b12', name: 'Mutton Arabic Biryani', price: 3499, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', description: 'Premium Arabic mutton biryani' },
  { id: 'b13', name: 'Mutton Biryani 500gm', price: 819, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop', description: '500gm mutton biryani' },
  { id: 'b14', name: 'Mutton Biryani 1kg', price: 1549, category: 'biryani', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop', description: '1kg mutton biryani' },

  // Chicken & Egg Items
  { id: 'ch1', name: 'Egg Curry', price: 119, category: 'chicken', type: 'egg', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop', description: 'Spiced egg curry' },
  { id: 'ch2', name: 'Egg Masala', price: 139, category: 'chicken', type: 'egg', image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop', description: 'Egg in masala gravy' },
  { id: 'ch3', name: 'Chicken Curry', price: 179, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', description: 'Traditional chicken curry' },
  { id: 'ch4', name: 'Chicken Roast', price: 165, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop', description: 'Roasted chicken with spices' },
  { id: 'ch5', name: 'Chicken Fry', price: 169, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop', description: 'Crispy fried chicken' },
  { id: 'ch6', name: 'Chicken Tawa', price: 189, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', description: 'Chicken cooked on tawa' },
  { id: 'ch7', name: 'Chicken 2 Piaz', price: 449, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop', description: 'Chicken with double onions' },
  { id: 'ch8', name: 'Chicken Kharda', price: 179, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&h=300&fit=crop', description: 'Spicy chicken kharda' },
  { id: 'ch9', name: 'Chicken Tikka Masala', price: 219, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', description: 'Chicken tikka in masala gravy' },
  { id: 'ch10', name: 'Chicken Dahiwala', price: 279, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', description: 'Chicken in yogurt gravy' },
  { id: 'ch11', name: 'Butter Chicken Curry', price: 229, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop', description: 'Rich butter chicken curry' },
  { id: 'ch12', name: 'Chicken Handi Half', price: 349, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', description: 'Half portion chicken handi' },
  { id: 'ch13', name: 'Chicken Malvani Full', price: 749, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Full portion Malvani chicken' },
  { id: 'ch14', name: 'Chicken Malvani Half', price: 399, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Half portion Malvani chicken' },
  { id: 'ch15', name: 'Chicken Handi Full', price: 699, category: 'chicken', type: 'non-veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: 'Full portion chicken handi' }
];

module.exports = productData;
