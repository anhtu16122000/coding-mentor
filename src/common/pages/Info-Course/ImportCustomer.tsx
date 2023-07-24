import { Upload } from 'antd'
import { useState } from 'react'
import { customerAdviseApi } from '~/api/user/customer'
import { userInformationApi } from '~/api/user/user'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'

const ImportCustomer = (props) => {
	const { onFetchData, className } = props
	const [isLoading, setIsLoading] = useState(false)

	const onChange_ImportExcel = async (info) => {
		setIsLoading(true)
		try {
			let res = await customerAdviseApi.importCustomer(info)
			if (res.status == 200) {
				ShowNoti('success', 'Thành công')
				onFetchData && onFetchData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Upload customRequest={(event) => onChange_ImportExcel(event.file)} className={className} showUploadList={false}>
			<PrimaryButton className={className} iconClassName="m-0" loading={isLoading} type="button" icon="excel" background="orange">
				<div className="inline w500:hidden w600:inline ml-[8px]">Tạo nhanh</div>
			</PrimaryButton>
		</Upload>
	)
}

export default ImportCustomer
