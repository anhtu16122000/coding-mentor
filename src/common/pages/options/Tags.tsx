import { Tabs } from 'antd'
import moment from 'moment'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { tagCategoryApi } from '~/api/tagCategory'
import appConfigs from '~/appConfig'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import TagForm from '~/common/components/Tags/TagForm'
import TagList from '~/common/components/Tags/TagList'
import { ShowNostis, ShowNoti } from '~/common/utils'

const OptionsList = [
	{
		title: 'Khoá video',
		value: 1
	},
	{
		title: 'Câu hỏi',
		value: 2
	},
	{
		title: 'Bộ đề',
		value: 3
	}
]

const PAGE_SIZE = 20

function TagsPage() {
	const [dataTags, setdataTags] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [activeTab, setActiveTab] = useState(1)
	const [totalRow, setTotalRow] = useState(1)
	const [todoApi, setTodoApi] = useState({ type: activeTab, pageSize: PAGE_SIZE, pageIndex: 1 })

	const handleDelete = async (tagId) => {
		try {
			const res = await tagCategoryApi.delete(tagId)
			if (res.status === 200) {
				getAllTags()
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const columns = [
		{
			title: 'Tên',
			dataIndex: 'Name',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Dạng',
			dataIndex: 'TypeName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},

		{
			title: 'Chức năng',
			render: (data) => {
				return (
					<>
						<DeleteTableRow text={data.Name} handleDelete={() => handleDelete(data.Id)} />
					</>
				)
			}
		}
	]

	const getAllTags = async () => {
		try {
			setIsLoading(true)
			const response = await tagCategoryApi.getAll(todoApi)
			if (response.status == 200) {
				const { data, totalRow } = response.data
				setdataTags(data)
				setTotalRow(totalRow)
			} else {
				setdataTags([])
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getAllTags()
	}, [todoApi])

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Cấu hình từ khoá</title>
			</Head>

			<ExpandTable
				loading={isLoading}
				total={totalRow}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				Extra={<TagForm OptionsList={OptionsList} onAddTag={() => getAllTags()} activeTab={activeTab} />}
				dataSource={dataTags}
				columns={columns}
				pageSize={PAGE_SIZE}
				TitleCard={
					<div className="w-[300px] mb-[-20px]">
						<Tabs
							defaultActiveKey="1"
							type="card"
							items={OptionsList.map((item, i) => {
								return { label: item.title, key: item.value + '' }
							})}
							onChange={(tabIndx) => {
								setActiveTab(+tabIndx)
								setTodoApi((pre) => ({ ...pre, type: +tabIndx }))
							}}
						/>
					</div>
				}
				expandable={(data) => <TagList tagCategoryId={data.Id} />}
			/>
		</>
	)
}

export default TagsPage
