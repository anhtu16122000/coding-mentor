import { Card, Popconfirm } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ModalCreateHomeWork from './ModalCreate'
import { homeWorkApi } from '~/api/home-work'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import PrimaryTable from '../../Primary/Table'
import moment from 'moment'
import PrimaryTag from '../../Primary/Tag'
import PrimaryTooltip from '../../PrimaryTooltip'
import { FaEdit, FaFilePrescription } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { TbWritingSign } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const listTodoApi = {
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	Code: null,
	Name: null
}

const HomeWork = () => {
	const router = useRouter()
	//

	const [data, setData] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [loading, setLoading] = useState<boolean>(true)
	const [totalPage, setTotalPage] = useState(null)

	useEffect(() => {
		if (!!router.query?.class) {
			getData()
		}
	}, [filters, router])

	async function getData() {
		const ClassId = router.query?.class || null

		setLoading(true)
		try {
			const res = await homeWorkApi.getAll({ ...filters, classId: ClassId })
			if (res.status == 200) {
				setData(res.data?.data)
				setTotalPage(res.data.totalRow)
			} else {
				setData([])
				setTotalPage(1)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	async function delThis(Id) {
		setLoading(true)
		try {
			const res = await homeWorkApi.delete(Id)
			if (res.status == 200) {
				getData()
			} else {
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
		}
	}

	const userInfo = useSelector((state: RootState) => state.user.information)

	const is = {
		parent: userInfo?.RoleId == '8',
		admin: userInfo?.RoleId == '1',
		teacher: userInfo?.RoleId == '2'
	}

	const columns = [
		{
			title: 'Tên bài',
			dataIndex: 'Name',
			render: (value, item, index) => <div className="font-[600] text-[#1b73e8] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Bắt đầu',
			width: 120,
			dataIndex: 'FromDate',
			render: (value, item, index) => <>{moment(new Date(value)).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Kết thúc',
			width: 120,
			dataIndex: 'ToDate',
			render: (value, item, index) => <>{moment(new Date(value)).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Đề',
			dataIndex: 'IeltsExamName',
			render: (value, item, index) => <div className="font-[600] in-1-line min-w-[80px] max-w-[220px]">{value}</div>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'MyStatusName',
			render: (value, item, index) => {
				if (item?.MyStatus == 1) {
					return <PrimaryTag children={value || ''} color="yellow" />
				}

				if (item?.MyStatus == 2) {
					return <PrimaryTag children={value || ''} color="green" />
				}

				return <PrimaryTag children={value || ''} color="red" />
			}
		},
		{
			title: 'Ghi chú',
			width: 150,
			dataIndex: 'Note',

			render: (value, item, index) => (
				<PrimaryTooltip place="left" id={item?.Id} content={value}>
					<div className="font-[600] in-1-line min-w-[80px] max-w-[200px]">{value}</div>
				</PrimaryTooltip>
			)
		},
		{
			fixed: 'right',
			render: (value, item, index) => {
				return (
					<div className="flex items-center">
						{(is.admin || is.teacher) && <ModalCreateHomeWork isEdit defaultData={item} onRefresh={getData} />}

						{(is.admin || is.teacher) && (
							<PrimaryTooltip place="left" id={`hw-del-${item?.Id}`} content="Làm bài">
								<Popconfirm placement="left" title={`Xoá bài tập: ${item?.Name}?`} onConfirm={() => delThis(item?.Id)}>
									<div className="mr-[8px] w-[28px] text-[#C94A4F] h-[30px] all-center hover:opacity-70 cursor-pointer ml-[8px]">
										<IoClose size={26} className="mb-[-2px]" />
									</div>
								</Popconfirm>
							</PrimaryTooltip>
						)}

						<PrimaryTooltip place="left" id={`hw-take-${item?.Id}`} content="Làm bài">
							<div className="w-[28px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer">
								<TbWritingSign size={22} />
							</div>
						</PrimaryTooltip>
					</div>
				)
			}
		}
	]

	return (
		<Card
			className="shadow-sm"
			title={
				<div className="w-full flex items-center justify-between">
					<div>Bài tập</div>
					{(is.admin || is.teacher) && <ModalCreateHomeWork onRefresh={getData} />}
				</div>
			}
		>
			<PrimaryTable
				loading={loading}
				total={totalPage && totalPage}
				data={data}
				columns={columns}
				onChangePage={(event: number) => setFilters({ ...filters, pageIndex: event })}
			/>
		</Card>
	)
}

export default HomeWork
