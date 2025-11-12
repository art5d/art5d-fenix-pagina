art5d-fenix-pagina

Página de Ventas y Certificación ART5D 🖼️ Galería Digital Profesional del Artista

Versión: 1.0.0
Estado del Proyecto: Activo y en Mantenimiento

📝 Descripción del Proyecto

Este repositorio contiene la estructura principal y la documentación para la Galería Digital del Artista. El objetivo es ofrecer una plataforma de alto rendimiento y visualmente atractiva para la exhibición de obras de arte, bocetos y colecciones certificadas, usando Firebase para la gestión de contenido en tiempo real.

✨ Características Principales

Portafolio Dinámico: Vista de galería interactiva con filtrado por colección, estilo o fecha (implementado con Firestore).

Certificación Digital: Mecanismo para validar la autenticidad de las obras y los Bocetos IA Certificados.

Diseño Responsivo: Visualización óptima en dispositivos móviles, tabletas y escritorio.

Gestión en Tiempo Real: Uso de Firestore para la administración y publicación instantánea de contenido.

🚀 Instalación y Configuración (Para Desarrolladores)

Sigue estos pasos para levantar el entorno local:

Clonar el Repositorio:

git clone [URL_DEL_REPOSITORIO] 
cd art5d-fenix-pagina


Instalar dependencias: Asegúrate de tener Node.js instalado.

npm install


Configuración de variables de entorno: Crea un archivo .env en el directorio raíz y configura las credenciales necesarias (Firebase, claves API, etc.).

Ejemplo de .env

FIREBASE_API_KEY="TU_CLAVE_API_FIREBASE"
DB_URL="URL_DE_TU_BASE_DE_DATOS_FIREBASE"
# ... otras variables


Ejecutar la aplicación:

npm run start


La aplicación se iniciará en http://localhost:3000.

🛠️ Uso y Despliegue

Gestión de contenido

El contenido de la galería se administra principalmente a través de la consola de administración conectada a Firestore.

Carga de obras: Utiliza el panel de administración para subir nuevas imágenes y rellenar los metadatos (título, técnica, dimensiones, año).

Actualización de catálogos: Las colecciones se pueden modificar desde la sección "Ajustes de galería" en el panel.

🔑 Planes de Contenido y Actualizaciones

A. PACK GOLD (Actualización de contenido - [2025-10-09])

El PACK GOLD corresponde a la publicación de un conjunto premium de imágenes en la galería. La configuración de este paquete en la base de datos debe adherirse al siguiente formato:

Categoría

Cantidad

Requisitos de Certificación

Imágenes Propias del Artista

10

Alta Resolución (mín. 4K)

Bocetos IA Certificados por ART5D

5

Requiere hash de certificación

Total de Imágenes en la Galería

15



Nota Importante: Asegúrate de que los textos de exhibición estén corregidos y muestren esta composición total de 15 imágenes.

B. Actualización Avanzada (Formato y Ventana - [2025-11-07])

La función de "Actualización Avanzada" (advancedUpdate) no se ejecuta desde el panel principal. El nuevo formato y flujo de esta función debe registrarse y gestionarse directamente a través de:

Ubicación de la Función: Se encuentra disponible en una ventana de consola diferente dentro de la herramienta de implementación (probablemente en Cloud Functions o un entorno similar).

Ejecución: Debes usar la Consola de Google Cloud para invocar esta función con los parámetros de registro específicos.

🤝 Contribución

Agradecemos cualquier contribución para mejorar la galería. Por favor, lee CONTRIBUTING.md para conocer el proceso de envío de solicitudes de extracción.

📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE.md para obtener más detalles.
