import { List } from 'antd'
import React from 'react'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'

const ListShowClassSelected = (props) => {
	const { classesSelected, setClassesSelected, setClasses } = props
	const handleRemoveClass = (data) => {
		const newClasses = classesSelected.filter((item) => item.Id !== data.Id)
		setClassesSelected(newClasses)
		setClasses((prev) => [{ ...data }, ...prev])
	}
	return (
		<>
			<List
				itemLayout="horizontal"
				dataSource={classesSelected}
				renderItem={(item: IClass) => (
					<List.Item
						extra={<IconButton icon="remove" color="red" type="button" tooltip="Xóa lớp" onClick={() => handleRemoveClass(item)} />}
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

export default ListShowClassSelected
