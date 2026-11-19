/**
 * Foodie Hub - Data Store
 * Gourmet Menu, Categories, Initial Snaps, and Promos
 */

const MENU_DATA_VERSION = '4.0';

const FOOD_MENU = [
  // --- BURGERS ---
  {
    id: 'b1',
    name: '24K Gold Leaf & Black Truffle Smash Burger',
    category: 'burgers',
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.95,
    reviewsCount: 412,
    prepTime: '18-22 min',
    calories: '680 kcal',
    isVeg: false,
    badge: 'Chef Signature 🔥',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Double smashed Angus beef patties layered with black winter truffle aioli, 18-month aged cave Gruyère, caramelized shallots, and touch of edible 24K gold on artisanal brioche.',
    ingredients: ['Double Angus Beef', 'Black Winter Truffle', 'Cave-Aged Gruyère', 'Caramelized Shallots', 'Toasted Brioche'],
    addons: [
      { name: 'Extra Périgord Truffle Shavings', price: 3.50 },
      { name: 'Double Thick Smoked Bacon', price: 2.75 },
      { name: 'Melted Reserve Gruyère Crown', price: 2.00 }
    ]
  },
  {
    id: 'b2',
    name: 'Kobe Wagyu & Bourbon BBQ Beast Burger',
    category: 'burgers',
    price: 22.50,
    originalPrice: 27.00,
    rating: 4.98,
    reviewsCount: 529,
    prepTime: '20-25 min',
    calories: '820 kcal',
    isVeg: false,
    badge: 'Ultra Premium 👑',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    description: 'Certified Wagyu beef patty glazed in 25-year Kentucky bourbon BBQ reduction, tempura vidalia rings, smoked cheddar, and house dill pickles.',
    ingredients: ['Wagyu Beef Patty', 'Bourbon BBQ Glaze', 'Smoked White Cheddar', 'Tempura Onion Rings', 'Artisan Bun'],
    addons: [
      { name: 'Second Wagyu Patty (150g)', price: 5.50 },
      { name: 'Charred Jalapeño Relish', price: 1.50 },
      { name: 'Fried Farm Duck Egg', price: 2.25 }
    ]
  },
  {
    id: 'b3',
    name: 'Imperial Saffron Nashville Hot Chicken',
    category: 'burgers',
    price: 16.99,
    originalPrice: 21.00,
    rating: 4.91,
    reviewsCount: 388,
    prepTime: '15-20 min',
    calories: '710 kcal',
    isVeg: false,
    badge: 'Fiery Spicy 🌶️',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy fried organic buttermilk chicken steeped in Nashville hot chili oil and saffron butter, crunchy Champagne slaw, and truffle comeback aioli.',
    ingredients: ['Buttermilk Fried Chicken', 'Nashville Hot Chili Oil', 'Champagne Slaw', 'Truffle Comeback Aioli', 'Pickle Chips'],
    addons: [
      { name: 'Ghost Pepper Dust (Extreme)', price: 1.25 },
      { name: 'Molten Brie Cheese Dip', price: 2.50 },
      { name: 'Extra Crisp Garlic Fries', price: 3.50 }
    ]
  },
  {
    id: 'b4',
    name: 'Royal Truffle Avocado & Halloumi Burger',
    category: 'burgers',
    price: 15.75,
    originalPrice: 19.50,
    rating: 4.88,
    reviewsCount: 290,
    prepTime: '15-18 min',
    calories: '540 kcal',
    isVeg: true,
    badge: 'Pure Veg 🌱',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    description: 'Pan-seared Cypriot halloumi cheese, sliced fresh Hass avocado, flame-roasted piquillo peppers, wild rocket, and 12-year balsamic glaze on multi-seed brioche.',
    ingredients: ['Cypriot Halloumi', 'Fresh Hass Avocado', 'Piquillo Peppers', 'Wild Rocket Arugula', 'Aged Balsamic'],
    addons: [
      { name: 'Extra Grilled Halloumi Slab', price: 3.00 },
      { name: 'Herb Truffle Aioli', price: 1.75 },
      { name: 'Caramelized Balsamic Onions', price: 1.50 }
    ]
  },

  // --- PIZZA ---
  {
    id: 'p1',
    name: 'Authentic Neapolitan Margherita D.O.P.',
    category: 'pizza',
    price: 17.50,
    originalPrice: 21.00,
    rating: 4.96,
    reviewsCount: 684,
    prepTime: '18-22 min',
    calories: '780 kcal',
    isVeg: true,
    badge: 'Italian D.O.P. 🍕',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    description: '72-hour cold fermented sourdough crust, volcanic San Marzano D.O.P. tomatoes, fresh Campania buffalo mozzarella, sweet basil, and extra virgin cold-press olive oil.',
    ingredients: ['San Marzano D.O.P.', 'Campania Buffalo Mozzarella', 'Fresh Sweet Basil', 'Ligurian EVOO', 'Sea Salt'],
    addons: [
      { name: 'Double Buffalo Mozzarella', price: 3.50 },
      { name: 'Hot Chili Infused Honey Drizzle', price: 1.75 },
      { name: 'Black Garlic Crust Dip', price: 2.00 }
    ]
  },
  {
    id: 'p2',
    name: 'Dry-Aged Pepperoni & Hot Truffle Honey',
    category: 'pizza',
    price: 20.50,
    originalPrice: 25.00,
    rating: 4.97,
    reviewsCount: 760,
    prepTime: '20-24 min',
    calories: '940 kcal',
    isVeg: false,
    badge: 'Best Seller 🔥',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    description: 'Cups of crispy charred artisanal pepperoni, whole-milk fior di latte, spicy Calabrian chili wildflower honey, and shaved 36-month Parmigiano-Reggiano.',
    ingredients: ['Crispy Cup Pepperoni', 'Fior di Latte', 'Calabrian Chili Honey', 'San Marzano Sauce', '36-Mo Parmigiano'],
    addons: [
      { name: 'Stuffed Truffle Ricotta Crust', price: 4.50 },
      { name: 'Smoked Provolone Layer', price: 2.50 },
      { name: 'Side Garlic Truffle Butter', price: 1.50 }
    ]
  },
  {
    id: 'p3',
    name: 'Alba White Truffle & Wild Morels Blanco',
    category: 'pizza',
    price: 24.00,
    originalPrice: 29.50,
    rating: 4.99,
    reviewsCount: 340,
    prepTime: '20-25 min',
    calories: '860 kcal',
    isVeg: true,
    badge: 'Alba Truffle Luxury ✨',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Garlic mascarpone bianca cream, sautéed French chanterelle and wild morel mushrooms, creamy Taleggio cheese, and generous shaved white truffles.',
    ingredients: ['White Truffle Shavings', 'Wild Morel Mushrooms', 'Taleggio D.O.P.', 'Mascarpone Crème', 'Fresh Thyme'],
    addons: [
      { name: 'San Daniele Prosciutto Crudo', price: 4.00 },
      { name: 'Wild Peppery Arugula Crown', price: 1.75 },
      { name: 'Extra Alba Truffle Glaze', price: 3.25 }
    ]
  },
  {
    id: 'p4',
    name: 'Quattro Formaggi con Pera & Walnut',
    category: 'pizza',
    price: 18.99,
    originalPrice: 23.00,
    rating: 4.87,
    reviewsCount: 215,
    prepTime: '18-22 min',
    calories: '810 kcal',
    isVeg: true,
    badge: 'Pure Veg 🌱',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    description: 'Four artisan cheeses: Gorgonzola Dolce, smoked scamorza, creamy taleggio, and fior di latte, adorned with thinly sliced caramelized Bosc pear and toasted walnuts.',
    ingredients: ['Gorgonzola Dolce', 'Smoked Scamorza', 'Caramelized Pear', 'Toasted Walnuts', 'Wildflower Honey'],
    addons: [
      { name: 'Caramelized Balsamic Fig Glaze', price: 2.00 },
      { name: 'Extra Gorgonzola Crumbles', price: 2.50 }
    ]
  },

  // --- ASIAN & BOWLS ---
  {
    id: 'a1',
    name: 'Black Garlic Wagyu Tonkotsu Ramen',
    category: 'asian',
    price: 19.50,
    originalPrice: 24.00,
    rating: 4.98,
    reviewsCount: 890,
    prepTime: '18-22 min',
    calories: '790 kcal',
    isVeg: false,
    badge: 'Michelin Grade 🍜',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    description: '48-hour slow simmered rich pork bone broth, artisan wavy alkaline noodles, torched Wagyu chashu, 6-minute seasoned soy nitamago egg, menma bamboo, and roasted black garlic oil.',
    ingredients: ['48-Hr Tonkotsu Broth', 'Torched Wagyu Chashu', 'Nitamago Soft Egg', 'Alkaline Noodles', 'Black Garlic Mayu'],
    addons: [
      { name: 'Extra Seared Wagyu Chashu (2 pcs)', price: 4.50 },
      { name: 'Spicy Chili Bomb Rayu', price: 1.25 },
      { name: 'Crisp Seaweed Nori & Bamboo', price: 1.50 }
    ]
  },
  {
    id: 'a2',
    name: 'Bluefin Salmon & Caviar Omakase Bowl',
    category: 'asian',
    price: 21.00,
    originalPrice: 26.50,
    rating: 4.94,
    reviewsCount: 462,
    prepTime: '15-18 min',
    calories: '580 kcal',
    isVeg: false,
    badge: 'Fresh Catch 🍣',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Sashimi-grade Ora King salmon and ahi tuna cubes, royal black caviar, seasoned Koshihikari sushi rice, edamame, avocado rosettes, and white truffle ponzu glaze.',
    ingredients: ['Ora King Salmon', 'Ahi Tuna Sashimi', 'Royal Black Caviar', 'Koshihikari Sushi Rice', 'White Truffle Ponzu'],
    addons: [
      { name: 'Extra Ahi Tuna Cut', price: 4.25 },
      { name: 'Spicy Sriracha Togarashi Aioli', price: 1.50 },
      { name: 'Tempura Crunch Flakes', price: 1.00 }
    ]
  },
  {
    id: 'a3',
    name: 'Singapore Tiger Prawn Pad Thai',
    category: 'asian',
    price: 18.25,
    originalPrice: 22.50,
    rating: 4.89,
    reviewsCount: 310,
    prepTime: '15-20 min',
    calories: '650 kcal',
    isVeg: false,
    badge: 'Wok Master 🔥',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    description: 'Wok-charred rice noodles tossed in tamarind palm sugar sauce, jumbo wild black tiger prawns, farm egg scramble, pressed tofu, crushed peanuts, and lime.',
    ingredients: ['Wild Tiger Prawns', 'Rice Noodles', 'Tamarind Palm Glaze', 'Organic Eggs', 'Toasted Peanuts'],
    addons: [
      { name: 'Trio of Jumbo Prawns', price: 4.50 },
      { name: 'Crispy Garlic Wonton Strips', price: 1.75 }
    ]
  },
  {
    id: 'a4',
    name: 'Steamed Crystal Truffle Dim Sum Trio',
    category: 'asian',
    price: 14.50,
    originalPrice: 18.00,
    rating: 4.92,
    reviewsCount: 275,
    prepTime: '12-16 min',
    calories: '420 kcal',
    isVeg: true,
    badge: 'Pure Veg 🌱',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    description: 'Delicate translucent crystal dumpling wrappers stuffed with wild shiitake, king oyster mushrooms, water chestnuts, and fragrant black truffle drizzle.',
    ingredients: ['Crystal Dumpling Skin', 'Wild Shiitake', 'King Oyster Mushroom', 'Water Chestnut', 'Black Truffle Drizzle'],
    addons: [
      { name: 'Artisan Chili Crisp Oil Jar', price: 2.00 },
      { name: 'Sweet Soy Ginger Dip', price: 1.25 }
    ]
  },

  // --- MEXICAN & TACOS ---
  {
    id: 'm1',
    name: 'Birria Beef Quesatacos Supreme',
    category: 'mexican',
    price: 16.50,
    originalPrice: 20.00,
    rating: 4.97,
    reviewsCount: 620,
    prepTime: '15-18 min',
    calories: '720 kcal',
    isVeg: false,
    badge: 'Trending Craving 🌮',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    description: 'Trio of crispy grilled white corn tortillas dipped in savory chili broth, stuffed with 12-hour braised beef shank, melted Oaxaca cheese, served with rich dipping consommé.',
    ingredients: ['12-Hr Braised Beef', 'Oaxaca Cheese', 'Dipping Consommé', 'Crisp White Corn Tortillas', 'Cilantro & Onion'],
    addons: [
      { name: 'Extra Cup Rich Dipping Consommé', price: 2.50 },
      { name: 'Hass Avocado Guacamole', price: 2.25 },
      { name: 'Charred Jalapeño Lime Salsa', price: 1.50 }
    ]
  },
  {
    id: 'm2',
    name: 'Baja Crispy Tiger Prawn Tacos',
    category: 'mexican',
    price: 17.00,
    originalPrice: 21.50,
    rating: 4.90,
    reviewsCount: 340,
    prepTime: '14-18 min',
    calories: '590 kcal',
    isVeg: false,
    badge: 'Fresh & Crisp ✨',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    description: 'Golden crispy beer-battered wild prawns, chipotle crema drizzle, shaved purple cabbage, pico de gallo, and fresh lime on warm handcrafted corn tortillas.',
    ingredients: ['Beer-Battered Prawns', 'Chipotle Lime Crema', 'Purple Cabbage Slaw', 'Pico De Gallo', 'Warm Corn Tortillas'],
    addons: [
      { name: 'Fire-Roasted Corn Queso', price: 2.00 },
      { name: 'Extra Baja Prawn (2 pcs)', price: 3.50 }
    ]
  },
  {
    id: 'm3',
    name: 'Fiesta Supreme Loaded Skillet Nachos',
    category: 'mexican',
    price: 15.00,
    originalPrice: 19.00,
    rating: 4.86,
    reviewsCount: 410,
    prepTime: '12-16 min',
    calories: '880 kcal',
    isVeg: true,
    badge: 'Great For Sharing 🧀',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
    description: 'Crisp hand-cut tortilla chips layered with molten three-cheese queso, slow-simmered black beans, jalapeños, guacamole, sour cream, and fresh pico.',
    ingredients: ['Hand-Cut Tortilla Chips', 'Molten Three-Cheese Queso', 'Black Beans', 'Hass Guacamole', 'Pickled Jalapeños'],
    addons: [
      { name: 'Slow-Cooked Carnitas Shreds', price: 3.50 },
      { name: 'Extra Guacamole Bowl', price: 2.50 }
    ]
  },

  // --- HEALTHY GREENS ---
  {
    id: 's1',
    name: 'Truffle Burrata & Mission Fig Salad',
    category: 'salads',
    price: 15.50,
    originalPrice: 19.00,
    rating: 4.93,
    reviewsCount: 310,
    prepTime: '10-14 min',
    calories: '460 kcal',
    isVeg: true,
    badge: 'Haute Organic 🥗',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    description: 'Whole creamy Italian Puglia burrata, fresh sweet Black Mission figs, heirloom cherry tomatoes, baby wild arugula, candied pecans, and 18-year Modena balsamic drizzle.',
    ingredients: ['Puglia Burrata', 'Black Mission Figs', 'Heirloom Tomatoes', 'Wild Baby Arugula', '18-Yr Modena Balsamic'],
    addons: [
      { name: 'Sliced San Daniele Prosciutto', price: 3.50 },
      { name: 'Toasted Garlic Focaccia Points', price: 2.00 }
    ]
  },
  {
    id: 's2',
    name: 'Grilled Halloumi & Lemon Quinoa Bowl',
    category: 'salads',
    price: 14.75,
    originalPrice: 18.00,
    rating: 4.88,
    reviewsCount: 220,
    prepTime: '12-15 min',
    calories: '510 kcal',
    isVeg: true,
    badge: 'Pure Veg 🌱',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    description: 'Golden grilled halloumi cheese slices over organic tri-color quinoa, roasted chickpeas, cucumber ribbons, kalamata olives, and fresh herb lemon tahini dressing.',
    ingredients: ['Grilled Halloumi', 'Tri-Color Quinoa', 'Roasted Chickpeas', 'Kalamata Olives', 'Lemon Tahini Dressing'],
    addons: [
      { name: 'Hass Avocado Halves', price: 2.25 },
      { name: 'Grilled Herb Chicken Skewer', price: 3.75 }
    ]
  },
  {
    id: 's3',
    name: 'Roasted Heirloom Beet & Whipped Goat Cheese',
    category: 'salads',
    price: 13.99,
    originalPrice: 17.50,
    rating: 4.85,
    reviewsCount: 180,
    prepTime: '10-14 min',
    calories: '390 kcal',
    isVeg: true,
    badge: 'Farm Fresh 🌿',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
    description: 'Honey-roasted golden and red heirloom beets on velvety whipped French chèvre, baby spinach, toasted pistachios, and orange blossom vinaigrette.',
    ingredients: ['Heirloom Beets', 'Whipped Chèvre Goat Cheese', 'Baby Spinach', 'Roasted Pistachios', 'Orange Blossom Dressing'],
    addons: [
      { name: 'Double Whipped Goat Cheese', price: 2.25 }
    ]
  },

  // --- DESSERTS ---
  {
    id: 'd1',
    name: 'Belgian Dark Chocolate Molten Lava Cake',
    category: 'desserts',
    price: 10.99,
    originalPrice: 14.00,
    rating: 4.99,
    reviewsCount: 780,
    prepTime: '10-15 min',
    calories: '520 kcal',
    isVeg: true,
    badge: 'Crowd Favorite 🍫',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Warm, decadent Belgian 70% Callebaut chocolate cake with a molten flowing center, accompanied by Madagascar Bourbon vanilla bean gelato and raspberry coulis.',
    ingredients: ['70% Callebaut Chocolate', 'Bourbon Vanilla Bean Gelato', 'Organic Butter & Eggs', 'Raspberry Coulis'],
    addons: [
      { name: 'Extra Scoop Bourbon Vanilla Gelato', price: 2.50 },
      { name: 'Warm Sea Salt Caramel Drizzle', price: 1.50 }
    ]
  },
  {
    id: 'd2',
    name: 'New York Wild Berry Glaze Cheesecake',
    category: 'desserts',
    price: 9.75,
    originalPrice: 12.50,
    rating: 4.91,
    reviewsCount: 490,
    prepTime: '8-12 min',
    calories: '490 kcal',
    isVeg: true,
    badge: 'Classic NYC 🍰',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-creamy New York style cream cheese cake on a spiced graham cracker butter crust, crowned with fresh macerated blackberries, blueberries, and strawberry reduction.',
    ingredients: ['Philadelphia Cream Cheese', 'Graham Cracker Crust', 'Fresh Forest Berries', 'Madagascar Vanilla'],
    addons: [
      { name: 'Whipped Chantilly Cream Rosette', price: 1.25 },
      { name: 'Chocolate Shavings Crown', price: 1.50 }
    ]
  },
  {
    id: 'd3',
    name: 'Venetian Espresso & Mascarpone Tiramisu',
    category: 'desserts',
    price: 10.25,
    originalPrice: 13.00,
    rating: 4.94,
    reviewsCount: 520,
    prepTime: '8-10 min',
    calories: '450 kcal',
    isVeg: true,
    badge: 'Authentic Italian ☕',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted Italian savoiardi ladyfingers soaked in dark Illy espresso and Marsala wine, layered with airy whipped mascarpone and dusted with Dutch cocoa powder.',
    ingredients: ['Illy Espresso', 'Italian Savoiardi', 'Whipped Mascarpone', 'Dutch Cocoa Powder', 'Touch of Marsala'],
    addons: [
      { name: 'Dark Chocolate Hazelnut Crunch', price: 1.50 }
    ]
  },

  // --- DRINKS ---
  {
    id: 'dr1',
    name: 'Royal Tiger Brown Sugar Boba Latte',
    category: 'drinks',
    price: 7.50,
    originalPrice: 9.50,
    rating: 4.96,
    reviewsCount: 650,
    prepTime: '5-8 min',
    calories: '340 kcal',
    isVeg: true,
    badge: 'Boba Bliss 🧋',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
    description: 'Warm slow-cooked brown sugar tapioca pearls, organic whole milk or oat milk, rich black tea infusion, topped with caramelized brown sugar brulee cream.',
    ingredients: ['Brown Sugar Pearls', 'Organic Whole Milk', 'Ceylon Black Tea', 'Caramelized Brulee Cream'],
    addons: [
      { name: 'Switch to Creamy Oat Milk', price: 0.75 },
      { name: 'Extra Chewy Tapioca Pearls', price: 1.00 },
      { name: 'Sea Salt Cheese Foam Cap', price: 1.25 }
    ]
  },
  {
    id: 'dr2',
    name: 'Sparkling Strawberry Basil Mojito',
    category: 'drinks',
    price: 6.99,
    originalPrice: 8.50,
    rating: 4.88,
    reviewsCount: 310,
    prepTime: '4-7 min',
    calories: '160 kcal',
    isVeg: true,
    badge: 'Zero Proof Refreshing 🍓',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    description: 'Muddled fresh organic strawberries, aromatic Thai sweet basil leaves, fresh squeezed lime juice, pure cane sugar syrup, and fizzy mineral water over crushed ice.',
    ingredients: ['Organic Strawberries', 'Thai Sweet Basil', 'Fresh Key Lime', 'Fizzy Mineral Water', 'Crushed Ice'],
    addons: [
      { name: 'Chia Seeds Boost', price: 0.75 },
      { name: 'Passion Fruit Splash', price: 1.00 }
    ]
  },
  {
    id: 'dr3',
    name: 'Iced Madagascar Vanilla Bean Macchiato',
    category: 'drinks',
    price: 6.50,
    originalPrice: 8.00,
    rating: 4.91,
    reviewsCount: 420,
    prepTime: '5-7 min',
    calories: '210 kcal',
    isVeg: true,
    badge: 'Cold Brew ☕',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Double shot of single-origin Ethiopian espresso poured over velvety cold milk, infused with house-made real Madagascar vanilla bean syrup and caramel drizzle.',
    ingredients: ['Ethiopian Espresso', 'Madagascar Vanilla Syrup', 'Cold Farm Milk', 'Salted Caramel Drizzle'],
    addons: [
      { name: 'Almond Milk Sub', price: 0.75 },
      { name: 'Extra Espresso Shot', price: 1.50 }
    ]
  }
];

