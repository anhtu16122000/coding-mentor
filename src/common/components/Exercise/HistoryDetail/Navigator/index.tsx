import { List } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import SectionNavigator from './group'

const Navigator = () => {
	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	return (
		<>
			<div className="p-3 inner-testing-navigator scrollable">
				<List
					pagination={false}
					dataSource={sections}
					renderItem={(sectionItem, index) => (
						<List.Item key={`key-sec-${sectionItem.Id}`} className="w-full inline-flex flex-col">
							<SectionNavigator section={sectionItem} index={index} />
						</List.Item>
					)}
				/>
			</div>
		</>
	)
}

export default Navigator
