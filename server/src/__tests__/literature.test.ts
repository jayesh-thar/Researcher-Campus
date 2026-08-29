import { describe, it, expect } from 'vitest';
import {
  computeVectorCosineSimilarity,
  calculateTfIdfVectorCosineSimilarity,
  harvestFromCrossref,
  harvestFromArxiv,
  harvestFromOpenAlex,
  harvestFromSemanticScholar,
  harvestFromEuropePMC,
  executeMultiEngineLiteratureScan
} from '../services/literatureService';

describe('Literature Engine & Vector Cosine Similarity Tests', () => {
  describe('Mathematical Vector Cosine Similarity', () => {
    it('should compute 100% similarity for identical non-zero vectors', () => {
      const vecA = [0.5, 0.8, 0.2, 0.9, 0.1];
      const similarity = computeVectorCosineSimilarity(vecA, vecA);
      expect(similarity).toBe(100);
    });

    it('should compute 0% similarity for orthogonal vectors', () => {
      const vecA = [1.0, 0.0, 0.0];
      const vecB = [0.0, 1.0, 0.0];
      const similarity = computeVectorCosineSimilarity(vecA, vecB);
      expect(similarity).toBe(0);
    });

    it('should compute correct intermediate cosine similarity for known angle vectors', () => {
      const vecA = [1.0, 1.0];
      const vecB = [1.0, 0.0];
      // Cosine angle is 1/sqrt(2) ≈ 0.7071 -> 71%
      const similarity = computeVectorCosineSimilarity(vecA, vecB);
      expect(similarity).toBe(71);
    });

    it('should handle zero-norm or mismatched vectors gracefully', () => {
      expect(computeVectorCosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
      expect(computeVectorCosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
      expect(computeVectorCosineSimilarity([], [])).toBe(0);
    });
  });

  describe('TF-IDF N-Gram Vector Cosine Similarity', () => {
    it('should compute 100% similarity for identical texts', () => {
      const text = 'Early diabetes prediction using LightGBM ensemble trees and SMOTE-Tomek';
      const similarity = calculateTfIdfVectorCosineSimilarity(text, text);
      expect(similarity).toBe(100);
    });

    it('should compute significant similarity for closely related methodology texts', () => {
      const textA = 'Early diabetes prediction using LightGBM ensemble trees and SMOTE-Tomek resampling';
      const textB = 'Prediction of diabetes in clinical cohorts using gradient boosted trees and synthetic minority oversampling';
      const similarity = calculateTfIdfVectorCosineSimilarity(textA, textB);
      expect(similarity).toBeGreaterThan(12);
    });

    it('should compute low or zero similarity for completely disparate domains', () => {
      const textA = 'Early diabetes prediction using LightGBM ensemble trees';
      const textB = 'Quantum compiler optimization using Clifford algebraic graph rewrites in topological circuits';
      const similarity = calculateTfIdfVectorCosineSimilarity(textA, textB);
      expect(similarity).toBeLessThan(10);
    });
  });

  describe('Live Academic API Harvester Functions', () => {
    it('should query Crossref API and return normalized papers', async () => {
      const papers = await harvestFromCrossref('machine learning healthcare');
      expect(Array.isArray(papers)).toBe(true);
      expect(papers.length).toBeGreaterThan(0);
      expect(papers[0].sourceEngine).toBe('Crossref');
      expect(papers[0].title).toBeDefined();
      expect(papers[0].title.length).toBeGreaterThan(3);
      expect(papers[0].year).toBeGreaterThanOrEqual(1900);
      expect(papers[0].doiUrl).toContain('doi.org');
    });

    it('should query arXiv API and parse Atom XML properly', async () => {
      const papers = await harvestFromArxiv('deep learning transformer');
      expect(Array.isArray(papers)).toBe(true);
      expect(papers.length).toBeGreaterThan(0);
      expect(papers[0].sourceEngine).toBe('arXiv');
      expect(papers[0].venue).toBe('arXiv Preprint Repository');
      expect(papers[0].doiUrl).toContain('arxiv.org');
      expect(papers[0].abstract.length).toBeGreaterThan(10);
    });

    it('should query OpenAlex API properly', async () => {
      const papers = await harvestFromOpenAlex('distributed systems consensus');
      expect(Array.isArray(papers)).toBe(true);
      expect(papers.length).toBeGreaterThan(0);
      expect(papers[0].sourceEngine).toBe('OpenAlex');
      expect(papers[0].title).toBeDefined();
      expect(papers[0].title.length).toBeGreaterThan(3);
    });

    it('should execute end-to-end multi-engine scan and return valid GateScanResult', async () => {
      const result = await executeMultiEngineLiteratureScan(
        'Predicting Type 2 Diabetes via Ensemble Trees',
        'Early risk diagnosis in clinical health records',
        'LightGBM classifier combined with SMOTE-Tomek feature engineering'
      );

      expect(result).toBeDefined();
      expect(['PASS', 'SOFT_WARNING', 'HARD_STOP']).toContain(result.status);
      expect(result.noveltyScore).toBeGreaterThanOrEqual(10);
      expect(result.noveltyScore).toBeLessThanOrEqual(100);
      expect(result.literature.length).toBeGreaterThan(0);
      expect(result.whitespaceStatement).toBeDefined();
    });
  });
});
