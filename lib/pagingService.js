const fs = require('fs-extra')
// this mutates in place and should be changed
const pagingService = () => {
  const literatureCollectionsFile = 'data/prod/literature-collections.json'

  fs.readJson(literatureCollectionsFile, (error, result) => {
    const literatureCollections = result

    for (const collection in literatureCollections) {
      const items = literatureCollections[collection].items
      for (const index in items) {
        const item = items[index]
        const itemId = item.id.split('-')

        if (!item.pageSizes) {
          let htmlContent = fs.readFileSync(`content/literature/${itemId[0]}/${item.id}.html`).toString()
          const pageSize = 2000
          const buffer = 500
          const pageSizes = []

          if (item.category !== 'poetry') {
            do {
              let lastChar = 2000
              let page = 0
              while (lastChar < htmlContent.length) {
                if (htmlContent.substring(lastChar - 4, lastChar) === '</p>' || htmlContent.substring(lastChar - 6, lastChar) === '</pre>') {
                  break
                } else {
                  lastChar++
                }
              }

              if (htmlContent.length > (lastChar + buffer)) {
                page = lastChar
                htmlContent = htmlContent.slice(lastChar)
              } else {
                page = htmlContent.length
                htmlContent = ''
              }

              pageSizes.push(page)

              if (htmlContent.length > 1 && htmlContent.length < (lastChar + buffer)) {
                page = htmlContent.length
                htmlContent = htmlContent.slice(lastChar + buffer)
                pageSizes.push(page)
                break
              }
            } while (htmlContent.length > pageSize)
          } else {
            pageSizes.push(htmlContent.length)
          }

          item.pageSizes = pageSizes
        }
      }
    }

    fs.writeJson(literatureCollectionsFile, literatureCollections)

  })
}

pagingService()
