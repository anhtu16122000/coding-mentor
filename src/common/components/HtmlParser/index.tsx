import ReactHtmlParser from 'react-html-parser'

const htmlParser = (htmlString?: string) => {
	if (!htmlString) return ''
	return ReactHtmlParser(htmlString)
}

export default htmlParser
