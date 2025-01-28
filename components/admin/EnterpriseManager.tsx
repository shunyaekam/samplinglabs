'use client'

import { useState } from 'react'

type Enterprise = {
  id: string
  name: string
  domain: string
  employeeCount: string
  status: 'ACTIVE' | 'INACTIVE'
}

export default function EnterpriseManager() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [newEnterprise, setNewEnterprise] = useState({
    name: '',
    domain: '',
    employeeCount: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/enterprises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnterprise)
      })
      if (response.ok) {
        setShowAddForm(false)
        // Refresh enterprises list
      }
    } catch (error) {
      console.error('Error adding enterprise:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Enterprise Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Enterprise
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Enterprise</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={newEnterprise.name}
                    onChange={(e) => setNewEnterprise({ ...newEnterprise, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={newEnterprise.domain}
                    onChange={(e) => setNewEnterprise({ ...newEnterprise, domain: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employee Count
                  </label>
                  <input
                    type="number"
                    value={newEnterprise.employeeCount}
                    onChange={(e) => setNewEnterprise({ ...newEnterprise, employeeCount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Enterprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ... existing table code ... */}
        </table>
      </div>
    </div>
  )
} 