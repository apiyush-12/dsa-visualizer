// Generator-based sorting algorithms. Each yields steps for animation.
// Step format: { array: [...], comparing: [i, j], swapping: [i, j], sorted: [...], message: '...', line: n }

export function* bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  const sorted = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], message: `Comparing ${a[j]} and ${a[j + 1]}`, line: 2 };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], message: `Swapping ${a[j + 1]} and ${a[j]}`, line: 3 };
      }
    }
    sorted.push(n - 1 - i);
  }
  sorted.push(0);
  yield { array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Sorting complete!', line: 6 };
}

export function* selectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  const sorted = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { array: [...a], comparing: [i], swapping: [], sorted: [...sorted], message: `Finding minimum from index ${i}`, line: 1 };
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparing: [minIdx, j], swapping: [], sorted: [...sorted], message: `Comparing ${a[minIdx]} with ${a[j]}`, line: 3 };
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted], message: `Swapping ${a[minIdx]} to position ${i}`, line: 5 };
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  yield { array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Sorting complete!', line: 7 };
}

export function* insertionSort(arr) {
  const a = [...arr];
  const n = a.length;
  const sorted = [0];
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield { array: [...a], comparing: [i], swapping: [], sorted: [...sorted], message: `Inserting ${key} into sorted portion`, line: 1 };
    while (j >= 0 && a[j] > key) {
      yield { array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], message: `${a[j]} > ${key}, shifting right`, line: 3 };
      a[j + 1] = a[j];
      j--;
      yield { array: [...a], comparing: [], swapping: [j + 1, j + 2], sorted: [...sorted], message: `Shifted element right`, line: 4 };
    }
    a[j + 1] = key;
    sorted.push(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], message: `Placed ${key} at position ${j + 1}`, line: 5 };
  }
  yield { array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Sorting complete!', line: 7 };
}

