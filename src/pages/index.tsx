import MainLayout from '~/common/components/MainLayout'
import EmptyPage from './EmptyPage'
import NewsPage from './news'

const Home = () => {
	return <NewsPage />
}

Home.Layout = MainLayout
export default Home
