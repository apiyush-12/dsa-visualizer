// BST implementation with animation steps
export class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
    this.color = 'default'; // for red-black tree
  }
}

export function bstInsert(root, value) {
  const steps = [];
  function insert(node, val, depth = 0) {
    if (!node) {
      steps.push({ type: 'insert', value: val, message: `Inserting ${val}` });
      return new BSTNode(val);
    }
    steps.push({ type: 'compare', nodeValue: node.value, value: val, message: `Comparing ${val} with ${node.value}` });
    if (val < node.value) {
      steps.push({ type: 'go_left', nodeValue: node.value, message: `${val} < ${node.value}, go left` });
      node.left = insert(node.left, val, depth + 1);
    } else if (val > node.value) {
      steps.push({ type: 'go_right', nodeValue: node.value, message: `${val} > ${node.value}, go right` });
      node.right = insert(node.right, val, depth + 1);
    }
    return node;
  }
  const newRoot = insert(root, value);
  return { root: newRoot, steps };
}

export function bstSearch(root, value) {
  const steps = [];
  function search(node, val) {
    if (!node) {
      steps.push({ type: 'not_found', message: `${val} not found in tree` });
      return false;
    }
    steps.push({ type: 'visit', nodeValue: node.value, message: `Visiting node ${node.value}` });
    if (val === node.value) {
      steps.push({ type: 'found', nodeValue: node.value, message: `Found ${val}!` });
      return true;
    }
    if (val < node.value) {
      steps.push({ type: 'go_left', nodeValue: node.value, message: `${val} < ${node.value}, go left` });
      return search(node.left, val);
    }
    steps.push({ type: 'go_right', nodeValue: node.value, message: `${val} > ${node.value}, go right` });
    return search(node.right, val);
  }
  search(root, value);
  return steps;
}

export function bstDelete(root, value) {
  const steps = [];
  function findMin(node) {
    while (node.left) node = node.left;
    return node;
  }
  function deleteNode(node, val) {
    if (!node) {
      steps.push({ type: 'not_found', message: `${val} not found` });
      return null;
    }
    steps.push({ type: 'visit', nodeValue: node.value, message: `Visiting ${node.value}` });
    if (val < node.value) {
      node.left = deleteNode(node.left, val);
    } else if (val > node.value) {
      node.right = deleteNode(node.right, val);
    } else {
      steps.push({ type: 'delete', nodeValue: node.value, message: `Deleting ${node.value}` });
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      const successor = findMin(node.right);
      steps.push({ type: 'replace', nodeValue: node.value, successor: successor.value, message: `Replacing with successor ${successor.value}` });
      node.value = successor.value;
      node.right = deleteNode(node.right, successor.value);
    }
    return node;
  }
  const newRoot = deleteNode(root, value);
  return { root: newRoot, steps };
}

// Traversals
export function inorder(root) {
  const steps = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    steps.push({ type: 'visit', nodeValue: node.value, message: `Visit ${node.value}` });
    traverse(node.right);
  }
  traverse(root);
  return steps;
}

export function preorder(root) {
  const steps = [];
  function traverse(node) {
    if (!node) return;
    steps.push({ type: 'visit', nodeValue: node.value, message: `Visit ${node.value}` });
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return steps;
}

export function postorder(root) {
  const steps = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    steps.push({ type: 'visit', nodeValue: node.value, message: `Visit ${node.value}` });
  }
  traverse(root);
  return steps;
}

export function levelOrder(root) {
  const steps = [];
  if (!root) return steps;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    steps.push({ type: 'visit', nodeValue: node.value, message: `Visit ${node.value} (level order)` });
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return steps;
}

// AVL helpers
function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function getBalance(node) {
  if (!node) return 0;
  return height(node.left) - height(node.right);
}

function rotateRight(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  return x;
}

function rotateLeft(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  return y;
}

