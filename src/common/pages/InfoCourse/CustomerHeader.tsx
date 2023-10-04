import Router from 'next/router'
import React, { useRef } from 'react'
import { MdOutlineNotificationAdd } from 'react-icons/md'
import { useSelector } from 'react-redux'
import appConfigs from '~/appConfig'
import PrimaryButton from '~/common/components/Primary/Button'
import { is } from '~/common/utils/common'
import { ExportLeads } from '~/common/utils/export-excel/leads'
import { RootState } from '~/store'
import ImportCustomer from './ImportCustomer'
import CustomerAdviseForm from '~/common/components/Customer/CustomerAdviseForm'
import { Popover, Select } from 'antd'
import { TiArrowSortedDown } from 'react-icons/ti'

const CustomerHeader = (props) => {
	const { onFilter, formProps, onRefresh } = props

	const userInfo = useSelector((state: RootState) => state.user.information)
	const branchs = useSelector((state: RootState) => state.branch.Branch)

	function downloadExample() {
		window.open(`${appConfigs.linkDownloadExcelCustomer}?key=${new Date().getTime()}`)
	}

	function gotoSentMail() {
		Router.push({ pathname: '/leads/send-mail-all' })
	}

	const showExample = is(userInfo).admin || is(userInfo).teacher || is(userInfo).manager || is(userInfo).academic || is(userInfo).saler
	const showImport = is(userInfo).admin || is(userInfo).teacher || is(userInfo).manager || is(userInfo).academic || is(userInfo).saler
	const showCreate = is(userInfo).admin || is(userInfo).manager || is(userInfo).academic || is(userInfo).saler

	const content = (
		<div className="w-[150] flex items-start flex-col w500:hidden">
			{showExample && (
				<PrimaryButton background="yellow" type="button" onClick={gotoSentMail}>
					<MdOutlineNotificationAdd className="text-[20px] mr-[8px]" />
					Thông báo
				</PrimaryButton>
			)}

			{showExample && <ExportLeads />}

			{showExample && (
				<PrimaryButton
					className="mr-2 btn-download mt-[8px] w500:mt-0"
					iconClassName="m-0"
					type="button"
					icon="download"
					background="blue"
					onClick={downloadExample}
				>
					File mẫu
				</PrimaryButton>
			)}

			{showImport && <ImportCustomer className="mr-1 btn-import !mt-[4px]" onFetchData={onRefresh} />}

			{showCreate && (
				<div className="mt-[8px]">
					<CustomerAdviseForm {...formProps} />
				</div>
			)}
		</div>
	)

	const refVisiblePopover = useRef(null)

	return (
		<div className="flex items-center w-full">
			<div className="flex items-center flex-1">
				<Select className={`style-input max-w-[160px]`} placeholder="Trung tâm" onChange={(e) => onFilter({ branchIds: e })} size="large">
					<Select.Option value={null} key={9865544}>
						Tất cả
					</Select.Option>
					{branchs.map((option: any, index) => (
						<Select.Option title={option.dataSort} value={option?.Id} key={index}>
							{option.Name}
						</Select.Option>
					))}
				</Select>
			</div>

			<div className="items-center ml-[8px] hidden w500:flex">
				{showExample && (
					<PrimaryButton background="yellow" type="button" onClick={gotoSentMail} className="mr-2">
						<MdOutlineNotificationAdd className="text-[20px]" />
						<div className="hidden w800:inline w1000:hidden w1150:inline ml-[8px]">Thông báo</div>
					</PrimaryButton>
				)}

				{showExample && <ExportLeads />}

				{showExample && (
					<PrimaryButton
						className="mr-2 btn-download"
						iconClassName="m-0"
						type="button"
						icon="download"
						background="blue"
						onClick={downloadExample}
					>
						<div className="hidden w650:inline ml-[8px]">File mẫu</div>
					</PrimaryButton>
				)}

				{showImport && <ImportCustomer className="mr-1 btn-import" onFetchData={onRefresh} />}

				{showCreate && <CustomerAdviseForm {...formProps} />}
			</div>

			<Popover ref={refVisiblePopover} content={content} title={null} trigger="click" placement="bottomRight" overlayClassName="show-arrow">
				<PrimaryButton className="block w500:hidden" background="primary" type="button">
					<TiArrowSortedDown className="text-[18px] mr-[8px]" />
					<div>Thao tác</div>
				</PrimaryButton>
			</Popover>
		</div>
	)
}

export default CustomerHeader
