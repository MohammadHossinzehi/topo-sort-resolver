export interface Dependency {
  name: string;
  deps: string[];
}

export interface TopoSortResult {
  sorted: string[];
  hasCycle: boolean;
  cycleNode?: string;
}

export class DependencyResolver {
  private graph: Map<string, string[]> = new Map();
  private inDegree: Map<string, number> = new Map();

  constructor(dependencies: Dependency[]) {
    for (const dep of dependencies) {
      if (!this.graph.has(dep.name)) {
        this.graph.set(dep.name, []);
        this.inDegree.set(dep.name, 0);
      }
      for (const d of dep.deps) {
        if (!this.graph.has(d)) {
          this.graph.set(d, []);
          this.inDegree.set(d, 0);
        }
        this.graph.get(d)!.push(dep.name);
        this.inDegree.set(dep.name, (this.inDegree.get(dep.name) || 0) + 1);
      }
    }
  }

  resolveOrder(): TopoSortResult {
    const sorted: string[] = [];
    const queue: string[] = [];
    const inDeg = new Map(this.inDegree);

    for (const [node, degree] of inDeg) {
      if (degree === 0) {
        queue.push(node);
      }
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      sorted.push(node);

      for (const neighbor of this.graph.get(node) || []) {
        inDeg.set(neighbor, (inDeg.get(neighbor) || 0) - 1);
        if (inDeg.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    const hasCycle = sorted.length !== this.graph.size;
    let cycleNode: string | undefined;

    if (hasCycle) {
      for (const [node, degree] of inDeg) {
        if (degree > 0) {
          cycleNode = node;
          break;
        }
      }
    }

    return { sorted, hasCycle, cycleNode };
  }

  detectCycles(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      for (const neighbor of this.graph.get(node) || []) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            cycles.push([...path.slice(cycleStart), neighbor]);
          }
        }
      }

      recStack.delete(node);
    };

    for (const node of this.graph.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  getGraph(): Map<string, string[]> {
    return new Map(this.graph);
  }

  getInDegrees(): Map<string, number> {
    return new Map(this.inDegree);
  }
}
