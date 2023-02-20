import { List } from 'antd'
import React from 'react'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'

const ListClassReview = (props) => {
	const { classesSelected, setClassesSelected, setClasses } = props
	const handleRemoveClass = (data) => {
		const newClassesSelected = classesSelected.filter((item) => item.Id !== data.Id)
		setClassesSelected(newClassesSelected)
		setClasses((prev) => [{ ...data }, ...prev])
	}
	return (
		<List
			className="rounded-lg mb-3 p-[3px]"
			bordered
			itemLayout="horizontal"
			dataSource={classesSelected}
			renderItem={(item: IClass) => (
				<List.Item extra={<IconButton icon="remove" color="red" type="button" tooltip="Xóa" onClick={() => handleRemoveClass(item)} />}>
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
	)
}

export default ListClassReview
