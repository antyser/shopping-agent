import React from 'react'
import { Button } from '../Shared/Button'
import { Icon } from '../Shared/Icon'
import { useAuth } from '../../state/AuthProvider'

function UserActions() {
	const { logout } = useAuth()
	// TODO: Implement profile dropdown/modal logic

	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
				<Icon name="Bell" size={20} />
			</Button>
			<Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
				<Icon name="User" size={20} />
			</Button>
			{/* Example Logout - Consider moving to a dropdown */}
			<Button 
				variant="ghost" 
				size="icon" 
				className="text-gray-600 hover:bg-gray-100"
				onClick={logout}
				title="Logout"
			>
				<Icon name="MoreHorizontal" size={20} />
			</Button>
		</div>
	)
}

export default UserActions 