import { marked } from 'https://esm.sh/marked@11.0.0'
import prettify from 'npm:@liquify/prettify'
const text = Deno.readTextFileSync('./README.md')
const textDutch = Deno.readTextFileSync('./README.nl.md')
const template = Deno.readTextFileSync('./template.html')

const headers = ['h1', 'h2']

const textToBlocks = (text: string): { [key: string]: string } => {
    const htmlBlocks: { [key: string]: string } = {}
    let block: string[] = []
    const lines = marked.parse(text).split('\n').map((line: string) => line.includes('<img') ? line.replaceAll('<p>', '').replaceAll('</p>', '') : line)

    let usedHeader, className
    for (const [index, line] of lines.entries()) {
        usedHeader = headers.find(header => line.startsWith(`<${header}>`))

        if (usedHeader) {
            className = line.split(/,|\<br\ \/>/g).pop().trim()
                .replaceAll(`<${usedHeader}>`, '')
                .replaceAll(`</${usedHeader}>`, '')
                .replaceAll(/ |,/g, '-')
                .toLowerCase()

            block.push(line)
        }

        else if (headers.some(header => lines[index + 1]?.startsWith(`<${header}>`)) || !lines[index + 1]) {
            block.push(line)
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
        
    <aside class="left">
        <div class="inner">
            <section class="software-engineer">
                ${htmlBlocks['software-engineer']}
                <a class="language-link" href="/${language === 'en' ? 'nl' : 'en'}">${language === 'en' ? 'Nederlandse versie' : 'English version'}</a>
            </section>
        </div>
    </aside>

    <main class="right">
        <section class="about-me">${htmlBlocks['about-me']}</section>
        <section class="summary">${htmlBlocks['summary']}</section>
        <section class="passionate">${htmlBlocks['things-i-am-passionate-about']}</section>
        <section class="work-experience">${htmlBlocks['work-experience']}</section>
        <section class="study">${htmlBlocks['study']}</section>
        <section class="code-references">${htmlBlocks['code-references']}</section>
        <section class="talks">${htmlBlocks['talks']}</section>
    </main>
`

const en = template.replace('<body></body>', `<body>${output(htmlBlocks, 'en')}</body>`)
const nl = template.replace('<body></body>', `<body>${output(htmlBlocksDutch, 'nl')}</body>`)

Deno.writeTextFileSync('./index.html', await prettify.format(en))
// Deno.writeTextFileSync('./nl/index.html', await prettify.format(nl))