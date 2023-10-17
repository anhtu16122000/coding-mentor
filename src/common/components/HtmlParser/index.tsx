import ReactHtmlParser from 'react-html-parser'

const htmlParser = (htmlString?: string) => {
	if (!htmlString) return ''

	function removeContentEditable(text) {
		// Sử dụng regex để loại bỏ các đoạn văn bản có contenteditable="true"
		var regex = /contenteditable="true"/gi
		var result = text.replace(regex, '')
		return result
	}

	return ReactHtmlParser(removeContentEditable(htmlString))
}

export default htmlParser
