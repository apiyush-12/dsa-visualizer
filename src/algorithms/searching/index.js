// Generator-based searching algorithms

export function* linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    yield { array: arr, current: i, found: -1, window: [], message: `Checking index ${i}: ${arr[i]}`, line: 1 };
    if (arr[i] === target) {
      yield { array: arr, current: i, found: i, window: [], message: `Found ${target} at index ${i}!`, line: 2 };
      return;
    }
  }
  yield { array: arr, current: -1, found: -1, window: [], message: `${target} not found in array`, line: 3 };
}

export function* binarySearch(arr, target) {
  const sorted = [...arr].sort((a, b) => a - b);
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield { array: sorted, current: mid, found: -1, window: [lo, hi], message: `Window [${lo}..${hi}], checking mid=${mid} (${sorted[mid]})`, line: 1 };
    if (sorted[mid] === target) {
      yield { array: sorted, current: mid, found: mid, window: [lo, hi], message: `Found ${target} at index ${mid}!`, line: 2 };
      return;
    }
    if (sorted[mid] < target) {
      lo = mid + 1;
      yield { array: sorted, current: mid, found: -1, window: [lo, hi], message: `${sorted[mid]} < ${target}, searching right half`, line: 3 };
    } else {
      hi = mid - 1;
      yield { array: sorted, current: mid, found: -1, window: [lo, hi], message: `${sorted[mid]} > ${target}, searching left half`, line: 4 };
    }
  }
  yield { array: sorted, current: -1, found: -1, window: [], message: `${target} not found`, line: 5 };
}

export function* jumpSearch(arr, target) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const jump = Math.floor(Math.sqrt(n));
  let prev = 0;

  while (prev < n && sorted[Math.min(prev + jump, n) - 1] < target) {
    yield { array: sorted, current: Math.min(prev + jump, n) - 1, found: -1, window: [prev, Math.min(prev + jump, n) - 1], message: `Jumping to index ${Math.min(prev + jump, n) - 1}: ${sorted[Math.min(prev + jump, n) - 1]}`, line: 1 };
    prev += jump;
  }

  for (let i = prev; i < Math.min(prev + jump, n); i++) {
    yield { array: sorted, current: i, found: -1, window: [prev, Math.min(prev + jump, n) - 1], message: `Linear scan at index ${i}: ${sorted[i]}`, line: 2 };
    if (sorted[i] === target) {
      yield { array: sorted, current: i, found: i, window: [], message: `Found ${target} at index ${i}!`, line: 3 };
      return;
    }
  }
  yield { array: sorted, current: -1, found: -1, window: [], message: `${target} not found`, line: 4 };
}

export function* interpolationSearch(arr, target) {
  const sorted = [...arr].sort((a, b) => a - b);
  let lo = 0, hi = sorted.length - 1;

  while (lo <= hi && target >= sorted[lo] && target <= sorted[hi]) {
    if (lo === hi) {
      if (sorted[lo] === target) {
        yield { array: sorted, current: lo, found: lo, window: [lo, hi], message: `Found ${target} at index ${lo}!`, line: 2 };
      }
      return;
    }
    const pos = lo + Math.floor(((target - sorted[lo]) * (hi - lo)) / (sorted[hi] - sorted[lo]));
    yield { array: sorted, current: pos, found: -1, window: [lo, hi], message: `Interpolated position: ${pos} (${sorted[pos]})`, line: 1 };

    if (sorted[pos] === target) {
      yield { array: sorted, current: pos, found: pos, window: [lo, hi], message: `Found ${target} at index ${pos}!`, line: 2 };
      return;
    }
    if (sorted[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  yield { array: sorted, current: -1, found: -1, window: [], message: `${target} not found`, line: 3 };
}

export const SEARCHING_INFO = {
  linear: {
    name: 'Linear Search',
    description: 'Sequentially checks each element until the target is found or the end is reached.',
    bestCase: 'O(1)', avgCase: 'O(n)', worstCase: 'O(n)', space: 'O(1)',
    pseudocode: [
      'for i = 0 to n-1:',
      '  if arr[i] == target:',
      '    return i',
      'return -1'
    ],
    code: `public class LinearSearch {

  public static int linearSearch(int[] arr, int target) {

    for (int i = 0; i < arr.length; i++) {

      if (arr[i] == target) {
        return i;
      }

    }

    return -1;
  }

}`
  },

  binary: {
    name: 'Binary Search',
    description: 'Efficiently searches a sorted array by repeatedly halving the search window.',
    bestCase: 'O(1)', avgCase: 'O(log n)', worstCase: 'O(log n)', space: 'O(1)',
    pseudocode: [
      'lo = 0, hi = n-1',
      'while lo <= hi:',
      '  mid = (lo + hi) / 2',
      '  if arr[mid] == target: return mid',
      '  if arr[mid] < target: lo = mid + 1',
      '  else: hi = mid - 1'
    ],
    code: `public class BinarySearch {

  public static int binarySearch(int[] arr, int target) {

    int lo = 0;
    int hi = arr.length - 1;

    while (lo <= hi) {

      int mid = (lo + hi) / 2;

      if (arr[mid] == target)
        return mid;

      if (arr[mid] < target)
        lo = mid + 1;
      else
        hi = mid - 1;

    }

    return -1;
  }

}`
  },

  jump: {
    name: 'Jump Search',
    description: 'Searches by jumping ahead by fixed steps, then does linear search in the block.',
    bestCase: 'O(1)', avgCase: 'O(√n)', worstCase: 'O(√n)', space: 'O(1)',
    pseudocode: [
      'jump = √n',
      'while arr[min(jump,n)-1] < target:',
      '  prev = jump, jump += √n',
      'for i = prev to min(jump,n):',
      '  if arr[i] == target: return i'
    ],
    code: `public class JumpSearch {

  public static int jumpSearch(int[] arr, int target) {

    int n = arr.length;
    int step = (int)Math.floor(Math.sqrt(n));
    int prev = 0;

    while (arr[Math.min(step, n) - 1] < target) {

      prev = step;
      step += (int)Math.floor(Math.sqrt(n));

      if (prev >= n)
        return -1;

    }

    for (int i = prev; i < Math.min(step, n); i++) {

      if (arr[i] == target)
        return i;

    }

    return -1;
  }

}`
  },

  interpolation: {
    name: 'Interpolation Search',
    description: 'Improvement over binary search for uniformly distributed data. Uses interpolation to estimate position.',
    bestCase: 'O(1)', avgCase: 'O(log log n)', worstCase: 'O(n)', space: 'O(1)',
    pseudocode: [
      'while lo <= hi and target in range:',
      '  pos = lo + ((target-arr[lo])*(hi-lo))/(arr[hi]-arr[lo])',
      '  if arr[pos] == target: return pos',
      '  if arr[pos] < target: lo = pos + 1',
      '  else: hi = pos - 1'
    ],
    code: `public class InterpolationSearch {

  public static int interpolationSearch(int[] arr, int target) {

    int lo = 0;
    int hi = arr.length - 1;

    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {

      int pos = lo + ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]);

      if (arr[pos] == target)
        return pos;

      if (arr[pos] < target)
        lo = pos + 1;
      else
        hi = pos - 1;

    }

    return -1;
  }

}`
  }
};

export const SEARCHING_ALGORITHMS = { linearSearch, binarySearch, jumpSearch, interpolationSearch };
