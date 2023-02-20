import { List } from 'antd'
import React from 'react'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'

const ListProgramReview = (props) => {
	const { programsSelected, setProgramsSelected, setPrograms, type } = props
	const handleRemoveProgram = (data) => {
		const newProgramsSelected = programsSelected.filter((item) => item.Id !== data.Id)
		setProgramsSelected(newProgramsSelected)
		setPrograms((prev) => [{ ...data }, ...prev])
	}
	return (
		<List
			className="rounded-[6px] mb-3 p-[2px]"
			bordered
			itemLayout="horizontal"
			dataSource={programsSelected}
			renderItem={(item: any) => (
				<List.Item
					extra={
						type == '1-1' ? (
							<></>
						) : (
							<IconButton icon="remove" color="red" type="button" tooltip="Xóa" onClick={() => handleRemoveProgram(item)} />
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
	)
}

export default ListProgramReview
