import { marked } from 'https://esm.sh/marked@11.0.0'
const text = Deno.readTextFileSync('./README.md')
const textDutch = Deno.readTextFileSync('./README.nl.md')
const template = Deno.readTextFileSync('./template.html')

const headers = ['h1', 'h2']

const textToBlocks = (text: string): { [key: string]: string } => {
    const htmlBlocks: { [key: string]: string } = {}
    let block: string[] = []
    const lines = marked.parse(text).split('\n')

    let usedHeader, className
    for (const [index, line] of lines.entries()) {
        usedHeader = headers.find(header => line.startsWith(`<${header}>`))

        if (usedHeader) {
            className = line.split(/,|\<br\ \/>/g).pop().trim()
                .replaceAll(`<${usedHeader}>`, '')
                .replaceAll(`</${usedHeader}>`, '')
                .replaceAll(/ |,/g, '-')
                .toLowerCase()

            block.push(`<div class="block ${className}">${line}`)
        }

        else if (headers.some(header => lines[index + 1]?.startsWith(`<${header}>`)) || !lines[index + 1]) {
            block.push(`${line}</div>`)
            htmlBlocks[className] = block.join('\n')
            block = []
        }
        else {
            block.push(line)
        }
    }

    return htmlBlocks
}

const htmlBlocks = textToBlocks(text)
const blocksMapping = Object.keys(htmlBlocks)
const htmlBlocksDutch = Object.fromEntries(
    Object.entries(
        textToBlocks(textDutch)).map(([name, text], index) => [blocksMapping[index], text]))

const output = (htmlBlocks: { [key: string]: string }, language: string) => `

    <div class="translation-link">
        <a href="/${language === 'en' ? 'nl' : 'en'}">${language === 'en' ? 'Nederlandse versie' : 'English version'}</a>
    </div>
        
    <div class="left">
        ${htmlBlocks['software-engineer']}
        ${htmlBlocks['contact']}
        ${htmlBlocks['code-references']}
        ${htmlBlocks['some-side-projects']}
        ${htmlBlocks['talks']}
    </div>
    <div class="right">
        ${htmlBlocks['summary']}
        ${htmlBlocks['about-me']}
        ${htmlBlocks['work-experience']}
        ${htmlBlocks['study']}
    </div>
`

Deno.writeTextFileSync('./en/index.html', template.replace('<body></body>', `<body>${output(htmlBlocks, 'en')}</body>`))
Deno.writeTextFileSync('./nl/index.html', template.replace('<body></body>', `<body>${output(htmlBlocksDutch, 'nl')}</body>`))