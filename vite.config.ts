import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vue3-oop/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx({ enableObjectSlots: false })],
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
	},
})
