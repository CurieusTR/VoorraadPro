import { Boxes } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Boxes className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
          VoorraadPro
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Professioneel voorraadbeheer
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  )
}
