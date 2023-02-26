import { Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Book } from 'react-feather'
import { curriculumApi } from '~/api/curriculum'
import CurriculumForm from '~/common/components/Curriculum/CurriculumForm'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import MainLayout from '~/common/components/MainLayout'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

const ProgramDetail = () => {
	const router = useRouter()
	const { slug, name } = router.query
	const listTodoApi = {
		programId: null,
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}
	const [listCurriculum, setListCurriculum] = useState<ICurriculum[]>([])
	const [totalRow, setTotalRow] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const getAllCurriculum = async () => {
		try {
			setIsLoading(true)
			const res = await curriculumApi.getAll(todoApi)
			if (res.status === 200) {
				setListCurriculum(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setListCurriculum([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!!todoApi.programId) {
			getAllCurriculum()
		}
	}, [todoApi])

	useEffect(() => {
		if (!!slug) {
			setTodoApi({ ...todoApi, programId: slug })
		}
	}, [slug])

	const handleDelete = async (id) => {
		try {
			const res = await curriculumApi.delete(id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
				getAllCurriculum()
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const columns = [
		{
			title: 'Giáo trình',
			dataIndex: 'Name',
			key: 'Name',
			width: '150px',
			render: (text, data) => <div className="font-bold text-tw-primary">{text}</div>
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			key: 'Time',
			width: '150px'
		},
		{
			title: 'Số buổi',
			dataIndex: 'Lesson',
			key: 'Lesson',
			width: '150px'
		},
		{
			title: 'Chức năng',
			dataIndex: '',
			key: '',
			width: '150px',
			render: (text, data) => (
				<>
					<CurriculumForm onRefresh={() => getAllCurriculum()} dataRow={data} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
					<IconButton
						color="blue"
						type="button"
						icon="book"
						tooltip="Xem tài liệu"
						onClick={() => {
							router.push({
								pathname: '/options/program/curriculum-detail',
								query: {
									group: name,
									name: data.Id
								}
							})
						}}
					/>
					<DeleteTableRow text={data.Name} handleDelete={() => handleDelete(data.Id)} />
				</>
			)
		}
	]
	return (
		<>
			<PrimaryTable
				total={totalRow && totalRow}
				columns={columns}
				data={listCurriculum}
				loading={isLoading}
				onChangePage={(event: number) => setTodoApi({ ...listTodoApi, pageIndex: event })}
				Extra={<CurriculumForm onRefresh={() => getAllCurriculum()} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />}
				TitleCard={
					<>
						Chương trình:<span className="ml-2 text-tw-primary">{name}</span>
					</>
				}
			/>
		</>
	)
}

export default ProgramDetail
