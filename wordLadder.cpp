#include <iostream>
#include <fstream>
#include <string>
#include <set>
#include <queue>
#include <map>
#include <vector>
#include <algorithm>

class Solution
{
private:
    std::string beginWord, endWord;
    std::set<std::string> wordList;

public:
    Solution(const std::string &begin, const std::string &end, const std::string &filename)
    {
        beginWord = begin;
        endWord = end;
        std::ifstream file(filename);
        std::string word;
        while (std::getline(file, word))
        {
            wordList.insert(word);
        }
    }

    bool isValidWord(const std::string &word)
    {
        return wordList.find(word) != wordList.end();
    }

    bool getMinSteps(std::map<std::string, int> &levels)
    {
        std::queue<std::pair<std::string, int>> queue;
        queue.push({beginWord, 0});
        std::set<std::string> visited;
        visited.insert(beginWord);

        while (!queue.empty())
        {
            std::pair<std::string, int> top = queue.front();
            std::string currentWord = top.first;
            int currentLevel = top.second;
            queue.pop();
            levels[currentWord] = currentLevel;

            if (currentWord == endWord)
            {
                return true;
            }

            for (int i = 0; i < currentWord.length(); i++)
            {
                for (char ch = 'a'; ch <= 'z'; ch++)
                {
                    std::string newWord = currentWord.substr(0, i) + ch + currentWord.substr(i + 1);
                    if (!visited.count(newWord) && isValidWord(newWord))
                    {
                        queue.push({newWord, currentLevel + 1});
                        visited.insert(newWord);
                    }
                }
            }
        }
        return false;
    }
    void dfs(const std::string &word, int level, std::set<std::string> &visited, std::vector<std::string> &path, std::vector<std::vector<std::string>> &results, std::map<std::string, int> &levels)
    {
        path.push_back(word);

        if (level == 0)
        {
            results.push_back(std::vector<std::string>(path.rbegin(), path.rend()));
            path.pop_back();
            return;
        }

        for (int i = 0; i < word.length(); i++)
        {
            for (char ch = 'a'; ch <= 'z'; ch++)
            {
                std::string newWord = word.substr(0, i) + ch + word.substr(i + 1);
                if (visited.count(newWord) && levels[newWord] + 1 == level)
                {
                    dfs(newWord, levels[newWord], visited, path, results, levels);
                }
            }
        }

        path.pop_back();
    }

    std::vector<std::vector<std::string>> findLadders()
    {
        std::map<std::string, int> levels;
        std::vector<std::vector<std::string>> results;

        if (!isValidWord(endWord))
        {
            return results;
        }

        bool found = getMinSteps(levels);
        if (!found)
        {
            return results;
        }

        // Correctly initialize the visited set with only the keys from levels
        std::set<std::string> visited;
        for (const auto &pair : levels)
        {
            visited.insert(pair.first);
        }

        std::vector<std::string> path;
        dfs(endWord, levels[endWord], visited, path, results, levels);

        return results;
    }
};

int main(int argc, char *argv[])
{
    if (argc < 3)
    {
        std::cout << "Usage: " << argv[0] << " <beginWord> <endWord>" << std::endl;
        return 1;
    }
    std::string filePathRelative = "words.txt";
    Solution solution(argv[1], argv[2], filePathRelative);
    auto ladders = solution.findLadders();

    for (const auto &ladder : ladders)
    {
        for (const auto &word : ladder)
        {
            std::cout << word << " -> ";
        }
        std::cout << "END" << std::endl;
    }

    return 0;
}
