// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('externalApi', {
    loadProfilesFromSystem: async () => {
        return ipcRenderer.invoke('loadProfilesFromSystem');
    },
});
