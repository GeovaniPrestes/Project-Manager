
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const root = process.cwd()
const desktopSrc = resolve(root, 'apps/desktop/src')

export default defineConfig({
    main: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(desktopSrc, 'main/index.ts')
                }
            }
        }
    },

    preload: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(desktopSrc, 'preload/index.ts')
                }
            }
        }
    },

    renderer: {
        root: resolve(desktopSrc, 'renderer'),
        plugins: [react()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(desktopSrc, 'renderer/index.html')
                }
            }
        }
    }
})
