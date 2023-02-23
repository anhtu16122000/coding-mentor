import { Input, Modal, Popconfirm } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaMoneyBill } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import { PrimaryTooltip } from '~/common/components'
import PayForm from '~/common/components/Finance/Payment/pay'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import BillDetails from '../../../common/components/Finance/BillDetails'
import moment from 'moment'
import PrimaryButton from '~/common/components/Primary/Button'
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import AvatarComponent from '~/common/components/AvatarComponent'
import Avatar from '~/common/components/Avatar'
import Router from 'next/router'
import { IoMdOpen } from 'react-icons/io'
import { ImWarning } from 'react-icons/im'
import { ButtonEye } from '~/common/components/TableButton'
import { ChangeClass, ReserveForm } from '~/common/components/Student/StudentInClass'
import PrimaryEditor from '~/common/components/Editor'
import { AddToClass, RefundForm } from '~/common/components/Student/Registration'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import Filters from '~/common/components/Student/Filters'
import { FiCopy } from 'react-icons/fi'
import ButtonJoin from '~/common/components/TableButton/JOIN'
import ButtonClose from '~/common/components/TableButton/CLOSE'

const url = 'Schedule'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const ZoomRoomsPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [filters, setFilter] = React.useState(initFilters)

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>(url + '/zoom-room', filters)
			if (res.status == 200) {
				setData(res.data.data)
				setTotalPage(res.data.totalRow)
			} else {
				setData([])
				setTotalPage(1)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const expandedRowRender = (item) => {
		return <div>Ghi chú: {item?.Note}</div>
	}

	function gotoClass(params) {
		Router.push(`/class/list-class/detail/?class=${params.ClassId}`)
	}

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	async function closeZoomRoom(params) {
		setLoading(true)
		try {
			const response = await RestApi.put(url + '/close-zoom/' + params?.Id, {})
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				getData()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function joinRoom(params) {
		if (!!params?.JoinUrl) window.open(params?.JoinUrl, '_plank')
	}

	function handleColumn(value, item) {
		if (!!item?.IsOpenZoom) {
			return (
				<div className="flex item-center">
					<PrimaryTooltip content="Tham gia" place="left" id={`joi-st-${item?.Id}`}>
						<ButtonJoin onClick={() => joinRoom(item)} />
					</PrimaryTooltip>

					<PrimaryTooltip content="Đóng phòng" place="left" id={`clo-st-${item?.Id}`}>
						<Popconfirm onConfirm={() => closeZoomRoom(item)} title="Đóng phòng?">
							<ButtonClose className="ml-[16px]" />
						</Popconfirm>
					</PrimaryTooltip>
				</div>
			)
		}

		return ''
	}

	const columns = [
		{
			title: 'Zoom Id',
			dataIndex: 'ZoomId',
			className: 'font-[600]',
			width: 150,
			render: (value, item) => {
				return (
					<PrimaryTooltip content="Sao chép" id={`copy-id-${item?.Id}`} place="right">
						<span
							className="tag green is-button bold cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(value || '')
								ShowNostis.success('Đã sao chép')
							}}
						>
							{value}
							<FiCopy size={14} className="ml-2" />
						</span>
					</PrimaryTooltip>
				)
			}
		},
		{
			title: 'Password',
			dataIndex: 'ZoomPass',
			className: 'font-[600]',
			width: 150,
			render: (value, item) => {
				return (
					<PrimaryTooltip content="Sao chép" id={`copy-${item?.Id}`} place="right">
						<span
							className="tag blue is-button bold cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(value || '')
								ShowNostis.success('Đã sao chép')
							}}
						>
							{value}
							<FiCopy size={14} className="ml-2" />
						</span>
					</PrimaryTooltip>
				)
			}
		},
		{
			title: 'Link tham gia',
			dataIndex: 'BAOCHAU',
			className: 'font-[600]',
			width: 120,
			render: (value, item) => {
				if (!!item?.IsOpenZoom) {
					return (
						<PrimaryTooltip content="Sao chép" id={`copy-${item?.Id}`} place="right">
							<span
								className="tag blue is-button bold cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(item?.JoinUrl || '')
									ShowNostis.success('Đã sao chép')
								}}
							>
								Copy link tham gia
								<FiCopy size={14} className="ml-2" />
							</span>
						</PrimaryTooltip>
					)
				}
				return ''
			}
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			className: 'font-[600]',
			width: 200
		},
		{
			title: 'Lớp',
			dataIndex: 'ClassName',
			className: 'font-[600]',
			width: 160
		},
		{
			title: 'Giáo viên',
			dataIndex: 'TeacherName',
			className: 'font-[600]',
			width: 160
		},
		{
			title: 'Trạng thái',
			dataIndex: 'IsOpenZoom',
			width: 120,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == true && <span className="tag blue">Đang mở</span>}
					{value == false && <span className="tag gray">Đã đóng</span>}
				</p>
			)
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'StartTime',
			width: 160,
			render: (value, item) => <p className="font-[400]">{moment(value).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Kết thúc',
			dataIndex: 'EndTime',
			width: 160,
			render: (value, item) => <p className="font-[400]">{moment(value).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: '',
			dataIndex: 'Type',
			width: 60,
			fixed: 'right',
			render: handleColumn
		}
	]

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Danh sách phòng Zoom</title>
			</Head>

			<ExpandTable
				currentPage={filters.PageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data}
				columns={columns}
				TitleCard="Danh sách phòng Zoom"
			/>
		</>
	)
}

ZoomRoomsPage.Layout = MainLayout
export default ZoomRoomsPage
