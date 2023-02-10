import { Card, Empty, Popover, Skeleton, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import { ShowNoti } from '~/common/utils'
import FormUnit from '~/common/components/CurriculumDetail/UnitForm'
import { FiMoreHorizontal } from 'react-icons/fi'
import { CgCloseO } from 'react-icons/cg'
import ContextItem from './ContextItem'

const Units = ({ curriculumId, activatedUnit, setActivatedUnit }) => {
	const listTodoApi = { pageIndex: 1, pageSize: 9999, curriculumId: '' }
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [showPop, setShowPop] = useState('')
	async function _delete(id) {
		setLoading(true)
		try {
			const response = await curriculumDetailApi.delete(id)
			if (response.status === 200) {
				getData()
				ShowNoti('success', response.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		if (curriculumId) {
			setFilters({ ...filters, curriculumId: curriculumId })
		}
	}, [curriculumId])

	useEffect(() => {
		if (filters !== listTodoApi) {
			getData()
		}
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const response = await curriculumDetailApi.getAll(filters)
			if (response.status === 200) {
				setData(response.data.data)
				if (response.data.data.length > 0) {
					setActivatedUnit(response.data.data[0])
				}

				if (response.data.data.length == 0) {
					setActivatedUnit({ Id: '' })
				}
			} else {
				setData([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Card
				className="shadow-sm"
				title={
					<div className="curriculum-detail-unit-card-title">
						<div className="flex-1 in-1-line mb-2 w400:mb-0">Danh sách chương</div>
					</div>
				}
				extra={<FormUnit curriculumId={curriculumId} onRefresh={getData} />}
			>
				<div className="relative scrollable max-h-[calc(100vh-400px)] mb-[10px] mr-[-22px] pr-[12px]">
					{data.length !== 0 && loading && (
						<div className="all-center w-full mb-4">
							<Spin className="loading-blue" />
						</div>
					)}
					<>
						{data.length !== 0 && (
							<>
								{data.map((item, index) => {
									return (
										<div
											key={`xnxx-curriculum-detail-${index}`}
											onClick={() => setActivatedUnit(item)}
											contextMenu="cac"
											className={`curriculum-detail-docs-unit-item ${activatedUnit?.Id == item?.Id && 'unit-activated'} ${
												index > 0 && 'mt-[10px]'
											}`}
										>
											<div className="docs-unit-name">{item?.Name}</div>
											<div className="unit-menu">
												<Popover
													open={showPop == item?.Id}
													onOpenChange={(event) => setShowPop(event ? item?.Id : '')}
													placement="right"
													content={() => {
														return (
															<>
																<ContextItem onClick={() => _delete(item?.Id)} Icon={<CgCloseO size={20} className="mr-2" />} title="Xoá" />
																<hr className="border-[#00000014] my-2" />
																<FormUnit isEdit onOpen={() => setShowPop('')} defaultData={item} onRefresh={getData} />
															</>
														)
													}}
												>
													<FiMoreHorizontal size={18} />
												</Popover>
											</div>
										</div>
									)
								})}
							</>
						)}
					</>
					<>
						{data.length == 0 && !loading && (
							<div className="w-full all-center">
								<Empty />
							</div>
						)}

						{data.length == 0 && loading && (
							<>
								<Skeleton />
								<Skeleton className="mt-3" />
							</>
						)}
					</>
				</div>
			</Card>
		</>
	)
}

export default Units
