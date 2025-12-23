import ReportForm from '@/components/ReportForm'
import Disclaimer from '@/components/Disclaimer'

export const dynamic = 'force-dynamic'

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Сообщить о мошеннике
            </h1>
            <p className="text-gray-600">
              Помогите другим пользователям избежать мошенничества
            </p>
          </div>

          <Disclaimer />

          <div className="bg-white rounded-lg shadow-md p-6">
            <ReportForm />
          </div>
        </div>
      </div>
    </div>
  )
}


