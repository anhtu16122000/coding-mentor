import { Upload } from 'antd'
import { useState } from 'react'
import { userInformationApi } from '~/api/user/user'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'

const ImportStudent = (props) => {
	const { onFetchData, className } = props
	const [isLoading, setIsLoading] = useState(false)

	const onChange_ImportExcel = async (info) => {
		setIsLoading(true)
		try {
			let res = await userInformationApi.importUser(info)
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
			<PrimaryButton className={className} loading={isLoading} type="button" icon="excel" background="yellow">
				Tạo nhanh
			</PrimaryButton>
		</Upload>
	)
}

export default ImportStudent
