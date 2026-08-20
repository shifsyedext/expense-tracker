import { Layout } from 'antd';
import CallToAction from '../../components/CallToAction';
import FeatureSection from '../../components/FeatureSection';
import HeroSection from '../../components/HeroSection';
import LandingHeader from '../../components/LandingHeader';
import './Home.css';

const Home = (): React.JSX.Element => {
  return (
    <Layout className="home-page">
      <LandingHeader />

      <main>
        <HeroSection />

        <FeatureSection />

        <CallToAction />
      </main>
    </Layout>
  );
};

export default Home;