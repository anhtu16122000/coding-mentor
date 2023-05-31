import { Popover } from 'antd'
import React, { useRef } from 'react'
import { MdOutlineMoreVert } from 'react-icons/md'
import DeleteClass from '~/common/components/Class/ProClass/DeleteClass'
import UpdateClassForm from '~/common/components/Class/ProClass/UpdateClassForm'

const ProClassMenu = (props) => {
	const { data, onRefresh, academics } = props

	const thisRef = useRef(null)

	function closeThisPop() {
		if (!!thisRef?.current) {
			thisRef.current.close()
		}
	}

	return (
		<Popover
			ref={thisRef}
			trigger="click"
			overlayClassName="show-arrow"
			placement="left"
			content={
				<>
					<UpdateClassForm onShow={closeThisPop} onRefresh={onRefresh} dataRow={data} academic={academics} isPro />
					<DeleteClass onShow={closeThisPop} dataRow={data} onRefresh={onRefresh} />
				</>
			}
		>
			<div className="pro-class-menu" style={{ zIndex: 90 }}>
				<div className="icon-menu-close">
					<MdOutlineMoreVert size={20} />
				</div>
			</div>
		</Popover>
	)
}

export default ProClassMenu
