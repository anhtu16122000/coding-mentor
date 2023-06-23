import * as XLSX from 'xlsx'
import moment from 'moment'
import { userInformationApi } from '~/api/user'

const getAllUsers = async () => {
	let thisData = []
	try {
		const response = await userInformationApi.getAll({ PageSize: 999999, PageIndex: 1, sort: 1, sortType: true })
		if (response.status == 200) {
			thisData = response.data.data
		}
	} catch (error) {
		console.error(error)
	} finally {
		return thisData
	}
}

export const exportAllStudentToExcel = async () => {
	let wb = XLSX.utils.book_new()
	var ws = XLSX.utils.json_to_sheet([], {})

	const allUsers = await getAllUsers()

	let temp = []

	for (let i = 0; i < allUsers.length; i++) {
		const element = allUsers[i]
		const thisUser = {
			stt: i + 1 > 9 ? (i + 1).toString() : '0' + (i + 1), // Ra dạng 01 , 02 ...
			id: element?.UserCode,
			name: element?.FullName,
			username: element?.UserName,
			mail: element?.Email,
			phone: element?.Mobile,
			sex: element?.Gender == 2 ? 'Nữ' : element?.Gender == 1 ? 'Nam' : '',
			birthdate: element?.DOB ? moment(element?.DOB).format('DD/MM/YYYY') : '',
			status: element?.LearningStatusName,
			SaleName: element?.SaleName
		}
		temp.push(thisUser)
	}

	// Get content inner excel file
	function getItem() {
		return {
			A: 'STT',
			B: 'Mã',
			C: 'Tên',
			D: 'Tên đăng nhập',
			E: 'Email',
			F: 'Điện thoại',
			G: 'Giới tính',
			H: 'Ngày sinh',
			I: 'Trạng thái',
			J: 'Tư vấn viên'
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
					const columnWidth = (row[key].toString().length + 2) * 1.2 // Adjust the factor as needed
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
		const cols = widths.map((width) => ({ width: width > 10 ? width : 10 }))
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
