import { describe, expect, it } from 'vitest';
import { execute, getDetailedDescription, getDocPages } from './retrieveBidsDocs';

describe('BIDS Assistant - retrieveBidsDocs', () => {
  describe('getDocPages', () => {
    it('should return an array of BIDS document pages', () => {
      const docPages = getDocPages();

      expect(docPages).toBeInstanceOf(Array);
      expect(docPages.length).toBeGreaterThan(0);
    });

    it('should have the expected number of documents', () => {
      const docPages = getDocPages();

      // We defined 27 documents in the BIDS assistant
      expect(docPages.length).toBe(27);
    });

    it('should have core documents marked for preloading', () => {
      const docPages = getDocPages();
      const preloadedDocs = docPages.filter(doc => doc.includeFromStart);

      expect(preloadedDocs.length).toBeGreaterThan(0);

      // Verify the core documents are included
      const titles = preloadedDocs.map(doc => doc.title);
      expect(titles).toContain('Introduction');
      expect(titles).toContain('Common Principles');
      expect(titles).toContain('Modality Agnostic Files');
    });

    it('should have valid URLs for all documents', () => {
      const docPages = getDocPages();

      docPages.forEach(doc => {
        expect(doc.url).toMatch(/^https?:\/\//);
        expect(doc.sourceUrl).toMatch(/^https?:\/\//);
        expect(doc.sourceUrl).toContain('raw.githubusercontent.com');
      });
    });

    it('should include all major BIDS modalities', () => {
      const docPages = getDocPages();
      const titles = docPages.map(doc => doc.title).join(' ');

      // Check for major modalities
      expect(titles).toContain('MRI');
      expect(titles).toContain('MEG');
      expect(titles).toContain('EEG');
      expect(titles).toContain('iEEG');
      expect(titles).toContain('PET');
      expect(titles).toContain('Microscopy');
    });
  });

  describe('execute', () => {
    // Note: Network tests are skipped in test environment due to CORS restrictions
    // These would work in a real browser environment
    it.skip('should fetch BIDS documents successfully', async () => {
      const testUrls = [
        'https://bids-specification.readthedocs.io/en/stable/introduction.html',
      ];

      const result = await execute({ urls: testUrls }, {});

      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');

      const parsed = JSON.parse(result.result);
      expect(parsed).toBeInstanceOf(Array);
      expect(parsed[0]).toHaveProperty('url');
      expect(parsed[0]).toHaveProperty('content');
      expect(parsed[0].content.length).toBeGreaterThan(0);
    });

    it.skip('should handle multiple document requests', async () => {
      const testUrls = [
        'https://bids-specification.readthedocs.io/en/stable/introduction.html',
        'https://bids-specification.readthedocs.io/en/stable/common-principles.html',
      ];

      const result = await execute({ urls: testUrls }, {});
      const parsed = JSON.parse(result.result);

      expect(parsed.length).toBe(2);
      expect(parsed[0].url).toBe(testUrls[0]);
      expect(parsed[1].url).toBe(testUrls[1]);
    });

    it('should handle invalid URLs gracefully', async () => {
      const testUrls = [
        'https://bids-specification.readthedocs.io/en/stable/nonexistent.html',
      ];

      const result = await execute({ urls: testUrls }, {});

      // Should still return a result, even if it's an error
      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
    });
  });

  describe('getDetailedDescription', () => {
    it('should return a detailed description string', async () => {
      const description = await getDetailedDescription();

      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(0);
    });

    it('should list all available documents', async () => {
      const description = await getDetailedDescription();

      expect(description).toContain('Introduction');
      expect(description).toContain('Common Principles');
      expect(description).toContain('Modality Agnostic Files');
    });

    it('should include preloaded content', async () => {
      const description = await getDetailedDescription();

      expect(description).toContain('preloaded');
    });

    it('should provide valid JSON schema information', async () => {
      const description = await getDetailedDescription();

      expect(description).toContain('BIDS document URL');
      expect(description).toContain('BIDS document content');
    });
  });
});
