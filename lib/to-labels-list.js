module.exports = toLabelsList;

function toLabelsList(issueOrPullRequest) {
  return (
    issueOrPullRequest.labels.map((label) => label.name).join(", ") ||
    "<no labels>"
  );
}
