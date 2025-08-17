import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '../bin/apex.js');

describe('apex CLI', () => {
  it('should print help message when run without arguments', async () => {
    const result = await runCLI([], 5000);
    expect(result.stdout).toContain('Apex CLI: hello');
    expect(result.stdout).toContain('Usage: apex <command>');
    expect(result.exitCode).toBe(0);
  });

  it('should print dev message when run with dev command', async () => {
    const result = await runCLI(['dev'], 5000);
    expect(result.stdout).toContain('Starting development server');
    expect(result.exitCode).toBe(0);
  });

  it('should create a project when run with create command', async () => {
    const result = await runCLI(['create', 'test-project'], 5000);
    expect(result.stdout).toContain('Creating new Apex project: test-project');
    expect(result.exitCode).toBe(0);
  });
  
  it('should show build help when run with build command', async () => {
    const result = await runCLI(['build', '--help'], 5000);
    expect(result.exitCode).toBe(0);
  });
  
  it('should show start help when run with start command', async () => {
    const result = await runCLI(['start', '--help'], 5000);
    expect(result.exitCode).toBe(0);
  });
});

function runCLI(args: string[], timeout: number): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args]);
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