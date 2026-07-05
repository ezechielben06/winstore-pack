import Hero from '../components/Home/Hero';
import ShopEntrance from '../components/Home/ShopEntrance';
import Categories from '../components/Home/Categories';
import Testimonials from '../components/Home/Testimonials';
import SocialFeed from '../components/Home/SocialFeed';
import Newsletter from '../components/Home/Newsletter';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ShopEntrance />
      <Categories />
      <Testimonials />
      <SocialFeed />
      <Newsletter />
    </div>
  );
};

export default HomePage;