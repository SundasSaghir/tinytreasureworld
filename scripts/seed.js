const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const seedData = {
  admin: {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
  },
  categories: [
    { id: 'cat1', name: 'Hair Accessories', slug: 'hair-accessories', image: '/images/categories/hair.jpg', order: 1 },
    { id: 'cat2', name: 'Baby Accessories', slug: 'baby-accessories', image: '/images/categories/baby.jpg', order: 2 },
    { id: 'cat3', name: 'School Accessories', slug: 'school-accessories', image: '/images/categories/school.jpg', order: 3 },
    { id: 'cat4', name: 'Toys', slug: 'toys', image: '/images/categories/toys.jpg', order: 4 },
    { id: 'cat5', name: 'Gift Items', slug: 'gift-items', image: '/images/categories/gifts.jpg', order: 5 },
  ],
  products: [
    {
      id: 'prod1', name: 'Baby Girl Hair Bow Set', slug: 'baby-girl-hair-bow-set', category: 'hair-accessories',
      description: 'Beautiful set of 6 handmade hair bows for baby girls. Made with soft, gentle materials perfect for delicate hair. Available in assorted pastel colors.',
      price: 499, salePrice: 399, stock: 25, sku: 'HB-001', images: ['/images/products/placeholder.svg'], featured: true, bestSeller: true, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod2', name: 'Princess Hair Clips Set', slug: 'princess-hair-clips-set', category: 'hair-accessories',
      description: 'Set of 10 princess-themed hair clips with sparkling gems. Perfect for parties and daily wear.',
      price: 349, salePrice: null, stock: 15, sku: 'HC-002', images: ['/images/products/placeholder.svg'], featured: true, bestSeller: true, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod3', name: 'Baby Soft Soled Shoes', slug: 'baby-soft-soled-shoes', category: 'baby-accessories',
      description: 'Handcrafted soft soled shoes for newborns and infants. Made with breathable cotton fabric. Non-slip sole for safety.',
      price: 699, salePrice: 599, stock: 20, sku: 'BS-003', images: ['/images/products/placeholder.svg'], featured: true, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod4', name: 'Kids Backpack - Dinosaur', slug: 'kids-backpack-dinosaur', category: 'school-accessories',
      description: 'Adorable dinosaur-shaped backpack for kids. Lightweight with padded straps. Main compartment with front zipper pocket.',
      price: 1299, salePrice: null, stock: 10, sku: 'BP-004', images: ['/images/products/placeholder.svg'], featured: true, bestSeller: true, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod5', name: 'Educational Building Blocks', slug: 'educational-building-blocks', category: 'toys',
      description: '100-piece colorful building blocks set. Helps develop motor skills and creativity. Made from non-toxic materials.',
      price: 899, salePrice: 749, stock: 30, sku: 'TB-005', images: ['/images/products/placeholder.svg'], featured: false, bestSeller: true, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod6', name: 'Baby Gift Hamper', slug: 'baby-gift-hamper', category: 'gift-items',
      description: 'Complete baby gift hamper including soft toy, rattle, bib, and booties. Beautifully packaged in a gift box.',
      price: 1999, salePrice: 1699, stock: 8, sku: 'GH-006', images: ['/images/products/placeholder.svg'], featured: true, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod7', name: 'Kids Sunglasses - Butterfly', slug: 'kids-sunglasses-butterfly', category: 'baby-accessories',
      description: 'Stylish butterfly-shaped sunglasses for kids. UV400 protection. Flexible and durable frame.',
      price: 449, salePrice: null, stock: 3, sku: 'KS-007', images: ['/images/products/placeholder.svg'], featured: false, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod8', name: 'Pencil Case - Unicorn', slug: 'pencil-case-unicorn', category: 'school-accessories',
      description: 'Magical unicorn pencil case with multiple compartments. Holds up to 40 pens and pencils.',
      price: 549, salePrice: 449, stock: 5, sku: 'PC-008', images: ['/images/products/placeholder.svg'], featured: false, bestSeller: true, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod9', name: 'Soft Plush Teddy Bear', slug: 'soft-plush-teddy-bear', category: 'toys',
      description: 'Extra soft cuddly teddy bear. Made from premium plush material. Machine washable. Perfect gift for any occasion.',
      price: 799, salePrice: null, stock: 0, sku: 'TB-009', images: ['/images/products/placeholder.svg'], featured: false, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod10', name: 'Personalized Name Bracelet', slug: 'personalized-name-bracelet', category: 'gift-items',
      description: 'Custom name bracelet for kids. Available in gold, silver, and rose gold. Adjustable length.',
      price: 599, salePrice: 499, stock: 12, sku: 'GB-010', images: ['/images/products/placeholder.svg'], featured: true, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod11', name: 'Hair Bands - Rainbow Set', slug: 'hair-bands-rainbow-set', category: 'hair-accessories',
      description: 'Set of 12 colorful hair bands. No-metal design, gentle on hair. Perfect for active kids.',
      price: 249, salePrice: 199, stock: 50, sku: 'HB-011', images: ['/images/products/placeholder.svg'], featured: false, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
    {
      id: 'prod12', name: 'Kids Lunch Box - Cartoon', slug: 'kids-lunch-box-cartoon', category: 'school-accessories',
      description: 'BPA-free lunch box with cute cartoon design. Leak-proof with separate compartments.',
      price: 849, salePrice: null, stock: 7, sku: 'LB-012', images: ['/images/products/placeholder.svg'], featured: false, bestSeller: false, status: 'active', createdAt: new Date().toISOString(),
    },
  ],
  orders: [],
  banners: [
    {
      id: 'banner1', title: 'New Collection Arrived!', subtitle: 'Explore our latest kids accessories collection', image: '/images/products/placeholder.svg', link: '/shop', active: true, order: 1,
    },
    {
      id: 'banner2', title: 'Back to School Sale', subtitle: 'Up to 40% off on school accessories', image: '/images/products/placeholder.svg', link: '/shop?category=school-accessories', active: true, order: 2,
    },
  ],
  reviews: [
    { id: 'rev1', name: 'Ayesha Khan', rating: 5, comment: 'Amazing quality products! My daughter loves the hair bows. Fast delivery too!', productId: null, active: true, createdAt: new Date().toISOString() },
    { id: 'rev2', name: 'Saima Ali', rating: 4, comment: 'Great selection of kids accessories. The backpack is very durable.', productId: null, active: true, createdAt: new Date().toISOString() },
    { id: 'rev3', name: 'Fatima Ahmed', rating: 5, comment: 'Beautiful gift hamper. Perfect for newborn baby. Highly recommended!', productId: null, active: true, createdAt: new Date().toISOString() },
    { id: 'rev4', name: 'Zara Hussain', rating: 5, comment: 'Very affordable prices and excellent customer service. Will order again!', productId: null, active: true, createdAt: new Date().toISOString() },
  ],
  coupons: [
    { id: 'cpn1', code: 'WELCOME10', discount: 10, type: 'percentage', minAmount: 1000, active: true, expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
    { id: 'cpn2', code: 'FLAT200', discount: 200, type: 'fixed', minAmount: 1500, active: true, expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
  ],
  settings: [
    { key: 'shop_name', value: 'Tiny Treasure World' },
    { key: 'shop_description', value: 'Premium Kids Accessories - Hair Accessories, Baby Items, School Supplies, Toys & Gifts' },
    { key: 'whatsapp_number', value: '923001234567' },
    { key: 'email', value: 'info@tinytreasureworld.com' },
    { key: 'currency', value: 'Rs' },
    { key: 'free_shipping_min', value: '2000' },
    { key: 'delivery_charge', value: '200' },
    { key: 'address', value: 'Shop #5, Kids Fashion Mall, Main Boulevard, Lahore' },
    { key: 'flash_sale_enabled', value: 'true' },
    { key: 'flash_sale_end', value: '' },
    { key: 'facebook_url', value: 'https://facebook.com' },
    { key: 'instagram_url', value: 'https://instagram.com' },
    { key: 'tiktok_url', value: 'https://tiktok.com/@tinytreasureworld' },
  ],
};

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2), 'utf-8');
console.log('Seed data created successfully!');
console.log('Admin login: username=admin, password=admin123');
