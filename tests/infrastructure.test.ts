import { describe, it, expect } from 'vitest';
import { computeInfrastructureMetrics } from '../src/lib/infrastructure';

describe('Infrastructure & Unit Economics Engine', () => {
  it('computes scale, traffic, and bandwidth metrics accurately', () => {
    const infra = computeInfrastructureMetrics();

    expect(infra.scale).toBeDefined();
    expect(infra.scale.status).toBe('GREEN');
    expect(infra.traffic.totalBandwidthGB).toBeGreaterThan(0);
    expect(infra.traffic.totalParticipantMinutes).toBeGreaterThan(0);
    expect(infra.webrtc.p2pSuccessRate).toBeGreaterThan(70);
    expect(infra.webrtc.turnFallbackRate).toBeLessThan(30);
  });

  it('calculates unit costs with zero database storage liability', () => {
    const infra = computeInfrastructureMetrics();

    expect(infra.costs.storageCost).toBe(0.0); // Zero conversation storage guarantee!
    expect(infra.costs.totalCost).toBeGreaterThan(0);
    expect(infra.costs.costPerCompletedConversation).toBeGreaterThan(0);
    expect(infra.costs.costPerParticipantMinute).toBeGreaterThan(0);
    expect(infra.costs.costPerActiveUser).toBeGreaterThan(0);
  });

  it('triggers cost alert evaluation with thresholds', () => {
    const infra = computeInfrastructureMetrics();

    expect(infra.costs.alerts.tier1Threshold).toBe(500);
    expect(infra.costs.alerts.tier2Threshold).toBe(1000);
    expect(infra.costs.alerts.activeAlertLevel).toBe('NORMAL');
    expect(infra.costs.alerts.alertMessage).toContain('within normal budget');
  });

  it('generates actionable architectural recommendations', () => {
    const infra = computeInfrastructureMetrics();

    expect(infra.recommendations.length).toBeGreaterThan(0);
    const zeroRetRec = infra.recommendations.find((r) => r.id === 'rec_zero_retention');
    expect(zeroRetRec).toBeDefined();
    expect(zeroRetRec?.suggestedAction).toContain('ephemeral memory');
  });

  it('provides capacity scenarios from 1,000 to 1,000,000 MAU', () => {
    const infra = computeInfrastructureMetrics();

    expect(infra.scenarios.length).toBe(4);
    expect(infra.scenarios[0].mauTier).toBe('1,000 MAU');
    expect(infra.scenarios[3].mauTier).toBe('1,000,000 MAU');
    expect(infra.scenarios[3].costPerUser).toBeLessThan(infra.scenarios[0].costPerUser); // Economies of scale
  });
});
