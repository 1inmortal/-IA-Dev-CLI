const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const ora = require('ora');

const logSuccess = (message) => console.log(chalk.green(`✅ ${message}`));
const logError = (message) => console.error(chalk.red(`❌ ${message}`));
const logInfo = (message) => console.log(chalk.blue(`ℹ️ ${message}`));
const logWarn = (message) => console.log(chalk.yellow(`⚠️ ${message}`));

// Función para ejecutar comandos en la terminal
const runCommand = (command, cwd = process.cwd()) => {
    return new Promise((resolve, reject) => {
        const spinner = ora(chalk.cyan(`Ejecutando: ${command}`)).start();
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                spinner.fail(chalk.red(`Error al ejecutar: ${command}`));
                console.error(chalk.red(stderr));
                return reject(error);
            }
            spinner.succeed(chalk.green(`Comando ejecutado: ${command}`));
            console.log(chalk.gray(stdout));
            resolve(stdout);
        });
    });
};

// Función para crear un directorio
const createDirectory = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            logSuccess(`Directorio creado: ${dirPath}`);
        } else {
            logWarn(`El directorio ya existe: ${dirPath}`);
        }
    } catch (error) {
        logError(`Error al crear directorio ${dirPath}: ${error.message}`);
        throw error;
    }
};

// Función para crear un archivo con contenido
const createFile = (filePath, content = '') => {
    try {
        fs.writeFileSync(filePath, content);
        logSuccess(`Archivo creado: ${filePath}`);
    } catch (error) {
        logError(`Error al crear archivo ${filePath}: ${error.message}`);
        throw error;
    }
};

// Función para copiar archivos o directorios de una plantilla
const copyTemplate = (templatePath, targetPath, projectName) => {
    if (!fs.existsSync(templatePath)) {
        logError(`Plantilla no encontrada: ${templatePath}`);
        return;
    }

    createDirectory(targetPath); // Asegura que la carpeta destino exista

    const files = fs.readdirSync(templatePath);

    files.forEach(file => {
        const sourcePath = path.join(templatePath, file);
        const destPath = path.join(targetPath, file);
        const stats = fs.statSync(sourcePath);

        if (stats.isFile()) {
            let content = fs.readFileSync(sourcePath, 'utf8');
            // Reemplazar marcador de posición de nombre de proyecto si existe
            content = content.replace(/\{PROJECT_NAME\}/g, projectName);
            fs.writeFileSync(destPath, content);
            logSuccess(`Copiado: ${file}`);
        } else if (stats.isDirectory()) {
            copyTemplate(sourcePath, destPath, projectName); // Recursivo para subdirectorios
        }
    });
};

module.exports = {
    logSuccess,
    logError,
    logInfo,
    logWarn,
    runCommand,
    createDirectory,
    createFile,
    copyTemplate
}; 