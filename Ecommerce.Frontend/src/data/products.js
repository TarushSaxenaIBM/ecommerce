export const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Fitness']

export const products = [
  {
    id: 'p1',
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 4999,
    stock: 12,
    description:
      'Over-ear headphones with active noise cancellation, 30-hour battery life, and a fold-flat design for travel.',
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard, 75%',
    category: 'Electronics',
    price: 3499,
    stock: 20,
    description:
      'Hot-swappable mechanical keyboard with a compact 75% layout, PBT keycaps, and USB-C connectivity.',
  },
  {
    id: 'p3',
    name: '4K Webcam',
    category: 'Electronics',
    price: 2799,
    stock: 8,
    description: 'Autofocus 4K webcam with a wide-angle lens, built for video calls and streaming.',
  },
  {
    id: 'p4',
    name: 'Cotton Oxford Shirt',
    category: 'Fashion',
    price: 1299,
    stock: 35,
    description: 'A breathable cotton oxford shirt with a tailored fit, suitable for both office and casual wear.',
  },
  {
    id: 'p5',
    name: 'Leather Chelsea Boots',
    category: 'Fashion',
    price: 3999,
    stock: 15,
    description: 'Full-grain leather Chelsea boots with an elastic side panel and a stacked rubber sole.',
  },
  {
    id: 'p6',
    name: 'Merino Wool Sweater',
    category: 'Fashion',
    price: 2499,
    stock: 22,
    description: 'A lightweight merino wool sweater that regulates temperature and resists odor.',
  },
  {
    id: 'p7',
    name: 'Ceramic Pour-Over Set',
    category: 'Home',
    price: 1499,
    stock: 18,
    description: 'A ceramic pour-over dripper and carafe set for slow, even coffee extraction.',
  },
  {
    id: 'p8',
    name: 'Linen Throw Blanket',
    category: 'Home',
    price: 1899,
    stock: 25,
    description: 'A pre-washed linen throw blanket that softens with every wash, woven in a herringbone pattern.',
  },
  {
    id: 'p9',
    name: 'Table Lamp, Walnut Base',
    category: 'Home',
    price: 2199,
    stock: 10,
    description: 'A dimmable table lamp with a solid walnut base and a linen drum shade.',
  },
  {
    id: 'p10',
    name: 'Designing Data-Intensive Applications',
    category: 'Books',
    price: 899,
    stock: 40,
    description: 'A guide to the ideas behind reliable, scalable, and maintainable systems.',
  },
  {
    id: 'p11',
    name: 'The Pragmatic Programmer',
    category: 'Books',
    price: 799,
    stock: 30,
    description: 'A classic guide to practical, adaptable software craftsmanship.',
  },
  {
    id: 'p12',
    name: 'Adjustable Dumbbell Set',
    category: 'Fitness',
    price: 5499,
    stock: 9,
    description: 'A space-saving adjustable dumbbell pair, 5–25 kg per side in 2.5 kg increments.',
  },
  {
    id: 'p13',
    name: 'Yoga Mat, 6mm',
    category: 'Fitness',
    price: 999,
    stock: 50,
    description: 'A 6mm non-slip yoga mat with dual-sided texture and a carry strap.',
  },
  {
    id: 'p14',
    name: 'Smart Fitness Band',
    category: 'Fitness',
    price: 2299,
    stock: 27,
    description: 'A fitness band with heart-rate tracking, sleep monitoring, and a 10-day battery life.',
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}
