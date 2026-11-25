import { app, Menu, nativeImage, Tray } from 'electron'

import { getMainWindow } from './window.js'

let tray: Tray | null = null

function createTrayIcon() {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#4268c9"/>
            <circle cx="16" cy="16" r="10" fill="none" stroke="#ffffff" stroke-width="2"/>
            <path d="M16 9 V16 L21 19" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `

    return nativeImage.createFromDataURL(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    )
}

function showMainWindow(): void {
    const window = getMainWindow()

    if (!window || window.isDestroyed()) {
        return
    }

    if (window.isMinimized()) {
        window.restore()
    }

    window.show()
    window.focus()
}

export function createTray(): void {
    if (tray) {
        return
    }

    tray = new Tray(createTrayIcon())

    tray.setToolTip('Project Manager')

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Project Manager',
            click: showMainWindow
        },
        {
            type: 'separator'
        },
        {
            label: 'Sair',
            click: () => app.quit()
        }
    ])

    tray.setContextMenu(contextMenu)

    tray.on('click', showMainWindow)
    tray.on('double-click', showMainWindow)
}
