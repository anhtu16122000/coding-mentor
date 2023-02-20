import { Card } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LibraryLessons from './LibraryLesson'
import LibraryUnits from './LibraryUnits'

export interface ILibraryDocumentPageProps {}

export default function LibraryDocumentPage(props: ILibraryDocumentPageProps) {
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
					<div className="curriculum-detail-card-title left">Chi tiết chủ đề</div>
				</div>
			}
		>
			<div className="curriculum-detail-docs-container">
				<div className="curriculum-detail-docs-units">
					<LibraryUnits curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
				</div>
				<div className="curriculum-detail-docs-lesson">
					<LibraryLessons curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
				</div>
			</div>
		</Card>
	)
}
