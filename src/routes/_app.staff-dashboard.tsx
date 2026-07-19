import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageContainer } from '../components/PageContainer'
import { enforceRoleAccess } from '../lib/auth'
import { useStore } from '../store'
import type { LogbookConfig, LogbookField } from '../store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Plus, Trash2, Save } from 'lucide-react'

export const Route = createFileRoute('/_app/staff-dashboard')({
  beforeLoad: () => enforceRoleAccess(['Admin', 'Staff']),
  component: StaffDashboardComponent,
})

const PRESET_FIELDS: Omit<LogbookField, 'id'>[] = [
  { type: 'text', label: 'Student Name', required: true, isPreset: true },
  { type: 'date', label: 'Date and Time', required: true, isPreset: true },
  { type: 'text', label: 'Location', required: false, isPreset: true },
]

function StaffDashboardComponent() {
  const addLogbook = useStore((state) => state.addLogbook)
  
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    fields: [] as LogbookField[]
  })
  
  const addField = (fieldData: Partial<LogbookField>) => {
    setDraft(prev => ({
      ...prev,
      fields: [...prev.fields, { ...fieldData, id: crypto.randomUUID() } as LogbookField]
    }))
  }
  
  const handleAddPreset = (preset: Omit<LogbookField, 'id'>) => addField(preset)
  const handleAddCustom = () => addField({ type: 'text', label: 'Custom text field', required: false })
  
  const handleRemoveField = (id: string) => {
    setDraft(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }))
  }
  
  const handleUpdateField = (id: string, updates: Partial<LogbookField>) => {
    setDraft(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }))
  }
  
  const handleSave = () => {
    if (!draft.title.trim()) {
      alert('Please enter a logbook title')
      return
    }
    
    if (draft.fields.length === 0) {
      alert('Please add at least one field')
      return
    }
    
    const newLogbook: LogbookConfig = {
      id: crypto.randomUUID(),
      title: draft.title,
      description: draft.description,
      fields: draft.fields,
      createdAt: new Date().toISOString()
    }
    
    addLogbook(newLogbook)
    setDraft({ title: '', description: '', fields: [] })
    alert('Logbook saved successfully!')
  }

  return (
    <PageContainer className="gap-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage and create logbooks for the school.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Logbook Builder</CardTitle>
            <CardDescription>Create a new logbook configuration.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Logbook Title</Label>
                <Input 
                  id="title" 
                  value={draft.title} 
                  onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))} 
                  placeholder="e.g. Incident Report" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={draft.description} 
                  onChange={(e) => setDraft(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="What is this logbook for?" 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Logbook Fields</Label>
              {draft.fields.length === 0 ? (
                <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg text-center">
                  No fields added yet. Choose from the options below.
                </div>
              ) : (
                <div className="space-y-3">
                  {draft.fields.map((field) => (
                    <Card key={field.id} className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                              {field.type}
                            </span>
                            {field.isPreset && (
                              <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                PRESET
                              </span>
                            )}
                          </div>
                          <Input 
                            value={field.label} 
                            onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                            className="font-medium"
                          />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input 
                              type="checkbox" 
                              checked={field.required}
                              onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                              className="rounded border-input"
                            />
                            Required
                          </label>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveField(field.id)} className="text-destructive h-8 px-2">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <Label>Add Preset Fields</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_FIELDS.map((preset, idx) => (
                  <Button key={idx} variant="outline" size="sm" onClick={() => handleAddPreset(preset)}>
                    <Plus className="w-4 h-4 mr-1" />
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <Label>Add Custom Fields</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddCustom()}>
                  <Plus className="w-4 h-4 mr-1" /> Text
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t mt-auto">
            <Button className="w-full" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Logbook
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  )
}
