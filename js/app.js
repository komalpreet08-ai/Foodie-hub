/**
 * Foodie Hub - Core Interactive Engine
 * Handles Menu, Search, Filter, Cart, Checkout, Live Tracker,
 * plus Personal Rating System, Personal Photo Uploads & Foodie Space Gallery.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentCategory: 'all',
    dietaryFilter: 'all', // 'all', 'veg', 'nonveg', 'bestseller', 'my-rated'
    searchQuery: '',
    sortBy: 'recommended',
    cart: [],
    favorites: new Set(),
    personalRatings: {}, // dishId -> { rating, tastingNotes, tags, date, photo }
    userProfile: {},
    snaps: [],
    snapsFilter: 'all', // 'all', 'personal', 'top-rated'
    appliedPromo: null,
    deliveryFeeBase: 3.99,
    freeDeliveryThreshold: 45.00,
    taxRate: 0.08,
    activeModalItem: null,
    activeRateDishId: null,
    activeOrder: null,
    orderTrackerInterval: null,
    currentRateScore: 5.0,
    tempSnapPhoto: null,
    tempRatePhoto: null,
    tempProfilePhoto: null
  };

  // DOM Elements Cache
  let elements = {};

  function cacheElements() {
    elements = {
      foodGrid: document.getElementById('foodGrid'),
      categoryNav: document.getElementById('categoryNav'),
      dietFilters: document.querySelectorAll('.diet-btn'),
      sortSelect: document.getElementById('sortSelect'),
      heroSearchInput: document.getElementById('heroSearchInput'),
      heroSearchBtn: document.getElementById('heroSearchBtn'),
      inlineSearchInput: document.getElementById('inlineSearchInput'),
      cartPillBtn: document.getElementById('cartPillBtn'),
      cartPillTotal: document.getElementById('cartPillTotal'),
      cartBadgeCount: document.getElementById('cartBadgeCount'),
      favCountBadge: document.getElementById('favCountBadge'),
      cartDrawerBackdrop: document.getElementById('cartDrawerBackdrop'),
      cartCloseBtn: document.getElementById('cartCloseBtn'),
      cartItemsList: document.getElementById('cartItemsList'),
      cartSubtotal: document.getElementById('cartSubtotal'),
      cartDeliveryFee: document.getElementById('cartDeliveryFee'),
      cartTax: document.getElementById('cartTax'),
      cartDiscountRow: document.getElementById('cartDiscountRow'),
      cartDiscountVal: document.getElementById('cartDiscountVal'),
      cartTotal: document.getElementById('cartTotal'),
      freeDeliveryFill: document.getElementById('freeDeliveryFill'),
      freeDeliveryMsg: document.getElementById('freeDeliveryMsg'),
      promoInput: document.getElementById('promoInput'),
      btnApplyPromo: document.getElementById('btnApplyPromo'),
      btnCheckout: document.getElementById('btnCheckout'),
      quickViewBackdrop: document.getElementById('quickViewBackdrop'),
      quickViewContent: document.getElementById('quickViewContent'),
      checkoutModalBackdrop: document.getElementById('checkoutModalBackdrop'),
      checkoutForm: document.getElementById('checkoutForm'),
      orderTrackerBackdrop: document.getElementById('orderTrackerBackdrop'),
      orderTrackerContent: document.getElementById('orderTrackerContent'),
      toastContainer: document.getElementById('toastContainer'),

      // Foodie Space & Personal Rating Elements
      navProfileBtn: document.getElementById('navProfileBtn'),
      navProfileAvatar: document.getElementById('navProfileAvatar'),
      navProfileName: document.getElementById('navProfileName'),
      navProfileRatedCount: document.getElementById('navProfileRatedCount'),

      profileModalBackdrop: document.getElementById('profileModalBackdrop'),
      profileCloseBtn: document.getElementById('profileCloseBtn'),
      profileAvatarLarge: document.getElementById('profileAvatarLarge'),
      profileNameLarge: document.getElementById('profileNameLarge'),
      profileTitleLarge: document.getElementById('profileTitleLarge'),
      profileBioLarge: document.getElementById('profileBioLarge'),
      statRatedCount: document.getElementById('statRatedCount'),
      statAvgRate: document.getElementById('statAvgRate'),
      statSnapsCount: document.getElementById('statSnapsCount'),
      statCoinsCount: document.getElementById('statCoinsCount'),

      personalRateModalBackdrop: document.getElementById('personalRateModalBackdrop'),
      personalRateCloseBtn: document.getElementById('personalRateCloseBtn'),
      rateDishTitle: document.getElementById('rateDishTitle'),
      rateDishThumb: document.getElementById('rateDishThumb'),
      rateStarsInteractive: document.getElementById('rateStarsInteractive'),
      rateScoreDisplay: document.getElementById('rateScoreDisplay'),
      rateTastingNotes: document.getElementById('rateTastingNotes'),
      rateFlavorTags: document.getElementById('rateFlavorTags'),
      btnSaveRating: document.getElementById('btnSaveRating'),
      btnDeleteRating: document.getElementById('btnDeleteRating'),

      snapUploadModalBackdrop: document.getElementById('snapUploadModalBackdrop'),
      snapUploadCloseBtn: document.getElementById('snapUploadCloseBtn'),
      btnOpenSnapModal: document.getElementById('btnOpenSnapModal'),
      snapsGrid: document.getElementById('snapsGrid'),
      snapDishSelect: document.getElementById('snapDishSelect'),
      snapFileInput: document.getElementById('snapFileInput'),
      snapDropzone: document.getElementById('snapDropzone'),
      snapPreviewWrap: document.getElementById('snapPreviewWrap'),
      snapPreviewImg: document.getElementById('snapPreviewImg'),
      snapPreviewRemove: document.getElementById('snapPreviewRemove'),
      snapCaptionInput: document.getElementById('snapCaptionInput'),
      snapVibeSelect: document.getElementById('snapVibeSelect'),
      snapStarsInteractive: document.getElementById('snapStarsInteractive'),
      snapScoreDisplay: document.getElementById('snapScoreDisplay'),
      btnSubmitSnap: document.getElementById('btnSubmitSnap')
    };
  }

  // Initialize Application
  function init() {
    cacheElements();
    loadPersistedData();
    setupEventListeners();
    updateCategoryCounts();
    renderMenu();
    renderSnaps();
    updateCartUI();
    updateProfileUI();
    syncMenuFromSupabase();
  }

  // Live Sync Menu from Supabase Database
  async function syncMenuFromSupabase() {
    if (!window.supabaseClient) return;
    try {
      const { data, error } = await window.supabaseClient
        .from('food_menu')
        .select('*');

      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach(dbItem => {
          const idx = typeof FOOD_MENU !== 'undefined' ? FOOD_MENU.findIndex(m => m.id === dbItem.id) : -1;
          const mapped = {
            id: dbItem.id,
            name: dbItem.name,
            category: dbItem.category,
            price: parseFloat(dbItem.price),
            originalPrice: dbItem.original_price ? parseFloat(dbItem.original_price) : null,
            rating: parseFloat(dbItem.rating || 4.9),
            reviewsCount: dbItem.reviews_count || 100,
            prepTime: dbItem.prep_time || '20 min',
            calories: dbItem.calories || '600 kcal',
            isVeg: !!dbItem.is_veg,
            badge: dbItem.badge || '',
            image: dbItem.image,
            description: dbItem.description || '',
            ingredients: Array.isArray(dbItem.ingredients) ? dbItem.ingredients : [],
            addons: Array.isArray(dbItem.addons) ? dbItem.addons : []
          };
          if (idx >= 0) {
            FOOD_MENU[idx] = mapped;
          } else if (typeof FOOD_MENU !== 'undefined') {
            FOOD_MENU.push(mapped);
          }
        });
        updateCategoryCounts();
        renderMenu();
        console.log(`✅ Loaded ${data.length} dishes from live Supabase food_menu!`);
      }
    } catch (err) {
      console.warn('Supabase menu sync skipped:', err);
    }
  }

  // Load cart, favorites, personal ratings, snaps & user profile from localStorage
  function loadPersistedData() {
    try {
      // User Profile
      const savedProfile = localStorage.getItem('foodiehub_profile');
      if (savedProfile) {
        state.userProfile = JSON.parse(savedProfile);
      } else {
        state.userProfile = Object.assign({}, DEFAULT_USER_PROFILE);
      }

      // Personal Ratings
      const savedRatings = localStorage.getItem('foodiehub_personal_ratings');
      if (savedRatings) {
        state.personalRatings = JSON.parse(savedRatings);
      } else {
        state.personalRatings = Object.assign({}, DEFAULT_PERSONAL_RATINGS);
      }

      // Foodie Snaps
      const savedSnaps = localStorage.getItem('foodiehub_snaps');
      if (savedSnaps) {
        state.snaps = JSON.parse(savedSnaps);
      } else {
        state.snaps = INITIAL_SNAPS.slice();
      }

      // Cart
      const savedCart = localStorage.getItem('foodiehub_cart');
      if (savedCart) state.cart = JSON.parse(savedCart);

      // Favorites
      const savedFavs = localStorage.getItem('foodiehub_favs');
      if (savedFavs) state.favorites = new Set(JSON.parse(savedFavs));
      updateFavBadge();

    } catch (e) {
      console.warn('Storage initialization fallback:', e);
      state.userProfile = Object.assign({}, DEFAULT_USER_PROFILE);
      state.personalRatings = Object.assign({}, DEFAULT_PERSONAL_RATINGS);
      state.snaps = INITIAL_SNAPS.slice();
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('foodiehub_cart', JSON.stringify(state.cart));
    } catch (e) {}
  }

  function saveFavs() {
    try {
      localStorage.setItem('foodiehub_favs', JSON.stringify(Array.from(state.favorites)));
    } catch (e) {}
    updateFavBadge();
  }

  function savePersonalRatings() {
    try {
      localStorage.setItem('foodiehub_personal_ratings', JSON.stringify(state.personalRatings));
    } catch (e) {}
    updateProfileUI();
  }

  function saveUserProfile() {
    try {
      localStorage.setItem('foodiehub_profile', JSON.stringify(state.userProfile));
    } catch (e) {}
    updateProfileUI();
  }

  function saveSnaps() {
    try {
      localStorage.setItem('foodiehub_snaps', JSON.stringify(state.snaps));
    } catch (e) {}
  }

  function updateFavBadge() {
    if (elements.favCountBadge) {
      elements.favCountBadge.textContent = state.favorites.size;
    }
  }

  // Update Category Counts
  function updateCategoryCounts() {
    if (typeof FOOD_MENU === 'undefined') return;
    const counts = { all: FOOD_MENU.length };
    FOOD_MENU.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    document.querySelectorAll('.cat-pill').forEach(pill => {
      const cat = pill.dataset.category;
      const countSpan = pill.querySelector('.cat-count');
      if (countSpan && counts[cat] !== undefined) {
        countSpan.textContent = counts[cat];
      }
    });
  }

  // Filter & Sort Menu Items
  function getFilteredItems() {
    if (typeof FOOD_MENU === 'undefined') return [];
    let list = FOOD_MENU.slice();

    // Category
    if (state.currentCategory !== 'all') {
      list = list.filter(item => item.category === state.currentCategory);
    }

    // Dietary filter
    if (state.dietaryFilter === 'veg') {
      list = list.filter(item => item.isVeg === true);
    } else if (state.dietaryFilter === 'nonveg') {
      list = list.filter(item => item.isVeg === false);
    } else if (state.dietaryFilter === 'bestseller') {
      list = list.filter(item => item.badge && (item.badge.includes('Best') || item.badge.includes('Chef') || item.badge.includes('Trend') || item.badge.includes('Ultra')));
    } else if (state.dietaryFilter === 'my-rated') {
      list = list.filter(item => state.personalRatings[item.id] !== undefined);
    }

    // Search query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(q)))
      );
    }

    // Sorting
    switch (state.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'time':
        list.sort((a, b) => parseInt(a.prepTime) - parseInt(b.prepTime));
        break;
      default:
        break;
    }

    return list;
  }

  // Render Menu Grid
  function renderMenu() {
    if (!elements.foodGrid) return;
    const items = getFilteredItems();

    if (items.length === 0) {
      const isMyRated = state.dietaryFilter === 'my-rated';
      elements.foodGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 2px dashed var(--border-light);">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">${isMyRated ? '⭐' : '🍽️'}</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">${isMyRated ? 'No dishes rated yet!' : 'No mouth-watering matches found!'}</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem;">
            ${isMyRated 
              ? 'Click the "⭐ Rate This Dish" button on any menu card to log your personal rating, tasting notes, and food photos!'
              : 'Try searching for a different dish, ingredient, or reset filters to see our full culinary selection.'}
          </p>
          <button class="btn-reset-filters" id="btnResetFilters" style="background: var(--primary); color: #FFF; border: none; padding: 0.75rem 1.75rem; border-radius: var(--radius-full); font-weight: 700; cursor: pointer;">
            ${isMyRated ? 'Browse Full Menu to Rate' : 'Show Full Menu'}
          </button>
        </div>
      `;
      const btnReset = document.getElementById('btnResetFilters');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          state.currentCategory = 'all';
          state.dietaryFilter = 'all';
          state.searchQuery = '';
          if (elements.heroSearchInput) elements.heroSearchInput.value = '';
          if (elements.inlineSearchInput) elements.inlineSearchInput.value = '';
          updateActiveFilterPills();
          renderMenu();
        });
      }
      return;
    }

    elements.foodGrid.innerHTML = items.map(item => {
      const isFav = state.favorites.has(item.id);
      const cartItem = state.cart.find(c => c.id === item.id && (!c.addons || c.addons.length === 0));
      const inCartQty = cartItem ? cartItem.qty : 0;
      const personalRatingObj = state.personalRatings[item.id];

      return `
        <div class="food-card" data-id="${item.id}">
          <div class="card-media" onclick="window.FoodieHub.openQuickView('${item.id}')">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
            <div class="card-badges-top">
              ${item.badge ? `<span class="badge ${item.badge.includes('Chef') || item.badge.includes('Trend') ? 'badge-primary' : 'badge-amber'}">${item.badge}</span>` : ''}
            </div>
            <button class="card-fav-btn ${isFav ? 'active' : ''}" 
                    title="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}"
                    onclick="event.stopPropagation(); window.FoodieHub.toggleFavorite('${item.id}')">
              ${isFav ? '❤️' : '🤍'}
            </button>
            <button class="card-quickview-btn">
              🔍 Quick Customize
            </button>
          </div>

          <div class="card-body">
            <div class="card-meta-strip">
              <div class="meta-left">
                <span class="diet-indicator ${item.isVeg ? 'veg' : 'nonveg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                <span class="card-prep-time">⚡ ${item.prepTime}</span>
              </div>
              <div class="card-rating">
                ⭐ ${item.rating.toFixed(1)} <span style="font-weight:400;color:#78350F">(${item.reviewsCount})</span>
              </div>
            </div>

            <h3 class="card-title" onclick="window.FoodieHub.openQuickView('${item.id}')">${item.name}</h3>
            <p class="card-desc">${item.description}</p>
            <div class="card-nutri-tag">🔥 ${item.calories} • Freshly Prepared</div>

            <!-- Personal Rate Strip -->
            <div class="card-personal-rate-row">
              <span class="personal-rate-label">Personal Rate:</span>
              ${personalRatingObj ? `
                <button class="btn-personal-rate rated" onclick="event.stopPropagation(); window.FoodieHub.openPersonalRateModal('${item.id}')" title="Your personal rating. Click to edit.">
                  <span>⭐ ${personalRatingObj.rating.toFixed(1)}</span>
                  <span style="font-size:0.7rem;opacity:0.85">✎ Edit</span>
                </button>
              ` : `
                <button class="btn-personal-rate unrated" onclick="event.stopPropagation(); window.FoodieHub.openPersonalRateModal('${item.id}')" title="Click to give your personal rate">
                  <span>⭐ Rate This Dish</span>
                </button>
              `}
            </div>

            <div class="card-footer" style="margin-top: 0.85rem;">
              <div class="price-box">
                <span class="price-current">$${item.price.toFixed(2)}</span>
                ${item.originalPrice ? `<span class="price-old">$${item.originalPrice.toFixed(2)}</span>` : ''}
              </div>

              ${inCartQty > 0 ? `
                <div class="card-stepper">
                  <button onclick="window.FoodieHub.updateCartQty('${item.id}', -1)">−</button>
                  <span>${inCartQty}</span>
                  <button onclick="window.FoodieHub.updateCartQty('${item.id}', 1)">+</button>
                </div>
              ` : `
                <button class="btn-add-cart" onclick="window.FoodieHub.addToCart('${item.id}')">
                  <span>+ Add</span>
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Update Active Filter Pills
  function updateActiveFilterPills() {
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === state.currentCategory);
    });

    elements.dietFilters.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diet === state.dietaryFilter);
    });
  }

  // ============================================================================
  // PERSONAL RATING SYSTEM
  // ============================================================================

  function openPersonalRateModal(dishId) {
    const item = FOOD_MENU.find(i => i.id === dishId);
    if (!item) return;

    state.activeRateDishId = dishId;
    const existing = state.personalRatings[dishId];

    if (elements.rateDishTitle) elements.rateDishTitle.textContent = item.name;
    if (elements.rateDishThumb) elements.rateDishThumb.src = item.image;

    state.currentRateScore = existing ? existing.rating : 5.0;
    renderInteractiveStars(elements.rateStarsInteractive, state.currentRateScore);
    if (elements.rateScoreDisplay) {
      elements.rateScoreDisplay.textContent = `${state.currentRateScore.toFixed(1)} / 5.0 ⭐`;
    }

    if (elements.rateTastingNotes) {
      elements.rateTastingNotes.value = existing ? existing.tastingNotes : '';
    }

    // Flavor tags
    renderFlavorTags(existing ? existing.tags || [] : []);

    // Delete button visibility
    if (elements.btnDeleteRating) {
      elements.btnDeleteRating.style.display = existing ? 'inline-flex' : 'none';
    }

    if (elements.personalRateModalBackdrop) {
      elements.personalRateModalBackdrop.classList.add('open');
    }
  }

  function renderInteractiveStars(container, initialScore) {
    if (!container) return;
    const rounded = Math.round(initialScore);
    container.innerHTML = [1, 2, 3, 4, 5].map(star => `
      <span class="star-interactive-item ${star <= rounded ? 'active' : ''}" data-value="${star}">★</span>
    `).join('');

    const stars = container.querySelectorAll('.star-interactive-item');
    stars.forEach(starEl => {
      starEl.addEventListener('mouseenter', () => {
        const val = parseInt(starEl.dataset.value);
        stars.forEach(s => {
          s.classList.toggle('hover', parseInt(s.dataset.value) <= val);
        });
      });

      starEl.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hover'));
      });

      starEl.addEventListener('click', () => {
        const val = parseFloat(starEl.dataset.value);
        state.currentRateScore = val;
        stars.forEach(s => {
          s.classList.toggle('active', parseFloat(s.dataset.value) <= val);
        });
        if (elements.rateScoreDisplay) {
          elements.rateScoreDisplay.textContent = `${val.toFixed(1)} / 5.0 ⭐`;
        }
      });
    });
  }

  function renderFlavorTags(selectedTags = []) {
    if (!elements.rateFlavorTags) return;
    const allTags = [
      '🔥 Super Spicy', '🧀 Extra Cheesy', '🌿 Crisp & Fresh', '⚡ Lightning Fast',
      '🤤 Chef Kiss', '💰 Worth Every Penny', '👑 Ultra Gourmet', '🍫 Sweet Tooth',
      '🥑 Creamy Texture', '🪵 Wood-Fired Smokey'
    ];

    elements.rateFlavorTags.innerHTML = allTags.map(tag => {
      const isSel = selectedTags.includes(tag);
      return `<button type="button" class="flavor-tag-pill ${isSel ? 'selected' : ''}" data-tag="${tag}">${tag}</button>`;
    }).join('');

    elements.rateFlavorTags.querySelectorAll('.flavor-tag-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
      });
    });
  }

  function savePersonalRating() {
    const dishId = state.activeRateDishId;
    if (!dishId) return;

    const tastingNotes = elements.rateTastingNotes ? elements.rateTastingNotes.value.trim() : '';
    const selectedTags = [];
    if (elements.rateFlavorTags) {
      elements.rateFlavorTags.querySelectorAll('.flavor-tag-pill.selected').forEach(b => {
        selectedTags.push(b.dataset.tag);
      });
    }

    const dishItem = FOOD_MENU.find(i => i.id === dishId);

    state.personalRatings[dishId] = {
      rating: state.currentRateScore,
      tastingNotes: tastingNotes || 'Rated with personal culinary approval.',
      tags: selectedTags,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Award Foodie Coins
    state.userProfile.foodieCoins = (state.userProfile.foodieCoins || 0) + 20;

    savePersonalRatings();
    saveUserProfile();
    closeModals();
    renderMenu();
    updateProfileUI();

    showToast(`Saved personal rate (${state.currentRateScore.toFixed(1)}⭐) for ${dishItem ? dishItem.name : 'dish'}! +20 Coins 🪙`);
  }

  function deletePersonalRating() {
    const dishId = state.activeRateDishId;
    if (!dishId || !state.personalRatings[dishId]) return;

    delete state.personalRatings[dishId];
    savePersonalRatings();
    closeModals();
    renderMenu();
    updateProfileUI();
    showToast(`Removed your personal rating.`);
  }

  // ============================================================================
  // FOODIE SNAPS & USER PHOTO GALLERY
  // ============================================================================

  function renderSnaps() {
    if (!elements.snapsGrid) return;

    let list = state.snaps.slice();

    if (state.snapsFilter === 'personal') {
      list = list.filter(s => s.isPersonal === true || s.author === state.userProfile.name);
    } else if (state.snapsFilter === 'top-rated') {
      list = list.filter(s => s.personalRate >= 4.9);
    }

    if (list.length === 0) {
      elements.snapsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 2px dashed var(--border-light);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📸</div>
          <h3>No snaps found in this filter!</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Be the first to share your personal photo and review with the Foodie community.</p>
          <button class="btn-upload-snap-hero" onclick="window.FoodieHub.openSnapUploadModal()">
            <span>📸 Upload Your Food Snap</span>
          </button>
        </div>
      `;
      return;
    }

    elements.snapsGrid.innerHTML = list.map(snap => {
      const isUserSnap = snap.isPersonal || snap.author === state.userProfile.name;
      return `
        <div class="snap-card" data-snap-id="${snap.id}">
          <div class="snap-card-media">
            <img src="${snap.foodPhoto}" alt="${snap.dishName}" loading="lazy" />
            ${isUserSnap ? `<div class="snap-badge-personal"><span>📸</span> Your Personal Photo</div>` : ''}
            <div class="snap-rate-badge">⭐ ${Number(snap.personalRate).toFixed(1)}</div>
          </div>

          <div class="snap-card-body">
            <div class="snap-author-row">
              <img src="${isUserSnap ? state.userProfile.avatar : snap.authorPhoto}" alt="${snap.author}" class="snap-author-avatar" />
              <div class="snap-author-info">
                <span class="snap-author-name">${isUserSnap ? state.userProfile.name + ' (You)' : snap.author}</span>
                <span class="snap-meta-time">${snap.date}</span>
              </div>
            </div>

            <div class="snap-dish-tag">🍽️ ${snap.dishName}</div>
            <p class="snap-caption">"${snap.review}"</p>

            <div class="snap-card-footer">
              <span class="snap-vibe-tag">${snap.vibe || 'Foodie Bite'}</span>
              <div style="display:flex;align-items:center;gap:0.5rem">
                <button class="snap-like-btn" onclick="window.FoodieHub.likeSnap('${snap.id}')">
                  <span>❤️</span>
                  <span>${snap.likes || 0}</span>
                </button>
                ${isUserSnap ? `
                  <button class="snap-delete-btn" title="Delete your snap" onclick="window.FoodieHub.deleteSnap('${snap.id}')">🗑️</button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function openSnapUploadModal(preselectedDishId = null) {
    state.tempSnapPhoto = null;
    if (elements.snapPreviewWrap) elements.snapPreviewWrap.style.display = 'none';
    if (elements.snapFileInput) elements.snapFileInput.value = '';
    if (elements.snapCaptionInput) elements.snapCaptionInput.value = '';

    // Populate Dish selector
    if (elements.snapDishSelect && typeof FOOD_MENU !== 'undefined') {
      elements.snapDishSelect.innerHTML = FOOD_MENU.map(item => `
        <option value="${item.id}" ${item.id === preselectedDishId ? 'selected' : ''}>${item.name} (${item.category})</option>
      `).join('') + `<option value="custom">Other / Custom Chef Dish</option>`;
    }

    // Render 5 interactive stars for snap
    if (elements.snapStarsInteractive) {
      renderInteractiveStars(elements.snapStarsInteractive, 5.0);
    }
    if (elements.snapScoreDisplay) elements.snapScoreDisplay.textContent = '5.0 / 5.0 ⭐';

    if (elements.snapUploadModalBackdrop) {
      elements.snapUploadModalBackdrop.classList.add('open');
    }
  }

  function handleSnapFileSelect(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.tempSnapPhoto = e.target.result;
      if (elements.snapPreviewImg) elements.snapPreviewImg.src = e.target.result;
      if (elements.snapPreviewWrap) elements.snapPreviewWrap.style.display = 'block';
      showToast('Personal food photo loaded! Preview ready.');
    };
    reader.readAsDataURL(file);
  }

  function submitFoodSnap() {
    if (!state.tempSnapPhoto) {
      showToast('Please select or upload a personal food photo first! 📸');
      return;
    }

    const dishSelect = elements.snapDishSelect;
    const dishId = dishSelect ? dishSelect.value : 'b1';
    let dishName = 'Chef Special Dish';
    const found = FOOD_MENU.find(i => i.id === dishId);
    if (found) dishName = found.name;

    const caption = elements.snapCaptionInput ? elements.snapCaptionInput.value.trim() : '';
    const vibe = elements.snapVibeSelect ? elements.snapVibeSelect.value : 'Personal Moment 📸';

    const newSnap = {
      id: 'snap-' + Date.now(),
      author: state.userProfile.name,
      authorPhoto: state.userProfile.avatar,
      isPersonal: true,
      dishId: dishId,
      dishName: dishName,
      foodPhoto: state.tempSnapPhoto,
      personalRate: state.currentRateScore || 5.0,
      review: caption || 'Shared my personal bite! Tasted phenomenal.',
      vibe: vibe,
      date: 'Just now',
      likes: 1
    };

    // Prepend to snaps
    state.snaps.unshift(newSnap);
    saveSnaps();

    // Reward coins
    state.userProfile.foodieCoins = (state.userProfile.foodieCoins || 0) + 50;
    saveUserProfile();

    // Also register personal rating if not already rated
    if (found && !state.personalRatings[found.id]) {
      state.personalRatings[found.id] = {
        rating: state.currentRateScore || 5.0,
        tastingNotes: caption || 'Loved this dish!',
        tags: ['📸 Photo Snap'],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      savePersonalRatings();
      renderMenu();
    }

    closeModals();
    renderSnaps();
    updateProfileUI();

    showToast('Your Personal Food Snap is live! +50 Foodie Coins earned! 📸🎉');

    // Smooth scroll to snaps
    const snapsEl = document.getElementById('snapsSection');
    if (snapsEl) snapsEl.scrollIntoView({ behavior: 'smooth' });
  }

  function likeSnap(snapId) {
    const snap = state.snaps.find(s => s.id === snapId);
    if (!snap) return;
    snap.likes = (snap.likes || 0) + 1;
    saveSnaps();
    renderSnaps();
  }

  function deleteSnap(snapId) {
    if (!confirm('Are you sure you want to delete this food snap?')) return;
    state.snaps = state.snaps.filter(s => s.id !== snapId);
    saveSnaps();
    renderSnaps();
    updateProfileUI();
    showToast('Snap removed.');
  }

  // ============================================================================
  // USER FOODIE PROFILE / MY FOODIE SPACE
  // ============================================================================

  function updateProfileUI() {
    // Navbar pill
    if (elements.navProfileAvatar) elements.navProfileAvatar.src = state.userProfile.avatar;
    if (elements.navProfileName) elements.navProfileName.textContent = state.userProfile.name;
    const ratedCount = Object.keys(state.personalRatings).length;
    if (elements.navProfileRatedCount) {
      elements.navProfileRatedCount.textContent = `${ratedCount} rated`;
    }

    // Large profile modal elements
    if (elements.profileAvatarLarge) elements.profileAvatarLarge.src = state.userProfile.avatar;
    if (elements.profileNameLarge) elements.profileNameLarge.textContent = state.userProfile.name;
    if (elements.profileTitleLarge) elements.profileTitleLarge.textContent = state.userProfile.title;
    if (elements.profileBioLarge) elements.profileBioLarge.textContent = state.userProfile.bio;

    // Stats
    if (elements.statRatedCount) elements.statRatedCount.textContent = ratedCount;

    // Calculate Average Rating
    let avg = '0.0';
    const ratingsArr = Object.values(state.personalRatings).map(r => r.rating);
    if (ratingsArr.length > 0) {
      const sum = ratingsArr.reduce((a, b) => a + b, 0);
      avg = (sum / ratingsArr.length).toFixed(1);
    }
    if (elements.statAvgRate) elements.statAvgRate.textContent = `${avg} ★`;

    const personalSnapsCount = state.snaps.filter(s => s.isPersonal || s.author === state.userProfile.name).length;
    if (elements.statSnapsCount) elements.statSnapsCount.textContent = personalSnapsCount;
    if (elements.statCoinsCount) elements.statCoinsCount.textContent = `${state.userProfile.foodieCoins || 0} 🪙`;

    // Render Rated Items Tab inside profile modal
    renderProfileRatedList();
    renderProfileSnapsList();
    renderProfileFavoritesList();
  }

  function renderProfileRatedList() {
    const container = document.getElementById('profileRatedItemsList');
    if (!container) return;

    const ratedKeys = Object.keys(state.personalRatings);
    if (ratedKeys.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          You haven't given any personal ratings yet. Explore the menu and click "⭐ Rate This Dish" to start your tasting journal!
        </div>
      `;
      return;
    }

    container.innerHTML = ratedKeys.map(id => {
      const item = FOOD_MENU.find(i => i.id === id);
      const pr = state.personalRatings[id];
      if (!item) return '';

      return `
        <div class="rated-item-row">
          <img src="${item.image}" alt="${item.name}" class="rated-item-thumb" />
          <div class="rated-item-details">
            <div class="rated-item-name">${item.name}</div>
            <div class="rated-item-notes">"${pr.tastingNotes}"</div>
            <div style="font-size:0.72rem;color:var(--text-subtle);margin-top:0.25rem">Rated on ${pr.date}</div>
          </div>
          <div class="rated-item-score-pill">⭐ ${Number(pr.rating).toFixed(1)}</div>
          <div class="rated-item-actions">
            <button onclick="window.FoodieHub.openPersonalRateModal('${item.id}')" title="Edit your rate" style="border:none;background:var(--bg-subtle);padding:0.35rem 0.6rem;border-radius:6px;cursor:pointer">✏️</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderProfileSnapsList() {
    const container = document.getElementById('profileSnapsList');
    if (!container) return;

    const mySnaps = state.snaps.filter(s => s.isPersonal || s.author === state.userProfile.name);
    if (mySnaps.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No personal food snaps uploaded yet. Click "Upload Your Food Snap" to showcase your culinary moments!
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.85rem;">
        ${mySnaps.map(snap => `
          <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; height: 120px; box-shadow: var(--shadow-sm);">
            <img src="${snap.foodPhoto}" alt="${snap.dishName}" style="width:100%;height:100%;object-fit:cover;" />
            <div style="position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.75); color: #F59E0B; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
              ⭐ ${snap.personalRate}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderProfileFavoritesList() {
    const container = document.getElementById('profileFavsList');
    if (!container) return;

    const favIds = Array.from(state.favorites);
    if (favIds.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          Your wishlist is empty. Tap the ❤️ icon on any dish to save it here!
        </div>
      `;
      return;
    }

    container.innerHTML = favIds.map(id => {
      const item = FOOD_MENU.find(i => i.id === id);
      if (!item) return '';

      return `
        <div class="rated-item-row">
          <img src="${item.image}" alt="${item.name}" class="rated-item-thumb" />
          <div class="rated-item-details">
            <div class="rated-item-name">${item.name}</div>
            <div style="font-weight:700;color:var(--primary);font-size:0.85rem">$${item.price.toFixed(2)}</div>
          </div>
          <button class="btn-add-cart" style="padding:0.4rem 0.8rem;font-size:0.8rem" onclick="window.FoodieHub.addToCart('${item.id}'); window.FoodieHub.showToast('Added to cart!');">
            + Add to Cart
          </button>
        </div>
      `;
    }).join('');
  }

  function openProfileModal() {
    updateProfileUI();
    if (elements.profileModalBackdrop) {
      elements.profileModalBackdrop.classList.add('open');
    }
  }

  function handleProfilePhotoUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.userProfile.avatar = e.target.result;
      saveUserProfile();
      updateProfileUI();
      renderSnaps();
      showToast('Personal profile photo updated! 📸✨');
    };
    reader.readAsDataURL(file);
  }

  function editProfileDetails() {
    const currentName = state.userProfile.name;
    const currentTitle = state.userProfile.title;
    const currentBio = state.userProfile.bio;

    const newName = prompt('Enter your Foodie Display Name:', currentName);
    if (newName && newName.trim()) {
      state.userProfile.name = newName.trim();
    }

    const newTitle = prompt('Enter your Foodie Title:', currentTitle);
    if (newTitle && newTitle.trim()) {
      state.userProfile.title = newTitle.trim();
    }

    const newBio = prompt('Enter your Foodie Bio:', currentBio);
    if (newBio && newBio.trim()) {
      state.userProfile.bio = newBio.trim();
    }

    saveUserProfile();
    updateProfileUI();
    renderSnaps();
    showToast('Foodie profile info updated!');
  }

  // ============================================================================
  // QUICK VIEW & CUSTOMIZE MODAL
  // ============================================================================

  function openQuickView(itemId) {
    const item = FOOD_MENU.find(i => i.id === itemId);
    if (!item) return;
    state.activeModalItem = item;

    let selectedAddons = [];

    const calculateCurrentTotal = () => {
      const addonsSum = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      return (item.price + addonsSum).toFixed(2);
    };

    const personalRatingObj = state.personalRatings[item.id];

    elements.quickViewContent.innerHTML = `
      <div class="modal-grid">
        <div class="modal-media">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="modal-info">
          <div class="modal-header-meta">
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span class="diet-indicator ${item.isVeg ? 'veg' : 'nonveg'}"></span>
              <span class="badge ${item.isVeg ? 'badge-green' : 'badge-primary'}">${item.isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
              ${item.badge ? `<span class="badge badge-amber">${item.badge}</span>` : ''}
            </div>
            <div class="card-rating">⭐ ${item.rating.toFixed(1)} (${item.reviewsCount} reviews)</div>
          </div>

          <h2 class="modal-title">${item.name}</h2>
          <p class="modal-desc">${item.description}</p>

          <!-- Inline Personal Rating Indicator -->
          <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:var(--radius-md);padding:0.75rem 1rem;margin:1rem 0;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:0.75rem;font-weight:700;color:#92400E;text-transform:uppercase;">Your Personal Rate</div>
              <div style="font-size:0.85rem;color:#78350F;margin-top:0.15rem;">
                ${personalRatingObj ? `Rated <strong>⭐ ${personalRatingObj.rating.toFixed(1)}</strong>: "${personalRatingObj.tastingNotes}"` : 'You have not rated this dish yet.'}
              </div>
            </div>
            <button type="button" onclick="window.FoodieHub.openPersonalRateModal('${item.id}')" style="background:#F59E0B;color:#FFF;border:none;padding:0.4rem 0.85rem;border-radius:var(--radius-full);font-size:0.78rem;font-weight:700;cursor:pointer">
              ${personalRatingObj ? 'Edit Rate' : '⭐ Rate Dish'}
            </button>
          </div>

          <div class="modal-ingredients">
            <h4>Ingredients</h4>
            <div class="ingredients-tags">
              ${item.ingredients ? item.ingredients.map(ing => `<span class="ing-tag">${ing}</span>`).join('') : ''}
            </div>
          </div>

          ${item.addons && item.addons.length > 0 ? `
            <div class="modal-addons-section">
              <h4>Customize & Add-ons</h4>
              ${item.addons.map((addon, idx) => `
                <label class="addon-item" for="addon-${idx}">
                  <span class="addon-name">
                    <input type="checkbox" id="addon-${idx}" data-idx="${idx}" />
                    ${addon.name}
                  </span>
                  <span class="addon-price">+ $${addon.price.toFixed(2)}</span>
                </label>
              `).join('')}
            </div>
          ` : ''}

          <div class="form-group" style="margin-bottom:1.5rem">
            <label class="form-label" style="font-size:0.75rem">Chef Special Request / Notes</label>
            <input type="text" id="modalSpecialNotes" class="form-input" placeholder="e.g. Extra napkins, dressing on side..." />
          </div>

          <div class="modal-action-bar">
            <div class="modal-price-display">
              <span style="font-size:0.75rem;color:var(--text-muted)">Total Item Price</span>
              <strong id="modalTotalPriceDisplay">$${item.price.toFixed(2)}</strong>
            </div>
            <button class="modal-add-btn" id="modalAddToCartBtn">
              <span>Add to Order</span>
              <span>🛒</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Addon Checkbox Listeners
    const checkboxes = elements.quickViewContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        selectedAddons = [];
        checkboxes.forEach(box => {
          if (box.checked) {
            const idx = parseInt(box.dataset.idx);
            selectedAddons.push(item.addons[idx]);
          }
        });
        const priceDisplay = document.getElementById('modalTotalPriceDisplay');
        if (priceDisplay) priceDisplay.textContent = `$${calculateCurrentTotal()}`;
      });
    });

    // Add to Cart
    const addBtn = document.getElementById('modalAddToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const notes = document.getElementById('modalSpecialNotes') ? document.getElementById('modalSpecialNotes').value.trim() : '';
        addToCart(item.id, selectedAddons, notes);
        closeModals();
      });
    }

    elements.quickViewBackdrop.classList.add('open');
  }

  // ============================================================================
  // CART & CHECKOUT ENGINE
  // ============================================================================

  function addToCart(itemId, addons = [], notes = '') {
    const item = FOOD_MENU.find(i => i.id === itemId);
    if (!item) return;

    const addonsKey = addons.map(a => a.name).sort().join('|');
    const existingIndex = state.cart.findIndex(c => c.id === itemId && c.addonsKey === addonsKey && c.notes === notes);

    if (existingIndex > -1) {
      state.cart[existingIndex].qty += 1;
    } else {
      const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
      state.cart.push({
        id: item.id,
        name: item.name,
        image: item.image,
        basePrice: item.price,
        unitPrice: item.price + addonsPrice,
        addons: addons,
        addonsKey: addonsKey,
        notes: notes,
        qty: 1
      });
    }

    saveCart();
    updateCartUI();
    renderMenu();
    showToast(`Added "${item.name}" to your feast! 🍔`);
  }

  function updateCartQty(itemId, delta, addonsKey = '') {
    const itemIndex = state.cart.findIndex(c => c.id === itemId && (addonsKey ? c.addonsKey === addonsKey : (!c.addons || c.addons.length === 0)));
    if (itemIndex === -1) return;

    state.cart[itemIndex].qty += delta;
    if (state.cart[itemIndex].qty <= 0) {
      state.cart.splice(itemIndex, 1);
    }

    saveCart();
    updateCartUI();
    renderMenu();
  }

  function removeFromCart(cartIndex) {
    if (state.cart[cartIndex]) {
      const removed = state.cart.splice(cartIndex, 1);
      saveCart();
      updateCartUI();
      renderMenu();
      showToast(`Removed "${removed[0].name}" from cart.`);
    }
  }

  function toggleFavorite(itemId) {
    if (state.favorites.has(itemId)) {
      state.favorites.delete(itemId);
      showToast('Removed from favorites 🤍');
    } else {
      state.favorites.add(itemId);
      showToast('Saved to your favorites ❤️');
    }
    saveFavs();
    renderMenu();
    updateProfileUI();
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);

    // Badges & Pill
    if (elements.cartBadgeCount) elements.cartBadgeCount.textContent = totalItems;
    if (elements.cartPillTotal) elements.cartPillTotal.textContent = `$${subtotal.toFixed(2)}`;

    // Free delivery meter
    const remainingForFree = Math.max(0, state.freeDeliveryThreshold - subtotal);
    const progressPct = Math.min(100, Math.round((subtotal / state.freeDeliveryThreshold) * 100));

    if (elements.freeDeliveryFill) {
      elements.freeDeliveryFill.style.width = `${progressPct}%`;
    }

    if (elements.freeDeliveryMsg) {
      if (remainingForFree === 0 && subtotal > 0) {
        elements.freeDeliveryMsg.innerHTML = '🎉 <strong>Congratulations!</strong> You unlocked <strong>FREE Delivery!</strong>';
      } else {
        elements.freeDeliveryMsg.innerHTML = `Add <strong>$${remainingForFree.toFixed(2)}</strong> more to get <strong>FREE White-Glove Delivery!</strong>`;
      }
    }

    // Bill calculation
    let deliveryFee = subtotal > 0 ? (remainingForFree === 0 ? 0.00 : state.deliveryFeeBase) : 0.00;
    const tax = subtotal * state.taxRate;
    let discount = 0.00;

    if (state.appliedPromo) {
      if (state.appliedPromo.type === 'percent') {
        discount = Math.min(state.appliedPromo.maxCap, subtotal * (state.appliedPromo.value / 100));
      } else if (state.appliedPromo.type === 'flat') {
        discount = state.appliedPromo.value;
      } else if (state.appliedPromo.type === 'delivery') {
        discount = deliveryFee;
        deliveryFee = 0.00;
      }
    }

    const total = Math.max(0, subtotal + deliveryFee + tax - discount);

    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.cartDeliveryFee) elements.cartDeliveryFee.textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    if (elements.cartTax) elements.cartTax.textContent = `$${tax.toFixed(2)}`;

    if (elements.cartDiscountRow && elements.cartDiscountVal) {
      if (discount > 0) {
        elements.cartDiscountRow.style.display = 'flex';
        elements.cartDiscountVal.textContent = `- $${discount.toFixed(2)} (${state.appliedPromo.code})`;
      } else {
        elements.cartDiscountRow.style.display = 'none';
      }
    }

    if (elements.cartTotal) elements.cartTotal.textContent = `$${total.toFixed(2)}`;

    // Render Items in Cart Drawer
    if (!elements.cartItemsList) return;

    if (state.cart.length === 0) {
      elements.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div style="font-size:3rem;margin-bottom:0.75rem">🛒</div>
          <h4>Your cart is empty</h4>
          <p>Explore our menu and add your favorite dishes!</p>
        </div>
      `;
      if (elements.btnCheckout) elements.btnCheckout.disabled = true;
      return;
    }

    if (elements.btnCheckout) elements.btnCheckout.disabled = false;

    elements.cartItemsList.innerHTML = state.cart.map((cItem, idx) => `
      <div class="cart-item-row">
        <img src="${cItem.image}" alt="${cItem.name}" class="cart-item-img" />
        <div class="cart-item-details">
          <h4 class="cart-item-title">${cItem.name}</h4>
          ${cItem.addons && cItem.addons.length > 0 ? `
            <div class="cart-item-addons">+ ${cItem.addons.map(a => a.name).join(', ')}</div>
          ` : ''}
          ${cItem.notes ? `<div class="cart-item-notes">Note: "${cItem.notes}"</div>` : ''}
          <div class="cart-item-price">$${(cItem.unitPrice * cItem.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-stepper-small">
            <button onclick="window.FoodieHub.updateCartQty('${cItem.id}', -1, '${cItem.addonsKey || ''}')">−</button>
            <span>${cItem.qty}</span>
            <button onclick="window.FoodieHub.updateCartQty('${cItem.id}', 1, '${cItem.addonsKey || ''}')">+</button>
          </div>
          <button class="cart-item-del-btn" onclick="window.FoodieHub.removeFromCart(${idx})" title="Remove">✕</button>
        </div>
      </div>
    `).join('');
  }

  function applyPromo(code) {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code.');
      return;
    }

    const clean = code.trim().toUpperCase();
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);

    if (subtotal === 0) {
      showToast('Add items to cart before applying promo codes!');
      return;
    }

    if (clean === 'WELCOME50') {
      state.appliedPromo = { code: clean, type: 'percent', value: 50, maxCap: 20.00 };
      showToast('WELCOME50 applied! Flat 50% OFF (up to $20). 🎉');
    } else if (clean === 'FOODIE20') {
      state.appliedPromo = { code: clean, type: 'percent', value: 20, maxCap: 50.00 };
      showToast('FOODIE20 applied! 20% OFF your entire feast! 🍟');
    } else if (clean === 'FREEDEL') {
      state.appliedPromo = { code: clean, type: 'delivery', value: 0 };
      showToast('FREEDEL applied! Free Delivery activated. 🛵');
    } else if (clean === 'TASTY10') {
      if (subtotal < 30) {
        showToast('TASTY10 requires minimum order of $30!');
        return;
      }
      state.appliedPromo = { code: clean, type: 'flat', value: 10.00 };
      showToast('TASTY10 applied! $10.00 OFF your order! 🎁');
    } else {
      showToast('Invalid promo code. Try WELCOME50 or FOODIE20!');
      return;
    }

    updateCartUI();
  }

  function openCartDrawer() {
    if (elements.cartDrawerBackdrop) elements.cartDrawerBackdrop.classList.add('open');
  }

  function closeCartDrawer() {
    if (elements.cartDrawerBackdrop) elements.cartDrawerBackdrop.classList.remove('open');
  }

  function openCheckout() {
    if (state.cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    closeCartDrawer();
    if (elements.checkoutModalBackdrop) elements.checkoutModalBackdrop.classList.add('open');
  }

  // Sync new Order and Items to Supabase
  async function syncOrderToSupabase(orderRecord, items) {
    if (!window.supabaseClient) {
      console.warn('Supabase client not initialized; skipping cloud order sync.');
      return;
    }
    try {
      const { data: orderData, error: orderErr } = await window.supabaseClient
        .from('orders')
        .insert([{
          order_number: orderRecord.orderNumber,
          customer_name: orderRecord.customerName,
          delivery_address: orderRecord.deliveryAddress,
          phone: orderRecord.phone,
          dropoff_notes: orderRecord.dropoffNotes,
          payment_method: orderRecord.paymentMethod,
          subtotal: orderRecord.subtotal,
          delivery_fee: orderRecord.deliveryFee,
          tax: orderRecord.tax,
          discount: orderRecord.discount,
          total_amount: orderRecord.totalAmount,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (orderErr) {
        console.error('Supabase error inserting order:', orderErr);
        return;
      }

      if (orderData && items && items.length > 0) {
        const orderItemsPayload = items.map(it => ({
          order_id: orderData.id,
          food_item_id: it.id || null,
          name: it.name,
          unit_price: parseFloat(it.unitPrice) || 0,
          quantity: it.qty || 1,
          addons: Array.isArray(it.selectedAddons) ? it.selectedAddons : [],
          notes: it.notes || ''
        }));

        const { error: itemsErr } = await window.supabaseClient
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsErr) {
          console.error('Supabase error inserting order items:', itemsErr);
        } else {
          console.log(`✅ Order #${orderRecord.orderNumber} and items synced to Supabase!`);
        }
      }
    } catch (err) {
      console.error('Supabase sync order exception:', err);
    }
  }

  // Update Order Status in Supabase as live tracker progresses
  async function updateOrderStatusInSupabase(orderNumber, stage) {
    if (!window.supabaseClient || !orderNumber) return;
    const statusMap = { 1: 'confirmed', 2: 'preparing', 3: 'on_the_way', 4: 'delivered' };
    const newStatus = statusMap[stage] || 'confirmed';
    try {
      await window.supabaseClient
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('order_number', orderNumber);
      console.log(`✅ Order #${orderNumber} status updated to '${newStatus}' in Supabase`);
    } catch (err) {
      console.warn('Supabase status update error:', err);
    }
  }

  // Newsletter Subscription to Supabase
  async function handleNewsletterSubscribe() {
    const input = document.getElementById('newsletterEmail');
    if (!input) return;
    const em = input.value ? input.value.trim() : '';
    if (em && em.includes('@')) {
      showToast('Subscribed! Check your inbox for $10 voucher 🎁');
      input.value = '';
      if (window.supabaseClient) {
        try {
          const { error } = await window.supabaseClient
            .from('newsletter_subscribers')
            .insert([{ email: em }]);
          if (error && error.code !== '23505') {
            console.warn('Supabase newsletter error:', error);
          } else {
            console.log('✅ Newsletter subscriber recorded in Supabase!');
          }
        } catch (err) {
          console.warn('Newsletter sync exception:', err);
        }
      }
    } else {
      showToast('Please enter a valid email address!');
    }
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    const orderNumber = 'FH-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
    let deliveryFee = subtotal >= state.freeDeliveryThreshold ? 0.00 : state.deliveryFeeBase;
    const tax = subtotal * state.taxRate;
    let discount = 0.00;
    if (state.appliedPromo) {
      if (state.appliedPromo.type === 'percent') {
        discount = Math.min(state.appliedPromo.maxCap, subtotal * (state.appliedPromo.value / 100));
      } else if (state.appliedPromo.type === 'flat') {
        discount = state.appliedPromo.value;
      } else if (state.appliedPromo.type === 'delivery') {
        discount = deliveryFee;
        deliveryFee = 0.00;
      }
    }
    const finalTotal = Math.max(0, subtotal + deliveryFee + tax - discount);

    // Extract checkout form values
    const nameInput = elements.checkoutForm ? elements.checkoutForm.querySelector('input[type="text"]') : null;
    const customerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : (state.userProfile.name || 'Alex Morgan');
    const addrInput = document.getElementById('checkoutAddress');
    const deliveryAddress = (addrInput && addrInput.value.trim()) ? addrInput.value.trim() : 'Downtown, 5th Avenue';
    const phoneInput = document.getElementById('checkoutPhone');
    const phone = (phoneInput && phoneInput.value.trim()) ? phoneInput.value.trim() : '+1 (555) 234-5678';
    const allTextInputs = elements.checkoutForm ? elements.checkoutForm.querySelectorAll('input[type="text"]') : [];
    const dropoffNotes = (allTextInputs.length > 1 && allTextInputs[1].value.trim()) ? allTextInputs[1].value.trim() : '';
    const activePayBtn = elements.checkoutForm ? elements.checkoutForm.querySelector('.payment-option-btn.active span') : null;
    const paymentMethod = activePayBtn ? activePayBtn.textContent.trim() : 'Credit Card';

    const orderRecord = {
      orderNumber,
      customerName,
      deliveryAddress,
      phone,
      dropoffNotes,
      paymentMethod,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      totalAmount: parseFloat(finalTotal.toFixed(2))
    };

    const orderedItems = state.cart.slice();

    state.activeOrder = {
      orderNumber,
      items: orderedItems,
      total: elements.cartTotal ? elements.cartTotal.textContent : `$${finalTotal.toFixed(2)}`,
      createdAt: new Date(),
      stage: 1
    };

    // Save order asynchronously to Supabase cloud database
    syncOrderToSupabase(orderRecord, orderedItems);

    // Clear Cart
    state.cart = [];
    state.appliedPromo = null;
    saveCart();
    updateCartUI();
    renderMenu();
    closeModals();

    // Reward points for order
    state.userProfile.foodieCoins = (state.userProfile.foodieCoins || 0) + 100;
    saveUserProfile();

    showToast(`Order #${orderNumber} placed successfully! 🛵💨`);
    openOrderTracker();
  }

  // ============================================================================
  // LIVE SIMULATED ORDER TRACKER
  // ============================================================================

  function openOrderTracker() {
    if (!state.activeOrder || !elements.orderTrackerContent) return;

    renderOrderTrackerHTML();
    if (elements.orderTrackerBackdrop) elements.orderTrackerBackdrop.classList.add('open');

    // Simulate 4-stage progression
    if (state.orderTrackerInterval) clearInterval(state.orderTrackerInterval);

    state.orderTrackerInterval = setInterval(() => {
      if (!state.activeOrder) {
        clearInterval(state.orderTrackerInterval);
        return;
      }

      if (state.activeOrder.stage < 4) {
        state.activeOrder.stage += 1;
        renderOrderTrackerHTML();
        updateOrderStatusInSupabase(state.activeOrder.orderNumber, state.activeOrder.stage);
        if (state.activeOrder.stage === 4) {
          clearInterval(state.orderTrackerInterval);
          showToast('Ding-dong! Your Foodie Hub feast has arrived! 🎉😋');
        }
      }
    }, 6000); // Progresses every 6 seconds
  }

  function renderOrderTrackerHTML() {
    const o = state.activeOrder;
    if (!o || !elements.orderTrackerContent) return;

    const stages = [
      { num: 1, icon: '📋', title: 'Confirmed', desc: 'Ticket received' },
      { num: 2, icon: '👨‍🍳', title: 'Preparing', desc: 'Chefs cooking' },
      { num: 3, icon: '🛵', title: 'On the Way', desc: 'Rider dispatched' },
      { num: 4, icon: '🎉', title: 'Delivered', desc: 'Enjoy your feast!' }
    ];

    const progressPct = o.stage === 1 ? 15 : o.stage === 2 ? 45 : o.stage === 3 ? 75 : 100;

    elements.orderTrackerContent.innerHTML = `
      <button class="modal-close-btn" onclick="window.FoodieHub.closeOrderTracker()" title="Close">✕</button>
      <div style="text-align:center;margin-bottom:1.5rem">
        <span class="badge badge-primary" style="font-size:0.85rem">Live GPS Tracking</span>
        <h2 style="font-size:1.6rem;margin-top:0.4rem">Order #${o.orderNumber}</h2>
        <p style="color:var(--text-muted);font-size:0.9rem">Estimated Delivery in: <strong style="color:var(--primary)">${o.stage >= 4 ? 'Delivered!' : '18-24 mins'}</strong></p>
      </div>

      <!-- Stepper Track Bar -->
      <div class="tracker-steps-bar" style="--tracker-progress: ${progressPct}%;">
        ${stages.map(st => `
          <div class="tracker-step-item ${st.num <= o.stage ? 'completed' : ''} ${st.num === o.stage ? 'active' : ''}">
            <div class="step-bubble">${st.num <= o.stage ? (st.num < o.stage ? '✓' : st.icon) : st.icon}</div>
            <div class="step-title">${st.title}</div>
            <span style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">${st.desc}</span>
          </div>
        `).join('')}
      </div>

      <!-- Rider Profile Card -->
      <div class="rider-card">
        <div style="display:flex;align-items:center;gap:0.85rem">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" class="rider-avatar" alt="Rider Carlos" />
          <div class="rider-info">
            <h4 style="font-size:0.95rem;font-weight:700;margin-bottom:2px">Carlos Delgado</h4>
            <div style="font-size:0.78rem;color:var(--text-muted)">⚡ Honda EV Scooter • 4.98 ⭐ (1,240 trips)</div>
          </div>
        </div>
        <button style="background:var(--secondary);color:#FFF;border:none;padding:0.45rem 0.9rem;border-radius:var(--radius-full);font-size:0.78rem;font-weight:700;cursor:pointer" onclick="window.FoodieHub.showToast('Calling Rider Carlos Delgado... 📞')">
          📞 Call Rider
        </button>
      </div>

      <button style="width:100%;background:var(--primary);color:#FFF;border:none;padding:0.85rem;border-radius:var(--radius-md);font-weight:700;cursor:pointer" onclick="window.FoodieHub.closeOrderTracker()">
        Continue Browsing Foodie Hub
      </button>
    `;
  }

  // ============================================================================
  // GENERAL MODAL & TOAST CONTROLLER
  // ============================================================================

  function closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(mb => mb.classList.remove('open'));
  }

  function showToast(message) {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ============================================================================
  // EVENT LISTENERS BINDING
  // ============================================================================

  function setupEventListeners() {
    // Category pills
    if (elements.categoryNav) {
      elements.categoryNav.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;
        state.currentCategory = pill.dataset.category;
        updateActiveFilterPills();
        renderMenu();
      });
    }

    // Dietary filter pills
    elements.dietFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        state.dietaryFilter = btn.dataset.diet;
        updateActiveFilterPills();
        renderMenu();
      });
    });

    // Sorting
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', () => {
        state.sortBy = elements.sortSelect.value;
        renderMenu();
      });
    }

    // Search input (inline)
    if (elements.inlineSearchInput) {
      elements.inlineSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMenu();
      });
    }

    // Search input (hero)
    if (elements.heroSearchInput) {
      elements.heroSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (elements.inlineSearchInput) elements.inlineSearchInput.value = e.target.value;
        renderMenu();
      });
    }

    if (elements.heroSearchBtn) {
      elements.heroSearchBtn.addEventListener('click', () => {
        const query = elements.heroSearchInput ? elements.heroSearchInput.value : '';
        state.searchQuery = query;
        renderMenu();
        const menuEl = document.getElementById('menuCatalog');
        if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Quick craving chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.search || chip.textContent.trim();
        state.searchQuery = query;
        if (elements.heroSearchInput) elements.heroSearchInput.value = query;
        if (elements.inlineSearchInput) elements.inlineSearchInput.value = query;
        renderMenu();
        const menuEl = document.getElementById('menuCatalog');
        if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Cart toggles
    if (elements.cartPillBtn) elements.cartPillBtn.addEventListener('click', openCartDrawer);
    if (elements.cartCloseBtn) elements.cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (elements.cartDrawerBackdrop) {
      elements.cartDrawerBackdrop.addEventListener('click', (e) => {
        if (e.target === elements.cartDrawerBackdrop) closeCartDrawer();
      });
    }

    // Quick View Close
    const qvClose = document.getElementById('quickViewCloseBtn');
    if (qvClose) qvClose.addEventListener('click', closeModals);

    // Checkout modal controls
    const checkoutClose = document.getElementById('checkoutCloseBtn');
    if (checkoutClose) checkoutClose.addEventListener('click', closeModals);
    if (elements.btnCheckout) elements.btnCheckout.addEventListener('click', openCheckout);
    if (elements.checkoutForm) elements.checkoutForm.addEventListener('submit', handlePlaceOrder);

    // Promo code
    if (elements.btnApplyPromo) {
      elements.btnApplyPromo.addEventListener('click', () => {
        const val = elements.promoInput ? elements.promoInput.value : '';
        applyPromo(val);
      });
    }

    document.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Copied code "${code}"! Ready to paste.`);
          if (elements.promoInput) elements.promoInput.value = code;
        }).catch(() => {
          if (elements.promoInput) elements.promoInput.value = code;
          showToast(`Selected "${code}"!`);
        });
      });
    });

    // Delivery location change prompt
    const locBtn = document.getElementById('deliveryLocationBtn');
    if (locBtn) {
      locBtn.addEventListener('click', () => {
        const newLoc = prompt('Enter your delivery address / area:', state.userProfile.city || 'Downtown, 5th Avenue');
        if (newLoc && newLoc.trim()) {
          state.userProfile.city = newLoc.trim();
          saveUserProfile();
          const valEl = locBtn.querySelector('.loc-value');
          if (valEl) valEl.textContent = newLoc.trim() + ' ▾';
          showToast(`Delivery location set to "${newLoc.trim()}" 📍`);
        }
      });
    }

    // Profile Trigger
    if (elements.navProfileBtn) {
      elements.navProfileBtn.addEventListener('click', openProfileModal);
    }
    if (elements.profileCloseBtn) {
      elements.profileCloseBtn.addEventListener('click', closeModals);
    }

    // Profile photo upload file input
    const profileFileInput = document.getElementById('profileFileInput');
    if (profileFileInput) {
      profileFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleProfilePhotoUpload(e.target.files[0]);
        }
      });
    }

    // Profile Tabs
    document.querySelectorAll('.profile-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.profile-tab-pane').forEach(p => p.classList.remove('active'));
        tabBtn.classList.add('active');
        const targetId = tabBtn.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Personal Rating Modal Controls
    if (elements.personalRateCloseBtn) elements.personalRateCloseBtn.addEventListener('click', closeModals);
    if (elements.btnSaveRating) elements.btnSaveRating.addEventListener('click', savePersonalRating);
    if (elements.btnDeleteRating) elements.btnDeleteRating.addEventListener('click', deletePersonalRating);

    // Foodie Snap Modal Controls
    if (elements.btnOpenSnapModal) elements.btnOpenSnapModal.addEventListener('click', () => openSnapUploadModal());
    if (elements.snapUploadCloseBtn) elements.snapUploadCloseBtn.addEventListener('click', closeModals);
    if (elements.btnSubmitSnap) elements.btnSubmitSnap.addEventListener('click', submitFoodSnap);

    // Foodie Snap File Input & Dropzone
    if (elements.snapDropzone && elements.snapFileInput) {
      elements.snapDropzone.addEventListener('click', () => elements.snapFileInput.click());
      elements.snapFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleSnapFileSelect(e.target.files[0]);
      });

      elements.snapDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.snapDropzone.classList.add('dragover');
      });

      elements.snapDropzone.addEventListener('dragleave', () => {
        elements.snapDropzone.classList.remove('dragover');
      });

      elements.snapDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.snapDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleSnapFileSelect(e.dataTransfer.files[0]);
        }
      });
    }

    if (elements.snapPreviewRemove) {
      elements.snapPreviewRemove.addEventListener('click', () => {
        state.tempSnapPhoto = null;
        if (elements.snapPreviewWrap) elements.snapPreviewWrap.style.display = 'none';
        if (elements.snapFileInput) elements.snapFileInput.value = '';
      });
    }

    // Snaps filter pills
    document.querySelectorAll('.snap-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.snap-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.snapsFilter = btn.dataset.snapFilter;
        renderSnaps();
      });
    });

    // Close Modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModals();
      });
    });

    // Escape Key Listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModals();
    });

    // Mobile nav toggle
    const mobBtn = document.getElementById('mobileMenuToggle');
    if (mobBtn) {
      mobBtn.addEventListener('click', () => {
        const nav = document.querySelector('.nav-links');
        if (nav) {
          const isShown = nav.style.display === 'flex';
          nav.style.display = isShown ? 'none' : 'flex';
          nav.style.flexDirection = 'column';
          nav.style.position = 'absolute';
          nav.style.top = '76px';
          nav.style.left = '0';
          nav.style.right = '0';
          nav.style.background = '#FFF';
          nav.style.padding = '1.5rem';
          nav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        }
      });
    }
  }

  // ============================================================================
  // EXPOSE GLOBAL API
  // ============================================================================

  window.FoodieHub = {
    openQuickView,
    addToCart,
    updateCartQty,
    removeFromCart,
    toggleFavorite,
    openCheckout,
    openOrderTracker,
    closeOrderTracker: () => {
      if (elements.orderTrackerBackdrop) elements.orderTrackerBackdrop.classList.remove('open');
    },
    openPersonalRateModal,
    openSnapUploadModal,
    openProfileModal,
    likeSnap,
    deleteSnap,
    editProfileDetails,
    showToast,
    handleNewsletterSubscribe
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
