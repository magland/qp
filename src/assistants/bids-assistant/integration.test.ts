import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

describe('BIDS Assistant - Integration', () => {
  describe('File Structure', () => {
    const assistantPath = 'src/assistants/bids-assistant';

    it('should have all required assistant files', () => {
      const requiredFiles = [
        'bidsAssistantSystemPrompt.ts',
        'getTools.ts',
        'preferences.tsx',
        'retrieveBidsDocs.tsx',
      ];

      requiredFiles.forEach(file => {
        const filePath = join(process.cwd(), assistantPath, file);
        expect(() => readFileSync(filePath, 'utf8')).not.toThrow();
      });
    });

    it('should have system prompt exported', () => {
      const filePath = join(process.cwd(), assistantPath, 'bidsAssistantSystemPrompt.ts');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('BIDS');
      expect(content.length).toBeGreaterThan(1000); // Ensure it's substantial
    });

    it('should export getTools function', () => {
      const filePath = join(process.cwd(), assistantPath, 'getTools.ts');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('retrieveBidsDocs');
    });

    it('should export preferences object', () => {
      const filePath = join(process.cwd(), assistantPath, 'preferences.tsx');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('Preferences');
      expect(content).toContain('bidsAssistantSystemPrompt');
    });
  });

  describe('App Integration', () => {
    it('should be integrated in App.tsx', () => {
      const appPath = join(process.cwd(), 'src/App.tsx');
      const content = readFileSync(appPath, 'utf8');

      expect(content).toContain('bids-assistant');
      expect(content).toContain('bidsAssistantPreferences');
    });

    it('should be integrated in getTools', () => {
      const toolsPath = join(process.cwd(), 'src/tools/getTools.ts');
      const content = readFileSync(toolsPath, 'utf8');

      expect(content).toContain('bids-assistant');
      expect(content).toContain('getBidsAssistantTools');
    });

    it('should have chat ID prefix in API', () => {
      const apiPath = join(process.cwd(), 'nextjs/qp-api/src/app/api/chats/route.ts');
      const content = readFileSync(apiPath, 'utf8');

      expect(content).toContain('bids-assistant');
      expect(content).toContain('ba_');
    });
  });

  describe('Tool Function Structure', () => {
    it('should export required tool properties', () => {
      const filePath = join(process.cwd(), 'src/assistants/bids-assistant/retrieveBidsDocs.tsx');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export const toolFunction');
      expect(content).toContain('export const execute');
      expect(content).toContain('export const getDetailedDescription');
      expect(content).toContain('export const requiresPermission');
      expect(content).toContain('export const createToolCallView');
    });

    it('should have correct tool name', () => {
      const filePath = join(process.cwd(), 'src/assistants/bids-assistant/retrieveBidsDocs.tsx');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('retrieve_bids_docs');
    });
  });

  describe('Documentation', () => {
    it('should be documented in README', () => {
      const readmePath = join(process.cwd(), 'README.md');
      const content = readFileSync(readmePath, 'utf8');

      expect(content).toContain('bids-assistant');
      expect(content).toContain('BIDS');
      expect(content).toContain('seven');
    });

    it('should be documented in CLAUDE.md', () => {
      const claudePath = join(process.cwd(), 'CLAUDE.md');
      const content = readFileSync(claudePath, 'utf8');

      expect(content).toContain('bids-assistant');
      expect(content).toContain('ba_');
      expect(content).toContain('Seven');
    });
  });
});
