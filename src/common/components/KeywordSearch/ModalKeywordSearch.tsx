import { Form, Modal, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import InputTextField from '~/common/components/FormControl/InputTextField'

const ModalKeywordSearch = (props) => {
	const { onSubmit, form, dataRow } = props
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const showModal = () => {
		setIsModalOpen(true)
	}
	useEffect(() => {
		if (isModalOpen) {
			if (dataRow) {
				form.setFieldsValue({ Keyword: dataRow.Keyword })
			} else {
				form.resetFields()
			}
		}
	}, [isModalOpen])
	return (
		<>
			{dataRow ? (
				<button onClick={showModal} className="btn btn-icon edit">
					<Tooltip title="Cập nhật">
						<Edit size={18} />
					</Tooltip>
				</button>
			) : (
				<button onClick={showModal} className="btn btn-warning">
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm từ khóa
				</button>
			)}

			<Modal
				title="Thêm từ khóa tìm kiếm"
				visible={isModalOpen}
				onCancel={handleCancel}
				className="antd-custom-wrap"
				footer={
					<>
						<button className="btn btn-outline mr-2" onClick={handleCancel}>
							Hủy
						</button>
						<button className="btn btn-primary" onClick={form.submit}>
							<MdSave size={18} className="mr-2" />
							Lưu
						</button>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<InputTextField
						isRequired={true}
						rules={[{ required: true, message: 'Bạn không được để trống' }]}
						label="Từ khóa"
						name="Keyword"
						placeholder="Nhập từ khóa tìm kiếm"
					/>
				</Form>
			</Modal>
		</>
	)
}

export default ModalKeywordSearch
