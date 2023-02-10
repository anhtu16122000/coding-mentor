import React, { Fragment, useEffect, useState } from 'react'
import { Card, Button, Spin } from 'antd'
import EditorField from '~/common/components/FormControl/EditorField'
// import TitlePage from '~/src/components/TitlePage'
import { rulesApi } from '~/api/rules'
import { MdSave } from 'react-icons/md'
import { ShowNoti } from '~/common/utils'

const TermOfService = () => {
	const [data, setData] = useState(null)
	const [dataContent, setDataContent] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const fetchContract = async () => {
		try {
			let res = await rulesApi.getAll({})

			if (res.status === 200) {
				if (typeof res.data.data === 'object') {
					setData(res.data.data)
				}
			} else if (res.status === 204) {
				setData([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}
	const changeContractContent = (value) => {
		setDataContent(value)
	}
	const updateData = async () => {
		if (!dataContent) {
			ShowNoti('error', 'Bạn chưa sửa đổi')
			return
		}
		setIsLoading(true)
		try {
			let res = await rulesApi.update({
				...data,
				RulesContent: dataContent
			})
			ShowNoti('success', res.data.message)
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setDataContent('')
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchContract()
	}, [])

	return (
		<div className="row">
			<div className="col-12">
				{/* <TitlePage title="Điều khoản" /> */}
				<Card>
					{/* <EditorField handleChangeDataEditor={changeContractContent} content={data?.RulesContent} /> */}
					<EditorField onChangeEditor={changeContractContent} name="RulesContent" />
					<div className="row pt-3">
						<div className="col-12 d-flex justify-content-center">
							<div style={{ paddingRight: 5 }}>
								<button className="btn btn-primary" onClick={updateData}>
									<MdSave size={18} className="mr-2" />
									Xác nhận
									{isLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}
export default TermOfService
