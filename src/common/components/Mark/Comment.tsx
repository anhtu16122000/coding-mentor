import { Avatar, Input, Button, Tooltip, Popconfirm } from 'antd'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { wait } from '~/common/utils'
import PrimaryButton from '../Primary/Button'

const AudioRecoder: any = dynamic(() => import('./MarkingExam/AudioRecoder'), {
	ssr: false
})

const { TextArea } = Input

const CommentItem = (props: IConmmentItem) => {
	const { hiddenRemove, item, active, onSave, onActive, onDeleteItem, loading, isSubmit, disabled } = props

	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
	}

	const [pending, setPending] = useState(false)

	useEffect(() => {
		pen()
	}, [item])

	async function pen() {
		setPending(true)
		await wait(100)
		setPending(false)
	}

	const [isRecord, setIsRecord] = useState<boolean>(false)

	useEffect(() => {
		getPermissiton()
	}, [])

	const getPermissiton = async () => {
		await navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {})
			.catch((err) => {})
	}

	// RENDER
	return (
		<div
			onClick={() => onActive(item)}
			id={`item-${item?.Code}`}
			className={`cmt-item ${item?.Code == active && 'active'} ${item?.Comment == '' && !!isSubmit && 'error'}`}
			style={{ cursor: 'pointer' }}
		>
			{!loading && (
				<>
					<div className="user-info">
						<Avatar className="shadow cmt-avt" src={!!item?.Avatar ? item?.Avatar : '/images/logo-thumnail.jpg'} />
						<div className="info">
							<Tooltip title={item?.CreatedBy}>
								<div className="user-name in-1-line">{item?.CreatedBy}</div>
							</Tooltip>
							<div className="created-date in-1-line">{item?.RoleName}</div>
						</div>
					</div>

					{!pending && (
						<TextArea
							rows={4}
							disabled={disabled}
							id={getTimeStamp() + '-cmt'}
							className="mt-3 cmt-input"
							placeholder="Nhập nội dung nhận xét"
							defaultValue={props.item.Comment}
							onChange={(event) => onSave({ ...item, Comment: event.target.value })}
							onFocus={() => onActive(item)}
						/>
					)}

					{!!active && item?.Code == active && !disabled && (
						<div className="cmt-control mt-3">
							<div className="mt-[-0px] mr-[8px]">
								<AudioRecoder
									disabled={disabled}
									id={item?.Code}
									isHideBar={true}
									setLinkRecord={(linkAudio: string) => onSave({ ...item, LinkAudio: linkAudio })}
									linkRecord={item?.LinkAudio}
									setIsRecord={setIsRecord}
									isRecord={isRecord}
									onDelete={() => onSave({ ...item, LinkAudio: '' })}
								/>
							</div>

							{hiddenRemove ? (
								<></>
							) : (
								<Popconfirm onConfirm={() => onDeleteItem(item)} placement="leftTop" title="Bạn muốn xóa nhận xét này?">
									<PrimaryButton background="red" icon="cancel" type="button">
										Xoá
									</PrimaryButton>
								</Popconfirm>
							)}
						</div>
					)}

					{!!disabled && !!item?.LinkAudio && (
						<audio id={`audio-${item.Code}`} className="mt-3 w-100" controls>
							<source src={item?.LinkAudio} type="audio/mpeg" />
						</audio>
					)}
				</>
			)}
		</div>
	)
}

export default CommentItem
