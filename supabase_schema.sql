-- ============================================================================
-- Foodie Hub - Supabase Database Schema & Seed Script
-- Run this in your Supabase Project -> SQL Editor to set up tables and data.
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create food_menu Table
CREATE TABLE IF NOT EXISTS public.food_menu (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    rating NUMERIC(3,2) DEFAULT 4.9,
    reviews_count INT DEFAULT 100,
    prep_time TEXT,
    calories TEXT,
    is_veg BOOLEAN DEFAULT false,
    badge TEXT,
    image TEXT NOT NULL,
    description TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    addons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    phone TEXT NOT NULL,
    dropoff_notes TEXT,
    payment_method TEXT DEFAULT 'Credit Card',
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    tax NUMERIC(10,2) DEFAULT 0.00,
    discount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create order_items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    food_item_id TEXT,
    name TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    addons JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create newsletter_subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Enable Row Level Security (RLS) & Policies
-- ============================================================================
ALTER TABLE public.food_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- food_menu policies: Anyone can view, anon can insert/update for demo
CREATE POLICY "Public can view food menu" ON public.food_menu FOR SELECT USING (true);
CREATE POLICY "Public can insert food menu" ON public.food_menu FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update food menu" ON public.food_menu FOR UPDATE USING (true);

-- orders policies: Anyone can insert orders and view them
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can update orders status" ON public.orders FOR UPDATE USING (true);

-- order_items policies
CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON public.order_items FOR SELECT USING (true);

-- newsletter policies
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);

-- ============================================================================
-- Enable Realtime for orders table
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ============================================================================
-- Seed Haute Luxury Menu Items
-- ============================================================================
INSERT INTO public.food_menu (id, name, category, price, original_price, rating, reviews_count, prep_time, calories, is_veg, badge, image, description, ingredients, addons)
VALUES
('b1', '24K Gold Leaf & Black Truffle Smash Burger', 'burgers', 85.00, 110.00, 4.95, 384, '18-22 min', '680 kcal', false, '24K Luxury ✨',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
 'Double smashed Miyazaki A5 Wagyu patties draped in edible 24K gold leaf, shaved Périgord black winter truffles, baby bella mushrooms, and 18-month aged Gruyère on a toasted artisanal brioche bun.',
 '["Miyazaki A5 Wagyu", "24K Edible Gold Leaf", "Périgord Black Truffles", "Baby Bella Mushrooms", "18-Mo Cave Gruyère", "Artisanal Brioche"]'::jsonb,
 '[{"name": "Extra Shaved Périgord Truffle", "price": 28.00}, {"name": "Thick Iberico De Bellota Bacon", "price": 18.00}, {"name": "Melted Reserve Gruyère Crown", "price": 12.00}]'::jsonb),

('b2', 'Kobe Wagyu & Caviar BBQ Beast Burger', 'burgers', 125.00, 160.00, 4.98, 512, '20-25 min', '820 kcal', false, 'Ultra Premium 👑',
 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
 'Certified Hyogo Tajima Kobe beef patty, Royal Osetra caviar dollop, 25-year Pappy Van Winkle bourbon BBQ reduction, tempura sweet onion crisps, and triple-smoked Vermont white cheddar.',
 '["Certified Kobe Beef", "Royal Osetra Caviar", "25-Yr Bourbon BBQ Glaze", "Triple-Smoked Cheddar", "Tempura Vidalia Rings"]'::jsonb,
 '[{"name": "Second Kobe Wagyu Patty (150g)", "price": 48.00}, {"name": "Extra Royal Osetra Caviar Bump (15g)", "price": 38.00}, {"name": "Wild Morel Mushroom Relish", "price": 14.00}]'::jsonb),

('b3', 'Imperial Saffron Nashville Hot Chicken', 'burgers', 68.00, 88.00, 4.90, 429, '15-20 min', '710 kcal', false, 'Signature Spice 🔥',
 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
 'French Label Rouge organic chicken breast crisped in pure duck fat, steeped in Persian saffron and Kashmiri chili hot oil, finished with Champagne vinegar slaw and truffle comeback aioli.',
 '["Label Rouge Chicken", "Persian Saffron Oil", "Duck Fat Fry", "Champagne Vinegar Slaw", "Truffle Comeback Aioli"]'::jsonb,
 '[{"name": "Smoked Ghost Pepper Dust", "price": 6.00}, {"name": "Molten Truffle Brie Injection", "price": 14.00}, {"name": "Artisanal Black Truffle Dip", "price": 9.50}]'::jsonb),

('b4', 'Royal Truffle Avocado & Halloumi Burger', 'burgers', 62.00, 80.00, 4.85, 260, '15-18 min', '540 kcal', true, 'Haute Green 🌱',
 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
 'Handmade Cypriot sheep milk halloumi, sliced premium Hass avocado, fire-blistered piquillo peppers, baby wild arugula, and 12-year Modena balsamic glaze on pain de campagne bun.',
 '["Artisanal Halloumi", "California Hass Avocado", "Piquillo Peppers", "Wild Baby Arugula", "12-Yr Modena Balsamic"]'::jsonb,
 '[{"name": "Organic Duck Egg Over-Easy", "price": 8.50}, {"name": "Extra Sliced Hass Avocado", "price": 10.00}, {"name": "Gold Dust Multi-Seed Brioche", "price": 7.00}]'::jsonb),

