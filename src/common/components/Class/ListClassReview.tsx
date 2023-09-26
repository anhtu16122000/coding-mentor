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
			className="rounded-lg mt-3 p-[3px]"
			bordered
			itemLayout="horizontal"
			dataSource={classesSelected}
			renderItem={(item: IClass) => (
				<List.Item
					className="!px-[14px]"
					extra={<IconButton icon="remove" color="red" type="button" tooltip="Xóa" onClick={() => handleRemoveClass(item)} />}
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
								<span className="title">Buổi đã học:</span>
								<span className="font-normal ml-1">
									{item?.CompletedLesson} / {item?.TotalLesson}
								</span>
							</p>

							<p>
								<span className="title">Học viên:</span>
								<span className="font-normal ml-1">
									{item.StudentQuantity} / {item.MaxQuantity}
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
