import React from 'react'
import { MainLayout } from '~/common'
import LibraryDocumentPage from '~/common/components/Library/LibraryPage'

export interface ILibraryDocumentProps {}

export default function LibraryDocument(props: ILibraryDocumentProps) {
	return (
		<>
			<LibraryDocumentPage />
		</>
	)
}
LibraryDocument.Layout = MainLayout
