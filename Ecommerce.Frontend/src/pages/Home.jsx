import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const featured = products.slice(0, 4)

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-gray-500 mb-2">EnterpriseShop</p>
        <h1 className="text-4xl font-bold tracking-tight max-w-lg mb-4">
          Everyday goods, chosen with care and shipped without fuss.
        </h1>
        <p className="text-gray-500 max-w-md mb-6">
          Electronics, fashion, home, books and fitness — one catalog, one checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-md text-sm"
        >
          Browse the catalog
        </Link>

        <div className="flex items-baseline justify-between mt-14 mb-1">
          <h2 className="text-xl font-semibold">Featured</h2>
          <Link to="/products" className="text-sm text-gray-500 hover:text-gray-900">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
