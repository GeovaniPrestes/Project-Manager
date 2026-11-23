
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const root = process.cwd()
const desktopSrc = resolve(root, 'apps/desktop/src')

const sharedAlias = {
    '@project-manager/shared': resolve(
        root,
        'packages/shared/src/index.ts'
    )
}

export default defineConfig({
    main: {
        resolve: {
            alias: sharedAlias
        },
        build: {
            externalizeDeps: {
                exclude: ['@project-manager/shared']
            },
            rollupOptions: {
                input: {
                    index: resolve(desktopSrc, 'main/index.ts')
                }
            }
        }
    },

    preload: {
        resolve: {
            alias: sharedAlias
        },
        build: {
            externalizeDeps: {
                exclude: ['@project-manager/shared']
            },
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
        resolve: {
            alias: sharedAlias
        },
        build: {
            rollupOptions: {
                input: {
                    index: resolve(desktopSrc, 'renderer/index.html')
                }
            }
        }
    }
})
