if (!process.env.GITHUB_TOKEN) {
  throw new Error(`GITHUB_TOKEN must be set`);
}

const IGNORE_REPOSITORIES = require("./lib/ignored-repositories");
const toLabelsList = require("./lib/to-labels-list");
const validateLabnels = require("./lib/validate-labels");
const setCard = require("./lib/set-card");
const normalizeLabels = require("./lib/normalize-labels");
const Octokit = require("./lib/octokit");

run();

async function run() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // https://developer.github.com/v3/repos/#list-organization-repositories
    for await (const response of octokit.paginate.iterator(
      "GET /orgs/:org/repos",
      {
        org: "octokit",
        type: "public",
      }
    )) {
      for (const repository of response.data) {
        console.log("-".repeat(80));

        if (repository.archived) {
          console.log(`${repository.name} is archived. Ignoring.`);
          continue;
        }

        if (IGNORE_REPOSITORIES.includes(repository.name)) {
          console.log(`${repository.name} is not a JS repository. Ignoring.`);
          continue;
        }

        const owner = repository.owner.login;
        const repo = repository.name;

        // console.log(`Loading issues for ${repo}`);

        // // https://developer.github.com/v3/issues/#list-repository-issues
        // for await (const response of octokit.paginate.iterator(
        //   "GET /repos/:owner/:repo/issues",
        //   {
        //     owner,
        //     repo,
        //     state: "open",
        //   }
        // )) {
        //   for (const issue of response.data) {
        //     if (issue.pull_request) {
        //       // pull requests are returned in the response, but their IDs are not the
        //       continue;
        //     }

        //     validateLabnels(issue);

        //     console.log(`- ${issue.html_url} ${toLabelsList(issue)}`);

        //     await setCard(octokit, issue);
        //   }
        // }

        // console.log(`Loading pull requests for ${repo}`);

        // // https://developer.github.com/v3/pulls/#list-pull-requests
        // for await (const response of octokit.paginate.iterator(
        //   "GET /repos/:owner/:repo/pulls",
        //   {
        //     owner,
        //     repo,
        //     state: "open",
        //   }
        // )) {
        //   for (const pullRequest of response.data) {
        //     validateLabnels(pullRequest);

        //     console.log(
        //       `- ${pullRequest.html_url} ${toLabelsList(pullRequest)}`
        //     );

        //     await setCard(octokit, pullRequest);
        //   }
        // }

        // https://developer.github.com/v3/issues/labels/#list-all-labels-for-this-repository
        console.log(`Normalizing labels for ${repo}`);
        await normalizeLabels(octokit, { owner, repo });
      }
    }

    // TODO: add all issues / PRs to /orgs/octokit/projects/1/columns/9041689

    console.log("done.");
  } catch (error) {
    console.error(error);
  }
}
