module.exports = normalizeLabels;

const LABELS = require("./labels");

async function normalizeLabels(octokit, { owner, repo }) {
  for await (const response of octokit.paginate.iterator(
    "GET /repos/:owner/:repo/labels",
    {
      owner,
      repo,
      state: "open",
    }
  )) {
    const existingLabels = response.data;
    const labelsToUpdate = [];
    const labelsToDelete = [];
    const labelNamesMatches = [];
    for (const existingLabel of existingLabels) {
      const existingLabelName = existingLabel.name.toLowerCase();
      const match = LABELS.find((label) => {
        return (
          label.name.toLowerCase() === existingLabelName ||
          (label.aliases || []).includes(existingLabelName)
        );
      });
      if (match) {
        labelNamesMatches.push(existingLabelName);
        if (
          match.name !== existingLabel.name ||
          match.description !== existingLabel.description ||
          match.color !== existingLabel.color
        ) {
          labelsToUpdate.push(
            Object.assign(
              {},
              existingLabel,
              {
                name: existingLabel.name,
                description: match.description,
                color: match.color,
              },
              existingLabel.name !== match.name
                ? {
                    new_name: match.name,
                  }
                : null
            )
          );
        }
      } else {
        if (/released on /.test(existingLabelName)) {
          if (existingLabel.color !== "ffffff") {
            labelsToUpdate.push(
              Object.assign(existingLabel, {
                color: "ffffff",
              })
            );
          }
        } else {
          labelsToDelete.push(existingLabel);
        }
      }
    }
    const labelsToCreate = LABELS.filter((label) => {
      return (
        !labelNamesMatches.includes(label.name) &&
        !labelsToUpdate.map((label) => label.new_name).includes(label.name)
      );
    });
    for (const label of labelsToUpdate) {
      // https://developer.github.com/v3/issues/labels/#update-a-label
      console.log(`Updating label ${label.name}`);
      await octokit.request("PATCH /repos/:owner/:repo/labels/:name", {
        owner,
        repo,
        name: label.name,
        new_name: label.new_name,
        description: label.description,
        color: label.color,
      });
    }
    for (const label of labelsToDelete) {
      // https://developer.github.com/v3/issues/labels/#update-a-label
      console.log(`Deleting label ${label.name}`);
      await octokit.request("DELETE /repos/:owner/:repo/labels/:name", {
        owner,
        repo,
        name: label.name,
      });
    }
    for (const label of labelsToCreate) {
      // https://developer.github.com/v3/issues/labels/#update-a-label
      console.log(`Creating label ${label.name}`);
      const { name, description, color } = label;
      await octokit.request("POST /repos/:owner/:repo/labels", {
        owner,
        repo,
        name,
        description,
        color,
      });
    }
    console.log("");
  }
}
