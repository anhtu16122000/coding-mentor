import { Card, Empty, Popover, Skeleton, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { CgCloseO } from 'react-icons/cg'
import { FiMoreHorizontal } from 'react-icons/fi'
import { documentLibraryDirectoryApi } from '~/api/document-library'
import { ShowNoti } from '~/common/utils'
import LibraryContextItem from './LibraryContextItem'
import LibraryFormUnit from './LibraryUnitForm'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const LibraryUnits = ({ curriculumId, activatedUnit, setActivatedUnit }) => {
	const listTodoApi = { pageIndex: 1, pageSize: 9999 }
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [showPop, setShowPop] = useState('')

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	async function _delete(id) {
		setLoading(true)
		try {
			const response = await documentLibraryDirectoryApi.delete(id)
			if (response.status === 200) {
				getData()
				ShowNoti('success', response.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const response = await documentLibraryDirectoryApi.getAll(filters)
			if (response.status === 200) {
				setData(response.data.data)

				if (response?.data?.data?.length > 0) {
					setActivatedUnit(response.data.data[0])
				}

				if (response?.data?.data?.length == 0) {
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
						<div className="flex-1 in-1-line mb-2 w400:mb-0">Danh sách chủ đề</div>
					</div>
				}
				extra={<>{(isAdmin() || isTeacher() || isManager()) && <LibraryFormUnit curriculumId={curriculumId} onRefresh={getData} />}</>}
			>
				<div className="relative scrollable max-h-[calc(100vh-400px)] mb-[10px] mr-[-22px] pr-[12px]">
					{data?.length !== 0 && loading && (
						<div className="all-center w-full mb-4">
							<Spin className="loading-blue" />
						</div>
					)}
					<>
						{data?.length !== 0 && (
							<>
								{data?.map((item, index) => {
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

											{(isAdmin() || isTeacher() || isManager()) && (
												<div className="unit-menu">
													<Popover
														open={showPop == item?.Id}
														onOpenChange={(event) => setShowPop(event ? item?.Id : '')}
														placement="right"
														content={() => {
															return (
																<>
																	<LibraryContextItem
																		onClick={() => _delete(item?.Id)}
																		Icon={<CgCloseO size={20} className="mr-2" />}
																		title="Xoá"
																	/>
																	<hr className="border-[#00000014] my-2" />
																	<LibraryFormUnit isEdit onOpen={() => setShowPop('')} defaultData={item} onRefresh={getData} />
																</>
															)
														}}
													>
														<FiMoreHorizontal size={18} />
													</Popover>
												</div>
											)}
										</div>
									)
								})}
							</>
						)}
					</>

					<>
						{data?.length == 0 && !loading && (
							<div className="w-full all-center">
								<Empty />
							</div>
						)}

						{data?.length == 0 && loading && (
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

export default LibraryUnits
