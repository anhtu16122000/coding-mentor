import { Form, Modal, Spin, Tooltip } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { tagApi } from '~/api/tag'
import { ShowNoti } from '~/common/utils'
import DeleteTableRow from '../Elements/DeleteTableRow'
import InputTextField from '../FormControl/InputTextField'
import NestedTable from '../NestedTable'

const PAGE_SIZE = 3

function TagList(props) {
	const { tagCategoryId } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const [dataSource, setDataSource] = useState([])
	const [totalRow, setTotalRow] = useState(1)

	const [todoApi, setTodoApi] = useState({
		tagCategoryId,
		pageSize: PAGE_SIZE,
		pageIndex: 1
	})

	const columns = [
		{
			width: 300,
			title: 'Từ khoá',
			dataIndex: 'Name'
		},
		{
			title: 'Tạo ngày',
			dataIndex: 'ModifiedOn',
			render: (date) => <p>{moment(date).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Chức năng',
			render: (data) => {
				return <DeleteTableRow handleDelete={() => handleDelete(data?.Id)} />
			}
		}
	]

	const handleDelete = async (id) => {
		try {
			const res = await tagApi.deleteTag(id)
			if (res.status === 200) {
				setIsModalVisible(false)
				await getAllTagByTagCateId()
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const showModal = () => setIsModalVisible(true)

	const handleOk = () => setIsModalVisible(false)

	const handleCancel = () => setIsModalVisible(false)

	const handleAddTag = async (data) => {
		data.TagCategoryId = tagCategoryId

		try {
			const res = await tagApi.add(data)
			if (res.status === 200) {
				form.resetFields()
				setIsModalVisible(false)
				await getAllTagByTagCateId()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
		}
	}

	const getAllTagByTagCateId = async () => {
		try {
			const res = await tagApi.getAllTagByTagCeteId(todoApi)

			if (res.status === 200) {
				setDataSource(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			console.log('🚀 ~ file: TagList.tsx:94 ~ getAllTagByTagCateId ~ res.data', res.data)
			if (res.status === 204) {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (tagCategoryId) getAllTagByTagCateId()
	}, [todoApi])

	return (
		<div className="mt-2">
			<Tooltip title="Thêm từ khoá">
				<button className="btn btn-warning" onClick={() => showModal()}>
					Thêm từ khoá
				</button>
			</Tooltip>

			<Modal footer={null} title="Thêm ghi chú" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={400} centered>
				<Form layout="vertical" form={form} onFinish={handleAddTag}>
					<InputTextField placeholder="Nhập từ khoá " name="Name" label="Từ khoá" isRequired />

					<div className="mt-3 text-center">
						<button type="submit" className="btn btn-primary w-100">
							Lưu {loading && <Spin className="loading-base" />}
						</button>
					</div>
				</Form>
			</Modal>
			<div className="row">
				<div className="col-md-9">
					<NestedTable
						addClass="basic-header"
						dataSource={dataSource}
						columns={columns}
						haveBorder={true}
						pageSize={PAGE_SIZE}
						getPagination={(event: number) => {
							setTodoApi({ ...todoApi, pageIndex: event })
						}}
						totalPage={totalRow}
					/>
				</div>
			</div>
		</div>
	)
}

export default TagList
