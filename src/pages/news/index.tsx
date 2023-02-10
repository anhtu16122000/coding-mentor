import React from 'react'
import { MainLayout } from '~/common'
import NewsFeed from '~/common/components/News'
import NewsProvider from '~/common/providers/News'

function NewsPage() {
	return (
		<NewsProvider>
			<NewsFeed />
		</NewsProvider>
	)
}

NewsPage.Layout = MainLayout
export default NewsPage
