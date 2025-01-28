'use client'

import { useState, useEffect } from 'react'

export default function EnterpriseManagement() {
  const [admins, setAdmins] = useState([])
  const [inviteEmail, setInviteEmail] = useState('')

  const inviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/enterprise/invite-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      })
      setInviteEmail('')
      // Refresh admin list
    } catch (error) {
      console.error('Failed to invite admin:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Enterprise Management</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Invite Admin</h2>
        <form onSubmit={inviteAdmin} className="flex gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="input-field flex-1"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Send Invite
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Admins</h2>
        <div className="space-y-4">
          {admins.map((admin: any) => (
            <div key={admin.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{admin.firstName} {admin.lastName}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
              <button className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 