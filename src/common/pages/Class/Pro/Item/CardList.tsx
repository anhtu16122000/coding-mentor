import React from 'react'
import { parseToMoney } from '~/common/utils/common'
import AvatarComponent from '~/common/components/AvatarComponent'
import moment from 'moment'
import { MdRemoveRedEye } from 'react-icons/md'
import ModalDetail from './ModalDetail'
import ProClassStatus from '../Common/ProClassStatus'
import ProClassInfoItem from '../Common/ProClassInfoItem'
import ProClassType from '../Common/ProClassType'
import { viewClassDetails } from '../utils/functions'
import ProClassMenu from '../Common/ProClassMenu'

function getStrDate(date) {
	if (!date) return 'Không xác định'
	return moment(date).format('DD/MM/YYYY')
}

const CardList = (props) => {
	const { item, onRefresh, academics, onUpdate } = props

	function viewDetails() {
		viewClassDetails(item)
	}

	return (
		<div className="card-class-item pro-class-list-item">
			<div className="pro-cl-container">
				<AvatarComponent onClick={viewDetails} url={item.Thumbnail} type="class" className="class-list-itenm-thumbnail" />

				<div className="pro-cl-content-main">
					<div onClick={viewDetails}>
						<a>{item.Name}</a>

						<div className="col-span-2 block w1500:hidden">
							<ProClassInfoItem title="Bắt đầu" value={getStrDate(item.StartDay)} />
							<ProClassInfoItem title="Kết thúc" value={getStrDate(item.EndDay)} />
						</div>

						<div className="flex mt-[4px]">
							<ProClassType data={item} />
							<ProClassStatus data={item} onUpdate={onUpdate} />
						</div>
					</div>

					<div className="mt-[16px] flex items-center w600:hidden">
						<ModalDetail data={item} onRefresh={onRefresh} academics={academics} isMobile />
						<div
							onClick={viewDetails}
							className={`ml-[8px] flex items-center flex-shrink-0 bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff] px-[8px] h-[30px] rounded-[6px]`}
						>
							<MdRemoveRedEye size={18} className="mr-[4px] hidden w350:inline" />
							<div>Chi tiết</div>
						</div>
					</div>
				</div>
			</div>

			<ModalDetail data={item} onRefresh={onRefresh} academics={academics} isDesktop />

			<ProClassMenu data={item} onRefresh={onRefresh} academics={academics} />

			<div onClick={viewDetails} className="ml-[8px] col-span-2 hidden w1500:block">
				<ProClassInfoItem title="Bắt đầu" value={getStrDate(item.StartDay)} />
				<ProClassInfoItem title="Kết thúc" value={getStrDate(item.EndDay)} />
			</div>

			<div onClick={viewDetails} className="ml-[8px] col-span-2 hidden w700:block">
				{!!item?.Price && <ProClassInfoItem title="Giá" value={`${parseToMoney(item?.Price)}đ`} />}
				{!item?.Price && <ProClassInfoItem title="Giá" value="Miễn phí" />}

				<div className="class-info-item flex-1">
					Đã học: <div className="info-value">{`${item?.LessonCompleted} / ${item?.TotalLesson} buổi`}</div>
				</div>
			</div>
		</div>
	)
}

export default CardList
