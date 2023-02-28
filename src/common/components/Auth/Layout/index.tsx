import React, { useEffect, useState } from 'react'
import { idiomApi } from '~/api/idiom'
import { ShowNoti } from '~/common/utils'
import ReactHtmlParser from 'react-html-parser'
import { MdPlace } from 'react-icons/md'
import { FaPhoneSquareAlt } from 'react-icons/fa'
import { AiTwotoneMail } from 'react-icons/ai'
import { BsFillFileEarmarkTextFill } from 'react-icons/bs'
import { Modal, Spin } from 'antd'
import PrimaryButton from '../../Primary/Button'
import { configTemplateApi } from '~/api/config-example'

type IAuthLayout = {
	children: React.ReactNode
}

function AuthLayout({ children }: IAuthLayout) {
	const [contentIdiom, setContentIdiom] = useState(null)
	const [visible, setVisible] = useState(false)
	const [dateState, setDateState] = useState<any>(new Date())
	const [loading, setLoading] = useState(false)
	const [term, setTerm] = useState(null)
	const [isShowMore, setIsShowMore] = useState(false)

	const onClose = () => {
		setVisible(false)
	}
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

	const getTerms = async () => {
		try {
			setLoading(true)
			const res = await configTemplateApi.getTemplateByType(2)
			if (res.status === 200) {
				setTerm(res.data.data)
			}
			if (res.status === 204) {
				setTerm({})
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getIdiom()
		getTerms()
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
		<>
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
				<div className="form-term">
					<div className="content">
						<div className="item">
							<div className="icon">
								<MdPlace />
							</div>
							<p>Công viên lê thị riêng</p>
						</div>
						<div className="item">
							<div className="icon">
								<FaPhoneSquareAlt />
							</div>
							<p>1900 000 000</p>
						</div>
						<div className="item">
							<div className="icon">
								<AiTwotoneMail />
							</div>
							<p>INFO@CENTER.COM</p>
						</div>
						<div className="item cursor-pointer" onClick={() => setVisible(true)}>
							<div className="icon">
								<BsFillFileEarmarkTextFill />
							</div>
							<p>ĐIỀU KHOẢN</p>
						</div>
					</div>
				</div>
			</div>
			<Modal
				open={visible}
				onCancel={onClose}
				width={800}
				footer={
					<div className="flex justify-end ">
						<PrimaryButton onClick={onClose} className="w-[200px]" background="blue" type="button" children="Xác nhận" />
					</div>
				}
			>
				<Spin spinning={loading}>
					<div className="term-modal-template">
						<h2>{term?.TypeName}</h2>
						<div className="content">{ReactHtmlParser(term?.Content)}</div>
					</div>
				</Spin>
			</Modal>
		</>
	)
}

export default AuthLayout
