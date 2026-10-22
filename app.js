// Universal Disclaimer
const DEFAULT_DISCLAIMER = "Information and product do not replace professional medical diagnosis or treatment. Users acknowledge and assume full responsibility for choosing to use natural remedies. Not recommended for pregnant women and children under the age of 16 years.";

// Product Database
const PRODUCTS = [
  {
    id: "MALE-standard",
    name: "MALE-STANDARD",
    image: "assets/male_standard.png",
    price: 320.00,
    category: "pro",
    tags: ["Men's Health", "Hormonal Balance", "Wild Crafted"],
    tagline: "Wild-Crafted Male Hormonal & Vitality Blend",
    description: "M-Standard is a wild crafted, plant based capsules blend, rich in minerals and antioxidants for male hormonal balance.",
    ingredients: "Capadulla, Chaney Root, Bladderwrack, Muira Puama.",
    usage: "Take 4 capsules daily on an empty stomach.",
    disclaimer: "Information and product do not replace professional medical diagnosis or treatment. NOTE: Proprietary blend.",
    expiry: "08/2028"
  },
  {
    id: "FEMALE-STANDARD",
    name: "FEMALE STANDARD",
    image: "assets/female_standard.png",
    price: 249.00,
    category: "punch",
    tags: ["Immunity", "Energy", "Turmeric"],
    tagline: "Golden Botanical Energy Boost",
    description: "A vibrant, revitalizing blend infused with wild yellow turmeric, citrus botanicals, and ginger extracts.",
    ingredients: "Wild Yellow Turmeric, Cold-Pressed Citrus Botanicals, Ginger Root Extract.",
    usage: "Serve chilled. Consume 1 bottle daily.",
    disclaimer: DEFAULT_DISCLAIMER
  },
  {
    id: "mental_boost",
    name: "MENTAL BOOST",
    image: "assets/mental_boost.png",
    price: 249.00,
    category: "punch",
    tags: ["Antioxidant", "Vitality", "Hibiscus"],
    tagline: "Cellular Antioxidant & Bloom",
    description: "Rich in anthocyanins and wild hibiscus extract, this pink formula delivers essential antioxidants.",
    ingredients: "Wild Hibiscus Flower Extract, Rosehip, Botanical Bioflavonoids.",
    usage: "Serve chilled. Enjoy daily.",
    disclaimer: DEFAULT_DISCLAIMER
  },
  {
    id: "pure-flavor-blend",
    name: "PURE WILD BLEND",
    image: "assets/pure_wild_blend.jpg",
    price: 269.00,
    category: "blend",
    tags: ["Gut Health", "Balancing", "Herbal"],
    tagline: "Harmonizing Herbal Tonic",
    description: "A master blend combining wild herbal leaves, digestive bitings, and root extracts.",
    ingredients: "Wild Herbal Leaves, Digestive Bitter Roots, Botanical Extracts.",
    usage: "Drink 1 glass daily before meals.",
    disclaimer: DEFAULT_DISCLAIMER
  },
  {
    id: "grade-attack",
    name: "GRADE ATTACK",
    image: "assets/the_pack.jpg",
    price: 799.00,
    category: "pro",
    tags: ["Full-Spectrum", "Recovery", "Pro-Grade"],
    tagline: "Ultimate Multi-Layered Formula",
    description: "Our premier triple-action botanical formulation combining yellow, pink, and herbal blends.",
    ingredients: "Full-Spectrum Herbal Blend.",
    usage: "Consume 1 bottle after strenuous activity.",
    disclaimer: DEFAULT_DISCLAIMER
  }
];

let cart = [];
let currentCategory = 'all';

// Offline SVG Fallback Image (Embedded Data URI)
const getFallbackImage = () => {
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%23f5f5f4'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='32' fill='%23065f46'>Wondie Herbal</text></svg>";
};

function formatCurrency(amount) {
  return `R${amount.toFixed(2)}`;
}

function renderProducts() {
  const productGrid = document.getElementById('product-grid');
  if (!productGrid) return;

  const filtered = currentCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === currentCategory);

  productGrid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="card-media">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='${getFallbackImage()}'"/>
        <div class="card-tags">
          ${product.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
        </div>
        <button onclick="openModal('${product.id}')" class="quick-view-btn" title="Quick View Details">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div class="card-content">
        <div>
          <span class="card-tagline">${product.tagline}</span>
          <h3 class="card-title">${product.name}</h3>
          <p class="card-desc">${product.description}</p>
          <div class="notice-box">
            <strong>⚠️ Health Notice:</strong> ${product.disclaimer.substring(0, 70)}...
          </div>
        </div>
        <div class="card-footer">
          <span class="card-price">${formatCurrency(product.price)}</span>
          <button onclick="addToCart('${product.id}')" class="btn btn-primary">
            <span>+</span> Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`Added ${product.name} to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(productId);
    else updateCartUI();
  }
}

function updateCartUI() {
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartSubtotalEl || !cartBadge || !cartItemsContainer) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems > 0) {
    cartBadge.textContent = totalItems;
    cartBadge.classList.remove('badge-hidden');
  } else {
    cartBadge.classList.add('badge-hidden');
  }

  cartSubtotalEl.textContent = formatCurrency(subtotal);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="body-text" style="text-align:center; padding: 2rem 0;">Your basket is empty.</p>`;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='${getFallbackImage()}'"/>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="card-price">${formatCurrency(item.price)}</span>
          <div class="qty-controls">
            <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn">+</button>
          </div>
        </div>
        <button onclick="removeFromCart('${item.id}')" class="close-btn" style="font-size:1rem">&times;</button>
      </div>
    `).join('');
  }
}

function openCart() {
  document.getElementById('cart-drawer')?.classList.remove('pointer-events-none');
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.add('pointer-events-none');
}

function openModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const modalContent = document.getElementById('modal-content');
  const productModal = document.getElementById('product-modal');
  if (!product || !modalContent || !productModal) return;

  modalContent.innerHTML = `
    <div style="aspect-ratio:1/1; background-color:#f5f5f4;">
      <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${getFallbackImage()}'"/>
    </div>
    <div class="modal-body">
      <span class="card-tagline">${product.tagline}</span>
      <h3 class="section-title" style="margin-bottom:0.5rem">${product.name}</h3>
      <p class="body-text" style="margin-bottom:1rem">${product.description}</p>
      <p class="body-text" style="margin-bottom:0.5rem"><strong>Ingredients:</strong> ${product.ingredients || 'N/A'}</p>
      <p class="body-text" style="margin-bottom:0.5rem"><strong>Usage:</strong> ${product.usage || 'N/A'}</p>
      <div class="notice-box" style="margin-top:1rem; margin-bottom:1.5rem">
        <strong>Notice:</strong> ${product.disclaimer}
      </div>
      <div class="card-price" style="font-size:1.5rem; margin-bottom:1rem">${formatCurrency(product.price)}</div>
      <button onclick="addToCart('${product.id}'); closeModal();" class="btn btn-primary btn-full">Add to Cart</button>
    </div>
  `;

  productModal.classList.remove('pointer-events-none');
}

function closeModal() {
  document.getElementById('product-modal')?.classList.add('pointer-events-none');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

function initStore() {
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('close-cart-btn')?.addEventListener('click', closeCart);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-category');
      renderProducts();
    });
  });

  renderProducts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStore);
} else {
  initStore();
}