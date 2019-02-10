/**
 * Small script to keep the GitHub labels up-to-date
 */
var githubLabelSync = require('github-label-sync')
const repo = 'platyplus/platyplus'
const labels = [
  // { name: 'c/cli', color: '1b48ba' },
  // { name: 'c/community', color: 'c9840c' },
  // { name: 'c/console', color: 'e5e866' },
  { name: 'c/ui', color: 'e5e866' },
  { name: 'c/docs', color: '49d1a6' },
  // { name: 'c/firebase2graphql', color: '1e4dce' },
  // { name: 'c/json2graphql', color: 'fca992' },
  { name: 'c/server', color: 'f2a4ea' },
  { name: 'duplicate', color: 'cfd3d7' },
  { name: 'e/hard', color: 'd36eea' },
  { name: 'e/medium', color: '7e94f7' },
  { name: 'e/quickfix', color: '0f4391' },
  { name: 'good first issue', color: '7057ff' },
  // { name: 'hacktoberfest', color: 'ff9a56' },
  { name: 'help wanted', color: '008672' },
  { name: 'invalid', color: 'e4e669' },
  { name: 'k/bug', color: 'd73a4a' },
  { name: 'k/enhancement', color: 'a2eeef' },
  { name: 'k/ideas', color: 'bfd4f2' },
  { name: 'k/question', color: 'd876e3' },
  { name: 'mockup-required', color: '0e8a16' },
  { name: 'p/high', color: 'fbca04' },
  { name: 'p/longterm', color: '7fbaf9' },
  { name: 'p/medium', color: '9700c9' },
  { name: 'p/urgent', color: 'e5690b' },
  { name: 's/do-not-merge', color: 'ea3a3d' },
  { name: 's/ok-to-merge', color: '52ce50' },
  { name: 's/wip', color: '04e845' },
  { name: 's/wontfix', color: 'ffffff' }
]
if (!process.env.GITHUB_TOKEN) {
  console.error(`Set your github token with repo rights first!\n
    https://github.com/settings/tokens\n
    EXPORT GITHUB_TOKEN=xxxxx
    `)
  process.exit(1)
}
githubLabelSync({
  accessToken: process.env.GITHUB_TOKEN,
  repo: repo,
  // dryRun: true,
  //   allowAddedLabels: true,
  labels
})
  .then(diff => {
    if (diff.length) {
      console.log('Diff:')
      console.log(diff)
    } else {
      console.log('No changes')
    }
    console.log('Done')
  })
  .catch(error => {
    console.error('Error updating the labels!')
    console.error(error.body)
  })
