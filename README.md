ART5D 

Este repositorio contiene el código fuente de la plataforma ART5D, migrado a una arquitectura estática (Single Page Application) para máxima velocidad y fiabilidad, eliminando las dependencias pesadas de visores 3D (P2VR, Three.js).

🚀 Inicio Rápido y Despliegue

La aplicación se alimenta de la data en tiempo real desde Firebase Firestore y se despliega automáticamente a Netlify tras cada merge a la rama principal (main).

1. Requisitos

Node.js (versión recomendada)

npm o yarn

Credenciales de Firebase configuradas como variables de entorno.

2. Ejecución Local (Desarrollo)

Para trabajar en el código de la galería:

Instalar dependencias:

npm install
# o
yarn install


Ejecutar la aplicación (Modo Desarrollo):

npm run dev
# o
yarn dev


La aplicación se iniciará en un puerto local dinámico, generalmente http://localhost:5173.

3. Despliegue (Producción)

El despliegue es completamente automatizado a través de Netlify, enlazado a tu repositorio de GitHub.

Etapa

Plataforma

Rama de Origen

URL de Acceso

Producción

Netlify

main (o la rama principal)

art5d.cl

Desarrollo

Netlify

Ramas de preview

art5d.netlify.app (Subdominios de preview)

🛠️ Gestión de Contenido y Sincronización

La gestión de contenido y la lógica de certificación se simplifican y se centralizan:

1. Gestión de Contenido (Firebase Firestore)

Todas las obras se gestionan directamente en la consola de Firebase Firestore.

Ubicación de Data: Firestore Database > /artifacts/{appId}/public/data/obras

Estructura de Datos: Cada documento debe contener la data limpia y necesaria (título, artista, imageUrl, status, type).

Lógica del PACK GOLD (Validación): La lógica de la aplicación valida los límites: 10 Obras Propias Certificadas + 5 Bocetos IA Certificados por artista.

2. Sincronización y Certificación (App Script / Cloud)

Las funciones complejas de validación y certificación se manejan en back-end mediante:

Google App Script (ART5D_Sincronizador_Total): Para la automatización de flujos de trabajo con hojas de cálculo y Firebase.

Google Cloud Console: Para la función de Actualización Avanzada (tareas más robustas).

🚨 Notas de Auditoría

Archivos Obsoletos (Limpieza P2VR): Se eliminó más de 1.2 GB de assets (/pano, /scenes, componentes 3D).

Depuración de Datos: Se recomienda revisar y limpiar los campos obsoletos de P2VR en la colección obras de Firestore (ver el Checklist de Limpieza anterior).
