import React, { FC } from 'react'
import { FaFileSignature } from 'react-icons/fa'
import { IoMdImages } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Avatar from '../../Avatar'
import { MdGroup } from 'react-icons/md'

const CreateType: FC<TNewType> = (props) => {
	const { onClick, title, icon } = props

	return (
		<div onClick={(e) => onClick(e)} className="cc-news-create-type">
			{icon}
			<span>{title}</span>
		</div>
	)
}

function MainCreate(props) {
	const { onClick, setHaveImage } = props

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<div className="cc-news-create-container !w-[calc(100%-8px)] ml-[3px]">
			<div className="flex row-center">
				<Avatar uri={user?.Avatar} className="cc-news-avatar" />
				<div onClick={() => onClick()} className="cc-fake-input">
					<span>Bài viết mới...</span>
				</div>
			</div>
			<div className="cc-hr my-[16px]" />
			<div className="flex row-center">
				<CreateType
					onClick={() => {
						setHaveImage(false)
						onClick()
					}}
					icon={<FaFileSignature size={16} className="text-[#4CAF50] mt-[-2px] mr-[8px]" />}
					title="Bài viết"
				/>
				<CreateType
					onClick={() => {
						setHaveImage(true)
						onClick()
					}}
					icon={<IoMdImages size={20} className="text-[#1E88E5] mt-[-2px] mr-[8px]" />}
					title="Ảnh/video"
				/>
			</div>
		</div>
	)
}

export default MainCreate
