import { Card, DatePicker, DatePickerProps, Skeleton, Empty } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { staticsticalApi } from '~/api/statistic'
import { _format, log } from '~/common/utils'
import { Chart } from 'react-google-charts'

const Top5DemandChart = () => {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState<boolean>(true)

	const [filters, setFilters] = useState({
		branchIds: '',
		year: moment().year()
	})

	useEffect(() => {
		getData()
	}, [filters])

	function getTopItems(list) {
		// Sắp xếp danh sách theo giá trị giảm dần
		list.sort(function (a, b) {
			return b.Value - a.Value
		})

		// Tính tổng Value của tất cả các phần tử
		var totalValue = list.reduce(function (sum, item) {
			return sum + item.Value
		}, 0)

		// Lấy 4 phần tử đầu tiên
		var topItems = list.slice(0, 4)

		// Tính phần trăm của từng phần tử trên tổng Value và gán vào thuộc tính "Percentage"
		topItems.forEach(function (item) {
			item.Percentage = ((item.Value / totalValue) * 100).toFixed(2)
		})

		// Tạo phần tử "Khác" với Value là tổng Value của các phần tử trừ 4 phần tử cao nhất
		var otherValue = 0
		for (var i = 4; i < list.length; i++) {
			otherValue += list[i].Value
		}

		topItems.push({ Name: 'Khác', Value: otherValue, Percentage: ((otherValue / totalValue) * 100).toFixed(2) })

		return formatDataToArrays(topItems)
	}

	function formatDataToArrays(data) {
		var result = []

		data.forEach(function (item) {
			result.push([item.Name, item.Value])
		})

		return result
	}

	const [isNull, setIsNull] = useState<boolean>(false)

	function checkAllZeros(array) {
		return array.every((value) => value?.Value == 0)
	}

	const getData = async () => {
		try {
			const res = await staticsticalApi.getTopLearningNeed(filters)
			if (res.status == 200) {
				setData(getTopItems(res.data.data))
				setIsNull(checkAllZeros(res.data.data))
			} else {
				setData([])
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const onChange: DatePickerProps['onChange'] = (value) => {
		setFilters((pre) => ({ ...pre, year: Number(moment(value).format('YYYY')) }))
	}

	return (
		<Card
			className="shadow-sm w3-animate-left"
			title={
				<div className="flex items-center justify-between w-full">
					<div className="font-[500] mt-[2px]">Biểu đồ top nhu cầu học</div>

					<div className="flex items-center none-selection">
						<DatePicker
							defaultValue={moment(new Date())}
							onChange={onChange}
							picker="year"
							allowClear={false}
							className="primary-input w-[100px]"
						/>
					</div>
				</div>
			}
		>
			<div id="top-5-demand" className="w-full fucking-chart h-[300px]">
				{!loading && !isNull && (
					<Chart
						chartType="PieChart"
						data={[['Task', 'Hours per Day'], ...data]}
						options={{
							title: '',
							is3D: true,
							chartArea: { width: '80%', height: '80%' },
							legend: { position: 'right', alignment: 'center' },
							tooltip: {
								// trigger: 'none'
							},
							animation: { startup: true, duration: 1000, easing: 'inAndOut' }
						}}
						width={'100%'}
						height={'100%'}
					/>
				)}
				{loading && !isNull && <Skeleton active />}
				{!loading && isNull && <Empty />}
			</div>
		</Card>
	)
}

export default Top5DemandChart
