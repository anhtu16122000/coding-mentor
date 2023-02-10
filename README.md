## MONA LMS v2.2 🐶 🐹 🐰

<img src="https://img.shields.io/badge/mona--lms-v2.0-4CAF50"/> <img src="https://img.shields.io/badge/react-18.2.0-%23EC407A"/> <img src="https://img.shields.io/badge/next-12.2.2-orange"/> <img src="https://img.shields.io/badge/antd-4.21.6-42A5F5"/>

### Người mới vui lòng đọc hết và xem kĩ các lưu ý 🐥

## Cài đặt nè ⚙️

Clone source:

```sh
git clone https://github.com/hoanglong151/lms-v.2.2.git
```

Cài thư viện:

```sh
yarn install
```

Chạy dự án:

```sh
yarn dev
```

Xuất dự án ( static ):

```sh
yarn export
```

## Lưu ý 🗯

- Dự án này chạy bằng hình thức [Static Html Export](https://nextjs.org/docs/advanced-features/static-html-export) nên khi được yêu cầu xuất file thì chạy lệnh trên sau đó nén thư mục "out" và đưa file nén đó cho phía Back-End.
- Dự án này vẫn có thể build server bình thường.
- Khi tạo page mới thì nhớ "export default" do cơ chế của Nextjs nó bắt vậy.
- Tạo page mới có thể code trong page hoặc tạo components rồi import vào.
- Code xong phần nào nhớ test thật kĩ trước khi next ( lỗi ngu phạt 5 xị ).

## Style guide 😜 :

- Không quá khắc khe nhưng ổn nhất thì nên áp dụng style của Airbnb: [React Style Guide](https://airbnb.io/javascript/react/) hoặc [Javascript Style Guide](https://github.com/airbnb/javascript)
- Ps: Chaudepzaivailoz

## Lấy thông tin của tài khoản đang đăng nhập 🙎 :

```tsx
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

// ...
const user = useSelector((state: RootState) => state.user.information)
```

## Tạo thông báo 🆘 :

```tsx
import { ShowNoti } from '~/common/utils'

//...
ShowNoti('success', 'Bạn đã được lên lương')

//...
ShowNoti('warning', 'Bạn sắp bị đuổi')

//...
ShowNoti('error', 'Bạn đã bị đuổi')
```

## Sử dụng [Dynamic Routes (slug)](https://nextjs.org/docs/routing/dynamic-routes) cho Static HTML Export

- Thay vì đặt tên file là "[slug].tsx" mà hãy đặt là "index.tsx"
- Thay vì viết như này

```tsx
router.push({
	pathname: '/course/video-course/detail/[slug]',
	query: { slug: Id }
})
```

- Thì hãy viết như này

```javascript
router.push({
	pathname: '/course/video-course/detail',
	query: { slug: Id }
})
```

- Static files không thể hiểu được [slug] nên nếu cố viết theo cách đó sẽ bị lỗi khi reload lại trang.

- Xem thêm tại: [Nextjs Document @Châu đại đế](https://nextjs.org/docs/advanced-features/static-html-export)

## Cấu trúc dự án 🪓

```markdown
├ public
│ ├─── icons ⇾ lưu các icon png, svg
│ └─── images ⇾ lưu các ảnh sử dụng trong hệ thống (logo, background...)
│
├ src
│ ├ api ⇾ lưu các api
│ │ ├─ example ⇾ mẫu cách gọi 1 api (GET, POST, PUT, DELETE)
│ │ ├─ types ⇾ các khai báo types cho api
│ │ └─ instance.ts ⇾ file config axios (coi thôi đừng sửa)
│ │
│ ├ common
│ │ ├─ components ⇾ các componets sử dụng trong dự án
│ │ │ ├─ MainLayout ⇾ components Layout của dự án
│ │ │ └─ Primary ⇾ các components tái sử dụng nhiều lần (Button, Table...)
│ │ │
│ │ ├─ libs ⇾ lưu các biến static trong này cho dễ tái sử dụng
│ │ │
│ │ ├─ types ⇾ thư mục khai báo types
│ │ │
│ │ └─ utils ⇾ thư mục lưu các hàm hay sử dụng (ShowNoti...)
│ │
│ ├ pages ⇾ lưu các page của hệ thống
│ │
│ ├ services ⇾ lưu các api được gọi trước khi đăng nhập (không có token)
│ │
│ ├ store ⇾ thư mục khởi tạo và lưu reducer của redux
│ │
│ ├ styles ⇾ thư mục lưu các custom css (sass)
│ │
│ ├ appConfig.js ⇾ file cấu hình hệ thống
│ │
├ .env ⇾ file chứa các biến môi trường (kêu người nắm source đưa)
│ ├ NEXTAUTH_URL ⇾ root link
│ ├ NEXT_PUBLIC_API_ENDPOINT ⇾ api link
│ └ NEXT_PUBLIC_ONE_SIGNAL ⇾ key thông báo (push notification)
│
└ tailwind.config.js ⇾ file config "Tailwind"
```

## Bộ đề & Bài tập 📚

### Danh sách loại bài tập (sau này các loại mà không chạy chém Minh):

- MultipleChoice = 1 ✅
- DragDrop = 2
- FillInTheBlank = 3
- Mindmap = 4
- TrueOrFalse = 5 ✅
- Sort = 6
- Write = 7 ✅
- Speak = 8

Có thể sử dụng theo cách sau để đồng bộ

```tsx
// Created by Châu đại đế
import { QUESTION_TYPES } from '~/common/libs'

// QUESTION_TYPES là 1 file JSON chứa số tương ứng các loại bài tập
// VD: { MultipleChoice: 1, DragDrop: 2, FillInTheBlank: 3 }
console.log('- Question Types: ', QUESTION_TYPES)
```

## Liên hệ ☎️

- Mọi vấn đề liên hệ: [Châu đại đế](https://t.me/baochau9xx)

## Donate: 💰

- Momo: 0775712017

## Keyword

- lms, monamedia, elearning, fica
