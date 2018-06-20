const fs = require('fs')
// const path = require('path')
const c = require('chalk')
const meow = require('meow')
const isBinary = require('isbinaryfile')
const { highlight } = require('cli-highlight')

const log = (logs = '') => console.log(`${c.cyan('see')}: ${logs}`)

const cli = meow(
  `
  Usage
    $ ${c.cyan('see')} /path/file.ext
`,
  {
    flags: {
      type: {
        type: 'string',
        alias: 't',
      },
    },
  },
)

const [filePath] = cli.input

fs.stat(filePath, (err, stats) => {
  if (!stats) {
    return log(`${c.gray(filePath)} does not exists.`)
  }

  if (!stats.isFile()) {
    return log(`${c.gray(filePath)} is not a File.`)
  }

  if (isBinary.sync(filePath)) {
    return log(`${c.gray(filePath)} is not a TEXT File.`)
  }

  // const basename = path.basename(filePath)
  // const ext = (basename.match(/\.([^.]+)$/) || [])[1]

  const rs = fs.createReadStream(filePath)

  let text = ''
  rs.on('data', (chunk) => {
    text += chunk
  }).on('end', () => {
    try {
      console.log(highlight(text))
    } catch (er) {
      console.log(text)
    }
  })
})
