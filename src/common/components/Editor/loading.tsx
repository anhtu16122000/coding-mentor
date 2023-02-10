import { Skeleton } from 'antd'
import React, { FC } from 'react'

type TLoadingEditor = {
	hidden?: boolean
}

const LoadingEditor: FC<TLoadingEditor> = (props) => {
	const { hidden } = props

	if (hidden) {
		return <></>
	}

	return (
		<div className="editor-loading">
			<div className="editor-loading-header">
				<div className="editor-loading-left-item">
					<Skeleton active round paragraph={false} style={{ width: 30 }} />
				</div>
				<div className="editor-loading-right-item">
					<Skeleton active round paragraph={false} style={{ width: 30 }} />
				</div>
				<div className="editor-loading-left-item">
					<Skeleton active round paragraph={false} style={{ width: 20 }} />
				</div>
				<div className="editor-loading-right-item">
					<Skeleton active round paragraph={false} style={{ width: 30 }} />
				</div>
				<div className="editor-loading-right-item" style={{ paddingLeft: 16 }}>
					<Skeleton active round paragraph={false} style={{ width: 50 }} />
				</div>
			</div>
			<div style={{ padding: 16 }}>
				<Skeleton active paragraph={false} style={{ width: '30%' }} />
				<Skeleton active paragraph={false} style={{ width: '80%', marginTop: 8 }} />
				<Skeleton active paragraph={false} style={{ width: '60%', marginTop: 8 }} />
				<Skeleton active paragraph={false} style={{ width: '90%', marginTop: 8 }} />
			</div>
		</div>
	)
}

export default LoadingEditor
