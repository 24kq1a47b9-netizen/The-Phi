import { describe, expect, it } from 'vitest';
import { hashTerms, referenceNumber } from './agreement-service.js';

describe('agreement service', () => {
  it('creates stable SHA-256 hashes for equivalent terms', () => {
    expect(hashTerms('approved terms')).toHaveLength(64);
    expect(hashTerms('approved terms')).toBe(hashTerms('approved terms'));
  });
  it('creates a traceable reference number', () => {
    expect(referenceNumber()).toMatch(/^TP-\d{4}-[A-F0-9]{8}$/);
  });
});
