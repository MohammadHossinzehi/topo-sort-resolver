import { DependencyResolver, Dependency } from './index';

describe('DependencyResolver', () => {
  test('resolves simple linear dependency', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: ['B'] },
      { name: 'B', deps: ['C'] },
      { name: 'C', deps: [] }
    ];
    const resolver = new DependencyResolver(deps);
    const result = resolver.resolveOrder();
    
    expect(result.hasCycle).toBe(false);
    expect(result.sorted).toEqual(['C', 'B', 'A']);
  });

  test('resolves multiple dependencies', () => {
    const deps: Dependency[] = [
      { name: 'App', deps: ['Router', 'Logger'] },
      { name: 'Router', deps: ['Config'] },
      { name: 'Logger', deps: ['Config'] },
      { name: 'Config', deps: [] }
    ];
    const resolver = new DependencyResolver(deps);
    const result = resolver.resolveOrder();
    
    expect(result.hasCycle).toBe(false);
    expect(result.sorted[0]).toBe('Config');
    expect(result.sorted).toContain('Router');
    expect(result.sorted).toContain('Logger');
    expect(result.sorted[result.sorted.length - 1]).toBe('App');
  });

  test('detects cycles', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: ['B'] },
      { name: 'B', deps: ['C'] },
      { name: 'C', deps: ['A'] }
    ];
    const resolver = new DependencyResolver(deps);
    const result = resolver.resolveOrder();
    
    expect(result.hasCycle).toBe(true);
    expect(result.cycleNode).toBeDefined();
  });

  test('detects self-cycle', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: ['A'] }
    ];
    const resolver = new DependencyResolver(deps);
    const result = resolver.resolveOrder();
    
    expect(result.hasCycle).toBe(true);
  });

  test('handles isolated nodes', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: [] },
      { name: 'B', deps: [] },
      { name: 'C', deps: ['A', 'B'] }
    ];
    const resolver = new DependencyResolver(deps);
    const result = resolver.resolveOrder();
    
    expect(result.hasCycle).toBe(false);
    expect(result.sorted.length).toBe(3);
    expect(result.sorted[result.sorted.length - 1]).toBe('C');
  });

  test('detectCycles returns all cycles', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: ['B'] },
      { name: 'B', deps: ['A'] },
      { name: 'C', deps: ['D'] },
      { name: 'D', deps: ['C'] }
    ];
    const resolver = new DependencyResolver(deps);
    const cycles = resolver.detectCycles();
    
    expect(cycles.length).toBeGreaterThan(0);
  });

  test('getGraph returns correct adjacency', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: ['B', 'C'] },
      { name: 'B', deps: ['C'] },
      { name: 'C', deps: [] }
    ];
    const resolver = new DependencyResolver(deps);
    const graph = resolver.getGraph();
    
    expect(graph.get('C')).toContain('A');
    expect(graph.get('C')).toContain('B');
  });

  test('getInDegrees returns correct in-degrees', () => {
    const deps: Dependency[] = [
      { name: 'A', deps: ['B'] },
      { name: 'B', deps: ['C'] },
      { name: 'C', deps: [] }
    ];
    const resolver = new DependencyResolver(deps);
    const inDegrees = resolver.getInDegrees();
    
    expect(inDegrees.get('C')).toBe(0);
    expect(inDegrees.get('B')).toBe(1);
    expect(inDegrees.get('A')).toBe(1);
  });

  test('handles complex graph with diamond pattern', () => {
    const deps: Dependency[] = [
      { name: 'Top', deps: ['Left', 'Right'] },
      { name: 'Left', deps: ['Bottom'] },
      { name: 'Right', deps: ['Bottom'] },
      { name: 'Bottom', deps: [] }
    ];
    const resolver = new DependencyResolver(deps);
    const result = resolver.resolveOrder();
    
    expect(result.hasCycle).toBe(false);
    expect(result.sorted[0]).toBe('Bottom');
    expect(result.sorted[result.sorted.length - 1]).toBe('Top');
  });
});
