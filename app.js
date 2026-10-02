// Core storefront and cart logic

// Redirect to login if unauthenticated
const activeUser = JSON.parse(localStorage.getItem('scrapless_user') || 'null');
if (!activeUser && !window.location.pathname.endsWith('login.html')) {
  window.location.replace('login.html');
}

// Product catalog
const PRODUCTS = [
  {
    id: 1,
    name: 'Royal Aged Basmati Rice',
    category: 'Rice & Atta',
    price: 160,
    discountPrice: 125,
    unit: '1 kg Pouch',
    expiryDate: '2026-11-20',
    description: 'Long-grain fragrant aged basmati rice, perfect for biryanis, pulao, and daily steamed rice.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    stock: 24
  },
  {
    id: 2,
    name: 'Organic Unpolished Toor Dal',
    category: 'Dal & Pulses',
    price: 175,
    discountPrice: 135,
    unit: '1 kg Pouch',
    expiryDate: '2026-10-15',
    description: 'Naturally cultivated, unpolished yellow pigeon pea lentils rich in dietary protein and wholesome flavor.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    stock: 18
  },
  {
    id: 3,
    name: 'Pure Desi A2 Cow Ghee',
    category: 'Dairy & Ghee',
    price: 680,
    discountPrice: 530,
    unit: '500 ml Glass Jar',
    expiryDate: '2026-12-10',
    description: 'Traditional bilona churned golden cow ghee with rich granular Danedar texture and pure aroma.',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
    stock: 10
  },
  {
    id: 4,
    name: 'Shahi Garam Masala Blend',
    category: 'Spices & Masalas',
    price: 120,
    discountPrice: 88,
    unit: '100g Box',
    expiryDate: '2026-09-28',
    description: 'Authentic royal spice blend of roasted green cardamom, cloves, cinnamon, and black pepper.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    stock: 15
  },
  {
    id: 5,
    name: 'Fresh Malai Paneer',
    category: 'Dairy & Ghee',
    price: 125,
    discountPrice: 95,
    unit: '200g Pack',
    expiryDate: '2026-09-26',
    description: 'Soft, melt-in-mouth cottage cheese crafted from pure full cream milk, perfect for curries and tikka.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    stock: 14
  },
  {
    id: 6,
    name: 'Organic Turmeric Powder (Haldi)',
    category: 'Spices & Masalas',
    price: 85,
    discountPrice: 60,
    unit: '200g Pouch',
    expiryDate: '2026-10-30',
    description: 'High curcumin Salem turmeric powder freshly ground with no artificial coloring or fillers.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    stock: 20
  },
  {
    id: 7,
    name: 'Yellow Moong Dal (Split)',
    category: 'Dal & Pulses',
    price: 145,
    discountPrice: 110,
    unit: '1 kg Pouch',
    expiryDate: '2026-09-27',
    description: 'Quick-cooking, light and easily digestible split green gram dal for everyday comforting meals.',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    stock: 16
  },
  {
    id: 8,
    name: 'Chakki Fresh Sharbati Atta',
    category: 'Rice & Atta',
    price: 260,
    discountPrice: 210,
    unit: '5 kg Bag',
    expiryDate: '2026-10-25',
    description: '100% whole wheat flour milled from premium Sehore Sharbati grains for extra soft rotis.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    stock: 12
  },
  {
    id: 9,
    name: 'Kashmiri Deggi Mirch Powder',
    category: 'Spices & Masalas',
    price: 95,
    discountPrice: 72,
    unit: '100g Box',
    expiryDate: '2026-10-05',
    description: 'Mild pungent sun-dried Kashmiri red pepper powder imparting natural rich red color to gravies.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    stock: 22
  },
  {
    id: 10,
    name: 'Kachi Ghani Cold-Pressed Mustard Oil',
    category: 'Oils & Staples',
    price: 195,
    discountPrice: 155,
    unit: '1 Litre Bottle',
    expiryDate: '2026-11-15',
    description: 'Cold-pressed pungent mustard oil (Sarson ka Tel) retaining natural antioxidants and aroma.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    stock: 18
  },
  {
    id: 11,
    name: 'Organic Chana Dal (Bengal Gram)',
    category: 'Dal & Pulses',
    price: 130,
    discountPrice: 98,
    unit: '1 kg Pouch',
    expiryDate: '2026-09-29',
    description: 'Nutty and flavorful split chickpeas ideal for tadka dal, dhokla, and traditional snacks.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    stock: 17
  },
  {
    id: 12,
    name: 'Assam Masala Chai CTC Tea',
    category: 'Oils & Staples',
    price: 170,
    discountPrice: 129,
    unit: '250g Pouch',
    expiryDate: '2026-10-18',
    description: 'Strong full-bodied Assam black tea granules infused with cardamom, dry ginger, and cinnamon.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    stock: 25
  }
];

let cart = JSON.parse(localStorage.getItem('scrapless_cart') || '[]');
let activeCategory = 'all';
let searchQuery = '';
let activeSort = 'featured';
let selectedProductForModal = null;

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryGroup = document.getElementById('categoryGroup');
const sortSelect = document.getElementById('sortSelect');
const authNavContainer = document.getElementById('authNavContainer');

