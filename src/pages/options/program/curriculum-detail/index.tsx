import { Card, Collapse, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import Lessons from '~/common/components/CurriculumDetail/Lessons'
import Units from '~/common/components/CurriculumDetail/Units'
import MainLayout from '~/common/components/MainLayout'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

const CurriculumDetail = () => {
	// OLD VIEW, USE LATER
	// const router = useRouter()

	// const [curriculumId, setCurriculumId] = useState(null)
	// const [activatedUnit, setActivatedUnit] = useState(null)

	// useEffect(() => {
	// 	if (router.query?.name) {
	// 		setCurriculumId(router.query?.name)
	// 	}
	// }, [router.query])

	// return (
	// 	// <Card
	// 	// 	className="curriculum-detail-docs relative"
	// 	// 	title={
	// 	// 		<div className="curriculum-detail-card-title">
	// 	// 			<div className="curriculum-detail-card-title left">Chi tiết giáo trình</div>
	// 	// 		</div>
	// 	// 	}
	// 	// >
	// 	// 	<div className="curriculum-detail-docs-container">
	// 	// 		<div className="curriculum-detail-docs-units">
	// 	// 			<Units curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
	// 	// 		</div>
	// 	// 		<div className="curriculum-detail-docs-lesson">
	// 	// 			<Lessons curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
	// 	// 		</div>
	// 	// 	</div>
	// 	// </Card>
	// )

	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE, CurriculumId: null }
	const [dataSource, setDataSource] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(initialParams)
	const [curriculumId, setCurriculumId] = useState(null)
	const router = useRouter()

	useEffect(() => {
		if (router.query?.name) {
			setCurriculumId(router.query?.name)
			setTodoApi({ ...todoApi, CurriculumId: Number(router.query.name) })
		}
	}, [router.query])

	const getCurriculum = async () => {
		setIsLoading(true)
		try {
			const response = await curriculumDetailApi.getAll(todoApi)
			if (response.status === 200) {
				setDataSource(response.data.data)
			}
			if (response.status === 204) {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getCurriculum()
	}, [todoApi])

	if (isLoading) {
		return <Skeleton active />
	}

	return (
		<>
			<Collapse accordion>
				{dataSource?.map((item, index) => {
					return (
						<Collapse.Panel header={item.Name} key={index}>
							{item.Name}
						</Collapse.Panel>
					)
				})}
			</Collapse>
		</>
	)
}

CurriculumDetail.Layout = MainLayout
export default CurriculumDetail
