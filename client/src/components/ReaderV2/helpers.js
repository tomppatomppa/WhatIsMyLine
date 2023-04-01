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

export { getSceneTitles }
