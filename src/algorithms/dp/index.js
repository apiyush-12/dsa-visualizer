// DP Algorithms with animation steps

export function fibonacciDP(n) {
  const steps = [];
  const dp = Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  steps.push({ dp: [...dp], cell: 0, message: 'Initialize dp[0] = 0', row: 0, col: 0 });
  steps.push({ dp: [...dp], cell: 1, message: 'Initialize dp[1] = 1', row: 0, col: 1 });

  for (let i = 2; i <= n; i++) {
    steps.push({ dp: [...dp], cell: i, comparing: [i - 1, i - 2], message: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}` });
    dp[i] = dp[i - 1] + dp[i - 2];
    steps.push({ dp: [...dp], cell: i, message: `dp[${i}] = ${dp[i]}` });
  }
  steps.push({ dp: [...dp], cell: -1, message: `Fibonacci(${n}) = ${dp[n]}` });
  return steps;
}

export function knapsackDP(weights, values, capacity) {
  const n = weights.length;
  const steps = [];
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
        steps.push({
          table: dp.map(r => [...r]), row: i, col: w,
          message: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}): max(${dp[i - 1][w]}, ${values[i - 1]}+${dp[i - 1][w - weights[i - 1]]}) = ${dp[i][w]}`
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          table: dp.map(r => [...r]), row: i, col: w,
          message: `Item ${i} too heavy (w=${weights[i - 1]} > ${w}), dp[${i}][${w}] = ${dp[i][w]}`
        });
      }
    }
  }
  steps.push({ table: dp.map(r => [...r]), row: -1, col: -1, message: `Max value = ${dp[n][capacity]}` });
  return steps;
}

export function lcsDP(s1, s2) {
  const m = s1.length, n = s2.length;
  const steps = [];
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({ table: dp.map(r => [...r]), row: i, col: j, message: `'${s1[i - 1]}' == '${s2[j - 1]}': dp[${i}][${j}] = ${dp[i][j]}`, match: true });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({ table: dp.map(r => [...r]), row: i, col: j, message: `'${s1[i - 1]}' != '${s2[j - 1]}': dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`, match: false });
      }
    }
  }
  steps.push({ table: dp.map(r => [...r]), row: -1, col: -1, message: `LCS length = ${dp[m][n]}` });
  return steps;
}

export function coinChangeDP(coins, amount) {
  const steps = [];
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  steps.push({ dp: [...dp], cell: 0, message: 'Initialize dp[0] = 0' });

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        steps.push({ dp: [...dp], cell: i, coin, message: `dp[${i}] = dp[${i - coin}] + 1 = ${dp[i]} (using coin ${coin})` });
      }
    }
  }
  steps.push({ dp: [...dp], cell: -1, message: dp[amount] === Infinity ? `Cannot make ${amount}` : `Min coins for ${amount} = ${dp[amount]}` });
  return steps;
}

export function matrixChainDP(dims) {
  const n = dims.length - 1;
  const steps = [];
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          steps.push({ table: dp.map(r => [...r]), row: i, col: j, message: `M[${i + 1}..${j + 1}] split at ${k + 1}: cost=${cost}` });
        }
      }
    }
  }
  steps.push({ table: dp.map(r => [...r]), row: -1, col: -1, message: `Minimum multiplications = ${dp[0][n - 1]}` });
  return steps;
}

