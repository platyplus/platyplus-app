const express = require('express'),
  { GraphQLClient } = require('graphql-request'),
  bodyParser = require('body-parser')

const graphql = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
  }
})

console.log(graphql.url) // TODO: remove

function isCommon (event) {
  console.warn('TODO: isDownstream')
  console.log(event)
  return true
}

/** Is the current node the root of the cluster? */
function isRoot () {
  console.warn('TODO: isRoot')
  return true
}

function isUpstream (event) {
  if (isRoot()) return false
  console.warn('TODO: isUpstream')
  console.log(event)
  return true
}

function isDownstream (event) {
  console.warn('TODO: isDownstream')
  console.log(event)
  // 1. if table.name in downStreamTables
  // 2. if org_unit(org_unit_id) is child of one of the org units managed by the current node
  return true
}

const app = express()
app.use(bodyParser.json())
app.post('/', function (req, res) {
  const { event } = req.body
  if (event) {
    // TODO: tester si on est sur le bon table.schema
    if (isCommon(event)) {
      // send to the common queue
    } else {
      if (isUpstream(event)) {
        // send to the upstream queue
      }
      if (isDownstream(event)) {
        // send to the uptream queues
      }
    }
    res.sendStatus(200) // <=> res.status(200).send('OK');
  } else {
    res.sendStatus(400)
  }
})
module.exports = app
