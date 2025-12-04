import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

describe('ReproNim Assistant - Integration', () => {
  describe('File Structure', () => {
    const assistantPath = 'src/assistants/repronim-assistant';

    it('should have all required assistant files', () => {
      const requiredFiles = [
        'repronimAssistantSystemPrompt.ts',
        'getTools.ts',
        'preferences.tsx',
        'retrieveRepronimDocs.tsx',
      ];

      requiredFiles.forEach(file => {
        const filePath = join(process.cwd(), assistantPath, file);
        expect(() => readFileSync(filePath, 'utf8')).not.toThrow();
      });
    });

    it('should have system prompt exported', () => {
      const filePath = join(process.cwd(), assistantPath, 'repronimAssistantSystemPrompt.ts');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('ReproNim');
      expect(content.length).toBeGreaterThan(1000); // Ensure it's substantial
    });

    it('should export getTools function', () => {
      const filePath = join(process.cwd(), assistantPath, 'getTools.ts');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('retrieveRepronimDocs');
    });

    it('should export preferences object', () => {
      const filePath = join(process.cwd(), assistantPath, 'preferences.tsx');
      const content = readFileSync(filePath, 'utf8');

      expect(content).toContain('export default');
      expect(content).toContain('Preferences');
      expect(content).toContain('repronimAssistantSystemPrompt');
    });
  });

  describe('App Integration', () => {
    it('should be registered in App.tsx', () => {
      const appPath = join(process.cwd(), 'src/App.tsx');
      const content = readFileSync(appPath, 'utf8');

      expect(content).toContain('repronim-assistant');
      expect(content).toContain('repronimAssistantPreferences');
      expect(content).toContain('from "./assistants/repronim-assistant/preferences"');
    });

    it('should be registered in tools/getTools.ts', () => {
      const toolsPath = join(process.cwd(), 'src/tools/getTools.ts');
      const content = readFileSync(toolsPath, 'utf8');

      expect(content).toContain('repronim-assistant');
      expect(content).toContain('getRepronimAssistantTools');
      expect(content).toContain('from "../assistants/repronim-assistant/getTools"');
    });
  });

  describe('Documentation Tool', () => {
    it('should have retrieveRepronimDocs tool with proper structure', () => {
      const toolPath = join(process.cwd(), 'src/assistants/repronim-assistant/retrieveRepronimDocs.tsx');
      const content = readFileSync(toolPath, 'utf8');

      expect(content).toContain('export const toolFunction');
      expect(content).toContain('retrieve_repronim_docs');
      expect(content).toContain('export const execute');
      expect(content).toContain('export const getDocPages');
      expect(content).toContain('export const getDetailedDescription');
    });

    it('should have comprehensive documentation pages defined', () => {
      const toolPath = join(process.cwd(), 'src/assistants/repronim-assistant/retrieveRepronimDocs.tsx');
      const content = readFileSync(toolPath, 'utf8');

      // Check for key ReproNim tools/resources
      expect(content).toContain('HeuDiConv');
      expect(content).toContain('DataLad');
      expect(content).toContain('Neurodocker');
      expect(content).toContain('ReproIn');

      // Check for ReproStim documentation
      expect(content).toContain('ReproStim Introduction');
      expect(content).toContain('ReproStim CLI');
      expect(content).toContain('reprostim.readthedocs.io');

      // Check for training modules
      expect(content).toContain('module-intro');
      expect(content).toContain('module-reproducible-basics');
      expect(content).toContain('module-FAIR-data');

      // Verify we have a reasonable number of docs (now including ReproStim docs)
      const docMatches = content.match(/title:/g);
      expect(docMatches).toBeDefined();
      expect(docMatches!.length).toBeGreaterThan(25); // At least 25 docs with ReproStim
    });

    it('should have preloaded documents configured', () => {
      const toolPath = join(process.cwd(), 'src/assistants/repronim-assistant/retrieveRepronimDocs.tsx');
      const content = readFileSync(toolPath, 'utf8');

      expect(content).toContain('includeFromStart: true');

      // Should have at least 3 preloaded docs
      const preloadMatches = content.match(/includeFromStart: true/g);
      expect(preloadMatches).toBeDefined();
      expect(preloadMatches!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Assistant Content', () => {
    it('should have ReproNim-specific content in system prompt', () => {
      const promptPath = join(process.cwd(), 'src/assistants/repronim-assistant/repronimAssistantSystemPrompt.ts');
      const content = readFileSync(promptPath, 'utf8');

      // ReproNim-specific terms
      expect(content).toContain('ReproNim');
      expect(content).toContain('reproducible');
      expect(content).toContain('neuroimaging');
      expect(content).toContain('repronim.org');

      // Key tools should be mentioned
      expect(content).toContain('HeuDiConv');
      expect(content).toContain('DataLad');
      expect(content).toContain('Neurodocker');
      expect(content).toContain('containers');

      // Documentation requirements
      expect(content).toContain('retrieve_repronim_docs');
    });

    it('should reference related assistants', () => {
      const promptPath = join(process.cwd(), 'src/assistants/repronim-assistant/repronimAssistantSystemPrompt.ts');
      const content = readFileSync(promptPath, 'utf8');

      // Should reference other specialized assistants
      expect(content).toContain('bids-assistant.neurosift.app');
      expect(content).toContain('hed-assistant.neurosift.app');
      expect(content).toContain('nwb-assistant.neurosift.app');
    });

    it('should have suggested prompts in preferences', () => {
      const prefsPath = join(process.cwd(), 'src/assistants/repronim-assistant/preferences.tsx');
      const content = readFileSync(prefsPath, 'utf8');

      expect(content).toContain('suggestedPrompts');
      expect(content).toContain('HeuDiConv');
      expect(content).toContain('DataLad');
      expect(content).toContain('Neurodocker');
    });
  });

  describe('Documentation', () => {
    it('should be documented in README', () => {
      const readmePath = join(process.cwd(), 'README.md');
      const content = readFileSync(readmePath, 'utf8');

      expect(content).toContain('repronim-assistant');
      expect(content).toContain('ReproNim');
      expect(content).toContain('nine'); // nine assistants
    });

    it('should be documented in CLAUDE.md', () => {
      const claudePath = join(process.cwd(), 'CLAUDE.md');
      const content = readFileSync(claudePath, 'utf8');

      expect(content).toContain('repronim-assistant');
      expect(content).toContain('ReproNim');
    });
  });
});
