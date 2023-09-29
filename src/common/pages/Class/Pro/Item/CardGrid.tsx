import React from 'react'
import { is, parseToMoney } from '~/common/utils/common'
import AvatarComponent from '~/common/components/AvatarComponent'
import moment from 'moment'
import { FaUserGraduate } from 'react-icons/fa'
import ProClassStatus from '../Common/ProClassStatus'
import ProClassInfoItem from '../Common/ProClassInfoItem'
import ProClassType from '../Common/ProClassType'
import { viewClassDetails } from '../utils/functions'
import ModalDetail from './ModalDetail'
import ProClassMenu from '../Common/ProClassMenu'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { PrimaryTooltip } from '~/common/components'
import { Tooltip } from 'antd'

function getStrDate(date) {
	if (!date) return 'Không xác định'
	return moment(date).format('DD/MM/YYYY')
}

const CardGrid = (props) => {
	const { item, onRefresh, academics, onUpdate } = props

	const isNotFull = parseInt(item?.TotalStudent || 0) < parseInt(item?.MaxQuantity || 0)

	const userInfo = useSelector((state: RootState) => state.user.information)

	function viewDetails() {
		viewClassDetails(item)
	}

	return (
		<div className="card-class-item bg-[#fff] hover:!border-[#b7b7b7] cursor-pointer">
			<ModalDetail data={item} onRefresh={onRefresh} academics={academics} isDesktop isMobile />

			{(is(userInfo).admin || is(userInfo).manager) && <ProClassMenu data={item} onRefresh={onRefresh} academics={academics} />}

			<div onClick={viewDetails}>
				<AvatarComponent url={item.Thumbnail} type="class" className="class-thubmnail" />
			</div>

			<ProClassStatus data={item} onUpdate={onUpdate} />

			<div onClick={viewDetails} className="p-[16px] flex-1 flex flex-col">
				<a>{item.Name}</a>

				<div className="class-time">{`${getStrDate(item.StartDay)} - ${getStrDate(item.EndDay)}`}</div>

				{(is(userInfo).admin || is(userInfo).manager || is(userInfo).teacher) && (
					<ProClassInfoItem title="Thanh toán" value={item?.PaymentTypeName || 'Chưa nhập'} />
				)}

				<div className="flex items-center">
					<div className="class-info-item flex-1 in-1-line">
						Giảng viên:{' '}
						<div className="info-value !inline">
							<Tooltip
								id={`i-cl-${item?.Id}`}
								title={item?.Teachers.map((teacher, index) => {
									return (
										<div key={`te-n-${index}`} className="block">
											{teacher?.TeacherName}
										</div>
									)
								})}
								placement="top"
							>
								<>
									{item?.Teachers.map((teacher, index) => {
										return (
											<div key={`te-n-${index}`} className="inline">
												{index > 0 && ', '}
												{teacher?.TeacherName}
											</div>
										)
									})}
								</>
							</Tooltip>
						</div>
					</div>
				</div>

				<div className="flex items-center">
					<div className="class-info-item flex-1">
						Đã học: <div className="info-value">{`${item?.LessonCompleted} / ${item?.TotalLesson} buổi`}</div>
					</div>

					<ProClassType data={item} />
				</div>

				<div className="flex-1"></div>

				<div className="w-full h-[1px] mt-[16px]" style={{ background: '#cfcfcf' }}></div>

				<div className="class-item-footer pt-[8px]">
					<div className="flex items-center font-[500]" style={{ color: isNotFull ? '#1d9527' : '#e31616' }}>
						<FaUserGraduate size={13} className="mr-[4px]" />
						{`${item.TotalStudent || 0} / ${item.MaxQuantity || 0}`}
					</div>

					{!!item?.Price && (
						<div className="class-price">
							{parseToMoney(item?.Price)} VNĐ {item?.IsMonthly && '/ Tháng'}
						</div>
					)}
					{!item?.Price && <div className="free">Miễn phí</div>}
				</div>
			</div>
		</div>
	)
}

export default CardGrid