export function* mergeSort(arr) {
  const a = [...arr];
  const n = a.length;
  const steps = [];

  function* mergeSortHelper(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* mergeSortHelper(lo, mid);
    yield* mergeSortHelper(mid + 1, hi);
    yield* merge(lo, mid, hi);
  }

  function* merge(lo, mid, hi) {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    yield { array: [...a], comparing: Array.from({ length: hi - lo + 1 }, (_, x) => lo + x), swapping: [], sorted: [], message: `Merging [${lo}..${mid}] and [${mid + 1}..${hi}]`, line: 1 };
    while (i < left.length && j < right.length) {
      yield { array: [...a], comparing: [lo + i, mid + 1 + j], swapping: [], sorted: [], message: `Comparing ${left[i]} and ${right[j]}`, line: 3 };
      if (left[i] <= right[j]) {
        a[k] = left[i]; i++;
      } else {
        a[k] = right[j]; j++;
      }
      yield { array: [...a], comparing: [], swapping: [k], sorted: [], message: `Placed ${a[k]} at position ${k}`, line: 4 };
      k++;
    }
    while (i < left.length) { a[k] = left[i]; i++; k++; }
    while (j < right.length) { a[k] = right[j]; j++; k++; }
    yield { array: [...a], comparing: [], swapping: [], sorted: [], message: `Merged [${lo}..${hi}]`, line: 6 };
  }

  yield* mergeSortHelper(0, n - 1);
  yield { array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Sorting complete!', line: 8 };
}

export function* quickSort(arr) {
  const a = [...arr];
  const n = a.length;

  function* qsort(lo, hi) {
    if (lo >= hi) return;
    const pivot = a[hi];
    yield { array: [...a], comparing: [hi], swapping: [], sorted: [], message: `Pivot = ${pivot} at index ${hi}`, line: 1 };
    let i = lo;
    for (let j = lo; j < hi; j++) {
      yield { array: [...a], comparing: [j, hi], swapping: [], sorted: [], message: `Comparing ${a[j]} with pivot ${pivot}`, line: 3 };
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        yield { array: [...a], comparing: [], swapping: [i, j], sorted: [], message: `Swapping ${a[j]} and ${a[i]}`, line: 4 };
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    yield { array: [...a], comparing: [], swapping: [i, hi], sorted: [], message: `Placing pivot ${pivot} at position ${i}`, line: 5 };
    yield* qsort(lo, i - 1);
    yield* qsort(i + 1, hi);
  }

  yield* qsort(0, n - 1);
  yield { array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Sorting complete!', line: 7 };
}

export function* heapSort(arr) {
  const a = [...arr];
  const n = a.length;

  function* heapify(size, i) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    yield { array: [...a], comparing: [i, largest], swapping: [], sorted: [], message: `Heapify: checking node ${i} (${a[i]})`, line: 2 };
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      yield { array: [...a], comparing: [], swapping: [i, largest], sorted: [], message: `Swapping ${a[largest]} and ${a[i]}`, line: 3 };
      yield* heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }
  yield { array: [...a], comparing: [], swapping: [], sorted: [], message: 'Max heap built', line: 5 };

  const sorted = [];
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.push(i);
    yield { array: [...a], comparing: [], swapping: [0, i], sorted: [...sorted], message: `Moving ${a[i]} to sorted position`, line: 6 };
    yield* heapify(i, 0);
  }
  sorted.push(0);
  yield { array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Sorting complete!', line: 8 };
}

export const SORTING_INFO = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order. Simple but inefficient for large datasets.',
    bestCase: 'O(n)', avgCase: 'O(n²)', worstCase: 'O(n²)', space: 'O(1)',
    pseudocode: [
      'for i = 0 to n-1:',
      '  for j = 0 to n-i-2:',
      '    if arr[j] > arr[j+1]:',
      '      swap(arr[j], arr[j+1])',
      '  end for',
      'end for'
    ],
    code: `public class BubbleSort {
  public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
      for (int j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  }
}`
  },

  selection: {
    name: 'Selection Sort',
    description: 'Finds the minimum element and places it at the beginning. Repeats for the remaining unsorted portion.',
    bestCase: 'O(n²)', avgCase: 'O(n²)', worstCase: 'O(n²)', space: 'O(1)',
    pseudocode: [
      'for i = 0 to n-1:',
      '  minIdx = i',
      '  for j = i+1 to n:',
      '    if arr[j] < arr[minIdx]:',
      '      minIdx = j',
      '  swap(arr[i], arr[minIdx])',
      'end for'
    ],
    code: `public class SelectionSort {
  public static void selectionSort(int[] arr) {
    int n = arr.length;

    for (int i = 0; i < n; i++) {
      int minIdx = i;

      for (int j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      int temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
}`
  },

  insertion: {
    name: 'Insertion Sort',
    description: 'Builds the sorted array one element at a time by inserting each element into its correct position.',
    bestCase: 'O(n)', avgCase: 'O(n²)', worstCase: 'O(n²)', space: 'O(1)',
    pseudocode: [
      'for i = 1 to n:',
      '  key = arr[i]',
      '  j = i - 1',
      '  while j >= 0 and arr[j] > key:',
      '    arr[j+1] = arr[j]',
      '    j = j - 1',
      '  arr[j+1] = key'
    ],
    code: `public class InsertionSort {
  public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {

      int key = arr[i];
      int j = i - 1;

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;
    }
  }
}`
  },

  merge: {
    name: 'Merge Sort',
    description: 'Divide-and-conquer algorithm that splits the array into halves, sorts each half, then merges them back.',
    bestCase: 'O(n log n)', avgCase: 'O(n log n)', worstCase: 'O(n log n)', space: 'O(n)',
    pseudocode: [
      'mergeSort(arr, lo, hi):',
      '  if lo >= hi: return',
      '  mid = (lo + hi) / 2',
      '  mergeSort(arr, lo, mid)',
      '  mergeSort(arr, mid+1, hi)',
      '  merge(arr, lo, mid, hi)'
    ],
    code: `public class MergeSort {

  public static void mergeSort(int[] arr, int left, int right) {

    if (left < right) {

      int mid = (left + right) / 2;

      mergeSort(arr, left, mid);
      mergeSort(arr, mid + 1, right);

      merge(arr, left, mid, right);
    }
  }

  public static void merge(int[] arr, int left, int mid, int right) {

    int n1 = mid - left + 1;
    int n2 = right - mid;

    int[] L = new int[n1];
    int[] R = new int[n2];

    for (int i = 0; i < n1; i++)
      L[i] = arr[left + i];

    for (int j = 0; j < n2; j++)
      R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {

      if (L[i] <= R[j])
        arr[k++] = L[i++];
      else
        arr[k++] = R[j++];
    }

    while (i < n1)
      arr[k++] = L[i++];

    while (j < n2)
      arr[k++] = R[j++];
  }
}`
  },

  quick: {
    name: 'Quick Sort',
    description: 'Selects a pivot element, partitions array around it, then recursively sorts the partitions.',
    bestCase: 'O(n log n)', avgCase: 'O(n log n)', worstCase: 'O(n²)', space: 'O(log n)',
    pseudocode: [
      'quickSort(arr, lo, hi):',
      '  if lo >= hi: return',
      '  pivot = arr[hi]',
      '  partition around pivot',
      '  quickSort(arr, lo, pivotIdx-1)',
      '  quickSort(arr, pivotIdx+1, hi)'
    ],
    code: `public class QuickSort {

  public static void quickSort(int[] arr, int low, int high) {

    if (low < high) {

      int pi = partition(arr, low, high);

      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }

  public static int partition(int[] arr, int low, int high) {

    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {

      if (arr[j] < pivot) {

        i++;

        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1;
  }
}`
  },

  heap: {
    name: 'Heap Sort',
    description: 'Builds a max heap from the array, then repeatedly extracts the maximum element to build the sorted result.',
    bestCase: 'O(n log n)', avgCase: 'O(n log n)', worstCase: 'O(n log n)', space: 'O(1)',
    pseudocode: [
      'buildMaxHeap(arr)',
      'for i = n-1 to 1:',
      '  swap(arr[0], arr[i])',
      '  heapify(arr, i, 0)'
    ],
    code: `public class HeapSort {

  public static void heapSort(int[] arr) {

    int n = arr.length;

    for (int i = n / 2 - 1; i >= 0; i--)
      heapify(arr, n, i);

    for (int i = n - 1; i > 0; i--) {

      int temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      heapify(arr, i, 0);
    }
  }

  public static void heapify(int[] arr, int n, int i) {

    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
      largest = left;

    if (right < n && arr[right] > arr[largest])
      largest = right;

    if (largest != i) {

      int temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      heapify(arr, n, largest);
    }
  }
}`
  }
};

export const SORTING_ALGORITHMS = { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort };
