// i have to install vite plugin packge 
import { defineConfig } from 'vite'
import react from '@vitejs/p;ugin-react'
import pluginRewitALL from 'vite-plugin-rewrite-all'


export default defineConfig({
    plugins: [react(), pluginRewitALL],
})