import * as XLSX from 'xlsx'
import moment from 'moment'
import { customerAdviseApi } from '~/api/user/customer'
import PrimaryButton from '~/common/components/Primary/Button'
import { useState } from 'react'

const getAllUsers = async () => {
	let thisData = []
	try {
		const response = await customerAdviseApi.getAll({ PageSize: 999999, PageIndex: 1, sort: 1, sortType: true })
		if (response.status == 200) {
			thisData = response.data.data
		}
	} catch (error) {
		console.error(error)
	} finally {
		return thisData
	}
}

export const exportAllLeadsToExcel = async () => {
	let wb = XLSX.utils.book_new()
	var ws = XLSX.utils.json_to_sheet([], {})

	const allUsers = await getAllUsers()

	let temp = []

	for (let i = 0; i < allUsers.length; i++) {
		const element = allUsers[i]
		const thisUser = {
			stt: i + 1 > 9 ? (i + 1).toString() : '0' + (i + 1), // Ra dạng 01 , 02 ...
			id: element?.Code,
			name: element?.FullName,
			mail: element?.Email,
			phone: element?.Mobile,
			saler: element?.SaleName,
			status: element?.CustomerStatusName,
			branch: element?.BranchName,
			created: element?.CreatedBy,
			createdAt: moment(element?.CreatedOn).format('HH:mm DD/MM/YYYY'),
			update: element?.ModifiedBy,
			updateAt: moment(element?.ModifiedOn).format('HH:mm DD/MM/YYYY')
		}
		temp.push(thisUser)
	}

	// Get content inner excel file
	function getItem() {
		return {
			A: 'STT',
			B: 'Mã',
			C: 'Tên',
			D: 'Email',
			E: 'Điện thoại',
			F: 'Tư vấn',
			G: 'Trạng thái',
			H: 'Trung tâm',
			I: 'Người tạo',
			J: 'Ngày tạo',
			K: 'Người cập nhật',
			L: 'Ngày cập nhật'
		}
	}

	XLSX.utils.sheet_add_json(ws, [getItem()], { skipHeader: true, origin: 'A2' })
	XLSX.utils.sheet_add_json(ws, temp, { skipHeader: true, origin: 'A3' })
	XLSX.utils.book_append_sheet(wb, ws, 'Trang 1')

	function getColumnWidths(data) {
		const widths = []
		data.forEach((row) => {
			Object.keys(row).forEach((key, columnIndex) => {
				if (!!row[key]) {
					const columnWidth = (row[key].toString().length + 1) * 1.2 // Adjust the factor as needed
					if (widths[columnIndex]) {
						if (columnWidth > widths[columnIndex]) {
							widths[columnIndex] = columnWidth
						}
					} else {
						widths[columnIndex] = columnWidth
					}
				}
			})
		})
		const cols = widths.map((width) => ({ width: width > 15 ? width : 15 }))
		return cols
	}

	// Auto-size columns based on content
	const columnWidths = getColumnWidths(temp)
	ws['!cols'] = columnWidths

	// Get file name with timestamp
	function getFileName() {
		return `ds-hoc-vien_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`
	}

	XLSX.writeFile(wb, getFileName(), { type: 'binary', bookType: 'xlsx' })

	return true
}

export const ExportLeads = () => {
	const [loading, setLoading] = useState<boolean>(false)

	async function fuckAllLeads() {
		setLoading(true)
		await exportAllLeadsToExcel()
		setLoading(false)
	}

	return (
		<PrimaryButton
			loading={loading}
			className="mr-2 btn-download mt-[8px] w500:mt-0"
			iconClassName="m-0"
			type="button"
			icon="excel"
			background="purple"
			onClick={fuckAllLeads}
		>
			<div className="inline w500:hidden w750:inline w1000:hidden w1050:inline ml-[8px]">Xuất file</div>
		</PrimaryButton>
	)
}
