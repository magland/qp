import { describe, expect, it } from 'vitest';
import { execute, getDetailedDescription, getDocPages } from './retrieveRepronimDocs';

describe('ReproNim Assistant - retrieveRepronimDocs', () => {
  describe('getDocPages', () => {
    it('should return an array of ReproNim document pages', () => {
      const docPages = getDocPages();

      expect(docPages).toBeInstanceOf(Array);
      expect(docPages.length).toBeGreaterThan(0);
    });

    it('should have a reasonable number of documents', () => {
      const docPages = getDocPages();

      // Should have at least 15 documentation pages
      expect(docPages.length).toBeGreaterThanOrEqual(15);
    });

    it('should have core documents marked for preloading', () => {
      const docPages = getDocPages();
      const preloadedDocs = docPages.filter(doc => doc.includeFromStart);

      expect(preloadedDocs.length).toBeGreaterThan(0);

      // Verify repronim.org core content is preloaded (primary resources)
      const titles = preloadedDocs.map(doc => doc.title);
      expect(titles.some(t => t.includes('Why Reproducible'))).toBe(true);
      expect(titles.some(t => t.includes('ReproNim Approach'))).toBe(true);
      expect(titles.some(t => t.includes('Getting Started'))).toBe(true);
    });

    it('should have valid URLs for all documents', () => {
      const docPages = getDocPages();

      docPages.forEach(doc => {
        expect(doc.url).toMatch(/^https?:\/\//);
        expect(doc.sourceUrl).toMatch(/^https?:\/\//);
        // Source URLs should be raw content URLs
        expect(doc.sourceUrl).toMatch(/raw\.githubusercontent\.com|readthedocs/);
      });
    });

    it('should include key ReproNim tools documentation', () => {
      const docPages = getDocPages();
      const titles = docPages.map(doc => doc.title).join(' ');

      // Check for major ReproNim tools
      expect(titles).toContain('HeuDiConv');
      expect(titles).toContain('DataLad');
      expect(titles).toContain('Neurodocker');
      expect(titles).toContain('ReproIn');
      expect(titles).toContain('ReproStim');
    });

    it('should include comprehensive ReproStim documentation', () => {
      const docPages = getDocPages();
      const reprostimDocs = docPages.filter(doc => doc.title.includes('ReproStim'));

      // Should have multiple ReproStim docs
      expect(reprostimDocs.length).toBeGreaterThan(5);

      // Check for specific ReproStim documentation
      const titles = reprostimDocs.map(doc => doc.title).join(' ');
      expect(titles).toContain('Introduction');
      expect(titles).toContain('CLI');
      expect(titles).toContain('Installation');
    });

    it('should prioritize repronim.org content first in the list', () => {
      const docPages = getDocPages();

      // First documents should be from repronim.org
      const firstFiveTitles = docPages.slice(0, 5).map(doc => doc.title);
      expect(firstFiveTitles.every(t => t.startsWith('ReproNim -') || t.startsWith('ReproNim Tutorial'))).toBe(true);

      // Should include tutorials from repronim.org
      const repronimOrgDocs = docPages.filter(doc => doc.url.includes('repronim.org'));
      expect(repronimOrgDocs.length).toBeGreaterThan(10);
    });

    it('should include training modules', () => {
      const docPages = getDocPages();
      const urls = docPages.map(doc => doc.url).join(' ');

      expect(urls).toContain('module-intro');
      expect(urls).toContain('module-reproducible-basics');
      expect(urls).toContain('module-FAIR-data');
    });

    it('should have required properties for each document', () => {
      const docPages = getDocPages();

      docPages.forEach(doc => {
        expect(doc).toHaveProperty('title');
        expect(doc).toHaveProperty('url');
        expect(doc).toHaveProperty('sourceUrl');
        expect(doc).toHaveProperty('includeFromStart');
        expect(typeof doc.title).toBe('string');
        expect(typeof doc.url).toBe('string');
        expect(typeof doc.sourceUrl).toBe('string');
        expect(typeof doc.includeFromStart).toBe('boolean');
      });
    });
  });

  describe('execute', () => {
    // Note: Network tests are skipped in test environment due to CORS restrictions
    // These would work in a real browser environment
    it.skip('should fetch ReproNim documents successfully', async () => {
      const docPages = getDocPages();
      const testUrls = [docPages[0].url];

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
      const docPages = getDocPages();
      const testUrls = [docPages[0].url, docPages[1].url];

      const result = await execute({ urls: testUrls }, {});
      const parsed = JSON.parse(result.result);

      expect(parsed.length).toBe(2);
      expect(parsed[0].url).toBe(testUrls[0]);
      expect(parsed[1].url).toBe(testUrls[1]);
    });

    it('should handle invalid URLs gracefully', async () => {
      const testUrls = [
        'https://example.com/nonexistent-repronim-doc.html',
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

      expect(description).toContain('HeuDiConv');
      expect(description).toContain('DataLad');
      expect(description).toContain('Neurodocker');
    });

    it('should include preloaded content indicator', async () => {
      const description = await getDetailedDescription();

      expect(description).toContain('preloaded');
    });

    it('should provide valid JSON schema information', async () => {
      const description = await getDetailedDescription();

      expect(description).toContain('document URL');
      expect(description).toContain('document content');
    });

    it('should mention ReproNim in the description', async () => {
      const description = await getDetailedDescription();

      expect(description).toContain('ReproNim');
    });
  });
});
