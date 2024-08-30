import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Animation from '../components/Home/Animation'
import Introduce from '@/components/Home/Introduce'
import IntroduceBackGroud from '@/components/Home/IntroduceBackGroud'
import Promotional from '@/components/Home/Promotional'
import CinemaCorner from '@/components/Home/CinemaCorner'
import Moive from '@/components/Home/Moive'
import Home from './index'
import MovieShow from './MovieShow'

function MyApp({ Component, pageProps }) {
    return (
        <div>       
            <Component {...pageProps} />
        </div>
        )
    }

export default MyApp