export const DP_INFO = {
  fibonacci: {
    name: 'Fibonacci DP',
    description: 'Computes Fibonacci numbers using bottom-up DP, avoiding redundant recursive calls.',
    bestCase: 'O(n)', avgCase: 'O(n)', worstCase: 'O(n)', space: 'O(n)',
    pseudocode: [
      'dp[0] = 0, dp[1] = 1',
      'for i = 2 to n:',
      '  dp[i] = dp[i-1] + dp[i-2]',
      'return dp[n]'
    ],
    code: `public class FibonacciDP {

  public static int fib(int n) {

    if (n <= 1) return n;

    int[] dp = new int[n + 1];

    dp[0] = 0;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
  }

}`
  },

  knapsack: {
    name: '0/1 Knapsack',
    description: 'Find max value subset of items that fits in capacity.',
    bestCase: 'O(nW)', avgCase: 'O(nW)', worstCase: 'O(nW)', space: 'O(nW)',
    pseudocode: [
      'for i = 1 to n:',
      '  for w = 0 to W:',
      '    if weight[i] <= w:',
      '      dp[i][w] = max(dp[i-1][w], val[i]+dp[i-1][w-wt[i]])',
      '    else: dp[i][w] = dp[i-1][w]'
    ],
    code: `public class Knapsack {

  public static int knapsack(int[] weight, int[] value, int W) {

    int n = weight.length;
    int[][] dp = new int[n + 1][W + 1];

    for (int i = 1; i <= n; i++) {

      for (int w = 0; w <= W; w++) {

        if (weight[i - 1] <= w) {

          dp[i][w] = Math.max(
            dp[i - 1][w],
            value[i - 1] + dp[i - 1][w - weight[i - 1]]
          );

        } else {

          dp[i][w] = dp[i - 1][w];

        }

      }

    }

    return dp[n][W];
  }

}`
  },

  lcs: {
    name: 'Longest Common Subsequence',
    description: 'Find the longest subsequence common to two strings.',
    bestCase: 'O(mn)', avgCase: 'O(mn)', worstCase: 'O(mn)', space: 'O(mn)',
    pseudocode: [
      'for i = 1 to m:',
      '  for j = 1 to n:',
      '    if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1]+1',
      '    else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])'
    ],
    code: `public class LCS {

  public static int lcs(String s1, String s2) {

    int m = s1.length();
    int n = s2.length();

    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {

      for (int j = 1; j <= n; j++) {

        if (s1.charAt(i - 1) == s2.charAt(j - 1)) {

          dp[i][j] = dp[i - 1][j - 1] + 1;

        } else {

          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

        }

      }

    }

    return dp[m][n];
  }

}`
  },

  coin: {
    name: 'Coin Change',
    description: 'Find min number of coins to make a given amount.',
    bestCase: 'O(nA)', avgCase: 'O(nA)', worstCase: 'O(nA)', space: 'O(A)',
    pseudocode: [
      'dp[0] = 0',
      'for i = 1 to amount:',
      '  for each coin:',
      '    if coin <= i:',
      '      dp[i] = min(dp[i], dp[i-coin]+1)'
    ],
    code: `import java.util.Arrays;

public class CoinChange {

  public static int coinChange(int[] coins, int amount) {

    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);

    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {

      for (int coin : coins) {

        if (coin <= i) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }

      }

    }

    return dp[amount] > amount ? -1 : dp[amount];
  }

}`
  },

  matrix: {
    name: 'Matrix Chain Multiplication',
    description: 'Find optimal way to parenthesize matrix multiplications.',
    bestCase: 'O(n³)', avgCase: 'O(n³)', worstCase: 'O(n³)', space: 'O(n²)',
    pseudocode: [
      'for len = 2 to n:',
      '  for i = 0 to n-len:',
      '    j = i+len-1',
      '    for k = i to j-1:',
      '      cost = dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]',
      '      dp[i][j] = min(dp[i][j], cost)'
    ],
    code: `public class MatrixChainMultiplication {

  public static int matrixChain(int[] p) {

    int n = p.length - 1;
    int[][] dp = new int[n][n];

    for (int len = 2; len <= n; len++) {

      for (int i = 0; i < n - len + 1; i++) {

        int j = i + len - 1;
        dp[i][j] = Integer.MAX_VALUE;

        for (int k = i; k < j; k++) {

          int cost = dp[i][k]
                   + dp[k + 1][j]
                   + p[i] * p[k + 1] * p[j + 1];

          dp[i][j] = Math.min(dp[i][j], cost);

        }

      }

    }

    return dp[0][n - 1];
  }

}`
  }
};
