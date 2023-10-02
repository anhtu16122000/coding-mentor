import { Modal } from 'antd'
import PrimaryButton from '~/common/components/Primary/Button'

export const templateCertificate = (background, backside, content) => {
	return `
			<style>
				body {
					line-height:1;
					width: 100%;
					height: auto;
				 	top: 0;
					display: flex;
				 	flex-direction: column;
					margin: auto;
					font-size:14px;
 					}
				h1 {
					display: block;
		   			margin-block-start: 0;
					margin-block-end: 0;
					margin-inline-start: 0px;
					margin-inline-end: 0px;
					font-weight: bold;
				}
				p {
					display: block;
					margin-block-start: 0;
					margin-block-end: 0;
					margin-inline-start: 0px;
					margin-inline-end: 0px;
				}
				.contentPDF{
					background-image: url("${background}");
				    background-size: cover;
					background-repeat: no-repeat;
					width: 794px; 
					height: 1123px;
					word-wrap: break-word;
					line-height: 1;
				    display: block;
					padding:0;
				}
				.content{
					padding:0;
					width: 100%;
					height: auto;
				 	top: 0;
					display: flex;
				 	flex-direction: column;
					margin: auto;
					font-size:14px;
					justify-content: flex-start;
				}
				strong {
					font-weight: bold;
					word-wrap: break-word;
				}
				img {
					overflow-clip-margin: content-box;
					overflow: clip;
				}
			</style>
		<div >
		<div class="contentPDF">
			${content}
		</div> 
		</div>
	 `
}

const ModalViewCertificateExam = ({ open, setOpen, background, content, backside }) => {
	return (
		<Modal
			title="Xem trước chứng chỉ"
			width={850}
			open={open}
			onCancel={() => setOpen(false)}
			bodyStyle={{ padding: '1rem', maxHeight: '800px', overflow: 'auto' }}
			footer={[
				<PrimaryButton type="button" icon="cancel" onClick={() => setOpen(false)} background="red">
					Đóng
				</PrimaryButton>
			]}
		>
			<div
				className="overflow-auto d-flex justify-center items-center"
				contentEditable="false"
				dangerouslySetInnerHTML={{ __html: templateCertificate(background, backside, content) }}
			/>
		</Modal>
	)
}

export default ModalViewCertificateExam
