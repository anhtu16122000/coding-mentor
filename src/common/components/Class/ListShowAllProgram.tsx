import { Input, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { programApi } from '~/api/program'
import { ShowNoti } from '~/common/utils'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'

const ListShowAllProgram = (props) => {
	const { programs, setProgramsSelected, setPrograms, programsSelected } = props
	const [searchValue, setSearchValue] = useState(null)
	const handleAddProgram = (data) => {
		const newPrograms = programs.filter((item) => item.Id !== data.Id)
		setProgramsSelected((prev) => [...prev, data])
		setPrograms(newPrograms)
	}

	const handleSearch = async (data) => {
		setSearchValue(data.target.value)
	}

	const handleSearchProgram = async (data) => {
		try {
			const res = await programApi.getAll({
				search: data
			})
			if (res.status === 200) {
				const results = res.data.data.filter((item) => !programsSelected.some((data) => data.Id === item.Id))
				setPrograms(results)
			}
			if (res.status === 204) {
				setPrograms([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (searchValue !== null) {
			const timeID = setTimeout(() => handleSearchProgram(searchValue), 500)
			return () => clearTimeout(timeID)
		}
	}, [searchValue])

	return (
		<>
			<Input className="primary-input mb-3" value={searchValue} onChange={handleSearch} placeholder="Tìm kiếm chương trình" />
			<List
				className="modal-review-class-program"
				itemLayout="horizontal"
				dataSource={programs}
				renderItem={(item: IClass) => (
					<List.Item
						extra={
							<IconButton icon="add" color={'blue'} type="button" tooltip={'Thêm chương trình'} onClick={() => handleAddProgram(item)} />
						}
					>
						<div className="wrapper-item-class">
							<AvatarComponent className="img-class" url={item?.Thumbnail} type="class" />
							<div className="wrapper-info-class">
								<p>
									<span className="title">Chương trình:</span>
									<span className="font-normal ml-1">{item?.Name}</span>
								</p>
								<p>
									<span className="title">Giá:</span>
									<span className="font-normal ml-1">{Intl.NumberFormat('ja-JP').format(item?.Price)}</span>
								</p>
							</div>
						</div>
					</List.Item>
				)}
			/>
		</>
	)
}

export default ListShowAllProgram
