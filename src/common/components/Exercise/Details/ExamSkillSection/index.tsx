import React, { useEffect, useState } from 'react'
import { Empty } from 'antd'
import { useDispatch } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import { useRouter } from 'next/router'
import { ShowNostis } from '~/common/utils'
import PrimaryButton from '~/common/components/Primary/Button'
import LoadingExercise from '~/common/components/Loading/Exercise'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import ExamSectionItem from './exam-section-item'
import CreateExamSection from './exam-section-form'

function ExamSection(props) {
	const { data, activated } = props

	const dispatch = useDispatch()
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [showEditIndex, setShowEditIndex] = useState<boolean>(false)

	useEffect(() => {
		dispatch(setGlobalBreadcrumbs([{ title: 'Quản lý đề', link: '/exam' }]))

		const handleRouteChange = async (url) => {
			dispatch(setGlobalBreadcrumbs([]))
		}

		// Đăng ký sự kiện lắng nghe sự thay đổi router
		router.events.on('routeChangeStart', handleRouteChange)

		// Hủy đăng ký sự kiện khi component bị unmount để tránh memory leak
		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	}, [])

	useEffect(() => {
		if (!!data?.Id && sections.length == 0) {
			getExamSections()
		}
	}, [activated])

	const [sections, setSections] = useState([])

	async function getExamSections() {
		try {
			const res = await ieltsSectionApi.getAll({ pageSize: 99, pageIndex: 1, ieltsSkillId: data?.Id })
			if (res.status == 200) {
				setSections(res.data.data)

				setShowEditIndex(false)
				setChanged(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function handleChangeSEC(params) {
		setSections([...params])
		setChanged(true)
	}

	const [changed, setChanged] = useState(false)

	const [skillSelected, setSkillSelected] = useState(null)

	const onChange = (key: string | string[]) => {
		setSkillSelected(key)
	}

	function handleRefresh() {
		getExamSections()
	}

	useEffect(() => {
		if (skillSelected != data?.Id) {
			setShowEditIndex(false)
		}
	}, [skillSelected])

	async function saveChangedSections(params) {
		try {
			const res = await ieltsSectionApi.changeIndex(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')

				setShowEditIndex(false)
				setChanged(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	function handleSave() {
		let temp = []

		for (let i = 0; i < sections.length; i++) {
			const element = sections[i]
			temp.push({ Id: element.Id, Index: i })
		}

		saveChangedSections({ Items: temp })
	}

	return (
		<div className="cc-exam-detail !max-w-[1200px]">
			<div className="mb-[16px] flex items-center">
				{!showEditIndex && !changed && (
					<PrimaryButton onClick={() => setShowEditIndex(true)} className="mr-[8px]" background="blue" icon="edit" type="button">
						Thay đổi vị trí
					</PrimaryButton>
				)}

				{showEditIndex && !changed && (
					<PrimaryButton onClick={() => setShowEditIndex(false)} className="mr-[8px]" background="red" icon="cancel" type="button">
						Dừng thay đổi
					</PrimaryButton>
				)}

				{showEditIndex && changed && (
					<PrimaryButton onClick={handleSave} className="mr-[8px]" background="blue" icon="save" type="button">
						Lưu thay đổi
					</PrimaryButton>
				)}

				{showEditIndex && changed && (
					<PrimaryButton onClick={getExamSections} className="mr-[8px]" background="yellow" icon="reset" type="button">
						Khôi phục
					</PrimaryButton>
				)}

				{!showEditIndex && <CreateExamSection skill={data} onRefresh={handleRefresh} />}
			</div>

			{loading && <LoadingExercise />}

			{!loading && sections.length == 0 && <Empty />}

			{!loading && sections.length > 0 && (
				<div className="mb-[-16px]">
					{sections.map((sk, index) => {
						return (
							<ExamSectionItem
								key={`sk-${index}`}
								data={sk}
								sections={sections}
								setSections={handleChangeSEC}
								index={index}
								activeKey={[skillSelected]}
								onRefresh={getExamSections}
								onClick={() => onChange(sk?.Id == skillSelected ? '' : sk?.Id)}
								showEditIndex={showEditIndex}
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default ExamSection
