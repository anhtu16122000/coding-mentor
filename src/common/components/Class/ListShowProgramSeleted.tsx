import { List } from 'antd'
import React from 'react'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'

const ListShowProgramSelected = (props) => {
	const { programsSelected, setProgramsSelected, setPrograms } = props
	const handleRemoveProgram = (data) => {
		const newPrograms = programsSelected.filter((item) => item.Id !== data.Id)
		setProgramsSelected(newPrograms)
		setPrograms((prev) => [{ ...data }, ...prev])
	}
	return (
		<>
			<List
				itemLayout="horizontal"
				dataSource={programsSelected}
				renderItem={(item: IClass) => (
					<List.Item
						extra={
							<IconButton icon="remove" color="red" type="button" tooltip="Xóa chương trình" onClick={() => handleRemoveProgram(item)} />
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

export default ListShowProgramSelected
