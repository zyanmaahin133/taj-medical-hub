
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { categoryGroups, pharmacyCategories, diagnosticCategories, radiologyCategories, doctorSpecialties } from "@/data/categories";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  link: string;
}

const CategoryCard = ({ name, icon: Icon, color, link }: CategoryCardProps) => (
  <Link to={link} className="text-center group">
    <Card className="group-hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent group-hover:border-primary/20 h-full bg-card">
      <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center h-full">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <p className="text-xs font-medium line-clamp-2 leading-tight">{name}</p>
      </CardContent>
    </Card>
  </Link>
);

const SectionTitle = ({ title, link, linkText }: { title: string; link?: string; linkText?: string }) => (
  <div className="flex items-center justify-between mb-4 sm:mb-6">
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
    {link && (
      <Link to={link} className="text-primary text-xs sm:text-sm font-medium hover:underline whitespace-nowrap">
        {linkText || "View All"} →
      </Link>
    )}
  </div>
);

const CategorySection = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section>
        <SectionTitle title="Shop by Category" link="/shop" linkText="View All Products" />
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {categoryGroups.slice(0, 8).flatMap(group => 
            group.categories.slice(0, 1).map(cat => (
              <CategoryCard 
                key={cat.slug} 
                name={cat.name} 
                icon={cat.icon} 
                color={cat.color}
                link={`/shop?category=${cat.slug}`}
              />
            ))
          )}
        </div>
      </section>

      <section>
        <SectionTitle title="Browse by Health Condition" link="/lab-tests" linkText="All Lab Tests" />
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {diagnosticCategories.map(cat => (
            <CategoryCard 
              key={cat.slug} 
              name={cat.name} 
              icon={cat.icon} 
              color={cat.color}
              link={`/lab-tests?category=${cat.slug}`}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Pharmacy Categories" link="/shop" linkText="All Medicines" />
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {pharmacyCategories.map(cat => (
            <CategoryCard 
              key={cat.slug} 
              name={cat.name} 
              icon={cat.icon} 
              color={cat.color}
              link={`/shop?category=${cat.slug}`}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Radiology & Imaging" link="/scan-booking" linkText="Book Scan" />
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {radiologyCategories.map(cat => (
            <CategoryCard 
              key={cat.slug} 
              name={cat.name} 
              icon={cat.icon} 
              color={cat.color}
              link={`/scan-booking?type=${cat.slug}`}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Consult Doctors" link="/consult" linkText="All Doctors" />
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {doctorSpecialties.map(cat => (
            <CategoryCard 
              key={cat.slug} 
              name={cat.name} 
              icon={cat.icon} 
              color={cat.color}
              link={`/consult?specialty=${cat.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategorySection;
