import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'

interface ReportPoint {
  reportId: string
  damageType: string
  severity: string
  status: string
  latitude: number
  longitude: number
  createdAt: string
}

const statusColors: Record<string, string> = {
  new: '#dc2626',
  under_review: '#d97706',
  assigned: '#2563eb',
  resolved: '#16a34a',
}

export default function ReportMap({ reports }: { reports: ReportPoint[] }) {
  return (
    <MapContainer
      center={[9.082, 8.6753]}
      zoom={6}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((r) => (
        <CircleMarker
          key={r.reportId}
          center={[r.latitude, r.longitude]}
          radius={10}
          pathOptions={{
            fillColor: statusColors[r.status] || '#666',
            fillOpacity: 0.9,
            color: '#fff',
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm min-w-[160px]">
              <p className="font-bold text-blue-900 mb-1">{r.reportId}</p>
              <p className="capitalize text-gray-700">{r.damageType.replace(/_/g, ' ')}</p>
              <p className="text-gray-500 text-xs">{r.status.replace(/_/g, ' ')}</p>
              <Link href={`/admin/reports/${r.reportId}`} className="text-blue-600 text-xs underline mt-2 inline-block">
                View report →
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
