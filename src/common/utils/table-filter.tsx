import { SearchOutlined } from '@ant-design/icons'
import { Input, Select, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import PrimaryButton from '../components/Primary/Button'
import { AiFillFilter } from 'react-icons/ai'

const { Option } = Select

type IFilterTable = {
	type: 'search' | 'selection'
	dataIndex: string
	handleSearch?: Function
	handleReset?: Function
	listFilter?: Array<{ value: any; title: string }>
	mode?: 'multiple' | 'tags'
	defaultValue?: any
}

const FilterTable = (props: IFilterTable) => {
	const { type, handleSearch, handleReset, dataIndex, listFilter, mode, defaultValue } = props
	const [isVisible, setIsVisible] = useState(false)
	const [valueSearch, setValueSearch] = useState<any>(null)
	const inputRef = useRef<any>(null)

	const getValueSearch = (value) => {
		setValueSearch(value)
	}

	useEffect(() => {
		getValueSearch(defaultValue)
	}, [defaultValue])

	const checkHandleSearch = (value) => {
		if (!handleSearch) return
		if (valueSearch == null) return

		switch (type) {
			case 'search':
				handleSearch(value, dataIndex)
				break
			case 'selection':
				handleSearch(value, dataIndex)
				break
			default:
				break
		}

		getValueSearch(null)
		setIsVisible(false)
	}

	const checkHandleReset = () => {
		if (!handleReset) return
		handleReset()
		getValueSearch(null)
		setIsVisible(false)
	}

	const checkType = () => {
		let fControl
		switch (type) {
			case 'search':
				fControl = (
					<Input
						className="primary-input"
						ref={inputRef}
						value={valueSearch}
						placeholder="Tìm kiếm"
						onPressEnter={(e) => checkHandleSearch(valueSearch)}
						onChange={(e) => getValueSearch(e.target.value)}
						style={{ width: '100%' }}
					/>
				)
				break
			case 'selection':
				fControl = (
					<Select
						ref={inputRef}
						mode={mode}
						value={valueSearch}
						onChange={(value) => getValueSearch(value)}
						placeholder="Lọc"
						optionFilterProp="children"
						showSearch={true}
						className={`primary-input`}
						style={{ width: '100%' }}
					>
						{listFilter.map((o, idx) => (
							<Option key={idx} value={o.value}>
								{o.title}
							</Option>
						))}
					</Select>
				)
				break
			default:
				break
		}
		return fControl
	}

	useEffect(() => {
		if (isVisible) {
			setTimeout(() => {
				inputRef.current?.select?.()
			}, 100)
		}
	}, [isVisible])

	const getColumnSearchProps = (dataIndex) => {
		return {
			filterDropdown: () => (
				<div style={{ display: 'inline-flex', flexDirection: 'column', padding: 5 }}>
					{checkType()}
					<Space style={{ marginTop: 5 }}>
						<PrimaryButton className="button-filter-table" type="button" background="yellow" onClick={checkHandleReset}>
							Xóa bộ lọc
						</PrimaryButton>
						<PrimaryButton
							className="button-filter-table"
							type="button"
							background="primary"
							onClick={() => checkHandleSearch(valueSearch)}
						>
							Tìm kiếm
						</PrimaryButton>
					</Space>
				</div>
			),
			filterDropdownVisible: isVisible,
			filterIcon: (filtered) => (type == 'search' ? <SearchOutlined /> : <AiFillFilter />),
			onFilterDropdownVisibleChange: (visible) => {
				visible ? setIsVisible(true) : setIsVisible(false)
			}
		}
	}

	return getColumnSearchProps(dataIndex)
}

export default FilterTable
