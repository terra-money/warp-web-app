import * as path from "path";
import * as fs from "fs";
import * as child_process from "child_process";

type Dep = {
  path: string;
  name: string;
};

type RepoConfig = {
  deps: Dep[];
  output: string;
};

const getConfig = (): RepoConfig => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson["generate-dts"];
};

const generateDtsFiles = (repos: Dep[]) => {
  repos.forEach(({ path: repoPath }) => {
    const fullPath = path.resolve(process.cwd(), repoPath);
    try {
      child_process.execSync("yarn generate-dts", { cwd: fullPath });
    } catch (err) {
      // ignore error
    }
  });
};

const copyDtsToOutput = (repos: Dep[], outputDir: string) => {
  repos.forEach(({ path: repoPath, name }) => {
    const fullPath = path.resolve(process.cwd(), repoPath);
    const dtsFilePath = path.join(fullPath, "types.d.ts");
    if (fs.existsSync(dtsFilePath)) {
      const outputFilePath = path.join(
        outputDir,
        `${name.replace(/[@\/.-]/g, "_")}.txt`
      );
      fs.copyFileSync(dtsFilePath, outputFilePath);
    } else {
      console.error(`types.d.ts not found in ${fullPath}`);
    }
  });
};

const generateDependenciesExportFile = (repos: Dep[], outputDir: string) => {
  const imports = repos
    .map(({ name }) => {
      const safeName = name.replace(/[@\/.-]/g, "_"); // Normalize the module name to create valid identifiers
      const txtFileName = `${safeName}.txt`; // Name of the .txt file containing the types
      return `import ${safeName} from './${txtFileName}';`; // Static import for type definitions
    })
    .join("\n");

  const dependencies = repos
    .map(({ name }) => {
      const safeName = name.replace(/[@\/.-]/g, "_"); // Normalize again for consistency
      return `{ libName: '${name}', import: import('${name}'), typeDefs: ${safeName} as string, safeName: '${safeName}'}`;
    })
    .join(",\n  ");

  // Combine imports and dependencies into one file content
  const outputFileContent = `
${imports}

export const dependencies = [
  ${dependencies}
];
  `;

  fs.writeFileSync(path.join(outputDir, "dependencies.ts"), outputFileContent);
};

const clearOutputDir = (outputDir: string) => {
  try {
    fs.rmSync(outputDir, { recursive: true });
  } catch (error) {
    // Consume error if folder doesn't exist
  }
  fs.mkdirSync(outputDir, { recursive: true });
};

const formatOutputDir = (outputDir: string) => {
  setTimeout(() => {
    child_process.exec(`prettier --write ${outputDir}`);
  }, 500);
};

const main = () => {
  const config = getConfig();
  if (!config.deps || !config.output) {
    console.error(
      'Configuration for "generate-dts" is missing or incomplete in package.json.'
    );
    process.exit(1);
  }

  const outputDir = path.resolve(process.cwd(), config.output);
  clearOutputDir(outputDir); // Clear or create the output directory

  generateDtsFiles(config.deps);
  copyDtsToOutput(config.deps, outputDir);
  generateDependenciesExportFile(config.deps, outputDir);
  formatOutputDir(outputDir);
};

main();
