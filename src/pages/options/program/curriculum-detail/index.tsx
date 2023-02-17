import { Card, Collapse, Form, Skeleton, Upload, UploadProps } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import CurriculumDetailList from '~/common/components/CurriculumDetail/CurriculumDetailList'
import Lessons from '~/common/components/CurriculumDetail/Lessons'
import Units from '~/common/components/CurriculumDetail/Units'
import SelectField from '~/common/components/FormControl/SelectField'
import MainLayout from '~/common/components/MainLayout'
import PrimaryButton from '~/common/components/Primary/Button'
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
	// 	<Card
	// 		className="curriculum-detail-docs relative"
	// 		title={
	// 			<div className="curriculum-detail-card-title">
	// 				<div className="curriculum-detail-card-title left">Chi tiết giáo trình</div>
	// 			</div>
	// 		}
	// 	>
	// 		<div className="curriculum-detail-docs-container">
	// 			<div className="curriculum-detail-docs-units">
	// 				<Units curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
	// 			</div>
	// 			<div className="curriculum-detail-docs-lesson">
	// 				<Lessons curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
	// 			</div>
	// 		</div>
	// 	</Card>
	// )

	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE, CurriculumId: null }
	const [dataSource, setDataSource] = useState<{ option: { title: string; value: any }[]; list: ICurriculumDetail[] }>({
		option: [],
		list: []
	})
	const [dataSelected, setDataSelected] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(initialParams)
	const [curriculumId, setCurriculumId] = useState(null)
	const [form] = Form.useForm()
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
				let temp = []
				response.data.data.forEach((item) => temp.push({ title: item.Name, value: item.Id }))
				setDataSource({ list: response.data.data, option: temp })
				setDataSelected(response.data.data[0])
				form.setFieldValue('Curriculum', response.data.data[0].Id)
			}
			if (response.status === 204) {
				setDataSource({
					option: [],
					list: []
				})
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

	async function uploadFile(params, id) {
		try {
			const formData = new FormData()
			formData.append('file', params)
			const response = await curriculumDetailApi.addFile(id, formData)
			if (response.status == 200) {
				// getData()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const genExtra = (data) => {
		return (
			<>
				<Upload
					name="file"
					multiple={true}
					customRequest={(event) => uploadFile(event.file, data.Id)}
					onChange={(info) => {
						// data.push({ fileName: info.file.name, isUploading: true })
						// setData(data)
					}}
					showUploadList={false}
				>
					<PrimaryButton type="button" icon="upload" background="green">
						Thêm
					</PrimaryButton>
				</Upload>
			</>
		)
	}

	if (isLoading) {
		return <Skeleton active />
	}

	return (
		<div className="curriculum-content-container">

		<Form form={form}>
			<Card
				title="Danh sách chủ đề"
				extra={
					<>
						<SelectField
							name="Curriculum"
							label=""
							optionList={dataSource.option}
							className="m-0"
							placeholder="Chọn chủ đề"
							onChangeSelect={(data) => {
								let temp = dataSource.list.filter((item) => item.Id == data)[0]
								setDataSelected(temp)
							}}
						/>
					</>
				}
			>
				<CurriculumDetailList item={dataSelected} />
			</Card>
		</Form>
		</div>
	)
}

CurriculumDetail.Layout = MainLayout
export default CurriculumDetail
