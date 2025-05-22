require('dotenv').config(); // Cargar variables de entorno al inicio

const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ora = require('ora'); // Para el spinner de carga

const {
    logSuccess,
    logError,
    logInfo,
    logWarn,
    runCommand,
    createDirectory,
    createFile,
    copyTemplate
} = require('./utils');

// Configuración de la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// --- Funciones de creación de proyectos ---

async function createWebBasicProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    logInfo(`Creando proyecto web básico en: ${projectPath}`);
    createDirectory(projectPath);
    copyTemplate(path.join(__dirname, 'templates', 'web-basic'), projectPath, projectName);

    logInfo('Proyecto web básico generado.');
    logInfo(`Para verlo, navega a '${projectName}' y usa un servidor estático (ej: 'npx http-server').`);

    const { confirmInstallHttpServer } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmInstallHttpServer',
            message: `¿Deseas instalar 'http-server' localmente y levantar el servidor para ${projectName}?`,
            default: true,
        },
    ]);

    if (confirmInstallHttpServer) {
        try {
            await runCommand('npm init -y', projectPath); // Inicializar package.json si no existe
            await runCommand('npm install http-server', projectPath);
            await runCommand('npx http-server', projectPath);
            logSuccess('Servidor HTTP levantado en tu proyecto web básico.');
        } catch (error) {
            logError('No se pudo levantar el servidor HTTP. Asegúrate de tener Node.js y npm instalados.');
        }
    }
}

async function createNodeExpressProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    logInfo(`Creando proyecto Node.js con Express en: ${projectPath}`);
    createDirectory(projectPath);

    // Plantilla básica para Node/Express
    const packageJsonContent = {
        name: projectName,
        version: "1.0.0",
        description: "Servidor Express generado por Immortal IA Dev CLI",
        main: "src/index.js",
        scripts: {
            start: "node src/index.js",
            dev: "nodemon src/index.js" // Requiere nodemon
        },
        keywords: [],
        author: "",
        license: "MIT",
        dependencies: {
            express: "^4.17.1"
        },
        devDependencies: {
            nodemon: "^2.0.7"
        }
    };

    createFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJsonContent, null, 2));
    createDirectory(path.join(projectPath, 'src'));
    createFile(path.join(projectPath, 'src', 'index.js'), `
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola desde el servidor Express de ${projectName}!');
});

app.listen(port, () => {
    console.log(\`Servidor ${projectName} escuchando en http://localhost:\${port}\`);
});
`);
    createFile(path.join(projectPath, 'README.md'), `# ${projectName} - Servidor Express
Este es un servidor Express básico generado por Immortal IA Dev CLI.

## Para empezar:
1.  Navega a la carpeta del proyecto: \`cd ${projectName}\`
2.  Instala las dependencias: \`npm install\`
3.  Inicia el servidor en modo desarrollo (requiere nodemon): \`npm run dev\`
4.  O inicia el servidor en modo producción: \`npm start\`
`);

    const { installDeps } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'installDeps',
            message: '¿Deseas instalar las dependencias (express, nodemon)?',
            default: true,
        },
    ]);

    if (installDeps) {
        await runCommand('npm install', projectPath);
        await runCommand('npm install nodemon -D', projectPath);
    }

    logSuccess(`Proyecto Node.js con Express '${projectName}' creado.`);
    logInfo(`Para iniciar el servidor, ve a '${projectName}' y ejecuta: 'npm run dev' (o 'npm start').`);
}

async function createReactViteApp(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    logInfo(`Creando aplicación React con Vite en: ${projectPath}`);

    const { useTs } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'useTs',
            message: '¿Quieres usar TypeScript (en lugar de JavaScript)?',
            default: false,
        },
    ]);

    const template = useTs ? 'react-ts' : 'react';

    try {
        logInfo(`Ejecutando: npm create vite@latest ${projectName} -- --template ${template}`);
        // `create-vite` creará la carpeta del proyecto por sí mismo
        await runCommand(`npm create vite@latest ${projectName} -- --template ${template}`);

        logSuccess(`Aplicación React con Vite '${projectName}' creada.`);
        logInfo(`Para iniciarla, navega a '${projectName}' y ejecuta: 'npm install' y luego 'npm run dev'.`);

        const { installDepsAndRun } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'installDepsAndRun',
                message: '¿Deseas instalar las dependencias y levantar el servidor de desarrollo ahora?',
                default: true,
            },
        ]);

        if (installDepsAndRun) {
            await runCommand('npm install', projectPath);
            await runCommand('npm run dev', projectPath);
            logInfo('Servidor de desarrollo React Vite iniciado. Abre tu navegador en la URL indicada.');
        }
    } catch (error) {
        logError(`Error al crear la aplicación React con Vite: ${error.message}`);
    }
}

// --- Lógica de Integración con IA (Gemini) ---