export function avlInsert(root, value) {
  const steps = [];
  function insert(node, val) {
    if (!node) {
      steps.push({ type: 'insert', value: val, message: `Inserting ${val}` });
      return new BSTNode(val);
    }
    steps.push({ type: 'compare', nodeValue: node.value, message: `Comparing ${val} with ${node.value}` });
    if (val < node.value) node.left = insert(node.left, val);
    else if (val > node.value) node.right = insert(node.right, val);
    else return node;

    const balance = getBalance(node);
    // Left Left
    if (balance > 1 && val < node.left.value) {
      steps.push({ type: 'rotate', rotation: 'Right', nodeValue: node.value, message: `Right rotation at ${node.value}` });
      return rotateRight(node);
    }
    // Right Right
    if (balance < -1 && val > node.right.value) {
      steps.push({ type: 'rotate', rotation: 'Left', nodeValue: node.value, message: `Left rotation at ${node.value}` });
      return rotateLeft(node);
    }
    // Left Right
    if (balance > 1 && val > node.left.value) {
      steps.push({ type: 'rotate', rotation: 'Left-Right', nodeValue: node.value, message: `Left-Right rotation at ${node.value}` });
      node.left = rotateLeft(node.left);
      return rotateRight(node);
    }
    // Right Left
    if (balance < -1 && val < node.right.value) {
      steps.push({ type: 'rotate', rotation: 'Right-Left', nodeValue: node.value, message: `Right-Left rotation at ${node.value}` });
      node.right = rotateRight(node.right);
      return rotateLeft(node);
    }
    return node;
  }
  const newRoot = insert(root, value);
  return { root: newRoot, steps };
}

export const TREE_INFO = {
  bst: { 
    name: 'Binary Search Tree',
    description: 'A binary tree where left children are smaller and right children are larger than the parent.',
    bestCase: 'O(log n)',
    avgCase: 'O(log n)',
    worstCase: 'O(n)',
    space: 'O(n)',
    pseudocode: [
      'insert(node, val):',
      '  if node is null: return new Node(val)',
      '  if val < node.val: node.left = insert(node.left, val)',
      '  if val > node.val: node.right = insert(node.right, val)',
      '  return node'
    ],

    code: `class Node {
    int val;
    Node left, right;

    Node(int val) {
        this.val = val;
        left = right = null;
    }
}

class BST {

    Node root;

    Node insert(Node node, int val) {
        if (node == null) {
            return new Node(val);
        }

        if (val < node.val) {
            node.left = insert(node.left, val);
        } else if (val > node.val) {
            node.right = insert(node.right, val);
        }

        return node;
    }

    boolean search(Node node, int val) {
        if (node == null) return false;

        if (val == node.val) return true;

        if (val < node.val)
            return search(node.left, val);
        else
            return search(node.right, val);
    }

    Node delete(Node node, int val) {
        if (node == null) return null;

        if (val < node.val) {
            node.left = delete(node.left, val);
        }
        else if (val > node.val) {
            node.right = delete(node.right, val);
        }
        else {

            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            Node min = findMin(node.right);
            node.val = min.val;
            node.right = delete(node.right, min.val);
        }

        return node;
    }

    Node findMin(Node node) {
        while (node.left != null)
            node = node.left;
        return node;
    }
}`
  },

  avl: { 
    name: 'AVL Tree',
    description: 'Self-balancing BST where the height difference between left and right subtrees is at most 1.',
    bestCase: 'O(log n)',
    avgCase: 'O(log n)',
    worstCase: 'O(log n)',
    space: 'O(n)',
    pseudocode: [
      'insert(node, val):',
      '  BST insert',
      '  check balance factor',
      '  if unbalanced: rotate',
      '  LL → right rotate',
      '  RR → left rotate',
      '  LR → left-right rotate',
      '  RL → right-left rotate'
    ],

    code: `class Node {
    int val, height;
    Node left, right;

    Node(int val) {
        this.val = val;
        height = 1;
    }
}

class AVL {

    int height(Node n) {
        if (n == null) return 0;
        return n.height;
    }

    int getBalance(Node n) {
        if (n == null) return 0;
        return height(n.left) - height(n.right);
    }

    Node rotateRight(Node y) {
        Node x = y.left;
        Node T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;

        return x;
    }

    Node rotateLeft(Node x) {
        Node y = x.right;
        Node T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;

        return y;
    }

    Node insert(Node node, int val) {

        if (node == null)
            return new Node(val);

        if (val < node.val)
            node.left = insert(node.left, val);
        else if (val > node.val)
            node.right = insert(node.right, val);
        else
            return node;

        node.height = 1 + Math.max(height(node.left), height(node.right));

        int balance = getBalance(node);

        if (balance > 1 && val < node.left.val)
            return rotateRight(node);

        if (balance < -1 && val > node.right.val)
            return rotateLeft(node);

        if (balance > 1 && val > node.left.val) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }

        if (balance < -1 && val < node.right.val) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }

        return node;
    }
}`
  }
};
