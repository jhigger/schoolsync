import { useStore } from '../store'
import { addActivityLogEvent } from './mockData'
import { useQueryClient } from '@tanstack/react-query'

export function useITNotification() {
  const updateSessionActivity = useStore(state => state.updateSessionActivity)
  const queryClient = useQueryClient()

  const notifyIT = (deviceName: string | null, taskId: string | null, logMessage: string, locationChip: string) => {
    if (deviceName) {
      updateSessionActivity('notifiedDevices', (prev: string[]) => [...prev, deviceName])
    }
    if (taskId) {
      updateSessionActivity('handledTasks', (prev: string[]) => [...prev, taskId])
    }
    // Hardcoded cross-component linkage as requested by existing logic
    if (deviceName === 'Front printer' && !taskId) {
      updateSessionActivity('handledTasks', (prev: string[]) => [...prev, 'task-1'])
    }
    if (taskId === 'task-1' && !deviceName) {
      updateSessionActivity('notifiedDevices', (prev: string[]) => [...prev, 'Front printer'])
    }

    addActivityLogEvent({
      category: 'normal',
      text: logMessage,
      locationChip,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: 'Medium'
    })
    queryClient.invalidateQueries({ queryKey: ['activityLogData'] })
  }

  const undoNotifyIT = (deviceName: string | null, taskId: string | null) => {
    if (deviceName) {
      updateSessionActivity('notifiedDevices', (prev: string[]) => prev.filter(x => x !== deviceName))
    }
    if (taskId) {
      updateSessionActivity('handledTasks', (prev: string[]) => prev.filter(x => x !== taskId))
    }
    if (deviceName === 'Front printer' && !taskId) {
      updateSessionActivity('handledTasks', (prev: string[]) => prev.filter(x => x !== 'task-1'))
    }
    if (taskId === 'task-1' && !deviceName) {
      updateSessionActivity('notifiedDevices', (prev: string[]) => prev.filter(x => x !== 'Front printer'))
    }
  }

  return { notifyIT, undoNotifyIT }
}
