import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const root = process.cwd()

export default defineConfig({
    main: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(root, 'src/main/index.ts')
                }
            }
        }
    },

    preload: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(root, 'src/preload/index.ts')
                }
            }
        }
    },

    renderer: {
        root: resolve(root, 'src/renderer'),
        plugins: [react()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(root, 'src/renderer/index.html')
                }
            }
        }
    }
})
