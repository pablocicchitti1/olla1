# Olla — Prototipo

App solidaria que conecta donantes con comedores comunitarios de CABA.

## Cómo correr localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Deploy en Vercel

1. Subí este repo a GitHub
2. Conectá en vercel.com → Import project
3. Vercel detecta Vite automáticamente → Deploy

## Deploy en StackBlitz

1. Abrí stackblitz.com/new/vite-react
2. Reemplazá el contenido de `src/App.jsx` con el de este proyecto
3. Compartí la URL que genera

## Reset del onboarding

En Mi Perfil hay un botón "Reiniciar app" para volver a ver el onboarding desde cero (útil para testear).

## Estado persistente

El prototipo guarda en localStorage:
- `olla_comedor` — comedor elegido
- `olla_screen` — última pantalla visitada  
- `olla_ob` — preferencias del onboarding

Al reabrir la app, el usuario vuelve a donde estaba.