// Initial Seed Foodie Snaps (Real Photos from community & demo personal moments)
const INITIAL_SNAPS = [
  {
    id: 'snap-1',
    author: 'Alex Morgan',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isPersonal: true,
    dishId: 'b1',
    dishName: '24K Gold Leaf & Black Truffle Smash Burger',
    foodPhoto: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    personalRate: 5.0,
    review: 'Honestly the most satisfying burger of my life! The gold leaf looked incredible, but that black truffle aioli with the crispy smashed patty took it to another galaxy. 10/10.',
    vibe: 'Chef Feast 👑',
    date: 'Just now',
    likes: 42
  },
  {
    id: 'snap-2',
    author: 'Elena Rostova',
    authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isPersonal: false,
    dishId: 'p2',
    dishName: 'Dry-Aged Pepperoni & Hot Truffle Honey',
    foodPhoto: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    personalRate: 4.9,
    review: 'Look at those charred pepperoni cups! The spicy chili honey drizzle cuts through the rich fior di latte cheese perfectly. Delivered in only 21 minutes!',
    vibe: 'Friday Night Pizza 🍕',
    date: '2 hours ago',
    likes: 38
  },
  {
    id: 'snap-3',
    author: 'David Kumar',
    authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isPersonal: false,
    dishId: 'a1',
    dishName: 'Black Garlic Wagyu Tonkotsu Ramen',
    foodPhoto: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    personalRate: 5.0,
    review: 'That 48-hour bone broth has unmatched depth. The torched Wagyu chashu melted on my tongue. Steaming hot packaging kept the noodles springy.',
    vibe: 'Cozy Dinner 🍜',
    date: 'Yesterday',
    likes: 65
  },
  {
    id: 'snap-4',
    author: 'Chloe Vance',
    authorPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    isPersonal: false,
    dishId: 'd1',
    dishName: 'Belgian Dark Chocolate Molten Lava Cake',
    foodPhoto: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    personalRate: 4.8,
    review: 'The warm chocolate molten center flowed immediately when cut. Paired with cold vanilla bean gelato, this is the ultimate sweet finish!',
    vibe: 'Sweet Indulgence 🍫',
    date: '2 days ago',
    likes: 51
  }
];

// Initial Personal User Profile
const DEFAULT_USER_PROFILE = {
  name: 'Alex Morgan',
  title: 'Certified Food Critic & Burger Lover',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Living for crispy smash burgers, wood-fired crusts, and midnight ramen bowls. Sharing authentic bites & honest rates!',
  foodieCoins: 350,
  city: 'Downtown, 5th Avenue'
};

// Initial Seed Personal Ratings
const DEFAULT_PERSONAL_RATINGS = {
  'b1': {
    rating: 5.0,
    tastingNotes: 'Crispy smash edges and luxurious truffle kick. Best in town!',
    tags: ['🤤 Chef Kiss', '🧀 Extra Cheesy', '👑 Worth Every Penny'],
    date: 'Nov 17, 2026'
  },
  'p2': {
    rating: 4.8,
    tastingNotes: 'The hot honey combined with charred pepperoni is an explosion of sweet and spicy!',
    tags: ['🔥 Hot & Spicy', '🍕 Perfect Crust'],
    date: 'Nov 18, 2026'
  }
};
