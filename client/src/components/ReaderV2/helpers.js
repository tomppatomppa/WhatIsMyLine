const getSceneTitles = (file) => {
  const titles = []
  file.data.forEach((scene) => {
    const obj = {
      value: scene.key,
      label: scene.key,
    }
    titles.push(obj)
  })

  return titles
}
const getIdIfExists = (html) => {
  const parser = new DOMParser()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const documentFilename = parsedHtml.querySelector('div')?.id
  console.log(documentFilename)
  if (documentFilename) return documentFilename

  return null
}
export { getSceneTitles, getIdIfExists }
