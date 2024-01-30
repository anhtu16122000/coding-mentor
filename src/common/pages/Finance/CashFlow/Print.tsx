import { Card, Form, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { paymentSessionApi } from '~/api/business/payment-session'
import EditorField from '~/common/components/FormControl/EditorField'
import PrimaryButton from '~/common/components/Primary/Button'
import { FormPrintImport } from '~/common/components/Student/FormPrintImport'
import { ShowNoti } from '~/common/utils'

export default function PrintCashFlowPage() {
	const router = useRouter()
	const [form] = Form.useForm()

	const printAreaRef = useRef<HTMLTableElement>(null)

	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState(null)

	useEffect(() => {
		if (!!router?.query?.payment) {
			getPaymentDetail()
		}
	}, [router])

	const getPaymentDetail = async () => {
		setIsLoading(true)
		try {
			let res = await paymentSessionApi.getByID(router?.query?.payment)
			if (res.status == 200) {
				setData(res.data.data)
				form.setFieldValue('Content', res.data.data.PrintContent)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handlePrint = useReactToPrint({
		content: () => printAreaRef.current,
		removeAfterPrint: true
	})

	const onSubmit = async (data) => {
		try {
			let res = await paymentSessionApi.update({
				Id: router.query.payment,
				PrintContent: data.Content
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getPaymentDetail()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	if (isLoading) {
		return <Skeleton />
	}

	return (
		<div>
			<Card
				title={`Nội dung ${data?.TypeName?.toLowerCase()}`}
				extra={
					<div className="flex gap-[12px] justify-end items-center">
						<PrimaryButton background="blue" type="submit" icon="save">
							Lưu
						</PrimaryButton>

						<PrimaryButton background="green" type="button" icon="print" onClick={handlePrint}>
							In
						</PrimaryButton>
					</div>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<EditorField
						id={router?.query?.paymentID || ''}
						name="Content"
						label=""
						onChangeEditor={(value) => form.setFieldValue('Content', value)}
					/>

					<div className="hidden">
						<FormPrintImport data={data?.PrintContent ? data?.PrintContent : null} defaultValues={print} printAreaRef={printAreaRef} />
					</div>
				</Form>
			</Card>
		</div>
	)
}
