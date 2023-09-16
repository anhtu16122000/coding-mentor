import { Empty, Popconfirm, Popover } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { BiTrash } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { is } from '~/common/utils/common'
import { RootState } from '~/store'
import FormPackageSection from './FormModal'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { packageSkillApi } from '~/api/packed/packages-skill'
import { ShowNostis } from '~/common/utils'

const PackageDetailItem = ({ thisId, item, onDelete, deleting, currentPackage, onRefresh }) => {
	const userInfo = useSelector((state: RootState) => state.user.information)

	const popRef = useRef(null)

	const [loading, setLoading] = useState<boolean>(true)
	const [skills, setSkills] = useState([])

	useEffect(() => {
		getPackageSkill()
	}, [])

	async function getPackageSkill() {
		try {
			const res = await packageSkillApi.getAll({ pageIndex: 1, pageSize: 9999, packageSectionId: item?.Id })
			if (res.status == 200) {
				setSkills(res.data?.data)
			} else {
				setSkills([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div key={thisId} id={thisId} className="pe-d-default">
			{is(userInfo).admin && (
				<Popover
					ref={popRef}
					overlayClassName="show-arrow"
					content={
						<div>
							<Popconfirm disabled={deleting} onConfirm={onDelete} title={`Xoá: ${item?.Name}`} placement="left">
								<div className="pe-menu-item">
									<BiTrash size={18} color="#E53935" className="ml-[-3px]" />
									<div className="ml-[8px]">Xoá</div>
								</div>
							</Popconfirm>

							<FormPackageSection
								packageId={currentPackage}
								onOpen={() => popRef?.current?.close()}
								onRefresh={onRefresh}
								defaultData={item}
								isEdit
							/>
						</div>
					}
					placement="leftTop"
					trigger="click"
				>
					<div className="pe-i-d-menu">
						<BsThreeDotsVertical size={16} color="#000" />
					</div>
				</Popover>
			)}

			<div className="p-[8px]">
				<div>{item?.Name}</div>
			</div>

			<div className="pb-[16px]">{!loading && skills.length == 0 && <Empty />}</div>
		</div>
	)
}

export default PackageDetailItem
