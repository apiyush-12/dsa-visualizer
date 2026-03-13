// Graph algorithms with animation steps

export function bfs(graph, start) {
  const steps = [];
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  steps.push({ visited: new Set(visited), current: start, edge: null, message: `Starting BFS from node ${start}` });

  while (queue.length > 0) {
    const node = queue.shift();
    steps.push({ visited: new Set(visited), current: node, edge: null, message: `Processing node ${node}` });
    for (const neighbor of (graph[node] || [])) {
      const nId = typeof neighbor === 'object' ? neighbor.node : neighbor;
      if (!visited.has(nId)) {
        visited.add(nId);
        queue.push(nId);
        steps.push({ visited: new Set(visited), current: nId, edge: [node, nId], message: `Visiting ${nId} from ${node}` });
      }
    }
  }
  steps.push({ visited: new Set(visited), current: null, edge: null, message: 'BFS Complete!' });
  return steps;
}

export function dfs(graph, start) {
  const steps = [];
  const visited = new Set();

  function dfsHelper(node) {
    visited.add(node);
    steps.push({ visited: new Set(visited), current: node, edge: null, message: `Visiting node ${node}` });
    for (const neighbor of (graph[node] || [])) {
      const nId = typeof neighbor === 'object' ? neighbor.node : neighbor;
      if (!visited.has(nId)) {
        steps.push({ visited: new Set(visited), current: nId, edge: [node, nId], message: `Exploring ${nId} from ${node}` });
        dfsHelper(nId);
      }
    }
  }
  dfsHelper(start);
  steps.push({ visited: new Set(visited), current: null, edge: null, message: 'DFS Complete!' });
  return steps;
}

export function dijkstra(graph, start) {
  const steps = [];
  const dist = {};
  const prev = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[start] = 0;
  steps.push({ dist: { ...dist }, visited: new Set(), current: start, edge: null, shortestPath: [], message: `Initialize distances, start=${start}` });

  while (true) {
    let minDist = Infinity, u = null;
    for (const n of nodes) {
      if (!visited.has(n) && dist[n] < minDist) {
        minDist = dist[n];
        u = n;
      }
    }
    if (u === null) break;
    visited.add(u);
    steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, edge: null, shortestPath: [], message: `Visit node ${u} (dist=${dist[u]})` });

    for (const neighbor of (graph[u] || [])) {
      const { node: v, weight } = typeof neighbor === 'object' ? neighbor : { node: neighbor, weight: 1 };
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        steps.push({ dist: { ...dist }, visited: new Set(visited), current: v, edge: [u, v], shortestPath: [], message: `Update dist[${v}] = ${alt} via ${u}` });
      }
    }
  }

  steps.push({ dist: { ...dist }, visited: new Set(visited), current: null, edge: null, shortestPath: [], message: 'Dijkstra Complete!' });
  return steps;
}

export function primMST(graph, start) {
  const steps = [];
  const inMST = new Set();
  const mstEdges = [];
  const key = {};
  const nodes = Object.keys(graph);
  nodes.forEach(n => { key[n] = Infinity; });
  key[start] = 0;
  
  while (inMST.size < nodes.length) {
    let minKey = Infinity, u = null;
    for (const n of nodes) {
      if (!inMST.has(n) && key[n] < minKey) { minKey = key[n]; u = n; }
    }
    if (u === null) break;
    inMST.add(u);
    steps.push({ visited: new Set(inMST), current: u, mstEdges: [...mstEdges], message: `Adding ${u} to MST` });

    for (const neighbor of (graph[u] || [])) {
      const { node: v, weight } = typeof neighbor === 'object' ? neighbor : { node: neighbor, weight: 1 };
      if (!inMST.has(v) && weight < key[v]) {
        key[v] = weight;
        mstEdges.push([u, v]);
        steps.push({ visited: new Set(inMST), current: v, mstEdges: [...mstEdges], edge: [u, v], message: `Edge ${u}-${v} (w=${weight}) added` });
      }
    }
  }
  steps.push({ visited: new Set(inMST), current: null, mstEdges: [...mstEdges], message: "Prim's MST Complete!" });
  return steps;
}

export function kruskalMST(graph) {
  const steps = [];
  const edges = [];
  const nodes = Object.keys(graph);
  
  for (const u of nodes) {
    for (const neighbor of (graph[u] || [])) {
      const { node: v, weight } = typeof neighbor === 'object' ? neighbor : { node: neighbor, weight: 1 };
      if (u < v) edges.push({ u, v, weight });
    }
  }
  edges.sort((a, b) => a.weight - b.weight);

  const parent = {};
  const rank = {};
  nodes.forEach(n => { parent[n] = n; rank[n] = 0; });

  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
  function union(x, y) {
    const px = find(x), py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
    return true;
  }

  const mstEdges = [];
  for (const e of edges) {
    steps.push({ current: null, edge: [e.u, e.v], mstEdges: [...mstEdges], visited: new Set(mstEdges.flat()), message: `Checking edge ${e.u}-${e.v} (w=${e.weight})` });
    if (union(e.u, e.v)) {
      mstEdges.push([e.u, e.v]);
      steps.push({ current: null, edge: [e.u, e.v], mstEdges: [...mstEdges], visited: new Set(mstEdges.flat()), message: `Added edge ${e.u}-${e.v}` });
    }
  }
  steps.push({ current: null, edge: null, mstEdges: [...mstEdges], visited: new Set(nodes), message: "Kruskal's MST Complete!" });
  return steps;
}