const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const cartCount = document.getElementById('cartCount');
const drawerCartCount = document.getElementById('drawerCartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartSavings = document.getElementById('cartSavings');
const cartDelivery = document.getElementById('cartDelivery');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImg = document.getElementById('modalImg');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalUnit = document.getElementById('modalUnit');
const modalExpiry = document.getElementById('modalExpiry');
const modalPrice = document.getElementById('modalPrice');
const modalOldPrice = document.getElementById('modalOldPrice');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

const toast = document.getElementById('toast');

document.addEventListener('DOMContentLoaded', () => {
  renderAuthHeader();
  renderProducts();
  updateCartUI();

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  categoryGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;

    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderProducts();
  });

  sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderProducts();
  });

  openCartBtn.addEventListener('click', () => {
    cartOverlay.classList.add('active');
  });

  closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
  });

  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove('active');
    }
  });

  closeModalBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
  });

  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
      productModal.classList.remove('active');
    }
  });

  modalAddToCartBtn.addEventListener('click', () => {
    if (selectedProductForModal) {
      addToCart(selectedProductForModal.id);
      productModal.classList.remove('active');
    }
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('scrapless_user') || 'null');
    if (!user) {
      showToast('Please sign in to complete checkout.');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
      return;
    }

    alert(`Order Confirmed!\nThank you, ${user.name}! Your order has been placed. You rescued fresh food and saved with Scrapless Cart.`);
    cart = [];
    saveCart();
    updateCartUI();
    cartOverlay.classList.remove('active');
  });
});

// Update authentication status in navigation
function renderAuthHeader() {
  const user = JSON.parse(localStorage.getItem('scrapless_user') || 'null');
  if (user) {
    authNavContainer.innerHTML = `
      <div class="user-badge">
        <span>${escapeHtml(user.name)}</span>
        <button id="logoutBtn" style="color: var(--danger); font-size: 0.8rem; margin-left: 6px; font-weight: 700;">Logout</button>
      </div>
    `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('scrapless_user');
      window.location.href = 'login.html';
    });
  } else {
    authNavContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline" id="loginNavBtn">Sign In</a>
    `;
  }
}

// Filter and sort product list
function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (activeCategory !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }

  if (searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  switch (activeSort) {
    case 'price-low':
      list.sort((a, b) => a.discountPrice - b.discountPrice);
      break;
    case 'price-high':
      list.sort((a, b) => b.discountPrice - a.discountPrice);
      break;
    case 'discount':
      list.sort((a, b) => {
        const discA = (a.price - a.discountPrice) / a.price;
        const discB = (b.price - b.discountPrice) / b.price;
        return discB - discA;
      });
      break;
    case 'featured':
    default:
      break;
  }

  return list;
}

// Render product cards
function renderProducts() {
  const list = getFilteredProducts();

  if (list.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #fff; border-radius: 10px; border: 1px dashed var(--border);">
        <h3 style="margin-bottom: 6px;">No products found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Try selecting a different category or clearing your search.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = list.map(product => {
    const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-img-wrap" onclick="openProductModal(${product.id})">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
          ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ''}
          <span class="expiry-tag">Exp: ${product.expiryDate.slice(5)}</span>
        </div>
        <div class="card-content">
          <span class="card-category">${product.category}</span>
          <h3 class="card-title" onclick="openProductModal(${product.id})">${escapeHtml(product.name)}</h3>
          <p class="card-unit">${product.unit} &bull; ${product.stock} in stock</p>
          <div class="card-bottom">
            <div class="price-box">
              <span class="current-price">₹${product.discountPrice}</span>
              ${product.price > product.discountPrice ? `<span class="old-price">₹${product.price}</span>` : ''}
            </div>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">
              + Add
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Display product details modal
window.openProductModal = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  selectedProductForModal = product;
  modalImg.src = product.image;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;
  modalUnit.textContent = product.unit;
  modalExpiry.textContent = product.expiryDate;
  modalPrice.textContent = `₹${product.discountPrice}`;
  modalOldPrice.textContent = product.price > product.discountPrice ? `₹${product.price}` : '';

  productModal.classList.add('active');
};

// Cart management
window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty += 1;
    } else {
      showToast(`Maximum available stock reached (${product.stock})`);
      return;
    }
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      unit: product.unit,
      image: product.image,
      stock: product.stock,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${product.name} to cart`);
};

window.changeCartQty = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (newQty > item.stock) {
    showToast(`Only ${item.stock} available in stock`);
    return;
  }

  item.qty = newQty;
  saveCart();
  updateCartUI();
};

window.removeFromCart = function(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem('scrapless_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
  cartCount.textContent = totalCount;
  drawerCartCount.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-weight: 600;">Your cart is currently empty.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Add fresh products to save money and cut waste.</p>
      </div>
    `;
    cartSubtotal.textContent = '₹0';
    cartSavings.textContent = '- ₹0';
    cartTotal.textContent = '₹0';
    return;
  }

  const subtotal = cart.reduce((acc, i) => acc + (i.discountPrice * i.qty), 0);
  const regularTotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const savings = regularTotal - subtotal;
  const delivery = subtotal > 300 ? 0 : 35;
  const grandTotal = subtotal + delivery;

  cartSubtotal.textContent = `₹${subtotal}`;
  cartSavings.textContent = `- ₹${savings}`;
  cartDelivery.textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  cartTotal.textContent = `₹${grandTotal}`;

  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${escapeHtml(item.name)}</div>
        <div class="cart-item-price">₹${item.discountPrice} &bull; ${item.unit}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="changeCartQty(${item.id}, -1)">-</button>
          <span style="font-size: 0.85rem; font-weight: 700; min-width: 18px; text-align: center;">${item.qty}</span>
          <button class="qty-btn" onclick="changeCartQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Toast notification helper
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// HTML escape helper
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}
