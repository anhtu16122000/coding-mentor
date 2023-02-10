import { Card } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Lessons from '~/common/components/CurriculumDetail/Lessons'
import Units from '~/common/components/CurriculumDetail/Units'
import MainLayout from '~/common/components/MainLayout'

const CurriculumDetail = () => {
	const router = useRouter()

	const [curriculumId, setCurriculumId] = useState(null)
	const [activatedUnit, setActivatedUnit] = useState(null)

	useEffect(() => {
		if (router.query?.name) {
			setCurriculumId(router.query?.name)
		}
	}, [router.query])

	return (
		<Card
			className="curriculum-detail-docs relative"
			title={
				<div className="curriculum-detail-card-title">
					<div className="curriculum-detail-card-title left">Chi tiết giáo trình</div>
				</div>
			}
		>
			<div className="curriculum-detail-docs-container">
				<div className="curriculum-detail-docs-units">
					<Units curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
				</div>
				<div className="curriculum-detail-docs-lesson">
					<Lessons curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
				</div>
			</div>
		</Card>
	)
}

CurriculumDetail.Layout = MainLayout
export default CurriculumDetail
