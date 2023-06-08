import React, { useEffect, useState } from 'react'
import { studentHistoriesApi } from '~/api/student-in-class'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import moment from 'moment'
import { IoClose } from 'react-icons/io5'
import { TbLoader } from 'react-icons/tb'
import { MdMoreHoriz } from 'react-icons/md'
import { RiFileList2Fill } from 'react-icons/ri'

type ITabClassListHistory = {
	StudentDetail: IUserResponse
}
export const TabClassListHistory: React.FC<ITabClassListHistory> = ({ StudentDetail }) => {
	const [dataTable, setDataTable] = useState([])
	const initParameters = { studentId: StudentDetail?.UserInformationId, pageIndex: 1, pageSize: 99999 }

	const getData = async (params) => {
		try {
			const res = await studentHistoriesApi.getAll(params)
			if (res.status == 200) {
				setDataTable(res.data.data)
			}
		} catch (error) {
		} finally {
		}
	}

	useEffect(() => {
		if (StudentDetail?.UserInformationId) {
			getData(initParameters)
		}
	}, [StudentDetail])

	function getIcon(params: string) {
		if (params.includes('xóa') || params.includes('Xóa')) {
			return <IoClose size={20} />
		}

		if (params.includes('Chờ') || params.includes('chờ')) {
			return <TbLoader size={20} />
		}

		if (params.includes('Đăng ký') || params.includes('đăng ký')) {
			return <RiFileList2Fill size={16} />
		}

		return <MdMoreHoriz size={20} />
	}

	function getIconColor(params: string) {
		if (params.includes('xóa') || params.includes('Xóa')) {
			return '#d94a47'
		}

		if (params.includes('Chờ') || params.includes('chờ')) {
			return '#FBC02D'
		}

		if (params.includes('Đăng ký') || params.includes('đăng ký')) {
			return 'rgb(16, 204, 82)'
		}

		return '#1b73e8'
	}

	return (
		<>
			<VerticalTimeline animate={true} layout="1-column-left" lineColor="#b9b9b9">
				{dataTable.map((item, index) => {
					return (
						<VerticalTimelineElement
							key={index + 'ficax'}
							className="vertical-timeline-element--work"
							contentStyle={{ background: '#1b73e8', color: '#fff', borderRadius: 6 }}
							contentArrowStyle={{ borderRight: `7px solid #1b73e8` }}
							date={moment(item?.CreatedOn).format('HH:mm DD/MM/YYYY')}
							iconStyle={{ background: getIconColor(item?.Content), color: '#fff' }}
							icon={getIcon(item?.Content)}
						>
							<h4 className="vertical-timeline-element-title" style={{ color: '#fff' }}>
								{item?.Content}
							</h4>
						</VerticalTimelineElement>
					)
				})}
			</VerticalTimeline>
		</>
	)
}
