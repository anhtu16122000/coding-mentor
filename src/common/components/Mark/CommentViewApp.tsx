import { Avatar, Input, Button, Tooltip, Popconfirm } from 'antd'
import React from 'react'
import AudioRecoder from '~/common/pages/ElsaSpeak/AudioRecoder/AudioRecoderApp'

const { TextArea } = Input

const CommentItemViewApp = (props: IConmmentItemViewApp) => {
	const { item, active, onActive, loading, isSubmit, disabled } = props

	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
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
						<Avatar className="shadow cmt-avt" src={!!item?.Avatar ? item?.Avatar : '/images/logo-thumnail-2.jpg'} />
						<div className="info">
							<Tooltip title={item?.CreatedBy}>
								<div className="user-name in-1-line d-block">{item?.CreatedBy}</div>
							</Tooltip>
							<div className="created-date in-1-line">{item?.RoleName}</div>
						</div>
					</div>

					<TextArea
						rows={4}
						disabled={disabled}
						id={getTimeStamp() + '-cac'}
						className="mt-3 cmt-input"
						placeholder="Nhận nội dung nhận xét"
						defaultValue={item.Comment}
						onFocus={() => onActive(item)}
						value={item.Comment}
					/>

					{!!active && item?.Code == active && !disabled && (
						<div className="cmt-control mt-3">
							<AudioRecoder disabled={disabled} id={item?.Code} isHideBar={true} setLinkRecord={() => {}} linkRecord={item?.LinkAudio} />
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

export default CommentItemViewApp
