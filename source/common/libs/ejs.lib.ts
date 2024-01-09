import fs from 'node:fs'
import path from 'node:path'
import ejs from 'ejs'

export async function renderEjsTemplate (templateName: string, data: Record<string, any>): Promise<string | null> {
  try {
    const dirname = path.resolve(process.cwd(), `./source/common/templates/${templateName}.ejs`)

    if (fs.existsSync(dirname)) {
      const template = await ejs.renderFile(dirname, data)
      return template
    } else {
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
