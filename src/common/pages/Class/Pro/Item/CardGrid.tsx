import { Card, Empty, Form, Pagination, Popover, Select, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { classApi } from '~/api/class'
import { userInformationApi } from '~/api/user'
import ClassList from '~/common/components/Class/ClassList'
import { ClassListContent } from '~/common/components/Class/ClassListContent'
import FilterBase from '~/common/components/Elements/FilterBase'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis, ShowNoti, log } from '~/common/utils'
import { parseSelectArray, parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import AvatarComponent from '~/common/components/AvatarComponent'
import Link from 'next/link'
import { PrimaryTooltip } from '~/common/components'
import moment from 'moment'
import { MdOutlineAttachMoney, MdOutlineMoreVert, MdWifi } from 'react-icons/md'
import { FaEdit, FaUserGraduate, FaUserTie } from 'react-icons/fa'
import { reach } from 'yup'
import { RiHome3Fill } from 'react-icons/ri'
import { TiHome } from 'react-icons/ti'
import { TbTrashX } from 'react-icons/tb'
import { BiTrash } from 'react-icons/bi'
import UpdateClassForm from '~/common/components/Class/ProClass/UpdateClassForm'
import DeleteClass from '~/common/components/Class/ProClass/DeleteClass'
import Router from 'next/router'
import { IoIosArrowDown } from 'react-icons/io'

function InfoItem({ title, value }) {
	return (
		<div className="class-info-item">
			{title}: <div className="info-value">{value || ''}</div>
		</div>
	)
}

function getStrDate(date) {
	if (!date) return 'Không xác định'
	return moment(date).format('DD/MM/YYYY')
}

const CardGrid = (props) => {
	const { item, onRefresh, academics, onUpdate } = props

	const isNotFull = parseInt(item?.TotalStudent || 0) < parseInt(item?.MaxQuantity || 0)

	function getColor() {
		if (item?.Status == 3) {
			return 'red'
		}

		if (item?.Status == 2) {
			return 'blue'
		}

		if (item?.Status == 1) {
			return 'green'
		}

		return ''
	}

	function viewDetails() {
		Router.push({
			pathname: '/class/list-class/detail',
			query: { class: item?.Id, curriculum: item?.CurriculumId, branch: item?.BranchId }
		})
	}

	const popRef = useRef(null)

	const [updating, setUpdating] = useState<boolean>(false)

	const handleUpdate = async (data) => {
		popRef.current?.close()
		setUpdating(true)
		try {
			const res = await classApi.updateClass({ ...data, Id: item?.Id })
			if (res.status == 200) {
				!!onUpdate && onUpdate({ ...data })
			}
		} catch (err) {
			ShowNostis.error(err.message)
		} finally {
			setUpdating(false)
		}
	}

	const defaultClass = 'h-[32px] px-[8px] flex items-center cursor-pointer rounded-[4px] font-[500] hover:bg-[#f0f0f0] none-selection '

	const content = (
		<div>
			<div onClick={() => handleUpdate({ Status: 1, StatusName: 'Sắp diễn ra' })} className={defaultClass + 'text-[#24913c]'}>
				<div>Sắp diễn ra</div>
			</div>
			<div onClick={() => handleUpdate({ Status: 2, StatusName: 'Đang diễn ra' })} className={defaultClass + 'text-[#1b73e8]'}>
				<div>Đang diễn ra</div>
			</div>
			<div onClick={() => handleUpdate({ Status: 3, StatusName: 'Đã kết thúc' })} className={defaultClass + 'text-[#e31616]'}>
				<div>Đã kết thúc</div>
			</div>
		</div>
	)

	return (
		<div className="card-class-item bg-[#fff] hover:!border-[#b7b7b7] cursor-pointer">
			<div className="pro-class-menu">
				<div className="icon-menu-close">
					<MdOutlineMoreVert size={20} />
				</div>

				<div className="inner-menu-open none-selection">
					<UpdateClassForm onRefresh={onRefresh} dataRow={item} academic={academics} isPro />
					<DeleteClass dataRow={item} onRefresh={onRefresh} />
				</div>
			</div>

			<div onClick={viewDetails}>
				<AvatarComponent url={item.Thumbnail} type="class" className="class-thubmnail" />
			</div>

			<Popover ref={popRef} placement="bottom" title="Cập nhật trạng thái" content={content} trigger="click" overlayClassName="show-arrow">
				<div className={`class-status none-selection ${getColor()} hover:!bg-[#efefef]`}>
					{item?.StatusName} {!updating && <IoIosArrowDown size={18} className="inline ml-[0px] mt-[-2px]" />}
					{updating && <Spin size="small" className="mt-[0px] mb-[-4px] ml-[4px]" />}
				</div>
			</Popover>

			<div onClick={viewDetails} className="p-[16px] flex-1 flex flex-col">
				<div className="class-time">{`${getStrDate(item.StartDay)} - ${getStrDate(item.EndDay)}`}</div>

				<a>{item.Name}</a>

				<InfoItem title="Giảng viên" value={item.TeacherName} />
				<InfoItem title="Học vụ" value={item.AcademicName} />

				<InfoItem title="Chương trình" value={item.ProgramName} />
				<InfoItem title="Giáo trình" value={item.CurriculumName} />

				<div className="flex items-center">
					<div className="class-info-item flex-1">
						Đã học: <div className="info-value">{`${item?.LessonCompleted} / ${item?.TotalLesson} buổi`}</div>
					</div>

					{item?.Type == 2 && (
						<div className="class-type bg-primary">
							<MdWifi size={16} className="mb-[-1px]" />

							<p>Online</p>
						</div>
					)}

					{item?.Type == 1 && (
						<div className="class-type bg-[#f51d92]">
							<TiHome size={16} />

							<p>Offline</p>
						</div>
					)}
				</div>

				<div className="flex-1"></div>

				<div className="w-full h-[1px] mt-[16px]" style={{ background: '#cfcfcf' }}></div>

				<div className="class-item-footer pt-[8px]">
					<div className="flex items-center font-[500]" style={{ color: isNotFull ? '#000' : '#e31616' }}>
						<FaUserGraduate size={13} className="mr-[4px]" />
						{`${item.TotalStudent || 0} / ${item.MaxQuantity || 0}`}
					</div>

					{!!item?.Price && <div className="class-price">{parseToMoney(item?.Price)} VNĐ</div>}
					{!item?.Price && <div className="free">Miễn phí</div>}
				</div>
			</div>
		</div>
	)
}

export default CardGrid
