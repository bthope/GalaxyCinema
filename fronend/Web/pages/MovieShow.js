import React from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MovieDetail from '@/components/MovieShow/MoiveDetail'
import IntroduceMovie from '@/components/MovieShow/IntroduceMoive'
import IntroduceMovieSoon from '@/components/MovieShow/IntroduceMoiveSoon'
function MovieShow() {
  return (
    <div>
      <Header />
      <MovieDetail />
      <IntroduceMovie />
      <IntroduceMovieSoon />
      <Footer />
    </div>
  )
}

export default MovieShow