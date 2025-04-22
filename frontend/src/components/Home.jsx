import React from "react";
import ClientLayout from "./common/layouts/ClientLayout";
import Slideshow from "./common/Slideshow";
import FeaturedProduct from "./common/FeaturedProduct";
import CollectionFeatured from "./common/CollectionFeatured";
import BannerAdvertise from "./common/BannerAdvertise";
import BestCollection from "./common/BestCollection";
import LimitedEdition from "./common/LimitedEdition";

const Home = () => {
  return (
    <ClientLayout>
      <Slideshow />
      <CollectionFeatured />
      <FeaturedProduct />
      <BannerAdvertise />
      <BestCollection />
      <LimitedEdition />
    </ClientLayout>
  );
};

export default Home;
