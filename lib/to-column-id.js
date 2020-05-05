module.exports = toColumnId;

const CATEGORY_TO_COLUMN_ID = {
  "awaiting response": 9043179,
  support: 9041691,
  maintenance: 9054373,
  bug: 9041693,
  feature: 9041695,
  "in progress": 3301034,
  blocked: 9041710,
  done: 6400190,
  inbox: 9041689,
};

function toColumnId(issueOrPullRequest) {
  return CATEGORY_TO_COLUMN_ID[toCategoryName(issueOrPullRequest)];
}

function toCategoryName(issueOrPullRequest) {
  const labels = issueOrPullRequest.labels.map((label) => label.name);

  if (issueOrPullRequest.state === "closed") {
    return "done";
  }

  for (const label of ["blocked", "awaiting response"]) {
    if (labels.includes(label)) {
      return label;
    }
  }

  if (issueOrPullRequest.assignees.length) {
    return "in progress";
  }

  for (const label of ["feature", "bug", "support"]) {
    if (labels.includes(label)) {
      return label;
    }
  }

  return "inbox";
}
