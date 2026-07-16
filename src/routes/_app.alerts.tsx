import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/alerts')({
  component: AlertsComponent,
})

function AlertsComponent() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Alerts</h2>
        <p className="text-gray-500 mt-2">Placeholder for alerts content.</p>
      </div>
    </div>
  )
}
