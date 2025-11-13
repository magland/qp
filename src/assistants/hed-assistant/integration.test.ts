import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

describe('HED Assistant - Integration', () => {
  describe('File Structure', () => {
    const assistantPath = 'src/assistants/hed-assistant';

    it('should have all required assistant files', () => {
      const requiredFiles = [
        'hedAssistantSystemPrompt.ts',
        'getTools.ts',
        'preferences.tsx',
        'retrieveHedDocs.tsx',
      ];

      requiredFiles.forEach(file => {
        const filePath = join(process.cwd(), assistantPath, file);
        expect(() => readFileSync(filePath, 'utf8')).not.toThrow();
      });
    });

    it('should have system prompt exported', () => {
      const filePath = join(process.cwd(), assistantPath, 'hedAssistantSystemPrompt.ts');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('HED');
      expect(content.length).toBeGreaterThan(1000); // Ensure it's substantial
    });

    it('should export getTools function', () => {
      const filePath = join(process.cwd(), assistantPath, 'getTools.ts');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('retrieveHedDocs');
    });

    it('should export preferences object', () => {
      const filePath = join(process.cwd(), assistantPath, 'preferences.tsx');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('Preferences');
      expect(content).toContain('hedAssistantSystemPrompt');
    });
  });

  describe('App Integration', () => {
    it('should be registered in App.tsx', () => {
      const appPath = join(process.cwd(), 'src/App.tsx');
      const content = readFileSync(appPath, 'utf8');

      expect(content).toContain('hed-assistant');
      expect(content).toContain('hedAssistantPreferences');
      expect(content).toContain('from "./assistants/hed-assistant/preferences"');
    });

    it('should be registered in tools/getTools.ts', () => {
      const toolsPath = join(process.cwd(), 'src/tools/getTools.ts');
      const content = readFileSync(toolsPath, 'utf8');

      expect(content).toContain('hed-assistant');
      expect(content).toContain('getHedAssistantTools');
      expect(content).toContain('from "../assistants/hed-assistant/getTools"');
    });
  });

  describe('Documentation Tool', () => {
    it('should have retrieveHedDocs tool with proper structure', () => {
      const toolPath = join(process.cwd(), 'src/assistants/hed-assistant/retrieveHedDocs.tsx');
      const content = readFileSync(toolPath, 'utf8');

      expect(content).toContain('export const toolFunction');
      expect(content).toContain('retrieve_hed_docs');
      expect(content).toContain('export const execute');
      expect(content).toContain('export const getDocPages');
      expect(content).toContain('export const getDetailedDescription');
    });

    it('should have comprehensive documentation pages defined', () => {
      const toolPath = join(process.cwd(), 'src/assistants/hed-assistant/retrieveHedDocs.tsx');
      const content = readFileSync(toolPath, 'utf8');

      // Check for key HED resources
      expect(content).toContain('hed-specification');
      expect(content).toContain('hed-resources');
      expect(content).toContain('Introduction');
      expect(content).toContain('Terminology');
      expect(content).toContain('Basic');

      // Check for categories
      expect(content).toContain('specification');
      expect(content).toContain('quickstart');
      expect(content).toContain('tools');
      expect(content).toContain('advanced');
      expect(content).toContain('integration');

      // Verify we have substantial number of docs (should be 41)
      const docMatches = content.match(/title:/g);
      expect(docMatches).toBeDefined();
      expect(docMatches!.length).toBeGreaterThan(35); // At least 35 docs
    });

    it('should have preloaded documents configured', () => {
      const toolPath = join(process.cwd(), 'src/assistants/hed-assistant/retrieveHedDocs.tsx');
      const content = readFileSync(toolPath, 'utf8');

      expect(content).toContain('includeFromStart: true');

      // Should have at least 3 preloaded docs
      const preloadMatches = content.match(/includeFromStart: true/g);
      expect(preloadMatches).toBeDefined();
      expect(preloadMatches!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Assistant Content', () => {
    it('should have HED-specific content in system prompt', () => {
      const promptPath = join(process.cwd(), 'src/assistants/hed-assistant/hedAssistantSystemPrompt.ts');
      const content = readFileSync(promptPath, 'utf8');

      // HED-specific terms
      expect(content).toContain('Hierarchical Event Descriptors');
      expect(content).toContain('HED');
      expect(content).toContain('annotation');
      expect(content).toContain('hedtags.org');

      // Documentation requirements
      expect(content).toContain('retrieve_hed_docs');
      expect(content).toContain('documentation');
    });

    it('should have suggested prompts in preferences', () => {
      const prefsPath = join(process.cwd(), 'src/assistants/hed-assistant/preferences.tsx');
      const content = readFileSync(prefsPath, 'utf8');

      expect(content).toContain('suggestedPrompts');
      expect(content).toContain('HED');
    });
  });
});
