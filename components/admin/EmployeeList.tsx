interface Employee {
  id: number
  name: string
  completedCourses: number
  averageScore: number
}

export default function EmployeeList() {
  const employees: Employee[] = [
    { id: 1, name: 'John Doe', completedCourses: 8, averageScore: 92 },
    { id: 2, name: 'Jane Smith', completedCourses: 7, averageScore: 88 },
    { id: 3, name: 'Mike Johnson', completedCourses: 6, averageScore: 85 },
  ]

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <p className="font-medium">{employee.name}</p>
            <p className="text-sm text-gray-500">
              {employee.completedCourses} courses completed
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-indigo-600">
              {employee.averageScore}%
            </p>
            <p className="text-sm text-gray-500">avg. score</p>
          </div>
        </div>
      ))}
    </div>
  )
} 