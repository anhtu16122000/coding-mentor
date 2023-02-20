import { Input, List } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { programApi } from '~/api/program'
import { ShowNoti } from '~/common/utils'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'
import { RxCheck } from 'react-icons/rx'

type TListShowAllProgram = {
	programs?: Array<any>
	programsSelected?: Array<any>
	setProgramsSelected?: Function
	setPrograms?: Function
	type: 'default' | '1-1'
}

const ListShowAllProgram: FC<TListShowAllProgram> = (props) => {
	const { programs, setProgramsSelected, setPrograms, programsSelected, type } = props
	const [searchValue, setSearchValue] = useState(null)

	const handleAddProgram = (data) => {
		if (type == 'default') {
			const temp = programs.filter((item) => item.Id !== data.Id)
			setProgramsSelected((prev) => [...prev, data])
			setPrograms(temp)
		}

		if (type == '1-1') {
			setProgramsSelected((prev) => [data])
		}
	}

	const handleSearch = async (data) => {
		setSearchValue(data.target.value)
	}

	const handleSearchProgram = async (data) => {
		try {
			const res = await programApi.getAll({
				search: data
			})
			if (res.status == 200) {
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

	function checkSelected(params) {
		let flag = false
		programsSelected.forEach((element) => {
			if (element.Id == params.Id) {
				flag = true
			}
		})
		return flag
	}

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
							checkSelected(item) ? (
								<RxCheck size={28} className="mr-[6px] text-[#66BB6A]" />
							) : (
								<IconButton icon="add" color="blue" type="button" tooltip="Thêm chương trình" onClick={() => handleAddProgram(item)} />
							)
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
