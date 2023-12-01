import { marked } from 'https://esm.sh/marked@11.0.0'

const text = await fetch('/README.md').then(response => response.text())
const lines = marked.parse(text).split('\n')
const headers = ['h1', 'h2']


const htmlBlocks = {}
let block = []

let usedHeader, className
for (const [index, line] of lines.entries()) {
    if (usedHeader = headers.find(header => line.startsWith(`<${header}>`))) {
        className = line.split(/,|\<br\ \/>/g).pop().trim()
            .replaceAll(`<${usedHeader}>`, '')
            .replaceAll(`</${usedHeader}>`, '')
            .replaceAll(/ |,/g, '-')
            .toLowerCase()

        // block.push(`<details open class="block ${className}"><summary>${line}</summary>`)
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

const render = () => {
    document.querySelector('body').innerHTML = window.innerWidth > 720 ? `
    <div class="left">
        ${htmlBlocks['software-engineer']}
        ${htmlBlocks['contact']}
        ${htmlBlocks['code-references']}
        ${htmlBlocks['some-side-projects']}
    </div>
    <div class="right">
        ${htmlBlocks['summary']}
        ${htmlBlocks['about-me']}
        ${htmlBlocks['work-experience']}
        ${htmlBlocks['study']}
        ${htmlBlocks['talks']}
    </div>
` : `
    ${htmlBlocks['software-engineer']}
    ${htmlBlocks['contact']}
    ${htmlBlocks['summary']}
    ${htmlBlocks['about-me']}
    ${htmlBlocks['work-experience']}
    ${htmlBlocks['study']}
    ${htmlBlocks['talks']}
    ${htmlBlocks['code-references']}
    ${htmlBlocks['some-side-projects']}
`
}

render()

window.addEventListener('resize', render)

