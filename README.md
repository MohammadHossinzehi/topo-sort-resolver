# Topological Sort & Dependency Resolver

A production-grade TypeScript library for topological sorting and dependency resolution with cycle detection and visualization support.

## Problem Statement

Many applications require resolving dependencies in the correct order: package managers, build systems, task schedulers, and microservice orchestration all need to:

- Determine the correct order to resolve dependencies
- Detect circular dependencies early
- Provide detailed cycle information for debugging
- Support both simple linear chains and complex diamond patterns

This library provides efficient, well-tested implementations of these algorithms.

## Features

- **Kahn's Algorithm**: O(V + E) topological sort using in-degree tracking
- **Cycle Detection**: DFS-based detection with cycle path extraction
- **Multiple Methods**: Choose between Kahn's algorithm or DFS-based sorting
- **Graph Analysis**: Access to adjacency lists and in-degree information
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Production Ready**: Extensive test coverage and error handling

## Installation

```bash
npm install topo-sort-resolver
```

## Usage

### Basic Example

```typescript
import { DependencyResolver, Dependency } from 'topo-sort-resolver';

// Define dependencies
const deps: Dependency[] = [
  { name: 'App', deps: ['Router', 'Logger'] },
  { name: 'Router', deps: ['Config'] },
  { name: 'Logger', deps: ['Config'] },
  { name: 'Config', deps: [] }
];

// Create resolver
const resolver = new DependencyResolver(deps);

// Get resolution order
const result = resolver.resolveOrder();

if (result.hasCycle) {
  console.error('Circular dependency detected:', result.cycleNode);
} else {
  console.log('Resolution order:', result.sorted);
  // Output: ['Config', 'Router', 'Logger', 'App'] (or similar valid order)
}
```

### Cycle Detection

```typescript
// Detect all cycles in the graph
const cycles = resolver.detectCycles();
cycles.forEach(cycle => {
  console.log('Cycle found:', cycle.join(' -> '));
});
```

### Graph Inspection

```typescript
// Get the internal graph structure
const graph = resolver.getGraph();
const inDegrees = resolver.getInDegrees();

console.log('Adjacency list:', graph);
console.log('In-degrees:', inDegrees);
```

## Algorithm Details

### Topological Sort (Kahn's Algorithm)

1. Calculate in-degrees for all vertices
2. Add all vertices with in-degree 0 to a queue
3. Process queue: remove vertex, add to result, decrease in-degrees of neighbors
4. If all vertices processed, return sorted order; otherwise, cycle exists

**Time Complexity**: O(V + E)
**Space Complexity**: O(V + E)

### Cycle Detection (DFS)

1. Maintain visited set and recursion stack
2. For each unvisited node, perform DFS
3. If revisit node in recursion stack, cycle found
4. Track cycle path for debugging

**Time Complexity**: O(V + E)
**Space Complexity**: O(V)

## Design Decisions

### Why Kahn's Algorithm?
- Single-pass O(V + E) complexity
- Naturally detects cycles (incomplete processing)
- Returns valid topological order when no cycle
- Better for acyclic graphs (common case)

### In-Degree Tracking
- Reduces algorithm complexity to single pass
- Avoids deep recursion in large graphs
- Easier to debug and understand
- Works well with dynamic dependency graphs

### Separate Cycle Detection
- Decouples sorting from cycle finding
- Provides detailed cycle information
- Handles multiple cycles correctly
- Useful for debugging dependency issues

## Testing

Run the test suite:

```bash
npm test
```

Test coverage includes:

- Simple linear chains
- Multiple independent dependencies
- Diamond patterns (shared dependencies)
- Cycle detection (simple and complex)
- Self-referential dependencies
- Isolated nodes
- In-degree calculations
- Graph structure validation

## Performance Characteristics

For a graph with V vertices and E edges:

| Operation | Time | Space |
|-----------|------|-------|
| Construction | O(V + E) | O(V + E) |
| resolveOrder() | O(V + E) | O(V) |
| detectCycles() | O(V + E) | O(V) |
| getGraph() | O(V + E) | O(V + E) |
| getInDegrees() | O(V) | O(V) |

## Real-World Use Cases

- **Package Managers**: Resolve npm/pip/cargo dependencies
- **Build Systems**: Determine compilation order (Make, Gradle, etc.)
- **Task Scheduling**: DAG-based task schedulers
- **Microservices**: Startup order with service dependencies
- **Database Migrations**: SQL migration ordering
- **CI/CD Pipelines**: Stage and job dependency resolution

## API Reference

### DependencyResolver

```typescript
constructor(dependencies: Dependency[])
resolveOrder(): TopoSortResult
detectCycles(): string[][]
getGraph(): Map<string, string[]>
getInDegrees(): Map<string, number>
```

### Interfaces

```typescript
interface Dependency {
  name: string;
  deps: string[];
}

interface TopoSortResult {
  sorted: string[];
  hasCycle: boolean;
  cycleNode?: string;
}
```

## License

MIT

## Author

Mohammad Hossinzehi
