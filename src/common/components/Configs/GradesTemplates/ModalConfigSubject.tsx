import { Form, Input, Modal } from 'antd'
import InputTextField from '../../FormControl/InputTextField'
import { useEffect, useState } from 'react'
import { gradesTemplatesApi } from '~/api/configs/score-broad-templates'
import PrimaryButton from '../../Primary/Button'
import { ShowNoti } from '~/common/utils'
import DraggableTable from '../../DraggableTable'
import ModalAddNewCol from './ModalAddNewCol'
import { gradesColTemplatesApi } from '~/api/configs/score-column-templates'

function ModalConfigSubject(props) {
	const { isShow, data, onCancel, refreshDataTable } = props
	const [form] = Form.useForm()
	const [isShowAddCol, setShowAddCol] = useState(false)
	const [dataCols, setDataCols] = useState([])

	const getAllColumn = async () => {
		try {
			const res = await gradesColTemplatesApi.get({
				scoreBoardTemplateId: data?.Id
			})
			if (res?.status === 200) {
				setDataCols(res?.data?.data || [])
			}
			if (res?.status === 204) {
				setDataCols([])
			}
		} catch (error) {
			ShowNoti('error', error?.message || '')
		}
	}

	useEffect(() => {
		if (isShow === true) {
			getAllColumn()
		}
	}, [data, isShow])

	return (
		<Modal
			footer={null}
			title="Cấu hình bảng điểm chung"
			open={isShow}
			onOk={() => {
				form.submit()
			}}
			onCancel={onCancel}
			width={1300}
		>
			<div className="flex justify-end mb-4">
				<PrimaryButton className="" onClick={() => setShowAddCol(true)} background="green" icon="add" type="button">
					Thêm cột
				</PrimaryButton>
			</div>
			<ModalAddNewCol
				isShow={isShowAddCol}
				onCancel={() => {
					setShowAddCol(false)
				}}
				dataTemplates={data}
				handleRefresh={getAllColumn}
			/>
			<DraggableTable data={dataCols} setData={setDataCols} handleRefresh={getAllColumn} />
		</Modal>
	)
}

export default ModalConfigSubject
