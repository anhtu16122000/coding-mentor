import React from 'react'
import { MainLayout } from '~/common'
import TagsPage from '~/common/pages/options/Tags'

function TagRoute() {
	return <TagsPage />
}
TagRoute.Layout = MainLayout

export default TagRoute
