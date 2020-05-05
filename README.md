# add-issues-and-prs-to-octokit-project

> Internal utility script to update [the Octokit/JS project](https://github.com/orgs/octokit/projects/1)

This script loads all open issues and pull requests from all public JavaScript-related Octokit repositories in the [@octokit](https://github.com/octokit/) organization and add them to [the Octokit/JS project](https://github.com/orgs/octokit/projects/1).

It also normalizes labels across the same repositories.

I created it for a one-time use and future reference. For ongoing update of the board, I've registered the [`Octokit JS Project Board` GitHub App](https://github.com/apps/octokit-js-project-board/). It's hosted on Glitch: https://glitch.com/edit/#!/octokit-js-project-board?path=index.js

## Usage

```
git clone https://github.com/gr2m/add-issues-and-prs-to-octokit-project.git
cd add-issues-and-prs-to-octokit-project
npm install
GITHUB_TOKEN=[...] node index.js
```

Replace `[...]` with [a personal access token which includes the `repo` scope](https://github.com/settings/tokens/new?scopes=repo).

## License

[ISC](LICENSE)
