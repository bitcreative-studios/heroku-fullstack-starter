const NUMBER_OF_CORES = require("os").cpus().length
const forky = require("forky")
forky({
  path: `${__dirname}/worker_server.js`,
  workers: process.env.WEB_CONCURRENCY || NUMBER_OF_CORES,
  enable_logging: true,
})
