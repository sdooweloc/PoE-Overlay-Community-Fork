import { exec } from 'child_process'
import { Rectangle } from 'electron'
import { addon, windowManager } from 'node-window-manager'
import activeWin from 'active-win'

export interface Window {
  processId: number
  path: string
  title: () => string
  bounds: () => Rectangle
  bringToTop: any
}

// macos only - probably not needed for now
windowManager.requestAccessibility()

function focusPoE(id: number): void {
  console.log('Bringing to top : ' + id)
  exec("wmctrl -i -a " + id,  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  })
}

export async function getActiveWindow(): Promise<Window> {
  try {
    let active: any
    let processId: number
    let path: string
    let bounds: () => Rectangle
    let title: () => string
    let bringToTop: any
    const isLinux = process.platform !== ('win32' || 'darwin')

    if (isLinux) {
      active = await activeWin()

      if (!active) {
        return undefined
      }

      processId = active.owner.processId
      path = active.owner.path
      bounds = () => active.bounds
      title = () => active.title
      bringToTop = () => focusPoE(active.id)
    } else {
      active = windowManager.getActiveWindow()

      if (!active) {
        return undefined
      }

      processId = active.processId
      path = active.path
      bounds = () => addon.getWindowBounds(active.id)
      title = () => active.getTitle()
      bringToTop = () => active.bringToTop()
    }

    return {
      processId,
      path,
      bounds,
      title,
      bringToTop,
    }
  } catch (error) {
    console.warn('Could not get active window.', error)
    return undefined
  }
}
