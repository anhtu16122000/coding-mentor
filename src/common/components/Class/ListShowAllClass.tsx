import { Input, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { billApi } from '~/api/bill'
import { ShowNoti } from '~/common/utils'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'

const ListShowAllClass = (props) => {
	const { classes, setClassesSelected, setClasses, form, classesSelected } = props
	const [searchValue, setSearchValue] = useState(null)
	const handleAddClass = (data) => {
		const newClasses = classes.filter((item) => item.Id !== data.Id)
		setClassesSelected((prev) => [...prev, data])
		setClasses(newClasses)
	}
	const handleSearch = async (data) => {
		setSearchValue(data.target.value)
	}

	const handleSearchClass = async (data) => {
		try {
			const res = await billApi.getClassAvailable({
				studentId: form.getFieldValue('StudentId'),
				branchId: form.getFieldValue('BranchId'),
				search: data
			})
			if (res.status === 200) {
				const results = res.data.data.filter((item) => !classesSelected.some((data) => data.Id === item.Id))
				setClasses(results)
			}
			if (res.status === 204) {
				setClasses([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (searchValue !== null) {
			const timeID = setTimeout(() => handleSearchClass(searchValue), 500)
			return () => clearTimeout(timeID)
		}
	}, [searchValue])
	return (
		<>
			<Input className="primary-input mb-3" value={searchValue} onChange={handleSearch} placeholder="Tìm kiếm lớp học" />
			<List
				className="modal-review-class-program"
				itemLayout="horizontal"
				dataSource={classes}
				renderItem={(item: IClass) => (
					<List.Item
						extra={
							<IconButton
								disabled={!item.Fit}
								icon="add"
								color={!item.Fit ? 'disabled' : 'blue'}
								type="button"
								tooltip={!item.Fit ? item.Note : 'Thêm lớp'}
								onClick={() => handleAddClass(item)}
							/>
						}
					>
						<div className="wrapper-item-class">
							<AvatarComponent className="img-class" url={item?.Thumbnail} type="class" />
							<div className="wrapper-info-class">
								<p>
									<span className="title">Lớp:</span>
									<span className="font-normal ml-1">{item?.Name}</span>
								</p>
								<p>
									<span className="title">Giá:</span>
									<span className="font-normal ml-1">{Intl.NumberFormat('ja-JP').format(item?.Price)}</span>
								</p>
								<p>
									<span className="title">Số lượng:</span>
									<span className="font-normal ml-1">
										{item.StudentQuantity}/{item.MaxQuantity} học viên
									</span>
								</p>
							</div>
						</div>
					</List.Item>
				)}
			/>
		</>
	)
}

export default ListShowAllClass
