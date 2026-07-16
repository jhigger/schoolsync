import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Power, Settings2, Router } from 'lucide-react'

const ROOMS_DATA = [
  {
    id: 'room-1',
    name: 'Living Room',
    devices: [
      { id: 'dev-1', name: 'Smart TV', type: 'Entertainment', status: 'Online', icon: Power },
      { id: 'dev-2', name: 'Air Conditioner', type: 'Climate', status: 'Offline', icon: Power },
      { id: 'dev-3', name: 'Main Lights', type: 'Lighting', status: 'Online', icon: Power },
    ],
  },
  {
    id: 'room-2',
    name: 'Kitchen',
    devices: [
      { id: 'dev-4', name: 'Refrigerator', type: 'Appliance', status: 'Online', icon: Power },
      { id: 'dev-5', name: 'Smart Oven', type: 'Appliance', status: 'Offline', icon: Power },
    ],
  },
  {
    id: 'room-3',
    name: 'Master Bedroom',
    devices: [
      { id: 'dev-6', name: 'Ceiling Fan', type: 'Climate', status: 'Online', icon: Power },
      { id: 'dev-7', name: 'Bedside Lamp', type: 'Lighting', status: 'Online', icon: Power },
      { id: 'dev-8', name: 'Air Purifier', type: 'Climate', status: 'Online', icon: Power },
    ],
  },
]

export function DevicesRoute() {
  return (
    <div className="flex flex-col gap-8 p-6 bg-slate-50/50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rooms & Devices</h1>
        <p className="text-muted-foreground mt-2">Manage your smart devices across different rooms.</p>
      </div>

      <div className="flex flex-col gap-10">
        {ROOMS_DATA.map((room) => (
          <section key={room.id} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Router className="w-5 h-5 text-slate-500" />
              <h2 className="text-xl font-semibold text-slate-800">{room.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {room.devices.map((device) => (
                <Card key={device.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold leading-none">{device.name}</CardTitle>
                        <CardDescription className="text-sm">{device.type}</CardDescription>
                      </div>
                      <Badge variant={device.status === 'Online' ? 'default' : 'secondary'} className="rounded-full shadow-sm">
                        {device.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    {/* Add device specific metrics or info here in future */}
                  </CardContent>
                  <CardFooter className="pt-0 justify-end gap-2 border-t bg-muted/20 p-3">
                    <Button variant="outline" size="sm" className="h-8 shadow-sm">
                      <Settings2 className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                    <Button 
                      variant={device.status === 'Online' ? 'destructive' : 'default'} 
                      size="sm"
                      className="h-8 shadow-sm"
                    >
                      <Power className="w-4 h-4 mr-1" />
                      {device.status === 'Online' ? 'Turn Off' : 'Turn On'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
