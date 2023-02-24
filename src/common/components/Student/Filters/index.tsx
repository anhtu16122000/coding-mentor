import { Form, Popover, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { Filter } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { branchApi } from '~/api/branch'
import { useDispatch } from 'react-redux'
import { setFilterBranchs, setFilterClass, setFilterPrograms } from '~/store/filterReducer'
import { programApi } from '~/api/program'
import FooterFilters from '../../Footer/Filters'
import RestApi from '~/api/RestApi'

interface IFilters {
	filters?: any
	onSubmit?: Function
	onReset?: Function
	showBranch?: boolean
	showProgram?: boolean
	showWarning?: boolean
	showClass?: boolean
	showSort?: boolean
	statusList?: Array<{ value: any; title: string }>
}

const Filters: FC<IFilters> = (props) => {
	const { filters, onSubmit, onReset, showBranch, showProgram, statusList, showWarning } = props
	const { showClass, showSort } = props

	const [form] = Form.useForm()

	const dispatch = useDispatch()

	const [visible, setVisible] = useState(false)

	const branches = useSelector((state: RootState) => state.filter.Branchs)
	const programs = useSelector((state: RootState) => state.filter.Programs)
	const classes = useSelector((state: RootState) => state.filter.Classes)

	useEffect(() => {
		if (visible) {
			if (!!showBranch && branches.length == 0) {
				getBranchs()
			}

			if (!!showProgram && programs.length == 0) {
				getPrograms()
			}

			if (!!showClass && classes.length == 0) {
				getClasses()
			}
		}
	}, [visible])

	const getBranchs = async () => {
		try {
			const response = await branchApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (response.status == 200) {
				dispatch(setFilterBranchs(response.data.data))
			} else {
				dispatch(setFilterBranchs([]))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const getClasses = async () => {
		try {
			const response = await RestApi.get<any>('Class', { pageIndex: 1, pageSize: 99999, types: '1,2' })
			if (response.status == 200) {
				dispatch(setFilterClass(response.data.data))
			} else {
				dispatch(setFilterClass([]))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const getPrograms = async () => {
		try {
			const response = await programApi.getAll({ pageSize: 9999, pageIndex: 1 })
			if (response.status == 200) {
				dispatch(setFilterPrograms(response.data.data))
			} else {
				dispatch(setFilterPrograms([]))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	function toggle() {
		setVisible(!visible)
	}

	function onFinish(params) {
		const DATA_SUBMIT = {
			...filters,
			...params,
			sort: 1
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!!onSubmit && onSubmit(DATA_SUBMIT)

		toggle()
	}

	function submitForm() {
		form.submit()
	}

	function resetForm() {
		form.resetFields()
		if (!!onReset) onReset()
		toggle()
	}

	const content = (
		<div className="w-[300px] p-[8px]">
			<Form
				form={form}
				className="grid grid-cols-2 gap-x-4"
				layout="vertical"
				initialValues={{ remember: true }}
				onFinish={onFinish}
				autoComplete="on"
			>
				{!!showBranch && (
					<Form.Item className="col-span-2" name="branhIds" label="Trung tâm" rules={formNoneRequired}>
						<Select placeholder="Chọn trung tâm" allowClear>
							{branches.map((item) => {
								return (
									<Select.Option key={item.Id} value={item.Id}>
										{item?.Name}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				)}

				{!!showProgram && (
					<Form.Item className="col-span-2" name="classId" label="Chương trình" rules={formNoneRequired}>
						<Select placeholder="Chọn chương trình" allowClear>
							{programs.map((item) => {
								return (
									<Select.Option key={item.Id} value={item.Id}>
										{item?.Name}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				)}

				{!!showClass && (
					<Form.Item className="col-span-2" name="classId" label="Lớp học" rules={formNoneRequired}>
						<Select placeholder="Chọn lớp học" allowClear>
							{classes.map((item) => {
								return (
									<Select.Option key={item.Id} value={item.Id}>
										{item?.Name}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				)}

				{!!statusList && (
					<Form.Item className="col-span-2" name="status" label="Trạng thái" rules={formNoneRequired}>
						<Select placeholder="Chọn trạng thái" allowClear>
							{statusList.map((item) => {
								return (
									<Select.Option key={item.value} value={item.value}>
										{item?.title}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				)}

				{!!showWarning && (
					<Form.Item className="col-span-2" name="warning" label="Cảnh báo" rules={formNoneRequired}>
						<Select placeholder="Chọn trạng thái" allowClear>
							<Select.Option key="false" value={false}>
								Không bị cảnh báo
							</Select.Option>

							<Select.Option key="true" value={true}>
								Bị cảnh báo
							</Select.Option>
						</Select>
					</Form.Item>
				)}

				{!!showSort && (
					<Form.Item className="col-span-2" name="sortType" label="Sắp xếp" rules={formNoneRequired}>
						<Select placeholder="Chọn trạng thái" allowClear>
							<Select.Option key="false" value={true}>
								Tên A-Z
							</Select.Option>
							<Select.Option key="true" value={false}>
								Tên Z-A
							</Select.Option>
						</Select>
					</Form.Item>
				)}
			</Form>

			<FooterFilters onSubmit={submitForm} onReset={resetForm} />
		</div>
	)

	return (
		<>
			<Popover
				placement="bottomLeft"
				content={content}
				trigger="click"
				open={visible}
				onOpenChange={toggle}
				showArrow={true}
				overlayClassName="show-arrow"
			>
				<PrimaryTooltip id={`filters-api`} place="right" content="Bộ lọc">
					<div
						onClick={toggle}
						className="w-[36px] h-[36px] cursor-pointer bg-[#edf1f8] all-center rounded-[6px] hover:bg-[#dee2ea] active:bg-[#edf1f8]"
					>
						<Filter size={16} />
					</div>
				</PrimaryTooltip>
			</Popover>
		</>
	)
}

export default Filters