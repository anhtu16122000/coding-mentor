import React, { useEffect, useState } from 'react'
import { idiomApi } from '~/api/idiom'
import { ShowNoti } from '~/common/utils'
import ReactHtmlParser from 'react-html-parser'

type IAuthLayout = {
	children: React.ReactNode
}

function AuthLayout({ children }: IAuthLayout) {
	const [contentIdiom, setContentIdiom] = useState(null)
	const [dateState, setDateState] = useState<any>(new Date())
	const getIdiom = async () => {
		try {
			const res = await idiomApi.getRandom()
			if (res.status === 200) {
				setContentIdiom(res.data.data)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const createDateObject = (dateState, locale) => {
		const year = dateState.getFullYear()
		const month = dateState.toLocaleDateString(locale, { month: 'long' })
		const date = dateState.getDate()
		const hour = ('0' + dateState.getHours()).slice(-2)
		const minute = ('0' + dateState.getMinutes()).slice(-2)
		const second = ('0' + dateState.getSeconds()).slice(-2)
		return { year, month, date, hour, minute, second }
	}

	useEffect(() => {
		getIdiom()
	}, [])

	useEffect(() => {
		const timeID = setInterval(() => {
			setDateState(createDateObject(new Date(), 'en'))
		}, 1000)
		return () => {
			clearInterval(timeID)
		}
	}, [])

	return (
		<div className="login-container row m-0">
			<div className="col-md-8 col-12 left-login p-0">
				<div className="mask-background" />
				<div className="mask-content !relative">
					{dateState?.hour !== undefined ? (
						<>
							<p className="date">{dateState.date}</p>
							<p className="month_year">
								{dateState.month} {dateState.year}
							</p>
							<p className="time">
								{dateState.hour} : {dateState.minute} : {dateState.second}
							</p>
						</>
					) : (
						<>
							<p className="date">{dateState.getDate()}</p>
							<p className="month_year">
								{dateState.toLocaleDateString('en', { month: 'long' })} {dateState.getFullYear()}
							</p>
							<p className="time">
								{('0' + dateState.getHours()).slice(-2)} : {('0' + dateState.getMinutes()).slice(-2)} : 00
							</p>
						</>
					)}
					<h1 className="content-idiom">{ReactHtmlParser(contentIdiom?.Content)}</h1>
				</div>
			</div>
			<div className="col-md-4 col-12 m-0 right-login">{children}</div>
		</div>
	)
}

export default AuthLayout
