import { contextBridge, ipcRenderer } from 'electron'

// renderer 프로세스에 안전하게 노출할 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  platform: process.platform
})
