module.exports = validateLabnels;

const CATEGORY_LABELS = ["support", "bug", "feature"];

function validateLabnels(issueOrPullRequest) {
  const labelNames = issueOrPullRequest.labels.map((label) => label.name);
  const categoryLabels = labelNames.filter((labelName) =>
    CATEGORY_LABELS.includes(labelName)
  );

  if (categoryLabels.length === 0) {
    console.warn(
      `ℹ️ ${
        issueOrPullRequest.html_url
      } is missing one of the following labels: ${CATEGORY_LABELS.join(", ")}`
    );
  }

  if (categoryLabels.length > 1) {
    console.warn(
      `⚠️ ${issueOrPullRequest.html_url} has ${
        categoryLabels.length
      } category labels (${categoryLabels.join(
        ", "
      )}), but only one is allowed.`
    );
  }
}
