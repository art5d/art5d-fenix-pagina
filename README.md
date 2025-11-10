# art5d-fenix-pagina
Pagina de Ventas y Certificación ART5D
🖼️ Galería Digital Profesional del Artista

Versión: 1.0.0
Estado del Proyecto: Activo y en Mantenimiento

📝 Descripción del Proyecto

Este repositorio contiene la estructura principal y la documentación para la Galería Digital del Artista. El objetivo es ofrecer una plataforma de alto rendimiento y visualmente atractiva para la exhibición de obras de arte, bocetos y colecciones certificadas.

✨ Características Principales

Portafolio Dinámico: Vista de galería interactiva con filtrado por colección, estilo o fecha.

Certificación Digital: Mecanismo para validar la autenticidad de las obras y los Bocetos IA Certificados.

Diseño Responsivo: Visualización óptima en dispositivos móviles, tabletas y escritorio.

Acceso a la API: Puntos de conexión documentados para la gestión de contenido.

🚀 Instalación y Configuración (Para Desarrolladores)

Sigue estos pasos para levantar el entorno local:

Clonar el Repositorio:

git clone [URL_DEL_REPOSITORIO]
cd galeria-digital


Instalar Dependencias:
Asegúrate de tener Node.js instalado.

npm install


Configuración de Variables de Entorno: Crea un archivo .env en el directorio raíz y configura las credenciales necesarias (Firebase, API Keys, etc.).

# Ejemplo de .env
FIREBASE_API_KEY="TU_CLAVE_API_FIREBASE"
DB_URL="URL_DE_TU_BASE_DE_DATOS"
# ... otras variables


Ejecutar la Aplicación:

npm run start


La aplicación se iniciará en http://localhost:3000.

🛠️ Uso y Despliegue

Gestión de Contenido

El contenido de la galería se administra principalmente a través de la consola de administración conectada a Firestore.

Carga de Obras: Utiliza el panel de administración para subir nuevas imágenes y rellenar los metadatos (título, técnica, dimensiones, año).

Actualización de Catálogos: Las colecciones se pueden modificar desde la sección "Ajustes de Galería" en el panel.

🔑  Planes de Contenido y Actualizaciones

A. PACK GOLD (Actualización de Contenido - [2025-10-09])

El PACK GOLD corresponde a la publicación de un set premium de imágenes en la galería. La configuración de este pack en la base de datos debe adherirse al siguiente formato:

Categoría

Cantidad

Requisitos de Certificación

Imágenes Propias del Artista

10

Alta Resolución (mín. 4K)

Bocetos IA Certificados por ART5D

5

Requiere hash de certificación

Total de Imágenes en Galería

15



Nota Importante: Asegúrate de que los textos de exhibición estén corregidos y muestren esta composición total de 15 imágenes.

B. Actualización Avanzada (Formato y Ventana - [2025-11-07])

La función de "Actualización Avanzada" (advancedUpdate) no se ejecuta desde el panel principal. El nuevo formato y flujo de esta función debe ser registrado y gestionado directamente a través de:

Ubicación de la Función: Se encuentra disponible en una ventana de consola diferente dentro de la herramienta de despliegue.

Ejecución: Debes usar la Google Cloud Console para invocar esta función con los parámetros de registro específicos.

🤝 Contribución

Agradecemos cualquier contribución para mejorar la galería. Por favor, lee CONTRIBUTING.md para conocer el proceso de envío de pull requests.

📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE.md para más detalles.
