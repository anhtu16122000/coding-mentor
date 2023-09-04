import { List, Modal, Pagination } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'
import AvatarComponent from '../AvatarComponent'
import DeleteTableRow from '../Elements/DeleteTableRow'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

import dynamic from 'next/dynamic'
import { content } from 'tailwind.config'
import ExamItem from '../Exercise/item'
import { userInformationApi } from '~/api/user/user'
const Bar = dynamic(() => import('@ant-design/plots').then(({ Bar }) => Bar), { ssr: false })
const ClassListGantt = (props) => {
	const { isLoading, dataSource, setTodoApi, listTodoApi, totalRow, todoApi } = props
	const state = useSelector((state: RootState) => state)
	const router = useRouter()
	const { information: userInformation } = state.user
	const [isModalOpen, setIsModalOpen] = useState({ id: null, open: null })
	const [isLoadingDelete, setIsLoadingDelete] = useState(false)
	const [academic, setAcademic] = useState([])

	const getPagination = (page) => {
		setTodoApi({ ...todoApi, pageIndex: page })
	}
	const getAllAcademic = async () => {
		try {
			const res = await userInformationApi.getAll({ roleIds: '7' })
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'FullName', 'UserInformationId')
				setAcademic(convertData)
			}
			if (res.status === 204) {
				setAcademic([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (userInformation?.RoleId == 1) {
			getAllAcademic()
		}
	}, [])

	const formattedData: any = dataSource.map((item) => ({
		...item,
		Values: [new Date(item.Values[0]).getTime(), new Date(item.Values[1]).getTime()]
	}))

	// Find the minimum and maximum timestamps in your data
	const minTimestamp = Math.min(...formattedData.map((item) => item.Values[0] - 86400000))
	const maxTimestamp = Math.max(...formattedData.map((item) => item.Values[1] + 86400000))

	const config = {
		tooltip: {
			formatter: (datum) => {
				const { Name, StatusName, Values } = datum
				const startDate = moment(Values[0]).format('DD/MM/yyyy')
				const endDate = moment(Values[1]).format('DD/MM/yyyy')
				return { name: StatusName, value: `${startDate} - ${endDate}` }
			}
		}
	}

	return (
		<>
			<Bar
				{...config}
				// @ts-ignore
				data={formattedData}
				xField="Values"
				yField="Name"
				isRange={true}
				label={{
					position: 'middle',
					layout: [
						{
							type: 'adjust-color'
						}
					],
					content: (item) => {
						const startDate = moment(item.Values[0]).format('DD/MM/yyyy')
						const endDate = moment(item.Values[1]).format('DD/MM/yyyy')
						return `${startDate} - ${endDate}`
					}
				}}
				seriesField="StatusName"
				xAxis={{
					type: 'time',
					tickCount: 5,
					min: minTimestamp,
					max: maxTimestamp,
					label: {
						formatter: (v) => {
							return moment(v).format('DD/MM/yyyy')
						}
					}
				}}
			/>

			<Pagination
				className="mt-4"
				onChange={getPagination}
				total={totalRow}
				size={'small'}
				pageSize={5}
				showTotal={() => totalRow && <div className="font-weight-black">Tổng cộng: {totalRow}</div>}
			/>
		</>
	)
}

export default ClassListGantt
