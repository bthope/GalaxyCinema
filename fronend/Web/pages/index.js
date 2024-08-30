import Image from "next/image";
import styles from "../styles/page.module.css"

import Header from '../components/Header'
import Footer from '../components/Footer'
import Animation from '../components/Home/Animation'
import Introduce from '@/components/Home/Introduce'
import IntroduceBackGroud from '@/components/Home/IntroduceBackGroud'
import Promotional from '@/components/Home/Promotional'
import CinemaCorner from '@/components/Home/CinemaCorner'
import Moive from '@/components/Home/Moive'

export default function Home({ Component, pageProps }) {
  return (
    <div>
        <Header />
        <Animation />
        <Moive />
        <CinemaCorner />
        <Promotional />
        <IntroduceBackGroud />
        <Introduce />
        <Footer />
    </div>
    )
}
