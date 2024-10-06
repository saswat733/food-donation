import Contact from "../components/Contact";
import Hero from "../components/Hero";
import HeroEmail from "../components/Hero-email";
import FoodDonationSection from "../components/hero-second";
import Testimonials from "../components/testimonials";

export default function Home(){
    return (
        <>
        <Hero/>
        <HeroEmail/>
        <FoodDonationSection/>
        <Contact/>
        <Testimonials/>
        </>
    )
}