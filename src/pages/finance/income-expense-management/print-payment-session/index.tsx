import { Card, Form, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { paymentSessionApi } from '~/api/payment-session'
import { MainLayout } from '~/common'
import EditorField from '~/common/components/FormControl/EditorField'
import PrimaryButton from '~/common/components/Primary/Button'
import { FormPrintImport } from '~/common/components/Student/FormPrintImport'
import { ShowNoti } from '~/common/utils'

export interface IPrintPaymentSessionProps {}

export default function PrintPaymentSession(props: IPrintPaymentSessionProps) {
	const router = useRouter()
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmit, setIsSubmit] = useState(false)
	const [dataSource, setDataSource] = useState(null)
	const printAreaRef = useRef<HTMLTableElement>(null)

	const getPaymentDetail = async () => {
		setIsLoading(true)
		try {
			let res = await paymentSessionApi.getByID(router.query.paymentID)
			if (res.status == 200) {
				setDataSource(res.data.data.PrintContent)
				form.setFieldValue('Content', res.data.data.PrintContent)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!!router) {
			getPaymentDetail()
		}
	}, [router])

	const handlePrint = useReactToPrint({
		content: () => printAreaRef.current,
		removeAfterPrint: true
	})

	const onSubmit = async (data) => {
		setIsSubmit(true)
		try {
			let res = await paymentSessionApi.update({ Id: router.query.paymentID, PrintContent: data.Content })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
            getPaymentDetail()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsSubmit(false)
		}
	}

	if (isLoading) {
		return <Skeleton />
	}

	return (
		<div>
			<Card
				title={`Nội dung phiếu ${router && router.query.Name.toString().toLowerCase()}`}
				extra={
					<>
						<div className="flex gap-4 justify-end items-center">
							<PrimaryButton background="green" type="button" children={<span>In</span>} icon="print" onClick={handlePrint} />
						</div>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<EditorField name="Content" label="" onChangeEditor={(value) => form.setFieldValue('Content', value)} />

					<div className="flex justify-end items-center">
						<PrimaryButton background="blue" type="submit" children={<span>Lưu</span>} icon="save" />
					</div>
					<div className="hidden">
						<FormPrintImport data={dataSource ? dataSource : null} defaultValues={print} printAreaRef={printAreaRef} />
					</div>
				</Form>
			</Card>
		</div>
	)
}
PrintPaymentSession.Layout = MainLayout
