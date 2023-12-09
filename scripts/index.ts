import * as fs from 'fs/promises'
import * as yaml from 'js-yaml'
import { extname, resolve } from 'path'

const locales = {
  'de-DE': {},
  'fr-FR': {},
  'ja-JP': {},
  'ru-RU': {},
  'zh-TW': {},
}

async function traverse(root: string) {
  const dirents = await fs.readdir(root, { withFileTypes: true })
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      if (dirent.name.startsWith('.')) continue
      await traverse(`${root}/${dirent.name}`)
    } else if (dirent.isFile()) {
      const ext = extname(dirent.name)
      const locale = dirent.name.slice(0, -ext.length)
      if (['.yaml', '.yml'].includes(ext) && locale in locales) {
        const data = await fs.readFile(`${root}/${dirent.name}`, 'utf8')
        Object.assign(locales[locale], yaml.load(data))
      }
    }
  }
}

async function main() {
  await traverse(resolve(__dirname, '../external'))
  for (const locale in locales) {
    await fs.writeFile(resolve(__dirname, '../packages', locale.toLowerCase(), 'translation.json'), JSON.stringify(locales[locale]))
  }
}

if (require.main === module) {
  main()
}
