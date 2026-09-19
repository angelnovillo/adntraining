# Plan de entrenamiento semanal

Web estática mobile-first para consultar un plan de gimnasio, ciclismo, carrera y recuperación desde el móvil.

## Estructura

```text
.
├── index.html      # Estructura de la aplicación
├── styles.css      # Diseño responsive y mobile-first
├── data.js         # Datos del plan: ejercicios, sesiones y recuperación
├── app.js          # Calendario, navegación y renderizado
└── README.md
```

## Publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `plan-entrenamiento`.
2. Sube los cuatro archivos de la raíz: `index.html`, `styles.css`, `data.js` y `app.js`.
3. En GitHub ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/(root)`; pulsa **Save**.
6. GitHub mostrará una URL similar a:

   ```text
   https://TU-USUARIO.github.io/plan-entrenamiento/
   ```

7. Abre esa URL en Safari desde el iPhone y usa **Compartir → Añadir a pantalla de inicio** para tenerla como una app.

## Personalizar el plan

- Edita `data.js` para cambiar sesiones, ejercicios, series, descansos, enlaces de vídeo y alternativas de máquina.
- Edita `styles.css` para modificar colores, tipografía o espaciados.
- No necesitas instalar Node, dependencias ni ejecutar un build: GitHub Pages lo sirve directamente.

## Nota de seguridad

El plan es orientativo. Ajusta asiento y rango de movimiento en cada máquina; si aparece dolor articular agudo, detén el ejercicio y consulta al personal cualificado del gimnasio.