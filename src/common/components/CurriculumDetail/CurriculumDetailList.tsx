import { Collapse, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { getFileIcons } from '~/common/utils/main-function'
import moment from 'moment'
import IconButton from '../Primary/IconButton'

export interface ICurriculumDetailListProps {
	item: ICurriculumDetail
}

export default function CurriculumDetailList(props: ICurriculumDetailListProps) {
	const { item } = props
	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE, CurriculumDetailId: null }
	const [dataSource, setDataSource] = useState<ICurriculumDetail[]>([])
	console.log('🚀 ~ dataSource', dataSource)
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(initialParams)

	useEffect(() => {
		if (item) {
			setTodoApi({ ...todoApi, CurriculumDetailId: item.Id })
		}
	}, [item])

	async function getData() {
		setIsLoading(true)
		try {
			const response = await curriculumDetailApi.getFile(todoApi.CurriculumDetailId)
			if (response.status === 200) {
				setDataSource(response.data.data)
			} else {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (todoApi.CurriculumDetailId) {
			getData()
		}
	}, [todoApi])

	function formatFileName(fileName) {
		const res = fileName.replace('.png', '').replace('.jpg', '').replace('.jpeg', '').replace('.pdf', '').replace('.png', '')
		const ress = res.replace('.webp', '').replace('.mp4', '').replace('.avi', '').replace('.pptx', '').replace('.ppt', '')
		const resss = ress.replace('.docs', '').replace('.doc', '').replace('.xls', '').replace('.xlsx', '').replace('.mp3', '')
		return resss.replace('.zip', '').replace('.rar', '').replace('.json', '').replace('.xml', '')
	}

	if (isLoading) {
		return <Skeleton active />
	}

	return (
		<div className="curriculum-filename-contain">
			{dataSource?.map((item, index) => {
				return (
					<div className="item">
						<div className="left">
							{getFileIcons(item.FileType, item.FileUrl)}
							<p>{formatFileName(item.FileName)}</p>
						</div>
						<div className="right">
							<p>{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
							<div className="buttons">
								<IconButton
									type="button"
									icon="download"
									color="blue"
									onClick={() => {
										window.open(item.FileUrl)
									}}
									className=""
									tooltip="Tải tài liệu này"
								/>
								<IconButton type="button" icon="remove" color="red" onClick={() => {}} className="" tooltip="Xóa tài liệu này" />
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
