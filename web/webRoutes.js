const express = require('express');
const router = express.Router();
const { protect, isMerchant } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { authUser, registerUser } = require('../controllers/authController');
const {
  getStores,
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
} = require('../controllers/storeController');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { listUsers, updateUserRole, deleteUser } = require('../controllers/userAdminController');
const { getDashboardStats } = require('../controllers/dashboardController');

// Public pages
router.get('/', (req, res) => {
  if (req.cookies && req.cookies.token) return res.redirect('/dashboard');
  res.render('login', { error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Auth handlers (using existing controllers)
router.post('/login', async (req, res, next) => {
  try {
    // Call controller; it sends JSON. We want to redirect on success.
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // On success, redirect to dashboard
      return res.redirect('/dashboard');
    };
    await authUser(req, res, next);
  } catch (e) {
    res.render('login', { error: 'Invalid credentials' });
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const originalJson = res.json.bind(res);
    res.json = (data) => res.redirect('/');
    await registerUser(req, res, next);
  } catch (e) {
    res.render('register', { error: 'Registration failed' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Protected pages
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const fakeRes = { json(data){ return res.render('dashboard', { user: req.user, stats: data }); }, status(c){ this._s=c; return this; } };
    await getDashboardStats(req, fakeRes, next);
  } catch (e) { next(e); }
});

// Admin Panel: visible to admin and merchant (vendor) roles
router.get('/admin', protect, (req, res) => {
  if (!(req.user.role === 'admin' || req.user.role === 'merchant')) {
    return res.status(403).send('Forbidden');
  }
  res.render('admin_panel', { user: req.user });
});

router.get('/stores', protect, async (req, res, next) => {
  // Delegate to controller to fetch, but we need to capture JSON
  try {
    const fakeRes = {
      json(data) {
        // support both array and {items,total}
        const payload = Array.isArray(data) ? { items: data, total: data.length, page: 1, limit: data.length } : data;
        res.render('stores_list', { user: req.user, stores: payload.items, q: req.query.q, page: payload.page || 1, limit: payload.limit || 10, hasMore: (payload.page || 1) * (payload.limit || 10) < (payload.total || 0) });
      },
      status(code) { this._status = code; return this; }
    };
    await getStores(req, fakeRes, next);
  } catch (e) {
    next(e);
  }
});

router.get('/stores/new', protect, (req, res) => {
  res.render('stores_new', { user: req.user, error: null });
});

router.get('/stores/:id/edit', protect, async (req, res, next) => {
  try {
    const fakeRes = { json(data){ return res.render('stores_edit', { user: req.user, store: data }); }, status(c){ this._s=c; return this; } };
    await getStoreById(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.post('/stores', protect, async (req, res, next) => {
  // Admin only route, but protect will include role; createStore enforces admin in route normally
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const fakeRes = {
      status(code) { this._status = code; return this; },
      json(data) { return res.redirect('/stores'); }
    };
    await createStore(req, fakeRes, next);
  } catch (e) {
    res.render('stores_new', { user: req.user, error: 'Failed to create store' });
  }
});

router.post('/stores/:id', protect, async (req, res, next) => {
  // PUT via ?_method=PUT; DELETE via ?_method=DELETE
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  if (!req.query || !req.query._method) return res.status(400).send('Bad request');
  try {
    const method = req.query._method.toUpperCase();
    if (method === 'PUT') {
      req.method = 'PUT';
      const fakeRes = { json(){ return res.redirect('/stores'); }, status(c){ this._s=c; return this; } };
      await updateStore(req, fakeRes, next);
    } else if (method === 'DELETE') {
      req.method = 'DELETE';
      const fakeRes = { json(){ return res.redirect('/stores'); }, status(c){ this._s=c; return this; } };
      await deleteStore(req, fakeRes, next);
    } else {
      return res.status(400).send('Bad request');
    }
  } catch (e) { next(e); }
});

module.exports = router;
// Merchant document upload
router.get('/stores/:id/documents', protect, isMerchant, (req, res) => {
  res.render('stores_upload', { user: req.user, storeId: req.params.id, error: null });
});

// ----- Admin: Users Management -----
router.get('/admin/users', protect, async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const fakeRes = { json(data){ const payload = Array.isArray(data)?{items:data,page:1,limit:data.length,total:data.length}:data; return res.render('users_list', { user: req.user, users: payload.items, q: req.query.q, page: payload.page||1, limit: payload.limit||10, hasMore: (payload.page||1)*(payload.limit||10) < (payload.total||0) }); }, status(c){ this._s=c; return this; } };
    await listUsers(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.post('/admin/users/:id/role', protect, async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  req.method = 'PUT';
  try {
    const fakeRes = { json(){ return res.redirect('/admin/users'); }, status(c){ this._s=c; return this; } };
    await updateUserRole(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.post('/admin/users/:id', protect, async (req, res, next) => {
  // Expecting ?_method=DELETE
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  if ((req.query && req.query._method) !== 'DELETE') return res.status(400).send('Bad request');
  req.method = 'DELETE';
  try {
    const fakeRes = { json(){ return res.redirect('/admin/users'); }, status(c){ this._s=c; return this; } };
    await deleteUser(req, fakeRes, next);
  } catch (e) { next(e); }
});

// ----- Admin/Merchant: Products Management -----
router.get('/admin/products', protect, async (req, res, next) => {
  try {
    const fakeRes = { json(data){ const payload = Array.isArray(data)?{items:data,page:1,limit:data.length,total:data.length}:data; res.render('products_list', { user: req.user, products: payload.items, storeId: req.query.storeId, q: req.query.q, page: payload.page||1, limit: payload.limit||10, hasMore: (payload.page||1)*(payload.limit||10) < (payload.total||0) }); }, status(c){ this._s=c; return this; } };
    await listProducts(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.get('/admin/products/new', protect, (req, res) => {
  res.render('products_new', { user: req.user, error: null });
});

router.post('/admin/products', protect, upload.single('image'), async (req, res, next) => {
  try {
    const fakeRes = { status(c){ this._s=c; return this; }, json(){ return res.redirect('/admin/products'); } };
    await createProduct(req, fakeRes, next);
  } catch (e) { res.render('products_new', { user: req.user, error: 'Failed to create product' }); }
});

router.get('/admin/products/:id/edit', protect, async (req, res, next) => {
  try {
    const fakeRes = { json(data){ res.render('products_edit', { user: req.user, product: data }); }, status(c){ this._s=c; return this; } };
    await getProduct(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.post('/admin/products/:id', protect, upload.single('image'), async (req, res, next) => {
  // Emulate PUT via ?_method=PUT
  if ((req.query && req.query._method) !== 'PUT') return res.status(400).send('Bad request');
  req.method = 'PUT';
  try {
    const fakeRes = { json(){ return res.redirect('/admin/products'); }, status(c){ this._s=c; return this; } };
    await updateProduct(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.post('/admin/products/:id', protect, async (req, res, next) => {
  // This also handles DELETE with ?_method=DELETE; above route catches PUT specifically before
  if ((req.query && req.query._method) !== 'DELETE') return res.status(400).send('Bad request');
  req.method = 'DELETE';
  try {
    const fakeRes = { json(){ return res.redirect('/admin/products'); }, status(c){ this._s=c; return this; } };
    await deleteProduct(req, fakeRes, next);
  } catch (e) { next(e); }
});

router.post('/stores/:id/documents', protect, isMerchant, upload.single('document'), async (req, res, next) => {
  try {
    const fakeRes = {
      status(code) { this._status = code; return this; },
      json(data) { return res.redirect('/dashboard'); },
    };
    await uploadStoreDocument(req, fakeRes, next);
  } catch (e) {
    res.render('stores_upload', { user: req.user, storeId: req.params.id, error: 'Upload failed' });
  }
});