export function topologicalSort(graph) {
  const steps = [];
  const visited = new Set();
  const stack = [];

  function dfsHelper(node) {
    visited.add(node);
    steps.push({ visited: new Set(visited), current: node, edge: null, message: `Visiting ${node}` });
    for (const neighbor of (graph[node] || [])) {
      const nId = typeof neighbor === 'object' ? neighbor.node : neighbor;
      if (!visited.has(nId)) dfsHelper(nId);
    }
    stack.push(node);
    steps.push({ visited: new Set(visited), current: node, edge: null, result: [...stack], message: `${node} added to stack` });
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) dfsHelper(node);
  }

  const result = stack.reverse();
  steps.push({ visited: new Set(visited), current: null, edge: null, result: [...result], message: `Topological Order: ${result.join(' → ')}` });
  return steps;
}

export function bellmanFord(graph, start) {
  const steps = [];
  const nodes = Object.keys(graph);
  const dist = {};
  nodes.forEach(n => { dist[n] = n === start ? 0 : Infinity; });

  const edges = [];
  for (const u of nodes) {
    for (const neighbor of (graph[u] || [])) {
      const { node: v, weight } = typeof neighbor === 'object' ? neighbor : { node: neighbor, weight: 1 };
      edges.push({ u, v, weight });
    }
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    steps.push({ dist: { ...dist }, visited: new Set(), current: null, edge: null, message: `Iteration ${i + 1}` });
    for (const { u, v, weight } of edges) {
      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        steps.push({ dist: { ...dist }, visited: new Set(), current: v, edge: [u, v], message: `Relax ${u}→${v}: dist[${v}] = ${dist[v]}` });
      }
    }
  }
  steps.push({ dist: { ...dist }, visited: new Set(nodes), current: null, edge: null, message: 'Bellman-Ford Complete!' });
  return steps;
}

