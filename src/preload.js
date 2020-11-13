// Preload (Isolated World)
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('externalApi', {
    loadProfilesFromSystem: async () => {
        return ipcRenderer.invoke('loadProfilesFromSystem');
    },
    open(link) {
        shell.openExternal(link);
    },
});
