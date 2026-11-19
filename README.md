# 🍔 Foodie Hub - Modern Culinary Platform

Welcome to **Foodie Hub**, an interactive, modern, and mouth-watering food platform website built with pure **HTML5, CSS3, and JavaScript**.

Foodie Hub features an end-to-end culinary experience: **Personal Star Ratings**, **Personal Photo Uploads**, **Foodie Snaps & Moments Gallery**, **My Foodie Space Profile Dashboard**, interactive food customization, instant dietary filtering, a slide-over cart with coupons, and a live 4-stage order tracker.

---

## ✨ Features & Highlights

### 1. ⭐ Personal Rating System ("Personal Rate")
- **Dish-by-Dish Personal Ratings**:
  - Every food card displays both community ratings and your personal score.
  - Interactive **"⭐ Rate This Dish"** button opens the Personal Tasting Log modal.
  - Interactive 5-star picker with animated hover preview (`1.0` to `5.0 ★`).
  - **Flavor & Texture Tags**: One-click highlights like `🔥 Super Spicy`, `🧀 Extra Cheesy`, `🤤 Chef Kiss`, `💰 Worth Every Penny`.
  - **Personal Tasting Notes**: Enter your personal review, critique, or flavor notes.
  - **Filter by "⭐ My Rated Dishes"**: Dedicated dietary filter pill that instantly filters the menu to dishes you have personally reviewed.
  - Persists directly to `localStorage` (`foodiehub_personal_ratings`).

### 2. 📸 Personal Photo & Profile System ("Personal Photo")
- **Customizable Personal Avatar**:
  - Instant personal photo upload using the built-in file picker.
  - Real-time `FileReader` conversion to preview and save your avatar to `localStorage`.
  - Displayed prominently in the top navigation bar, personal reviews, and profile header.
- **My Foodie Space (Profile Dashboard)**:
  - Header profile banner with your personal photo, editable name, title, and bio.
  - **Live Foodie Stats**:
    - Total Dishes Rated counter
    - Average Personal Rating Given
    - Personal Food Snaps Uploaded
    - Foodie Reward Coins balance (earned on every review & photo upload!)
  - Tabbed interface:
    - *⭐ My Rated Dishes*: List of all your rated items with tasting notes and 1-click edit.
    - *📸 My Food Photos*: Grid of your personal food photos.
    - *❤️ Favorites*: Your saved wishlist items.

### 3. 📸 Foodie Snaps & Moments Gallery
- **Community & Personal Photo Stream**:
  - Showcase real food photography taken by food lovers.
  - Each snap card displays the reviewer's photo, personal star rating, dish tag, dining vibe, caption, and likes.
- **Upload Your Personal Food Snap**:
  - Modal with **drag-and-drop / file upload** zone.
  - Instant live image preview with remove/replace option.
  - Dish selector, personal rating picker, dining vibe selector, and caption.
  - Submitting awards **+50 Foodie Coins** and features your photo at the top of the gallery with a **"📸 Your Personal Photo"** badge!
  - Filter by *All Snaps*, *📸 My Personal Snaps*, or *⭐ Top Rated (4.9+)*.

### 4. 🍽️ Gourmet Menu & Filtering Engine
- **24+ Handcrafted Items across 7 Categories**:
  - 🍔 **Gourmet Burgers** (24K Gold Leaf Truffle Smash, Kobe Wagyu BBQ, Imperial Nashville Hot Chicken, Royal Halloumi)
  - 🍕 **Artisanal Pizza** (Neapolitan Margherita D.O.P., Dry-Aged Pepperoni & Hot Truffle Honey, Alba White Truffle Blanco, Quattro Formaggi)
  - 🍜 **Asian & Bowls** (Tonkotsu Wagyu Ramen, Bluefin Salmon Omakase Bowl, Tiger Prawn Pad Thai, Truffle Dim Sum)
  - 🌮 **Tacos & Mexican** (Birria Beef Quesatacos Supreme, Baja Crispy Prawn Tacos, Loaded Skillet Nachos)
  - 🥗 **Healthy Greens** (Truffle Burrata & Mission Fig, Grilled Halloumi Quinoa, Roasted Heirloom Beetroot)
  - 🍰 **Desserts & Cakes** (Belgian Dark Chocolate Molten Lava Cake, New York Wild Berry Cheesecake, Venetian Tiramisu)
  - 🧋 **Boba & Refreshments** (Tiger Brown Sugar Boba Latte, Sparkling Strawberry Basil Mojito, Vanilla Bean Macchiato)
- **Live Search**: Instant keyword filtering across dish names, ingredients, and descriptions.
- **Dietary Filter Pills**: *All Items*, *🌱 Veg Only*, *🥩 Non-Veg*, *🔥 Chef's Best Sellers*, and *⭐ My Rated Dishes*.
- **Sorting Dropdown**: Recommended, Top Rated, Price (Low to High / High to Low), and Fastest Prep Time.
- **Cravings Quick Chips**: One-click instant search chips.

### 5. 🔍 Quick Customize Modal
- High-definition photo, ingredients breakdown tags, and add-ons with dynamic price calculation.
- Inline display of your personal rating for that dish with instant edit link.
- Chef notes / special instructions input.

### 6. 🛒 Slide-Over Cart Drawer & Coupons
- Real-time **Free Delivery Meter** progress bar with remaining spend calculation.
- Item quantity controls `[- 1 +]` and item deletion.
- **Working Coupon Code Engine**:
  - `WELCOME50` - Flat 50% OFF (Up to $20)
  - `FOODIE20` - 20% OFF entire feast
  - `FREEDEL` - Free delivery
  - `TASTY10` - $10 OFF orders over $30
- Itemized bill breakdown (Subtotal, Delivery Fee, Taxes at 8%, Discount, Total).

### 7. 🛵 Checkout & Live GPS Order Tracker Simulation
- Delivery address form with payment toggles (Credit Card, Apple/Google Pay, Cash on Delivery).
- Generates unique Order ID (`#FH-XXXXXX`).
- **Live 4-Stage Animated Tracker**:
  1. 📋 Order Confirmed
  2. 👨‍🍳 Kitchen Preparing
  3. 🛵 Rider On The Way (with driver profile & phone link)
  4. 🎉 Delivered Hot & Enjoy!

---

## 🚀 How to Run and View

Foodie Hub is built with vanilla JavaScript, modern CSS, and HTML5. No Node.js, build step, or server installation is required.

Simply double-click or open `index.html` in your browser:

```
c:\Users\admin\OneDrive\Desktop\Foodie hub\index.html
```

Or open with VS Code Live Server / any web browser.

---

## 📂 Project Architecture

```
Foodie hub/
│
├── index.html              # Main HTML5 semantic page structure
├── style.css               # Modern culinary CSS (glassmorphism, animations, responsive)
├── data.js                 # Complete gourmet menu, initial snaps, and user presets
├── app.js                  # Core interactive JavaScript application engine
├── README.md               # Project documentation
│
├── css/
│   └── style.css           # Subfolder mirror for path resilience
└── js/
    ├── app.js              # Subfolder mirror
    └── data.js             # Subfolder mirror
```

---

© 2026 Foodie Hub. Savor every bite with love.
