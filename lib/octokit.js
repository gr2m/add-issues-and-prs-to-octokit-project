const { Octokit: Core } = require("@octokit/core");
const { paginateRest } = require("@octokit/plugin-paginate-rest");
const { throttling } = require("@octokit/plugin-throttling");

const PKG = require("../package.json");

module.exports = Core.plugin(paginateRest, throttling).defaults({
  throttle: {
    onRateLimit: (retryAfter, options) => {
      console.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      // retry 3 times
      if (options.request.retryCount < 3) {
        console.log(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onAbuseLimit: (retryAfter, options) => {
      // does not retry, only logs a warning
      console.warn(
        `Abuse detected for request ${options.method} ${options.url}`
      );

      // retry 3 times
      if (options.request.retryCount < 3) {
        console.log(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
  },
  userAgent: `${PKG.name}/${PKG.version}`,
});
