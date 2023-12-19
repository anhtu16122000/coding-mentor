import { Col, Empty, Modal, Row } from 'antd'
import { useEffect, useState } from 'react'
import { GiTrophyCup } from 'react-icons/gi'
import { IoDiamondSharp } from 'react-icons/io5'
import { packageSkillApi } from '~/api/packed/packages-skill'
import { ShowNostis } from '~/common/utils'
import findRankl from '~/common/components/json/findRankl.json'
import Lottie from 'react-lottie-player'
interface Rank {
	Id: number
	StudentId: number
	StudentName: string
	StudentThumbnail: string
	MyPoint: number
	TimeSpent: number
	Rank: number
}

function Ratings({ SkillsId }) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const [ranks, setRanks] = useState<Rank[]>([])
	const [myRanks, setMyRanks] = useState<Rank>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		if (isModalOpen) {
			getPreview()
		}
	}, [isModalOpen])

	const getPreview = async () => {
		setIsLoading(true)
		try {
			const res: any = await packageSkillApi.getRank(SkillsId)
			if (res.status == 200) {
				setRanks(res.data?.data?.Items)
				setMyRanks(res.data?.data?.MyRank)
			} else {
				setRanks([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<button
				onClick={() => {
					setIsModalOpen(true)
				}}
				className="text-[#fff] flex items-center justify-center rounded-[4px] mr-[8px] cursor-pointer bg-[#b02896] hover:bg-[#a4228c] !px-[8px] !h-[26px]"
			>
				Xếp hạng
			</button>
			<Modal title="Bảng xếp hạng" width={900} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={<div></div>}>
				<div className="flex items-center w-full justify-center">
					<div className="flex items-center justify-center h-[250px] w-[250px] pt-[50px]">
						<div className="flex flex-col items-center justify-center h-[220px] w-[220px] bg-[#f77f00] rounded-md">
							{!!ranks[1] ? (
								<>
									<div className="font-bold flex flex-col items-center">
										<img className="h-[80px] w-[90px] rounded-[16px] mb-[9px]" src={ranks[1].StudentThumbnail} />
										{ranks[1].StudentName}
									</div>
									<div className="text-[14px] h-[35px] w-[35px] bg-tw-white rounded-md flex items-center justify-center mt-2">
										<GiTrophyCup />
									</div>
									<div className="flex items-center justify-center text-[16px] font-bold text-[#212121] mt-3">
										<IoDiamondSharp className="!text-[14px] mr-[2px]" />
										{ranks[1].MyPoint}
									</div>
								</>
							) : (
								<Empty
									description=""
									image={
										<div className="flex w-full justify-center">
											<Lottie loop animationData={findRankl} play style={{ width: 120, height: 120 }} />
										</div>
									}
								/>
							)}
						</div>
					</div>
					<div className="flex flex-col rounded-md items-center justify-center h-[250px] w-[250px] bg-[#3f37c9]">
						{!!ranks[0] ? (
							<>
								<div className="font-bold text-[#fff] flex flex-col items-center">
									<img className="h-[100px] w-[100px] rounded-[16px] mb-[8px]" src={ranks[0].StudentThumbnail} />
									{ranks[0].StudentName}
								</div>
								<div className="h-[40px] w-[40px] bg-tw-yellow rounded-md flex items-center justify-center mt-2 text-[20px]">
									<GiTrophyCup />
								</div>
								<div className="flex items-center justify-center text-[16px] font-bold text-[#212121] mt-4">
									<IoDiamondSharp className="!text-[14px] mr-[2px]" />
									{ranks[0].MyPoint}
								</div>
							</>
						) : (
							<Empty
								description=""
								image={
									<div className="flex w-full justify-center">
										<Lottie loop animationData={findRankl} play style={{ width: 120, height: 120 }} />
									</div>
								}
							/>
						)}
					</div>

					<div className="flex items-center justify-center h-[250px] w-[250px] ">
						<div className="flex  flex-col rounded-md items-center justify-center h-[200px] w-[200px] bg-[#74c69d]">
							{!!ranks[2] ? (
								<>
									<div className="font-bold flex flex-col items-center">
										<img className="h-[80px] w-[80px] rounded-[16px] mb-[8px]" src={ranks[2].StudentThumbnail} />
										{ranks[2].StudentName}
									</div>
									<div className="h-[30px] w-[30px] bg-tw-orange rounded-md flex items-center justify-center mt-2">
										<GiTrophyCup />
									</div>
									<div className="flex items-center justify-center text-[16px] font-bold text-[#212121] mt-2">
										<IoDiamondSharp className="!text-[14px] mr-[2px]" />
										{ranks[2].MyPoint}
									</div>
								</>
							) : (
								<Empty
									description=""
									image={
										<div className="flex w-full justify-center">
											<Lottie loop animationData={findRankl} play style={{ width: 120, height: 120 }} />
										</div>
									}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="flex w-full items-center justify-center mt-[24px]">
					{myRanks && (
						<div className="flex items-center bg-[#c64fff] text-[#fff] p-[4px] pl-[8px] pr-[8px] rounded-[6px]">
							<div className="flex items-center mr-[4px]">
								Bạn có
								<div className="mr-[4px] ml-[4px] font-bold">
									<IoDiamondSharp className="!text-[14px] text-[#ffd166] mr-[2px]" />
									{myRanks.MyPoint}
								</div>
								và xếp hạng {myRanks.Rank}
							</div>
							-<div className="ml-[4px]"> {myRanks.Rank === 1 ? 'Kỹ năng vô đối' : 'Tiếp tục cố gắn hơn'}</div>
						</div>
					)}
				</div>
				<div className="w-full p-[8px] mt-[16px]">
					<Row gutter={[16, 8]}>
						<Col span={24} className="flex items-center">
							<Col span={4}>
								<div className="text-[14px] font-bold text-[#212121]">Xếp hạng</div>
							</Col>
							<Col span={12}>
								<div className="text-[14px] font-bold text-[#212121]">Học viên</div>
							</Col>
							<Col span={6}>
								<div className="text-[14px] font-bold text-[#212121]">Số điểm đạt được</div>
							</Col>
						</Col>
						{!!ranks[3] ? (
							ranks.slice(3).map((_item) => (
								<Col span={24} className="flex items-center bg-tw-disable pt-[4px] pb-[4px] rounded-md">
									<Col span={4}>
										<div className="flex items-center justify-center bg-tw-blue rounded-md text-tw-white font-bold w-[48px] pt-[8px] pb-[8px]">
											{_item.Rank}
										</div>
									</Col>
									<Col span={12}>
										<div className="font-bold flex items-center">
											<img className="h-[40px] w-[40px] rounded-[50%] mr-[4px]" src={_item.StudentThumbnail} />
											{_item.StudentName}
										</div>
									</Col>
									<Col span={6}>
										<div>{_item.MyPoint}</div>
									</Col>
								</Col> 
							))
						) : (
							<Col span={24} className="flex items-center bg-tw-disable pt-[4px] pb-[4px] rounded-md">
								<Col span={4}>
									<div className="flex items-center justify-center bg-tw-blue rounded-md text-tw-white font-bold w-[48px] pt-[8px] pb-[8px]">
										-
									</div>
								</Col>
								<Col span={12}>
									<div className="font-bold flex items-center">
										<div className="h-[40px] w-[40px] rounded-[50%] mr-[4px] bg-[#fff]" />
										------ --- ----- ----
									</div>
								</Col>
								<Col span={6}>
									<div>-</div>
								</Col>
							</Col>
						)}
					</Row>
				</div>
			</Modal>
		</>
	)
}

export default Ratings
