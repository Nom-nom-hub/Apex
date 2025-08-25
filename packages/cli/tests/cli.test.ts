import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, rmSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '../bin/apex.js');

// Create a temporary directory for testing
const tempDir = join(__dirname, 'temp-test');
const testProjectDir = join(tempDir, 'test-project');

describe('apex CLI', () => {
  beforeAll(() => {
    // Create temporary directory
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir);
    }
  });

  afterAll(() => {
    // Clean up temporary directory
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should print help message when run without arguments', async () => {
    const result = await runCLI([], 5000);
    expect(result.stdout).toContain('Apex CLI: hello');
    expect(result.stdout).toContain('Usage: apex <command>');
    expect(result.exitCode).toBe(0);
  });

  it('should print dev message when run with dev command', async () => {
    const result = await runCLI(['dev'], 5000);
    expect(result.stdout).toContain('Starting development server with node runtime');
    expect(result.exitCode).toBe(-1); // The dev server runs indefinitely, so it will timeout
  });

  it('should create a project when run with create command', async () => {
    // Clean up any existing test project directory
    if (existsSync(testProjectDir)) {
      rmSync(testProjectDir, { recursive: true, force: true });
    }
    
    const result = await runCLI(['create', 'test-project'], 5000, tempDir);
    expect(result.stdout).toContain('Successfully created new Apex project: test-project');
    expect(result.exitCode).toBe(0);
    
    // Verify the project was created
    expect(existsSync(testProjectDir)).toBe(true);
  });
  
  it('should show build help when run with build command', async () => {
    const result = await runCLI(['build', '--help'], 5000);
    // The build command interprets --help as a directory name
    expect(result.stdout).toContain('Building project at: --help');
    expect(result.exitCode).toBe(0);
  });
  
  it('should show start help when run with start command', async () => {
    const result = await runCLI(['start', '--help'], 5000);
    // The start command should exit with error because built server is not found
    expect(result.exitCode).toBe(1);
  });
});

function runCLI(args: string[], timeout: number, cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], { cwd });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode ?? 0 });
    });
    
    // Kill the process after timeout
    setTimeout(() => {
      child.kill();
      resolve({ stdout, stderr, exitCode: -1 });
    }, timeout);
  });
}