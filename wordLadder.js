// const axios = require('axios');
// read file words.txt and parse new line store all small case words in a set
const fs = require('fs');
const wordList = new Set();
fs.readFileSync('./words.txt', 'utf8')
  .split('\n')
  .forEach((word) => {
    wordList.add(word.toLowerCase());
  });

class Solution {
  constructor(beginWord, endWord) {
    this.beginWord = beginWord;
    this.endWord = endWord;
  }
  //   wordList = new Set(['hit', 'hot', 'dot', 'dog', 'lot', 'log', 'cog']);

  // Function to check if a word is valid by calling the dictionary API
  isValidWord(word) {
    try {
      return wordList.has(word);
    } catch (error) {
      return false;
    }
  }

  // BFS to find the minimum number of steps (levels) from beginWord to endWord
  getMinSteps(levels, beginWord, endWord) {
    const queue = [];
    queue.push([beginWord, 0]);
    const visited = new Set();
    visited.add(beginWord);
    let foundEndWord = false;

    while (queue.length > 0) {
      const [currentWord, currentLevel] = queue.shift();
      if (currentWord === endWord) {
        foundEndWord = true;
        levels.set(currentWord, currentLevel);
        break;
      }
      levels.set(currentWord, currentLevel);

      for (let i = 0; i < currentWord.length; i++) {
        for (let ch = 97; ch <= 122; ch++) {
          const newChar = String.fromCharCode(ch);
          const newWord =
            currentWord.substring(0, i) +
            newChar +
            currentWord.substring(i + 1);

          if (!visited.has(newWord)) {
            const isValid = this.isValidWord(newWord);
            if (isValid) {
              queue.push([newWord, currentLevel + 1]);
              visited.add(newWord);
            }
          }
        }
      }
    }
    return foundEndWord;
  }

  // DFS to backtrack and find all shortest paths from endWord to beginWord
  dfs(endWord, currentLevel, visited, tempPath, results, levels) {
    tempPath.push(endWord);

    if (currentLevel === 0) {
      results.push([...tempPath].reverse());
      tempPath.pop();
      return;
    }

    for (let i = 0; i < endWord.length; i++) {
      for (let ch = 97; ch <= 122; ch++) {
        const newChar = String.fromCharCode(ch);
        const newWord =
          endWord.substring(0, i) + newChar + endWord.substring(i + 1);

        if (visited.has(newWord) && levels.get(newWord) + 1 === currentLevel) {
          this.dfs(
            newWord,
            levels.get(newWord),
            visited,
            tempPath,
            results,
            levels
          );
        }
      }
    }

    tempPath.pop();
  }

  // Main function to find the shortest transformation sequences
  async findLadders() {
    const levels = new Map();
    const results = [];

    // Call the API to check if the endWord is valid
    const isValidEndWord = this.isValidWord(this.endWord);
    if (!isValidEndWord) {
      return results; // If the endWord is not valid, return an empty array
    }

    // Perform BFS to get the minimum steps to the endWord
    const found = this.getMinSteps(levels, this.beginWord, this.endWord);

    if (!found) {
      return results;
    }

    // Create a visited set for DFS traversal
    const visited = new Set([...levels.keys()]); // Populate with valid words from BFS

    this.dfs(
      this.endWord,
      levels.get(this.endWord),
      visited,
      [],
      results,
      levels
    );

    return results;
  }
}

setTimeout(() => {
  const solution = new Solution(...process.argv.slice(2));
  solution.findLadders().then((res) => {
    console.log(res);
  });
}, 2 * 1000);
