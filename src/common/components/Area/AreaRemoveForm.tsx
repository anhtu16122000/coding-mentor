import { Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Trash } from 'react-feather'
import { areaApi } from '~/api/area'
import { ShowNoti } from '~/common/utils'

const AreaRemoveForm = (props) => {
	const { dataRow, fetchAreaList } = props
	const [isModalOpen, setIsModalOpen] = useState(false)

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleOk = async () => {
		try {
			const res = await areaApi.delete({ ...dataRow, Enable: false })
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			fetchAreaList()
			setIsModalOpen(false)
		}
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}
	return (
		<>
			<button className="btn btn-icon delete" onClick={showModal}>
				<Tooltip title="Xóa">
					{/* <i className="far fa-trash" style={{ color: '#de2020', fontSize: 16, marginBottom: -1 }}></i> */}
					<Trash />
				</Tooltip>
			</button>
			<Modal
				title={<span>Xóa Tỉnh/Thành phố ?</span>}
				visible={isModalOpen}
				// onOk={handleOk}
				onCancel={handleCancel}
				// okText={'Xóa'}
				// cancelText="Hủy"
				footer={
					<>
						<button onClick={handleCancel} className="btn btn-outline mr-2">
							Hủy
						</button>
						<button onClick={handleOk} className="btn btn-danger">
							Xóa
						</button>
					</>
				}
			>
				<div>
					<span className="text-base mb-4">Bạn muốn xóa Tỉnh/Thành phố: </span>
					<span className="text-base mb-4" style={{ color: '#f25767' }}>
						{dataRow.AreaName}
					</span>
				</div>
			</Modal>
		</>
	)
}

export default AreaRemoveForm
