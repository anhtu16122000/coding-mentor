import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import UserAdmin from '~/common/components/UserAdmin'
import { AiOutlineBug } from "react-icons/ai";

const UserAdminPage = () => (
	<>
		<UserAdmin />
        
		<div className="my-2 bg-tw-white md:bg-tw-secondary max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl">
			<div className="md:flex">
				<div className="md:shrink-0">
					<img className="h-48 w-full object-cover md:h-full md:w-48" src="/images/logo.png" alt="Man looking at item at a store" />
				</div>
				<div className="p-8">
					<div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</div>
					<a href="#" className="block mt-1 text-lg leading-tight font-medium text-tw-secondary hover:underline">
						Finding customers for your new business
						{<AiOutlineBug/>}
					</a>
					<p className="mt-2 text-tw-primary">
						Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.
					</p>
				</div>
			</div>
		</div>
	</>
)

UserAdminPage.Layout = MainLayout

export default UserAdminPage