export const GRAPH_INFO = {
  bfs: {
    name: 'BFS',
    description: 'Breadth-First Search explores all neighbors at the current depth before moving deeper.',
    bestCase: 'O(V+E)', avgCase: 'O(V+E)', worstCase: 'O(V+E)', space: 'O(V)',
    pseudocode: [
      'BFS(graph, start):',
      '  queue = [start]',
      '  visited = {start}',
      '  while queue not empty:',
      '    node = dequeue',
      '    for each neighbor:',
      '      if not visited: enqueue'
    ],
    code: `import java.util.*;

public class BFS {

  public static void bfs(List<List<Integer>> graph, int start) {

    boolean[] visited = new boolean[graph.size()];
    Queue<Integer> queue = new LinkedList<>();

    visited[start] = true;
    queue.add(start);

    while (!queue.isEmpty()) {

      int node = queue.poll();
      System.out.print(node + " ");

      for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.add(neighbor);
        }
      }

    }
  }

}`
  },

  dfs: {
    name: 'DFS',
    description: 'Depth-First Search explores as far along each branch as possible before backtracking.',
    bestCase: 'O(V+E)', avgCase: 'O(V+E)', worstCase: 'O(V+E)', space: 'O(V)',
    pseudocode: [
      'DFS(graph, node):',
      '  visited.add(node)',
      '  for each neighbor:',
      '    if not visited:',
      '      DFS(neighbor)'
    ],
    code: `import java.util.*;

public class DFS {

  static void dfs(List<List<Integer>> graph, int node, boolean[] visited) {

    visited[node] = true;
    System.out.print(node + " ");

    for (int neighbor : graph.get(node)) {
      if (!visited[neighbor]) {
        dfs(graph, neighbor, visited);
      }
    }

  }

}`
  },

  dijkstra: {
    name: 'Dijkstra',
    description: "Finds shortest paths from a source to all other vertices in a weighted graph.",
    bestCase: 'O(V²)', avgCase: 'O(V²)', worstCase: 'O(V²)', space: 'O(V)',
    pseudocode: [
      'initialize dist[]=∞, dist[src]=0',
      'while unvisited nodes:',
      '  u = min dist unvisited',
      '  for each neighbor v:',
      '    if dist[u]+w < dist[v]:',
      '      dist[v] = dist[u]+w'
    ],
    code: `import java.util.*;

class Node {
  int vertex, weight;

  Node(int v, int w) {
    vertex = v;
    weight = w;
  }
}

public class Dijkstra {

  public static void dijkstra(List<List<Node>> graph, int src) {

    int V = graph.size();
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);

    dist[src] = 0;

    PriorityQueue<Node> pq = new PriorityQueue<>(
      Comparator.comparingInt(n -> n.weight)
    );

    pq.add(new Node(src, 0));

    while (!pq.isEmpty()) {

      Node current = pq.poll();

      for (Node neighbor : graph.get(current.vertex)) {

        int newDist = dist[current.vertex] + neighbor.weight;

        if (newDist < dist[neighbor.vertex]) {
          dist[neighbor.vertex] = newDist;
          pq.add(new Node(neighbor.vertex, newDist));
        }

      }

    }

  }

}`
  },

  prim: {
    name: "Prim's MST",
    description: "Builds minimum spanning tree by always adding the cheapest edge connecting to the tree.",
    bestCase: 'O(V²)', avgCase: 'O(V²)', worstCase: 'O(V²)', space: 'O(V)',
    pseudocode: [
      'initialize key[]=∞, key[0]=0',
      'while nodes not in MST:',
      '  u = min key not in MST',
      '  add u to MST',
      '  update keys of neighbors'
    ],
    code: `import java.util.*;

public class PrimMST {

  public static void prim(int[][] graph) {

    int V = graph.length;
    int[] key = new int[V];
    boolean[] mst = new boolean[V];

    Arrays.fill(key, Integer.MAX_VALUE);
    key[0] = 0;

    for (int count = 0; count < V - 1; count++) {

      int u = -1;
      int min = Integer.MAX_VALUE;

      for (int v = 0; v < V; v++) {
        if (!mst[v] && key[v] < min) {
          min = key[v];
          u = v;
        }
      }

      mst[u] = true;

      for (int v = 0; v < V; v++) {
        if (graph[u][v] != 0 && !mst[v] && graph[u][v] < key[v]) {
          key[v] = graph[u][v];
        }
      }

    }

  }

}`
  },

  kruskal: {
    name: "Kruskal's MST",
    description: "Builds MST by sorting all edges by weight and adding them if they don't form a cycle.",
    bestCase: 'O(E log E)', avgCase: 'O(E log E)', worstCase: 'O(E log E)', space: 'O(V)',
    pseudocode: [
      'sort edges by weight',
      'for each edge (u,v):',
      '  if find(u) != find(v):',
      '    union(u, v)',
      '    add edge to MST'
    ],
    code: `import java.util.*;

class Edge implements Comparable<Edge> {
  int src, dest, weight;

  public int compareTo(Edge e) {
    return this.weight - e.weight;
  }
}

public class Kruskal {

  static int find(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent, parent[i]);
  }

  static void union(int parent[], int x, int y) {
    int xset = find(parent, x);
    int yset = find(parent, y);
    parent[xset] = yset;
  }

}`
  },

  topological: {
    name: 'Topological Sort',
    description: 'Linear ordering of vertices such that for every edge (u,v), u comes before v.',
    bestCase: 'O(V+E)', avgCase: 'O(V+E)', worstCase: 'O(V+E)', space: 'O(V)',
    pseudocode: [
      'for each unvisited node:',
      '  DFS(node)',
      '  after DFS: push to stack',
      'reverse stack = topological order'
    ],
    code: `import java.util.*;

public class TopologicalSort {

  static void topoSort(int v, boolean[] visited,
                       Stack<Integer> stack,
                       List<List<Integer>> graph) {

    visited[v] = true;

    for (int neighbor : graph.get(v)) {
      if (!visited[neighbor]) {
        topoSort(neighbor, visited, stack, graph);
      }
    }

    stack.push(v);
  }

}`
  },

  bellmanFord: {
    name: 'Bellman-Ford',
    description: 'Finds shortest paths from source, handles negative weights. Runs V-1 iterations.',
    bestCase: 'O(VE)', avgCase: 'O(VE)', worstCase: 'O(VE)', space: 'O(V)',
    pseudocode: [
      'initialize dist[]=∞, dist[src]=0',
      'repeat V-1 times:',
      '  for each edge (u,v,w):',
      '    if dist[u]+w < dist[v]:',
      '      dist[v] = dist[u]+w'
    ],
    code: `import java.util.*;

class Edge {
  int src, dest, weight;
}

public class BellmanFord {

  public static void bellmanFord(Edge[] edges, int V, int src) {

    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    for (int i = 1; i < V; i++) {
      for (Edge e : edges) {

        if (dist[e.src] != Integer.MAX_VALUE &&
            dist[e.src] + e.weight < dist[e.dest]) {

          dist[e.dest] = dist[e.src] + e.weight;

        }

      }
    }

  }

}`
  }
};
