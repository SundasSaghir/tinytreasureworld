import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#4a3730] text-center mb-8">Shop by Category</h2>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="flex-shrink-0 w-28 sm:w-32 snap-start group"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#f5ede0] border-2 border-[#e0d4c4] group-hover:border-[#f0d6de] transition-all shadow-sm group-hover:shadow-md">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-[#f0d6de]">
                    &#127873;
                  </div>
                )}
              </div>
              <p className="text-center text-sm font-medium text-[#4a3730] mt-2 group-hover:text-[#d48e66] transition-colors truncate">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
