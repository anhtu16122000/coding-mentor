const appConfigs = {
  appName: 'Coding Mentor',
  appVersion: 'v3.0',
  primaryColor: '#004aad',
  secondColor: '#eaede8',
  oneSignalKey: process.env.NEXT_PUBLIC_ONE_SIGNAL,
  hostURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  linkDownloadExcel: process.env.NEXT_PUBLIC_API_ENDPOINT + `/Upload/Mau/MauThemHocVien.xlsx`,
  linkDownloadExcelCustomer: process.env.NEXT_PUBLIC_API_ENDPOINT + `/Upload/Mau/MauThemKhachHang.xlsx`
}

export default appConfigs