async function generateProjectWithAI() {
    logInfo(chalk.magenta.bold('🧠 Modo Generación con IA (Gemini) 🤖'));
    logInfo(chalk.magenta('Describe el tipo de proyecto que quieres crear.'));
    logInfo(chalk.magenta('Ej: "Una aplicación de lista de tareas con React en el frontend y Node.js con Express en el backend y una base de datos MongoDB."'));
    logInfo(chalk.magenta('O: "Un landing page simple para una pizzería, con HTML, CSS, y JavaScript, y un formulario de contacto funcional."'));

    const { projectDescription } = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectDescription',
            message: 'Describe tu proyecto:',
            validate: input => input.length > 10 || 'Por favor, describe tu proyecto con más detalle.'
        }
    ]);

    const { projectName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '¿Cómo quieres que se llame tu proyecto?',
            validate: input => /^[a-z0-9-]+$/.test(input) || 'El nombre del proyecto solo puede contener letras minúsculas, números y guiones.'
        }
    ]);

    const projectPath = path.join(process.cwd(), projectName);
    createDirectory(projectPath);

    const spinner = ora(chalk.cyan('Consultando a Gemini para generar la estructura y código... esto puede tardar un momento.')).start();

    try {
        const prompt = `
        Eres un asistente de desarrollo IA. Tu tarea es generar la estructura de un proyecto y código inicial basado en la descripción del usuario.
        Quiero que generes un proyecto con la siguiente descripción: "${projectDescription}".
        El nombre del proyecto es "${projectName}".

        Tu respuesta DEBE ser un objeto JSON parseable.
        El objeto JSON debe contener las siguientes propiedades:
        - \`name\`: (string) El nombre del proyecto.
        - \`description\`: (string) Una breve descripción generada del proyecto.
        - \`technologies\`: (array de strings) Las tecnologías principales a usar.
        - \`fileStructure\`: (array de objetos) Una lista de archivos y su contenido. Cada objeto debe tener:
            - \`path\`: (string) La ruta del archivo (ej. "src/index.js", "public/index.html", "package.json").
            - \`content\`: (string) El contenido del archivo (código, texto, JSON).
        - \`packageJsonScripts\`: (objeto) Opcional. Los scripts de 'npm' para el package.json (ej. "start": "node src/index.js").
        - \`dependencies\`: (array de strings) Opcional. Los paquetes npm necesarios para la sección 'dependencies'.
        - \`devDependencies\`: (array de strings) Opcional. Los paquetes npm necesarios para la sección 'devDependencies'.
        - \`readmeContent\`: (string) Opcional. El contenido Markdown para el archivo README.md.
        - \`dockerfileContent\`: (string) Opcional. El contenido del Dockerfile.
        - \`instructions\`: (array de strings) Opcional. Pasos para que el usuario inicie el proyecto.

        Asegúrate de que todo el contenido del código esté dentro de las propiedades \`content\`.
        Para archivos JSON como package.json, proporciona el JSON serializado como una string dentro de \`content\`.
        Evita cualquier texto adicional fuera del JSON. Si no puedes generar algo, déjalo vacío o en blanco.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extraer el JSON de la respuesta (puede venir con markdown ```json ... ```)
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        let projectData;
        if (jsonMatch && jsonMatch[1]) {
            projectData = JSON.parse(jsonMatch[1]);
        } else {
            projectData = JSON.parse(text); // Si no hay markdown, intenta parsear directamente
        }

        spinner.succeed(chalk.green('Gemini ha generado la estructura del proyecto.'));
        logInfo('Creando archivos y directorios...');

        // Crear package.json si hay dependencias o scripts
        if (projectData.dependencies || projectData.devDependencies || projectData.packageJsonScripts) {
            const initialPackageJson = {
                name: projectData.name,
                version: "1.0.0",
                description: projectData.description,
                main: "index.js", // Default, la IA puede sobrescribir con una ruta específica
                scripts: projectData.packageJsonScripts || {},
                dependencies: {},
                devDependencies: {}
            };

            // Asegurarse de que las dependencias estén en un objeto
            if (projectData.dependencies && Array.isArray(projectData.dependencies)) {
                projectData.dependencies.forEach(dep => initialPackageJson.dependencies[dep] = '*'); // Usar '*' como versión por defecto
            }
            if (projectData.devDependencies && Array.isArray(projectData.devDependencies)) {
                projectData.devDependencies.forEach(dep => initialPackageJson.devDependencies[dep] = '*');
            }

            createFile(path.join(projectPath, 'package.json'), JSON.stringify(initialPackageJson, null, 2));
            logInfo('Creando package.json (o placeholder para la IA).');
        }


        // Crear archivos y directorios según la estructura generada por la IA
        if (projectData.fileStructure && Array.isArray(projectData.fileStructure)) {
            for (const file of projectData.fileStructure) {
                const filePath = path.join(projectPath, file.path);
                createDirectory(path.dirname(filePath)); // Asegura que el directorio exista
                createFile(filePath, file.content || '');
            }
        } else {
            logWarn('La IA no proporcionó una estructura de archivos detallada.');
        }

        // Crear README.md
        if (projectData.readmeContent) {
            createFile(path.join(projectPath, 'README.md'), projectData.readmeContent);
        }

        // Crear Dockerfile
        if (projectData.dockerfileContent) {
            createFile(path.join(projectPath, 'Dockerfile'), projectData.dockerfileContent);
        }

        logSuccess(`Proyecto '${projectName}' generado por IA exitosamente.`);

        // Preguntar si quiere instalar dependencias
        if (projectData.dependencies || projectData.devDependencies) {
            const { installDeps } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'installDeps',
                    message: '¿Deseas instalar las dependencias generadas por la IA (npm install)?',
                    default: true,
                },
            ]);
            if (installDeps) {
                await runCommand('npm install', projectPath);
            }
        }

        logInfo('\n--- Próximos pasos sugeridos por Gemini ---');
        if (projectData.instructions && Array.isArray(projectData.instructions) && projectData.instructions.length > 0) {
            projectData.instructions.forEach((instruction, i) => console.log(chalk.green(`  ${i + 1}. ${instruction}`)));
        } else {
            logWarn('La IA no proporcionó instrucciones específicas.');
            logInfo(`1. Ve a tu nuevo proyecto: cd ${projectName}`);
            logInfo('2. Revisa los archivos creados.');
            logInfo('3. Si generó package.json, ejecuta npm install.');
            logInfo('4. Intenta ejecutar scripts si se definieron (ej. npm start o npm run dev).');
        }

    } catch (error) {
        spinner.fail(chalk.red('Error al comunicarse con Gemini o al procesar la respuesta.'));
        logError(`Mensaje de error: ${error.message}`);
        logError('Asegúrate de que tu GOOGLE_API_KEY en .env sea correcta y tenga permisos.');
        logError('También es posible que la respuesta de la IA no haya sido el JSON esperado. Inténtalo de nuevo con una descripción más clara.');
    }
}


// --- Otras opciones del menú ---

async function installPackagesManually() {
    const { packages } = await inquirer.prompt([
        {
            type: 'input',
            name: 'packages',
            message: 'Ingresa los paquetes que deseas instalar (separados por espacio, ej: express react axios):',
            validate: input => input.trim().length > 0 || 'Por favor, ingresa al menos un paquete.'
        }
    ]);
    const { devDep } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'devDep',
            message: '¿Son dependencias de desarrollo (--save-dev)?',
            default: false
        }
    ]);

    const installCommand = `npm install ${packages} ${devDep ? '--save-dev' : ''}`;
    try {
        await runCommand(installCommand);
        logSuccess(`Paquetes instalados: ${packages}`);
    } catch (error) {
        logError(`Error al instalar paquetes: ${error.message}`);
    }
}

async function displayMainHeader() {
    console.clear();
    const header = figlet.textSync('Immortal IA Dev', {
        horizontalLayout: 'full',
        font: 'Mini'
    });

    console.log(
        boxen(
            chalk.cyanBright(header) +
            chalk.white('\n\n        Tu asistente de desarrollo potenciado por IA 🧙‍♂️'), 
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'magenta',
                textAlign: 'center'
            }
        )
    );
}

// --- Menú principal ---

async function mainMenu() {
    await displayMainHeader();

    const questions = [
        {
            type: 'list',
            name: 'choice',
            message: '¿Qué necesitas hacer hoy?',
            choices: [
                { name: '1. Crear Proyecto Web Básico (HTML/CSS/JS)', value: 'web_basic' },
                { name: '2. Crear Servidor Node.js con Express', value: 'node_express' },
                { name: '3. Crear App con React + Vite', value: 'react_vite' },
                { name: '4. Generar Proyecto desde Pregunta IA 🤖', value: 'ai_driven' },
                new inquirer.Separator(),
                { name: '5. Instalar Paquetes Manualmente', value: 'install_manual' },
                { name: '6. Salir', value: 'exit' }
            ]
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Ingresa el nombre del proyecto:',
            when: (answers) => ['web_basic', 'node_express', 'react_vite'].includes(answers.choice),
            validate: input => {
                if (!input) return 'El nombre del proyecto no puede estar vacío.';
                if (!/^[a-z0-9-]+$/.test(input)) return 'El nombre del proyecto solo puede contener letras minúsculas, números y guiones.';
                return true;
            }
        }
    ];

    const answers = await inquirer.prompt(questions);

    switch (answers.choice) {
        case 'web_basic':
            await createWebBasicProject(answers.projectName);
            break;
        case 'node_express':
            await createNodeExpressProject(answers.projectName);
            break;
        case 'react_vite':
            await createReactViteApp(answers.projectName);
            break;
        case 'ai_driven':
            await generateProjectWithAI();
            break;
        case 'install_manual':
            await installPackagesManually();
            break;
        case 'exit':
            logInfo('¡Adiós! Que la IA te acompañe. 👋');
            process.exit(0);
        default:
            logError('Opción no válida. Inténtalo de nuevo.');
            break;
    }

    // Regresar al menú principal después de cada acción
    const { goBack } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'goBack',
            message: '¿Volver al menú principal?',
            default: true,
        }
    ]);

    if (goBack) {
        await mainMenu();
    } else {
        logInfo('¡Adiós! Que la IA te acompañe. 👋');
        process.exit(0);
    }
}

// Iniciar el menú
mainMenu().catch(error => {
    logError(`Se produjo un error crítico: ${error.message}`);
    process.exit(1);
}); 