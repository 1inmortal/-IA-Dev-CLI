# -IA-Dev-CLI
# 🚀 Immortal IA Dev CLI: Tu Aliado en el Desarrollo Asistido por IA 🧙‍♂️

![Banner Immortan IA Dev](https://via.placeholder.com/800x150/5F46A9/FFFFFF?text=IMMORTAL+IA+DEV+CLI+-+YOUR+AI-POWERED+ASSISTANT) 
*(Nota: Puedes reemplazar la URL de la imagen placeholder con una real si creas un banner).*

## 🌟 Visión General

¿Cansado de la configuración manual, las dependencias complejas y el temido "boilerplate" en cada nuevo proyecto? ¡Immortal IA Dev CLI ha llegado para transformarte en un verdadero **Inmortal Developer**! Este asistente inteligente te permite, directamente desde tu terminal, orquestar la creación de proyectos modernos con un toque mágico de Inteligencia Artificial.

Desde la generación automática de estructuras de carpetas hasta la instalación de dependencias, la creación de archivos base e incluso la autocompletación de código y configuraciones vía Gemini, este CLI está diseñado para maximizar tu productividad y hacer que la fase inicial de desarrollo sea un proceso fluido y sin esfuerzo.

## ✨ Características Estelares

-   **🪄 Menú de Control RPG:** Navega por un intuitivo menú estilo consola con opciones numéricas, haciendo la creación de proyectos una experiencia interactiva y divertida.
-   **📦 Proyectos Instantáneos:** Genera la estructura de carpetas necesaria para los tipos de proyecto más comunes:
    -   🌐 **Web Básico:** HTML, CSS, JavaScript Vanilla.
    -   ⚡ **Servidor Node.js con Express:** Backend robusto y listo para usar.
    -   ⚛️ **App React + Vite:** Frontend moderno con configuración ultra-rápida.
-   **🧠 IA en Acción (Gemini Integrado):**
    -   **Generación Inteligente:** Describe tu proyecto en lenguaje natural y deja que Gemini estructure directorios, genere archivos clave (`package.json`, `.js`, `.html`, `.css`, `README.md`, `Dockerfile`, etc.) y proponga código inicial relevante.
    -   **Autocompletado y Sugerencias:** Asistencia en tiempo real para configuraciones complejas o contenido boilerplate.
-   **⚙️ Automatización Milimétrica:**
    -   Instalación automática de paquetes (`npm install`).
    -   Inicialización de repositorios Git.
    -   Creación dinámica de READMEs, Dockerfiles y otros archivos de configuración.
    -   Capacidad para levantar servidores de desarrollo post-creación.
-   **🛠️ Gestión de Tareas (Próximamente):** Un panel de control por consola para ver y ejecutar tareas comunes del proyecto (ejecutar linters, tests, levantar dev servers, etc.)

## 🚀 Inicio Rápido

Sigue estos pasos para poner en marcha tu asistente Immortal IA Dev CLI:

### 1. Requisitos Previos

Asegúrate de tener instalado:
-   **Node.js** (versión 14.x o superior recomendada)
-   **npm** (viene con Node.js)
-   Una **API Key de Gemini** (o GPT), fundamental para el funcionamiento de la IA. Puedes obtener la tuya en [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Instalación

1.  **Clona o descarga este repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/immortal-ia-dev-cli.git # Reemplaza con la URL de tu repo si lo subes
    cd immortal-ia-dev-cli
    ```
    *(Si no usas Git, simplemente crea los archivos y carpetas como se indicó en la sección de "Estructura de Carpetas").*

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

### 3. Configuración de la API Key

1.  Crea un archivo llamado `.env` en la raíz de tu proyecto (`immortal-ia-dev-cli/`).
2.  Dentro de `.env`, añade tu clave de API de Gemini de esta forma:
    ```
    GOOGLE_API_KEY="TU_API_KEY_DE_GEMINI_AQUI"
    ```
    **¡Importante!** No compartas tu API Key y asegúrate de que `.env` esté listado en tu `.gitignore`.

### 4. Ejecución del Asistente

Ahora estás listo para lanzar tu Immortal IA Dev CLI:

```bash
npm start
Use code with caution.
Markdown
O si prefieres ejecutar directamente el archivo principal:
node src/index.js
Use code with caution.
Bash
🎯 Ejemplos de Uso
Una vez ejecutado, el CLI te presentará un menú interactivo:
========= [ MENÚ DE INMORTAL IA DEV ] =========
1. Crear Proyecto Web Básico (HTML/CSS/JS)
2. Crear Servidor Node.js con Express
3. Crear App con React + Vite
4. Generar Proyecto desde Pregunta IA 🤖
5. Instalar Paquetes Manualmente
6. Salir
==============================================
Elige una opción: █
Use code with caution.
🤖 Generando un Proyecto con IA (Opción 4)
Selecciona la opción 4 y el CLI te pedirá una descripción de tu proyecto:
🧠 Modo Generación con IA (Gemini) 🤖
Describe el tipo de proyecto que quieres crear.
Ej: "Una aplicación de lista de tareas con React en el frontend y Node.js con Express en el backend y una base de datos MongoDB."
O: "Un landing page simple para una pizzería, con HTML, CSS, y JavaScript, y un formulario de contacto funcional."

? Describe tu proyecto: _Una aplicación de chat en tiempo real con sockets.io, un frontend simple con HTML/CSS/JS y un backend Node.js._
? ¿Cómo quieres que se llame tu proyecto? _chat-app_
Use code with caution.
La IA procesará tu solicitud, creará la estructura de carpetas, los archivos de código (index.js, public/index.html, package.json), configurará las dependencias y te proporcionará las instrucciones para levantar el proyecto. ¡Es como tener un compañero de pair programming siempre disponible!
🤝 Contribuciones
¡Tu creatividad es bienvenida! Este proyecto está en constante evolución. Si tienes ideas para nuevas características, mejoras en los prompts de la IA, o quieres añadir más tipos de proyectos y plantillas, no dudes en:
Abrir un Issue para sugerencias o reportar errores.
Crear un Pull Request con tus contribuciones.
Juntos podemos hacer de "Immortal IA Dev CLI" una herramienta indispensable para la comunidad de desarrolladores.
📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.