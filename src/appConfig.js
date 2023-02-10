const appConfigs = {
	appName: 'Mona LMS',
	primaryColor: '#004aad',
	secondColor: '#eaede8',
	oneSignalKey: process.env.NEXT_PUBLIC_ONE_SIGNAL,
	hostURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
	linkDownloadExcel: process.env.NEXT_PUBLIC_API_ENDPOINT + '/Upload/Mau/MauThemHocVien.xlsx'
}

export default appConfigs
