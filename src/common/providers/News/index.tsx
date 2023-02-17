import { useRouter } from 'next/router'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { ShowNostis } from '~/common/utils'
import { decode } from '~/common/utils/common'

export const NewsContext = createContext<INewsProvider>({})

const NewsProvider = (props) => {
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [currentGroup, setCurrentGroup] = useState('')

	useEffect(() => {
		if (router?.query?.group) {
			setCurrentGroup(decode(router?.query?.group))
		} else {
			setCurrentGroup('')
		}
	}, [router])

	const contextValue = {
		loading,
		setLoading,
		currentGroup,
		setCurrentGroup
	}

	return <NewsContext.Provider value={contextValue}>{props.children}</NewsContext.Provider>
}

export const useNewsContext = () => useContext(NewsContext)
export default NewsProvider
