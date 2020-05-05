module.exports = setCard;

const toColumnId = require("./to-column-id");

async function setCard(octokit, pullRequestOrIssue) {
  const isIssue = !pullRequestOrIssue.head;
  const column_id = toColumnId(pullRequestOrIssue);
  try {
    await octokit.request("POST /projects/columns/:column_id/cards", {
      mediaType: {
        previews: ["inertia"],
      },
      column_id: column_id,
      content_id: pullRequestOrIssue.id,
      content_type: isIssue ? "Issue" : "PullRequest",
    });
  } catch (error) {
    if (error.status === 422) {
      // Don't throw error if project card is already set
      return;
    }

    throw error;
  }
}