('p1', 'Authentic Neapolitan Margherita D.O.P. Royal', 'pizza', 78.00, 98.00, 4.95, 680, '20-25 min', '840 kcal', true, 'D.O.P. Certified 🍕',
 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
 '72-hour slow fermented Biga sourdough, volcanic San Marzano D.O.P. tomatoes, fresh air-flown Campania buffalo mozzarella, fragrant mountain basil, and single-estate cold press Ligurian olive oil.',
 '["San Marzano D.O.P. Tomatoes", "Campania Buffalo Mozzarella", "Fresh Sweet Mountain Basil", "Single-Estate EVOO", "Maldon Sea Salt Flakes"]'::jsonb,
 '[{"name": "Double Buffalo Mozzarella D.O.P.", "price": 16.00}, {"name": "Black Garlic & Saffron Crust", "price": 12.00}, {"name": "Calabrian Hot Truffle Honey", "price": 9.50}]'::jsonb),

('p2', 'Dry-Aged Ibérico & Hot Truffle Honey Feast', 'pizza', 115.00, 145.00, 4.96, 742, '22-26 min', '990 kcal', false, 'Grand Reserve ⭐',
 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
 'Piled high with dry-cured Spanish Jamón Ibérico de Bellota, artisan spicy artisan pepperoni, whole milk fior di latte, hot chili infused wildflower honey, and aged 36-month Parmigiano Reggiano.',
 '["Jamón Ibérico de Bellota", "Artisan Pepperoni", "Fior di Latte", "Hot Truffle Honey", "36-Mo Parmigiano Reggiano"]'::jsonb,
 '[{"name": "Stuffed Black Truffle Mozzarella Crust", "price": 22.00}, {"name": "Calabrian Hot Pepper Emulsion", "price": 8.50}, {"name": "Side Truffle Ranch Cream", "price": 7.50}]'::jsonb),

('p3', 'Alba White Truffle & Wild Morels Blanco', 'pizza', 165.00, 210.00, 4.99, 310, '22-27 min', '890 kcal', true, 'Alba Truffle Luxury',
 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
 'Rich white mascarpone garlic emulsion, sautéed wild French morel and chanterelle mushrooms, creamy Taleggio D.O.P., generously covered in shaved fresh Alba white truffles.',
 '["Fresh Alba White Truffles", "Wild French Morels", "Chanterelles", "Taleggio D.O.P.", "White Truffle Mascarpone"]'::jsonb,
 '[{"name": "Extra Fresh Alba Truffle Shavings (5g)", "price": 45.00}, {"name": "San Daniele 30-Month Prosciutto", "price": 24.00}, {"name": "Wild Peppery Baby Rocket Crown", "price": 9.00}]'::jsonb),

('a1', 'Kobe A5 Wagyu & Black Garlic Tonkotsu Ramen', 'asian', 145.00, 185.00, 5.00, 890, '25-30 min', '790 kcal', false, 'Michelin Worthy 🍜',
 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
 '48-hour Kurobuta pork bone reduction broth, hand-pulled alkaline noodles, seared A5 Kobe beef chashu slices, organic nitamago egg, Kyoto spring scallions, and 10-year aged black garlic oil.',
 '["48-Hr Kurobuta Bone Broth", "Hand-Pulled Noodles", "Seared A5 Kobe Wagyu", "Organic Nitamago Egg", "Black Garlic Mayu", "Menma"]'::jsonb,
 '[{"name": "Extra Seared A5 Kobe Beef (3 pcs)", "price": 48.00}, {"name": "Organic Jidori Soft Egg", "price": 8.00}, {"name": "Artisanal Rayu Chili Bomb", "price": 6.50}]'::jsonb),

('a2', 'Bluefin Toro, King Salmon & Osetra Caviar Bowl', 'asian', 155.00, 195.00, 4.96, 460, '15-20 min', '580 kcal', false, 'Omakase Grade 🍣',
 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
 'Air-flown Japanese Bluefin Otoro fatty tuna sashimi, Ora King Salmon, 20g Royal Osetra caviar, Niigata Koshihikari sushi rice, fresh grated Shizuoka wasabi, and white truffle dashi.',
 '["Bluefin Otoro Tuna", "Ora King Salmon", "Royal Osetra Caviar", "Niigata Koshihikari Rice", "Real Shizuoka Wasabi", "White Truffle Dashi"]'::jsonb,
 '[{"name": "Extra Bluefin Otoro Sashimi Cut", "price": 42.00}, {"name": "Hokkaido Uni Sea Urchin Spoon", "price": 38.00}, {"name": "Truffle Ponzu Reduction", "price": 8.00}]'::jsonb)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge;
