const fs = require('fs-extra')
const artwork_categories = require('../data/artwork/collections/categories.json')
const artwork_creators = require('../data/artwork/collections/creators.json')
const literature_categories = require('../data/literature/collections/categories.json')
const literature_creators = require('../data/literature/collections/creators.json')

const mergingService = () => {

  const artwork_collections = Object.assign({}, artwork_categories, artwork_creators)
  const literature_collections = Object.assign({}, literature_categories, literature_creators)

  let artwork_items = []
  let literature_items = []

  for (const index in artwork_creators) {
    const artist = require(`../data/artwork/items/${index}.json`)
    if (artist) {
      artwork_items = artwork_items.concat(artist)
    }
  }

  for (const index in literature_creators) {
    const author = require(`../data/literature/items/${index}.json`)
    if (author) {
      literature_items = literature_items.concat(author)
    }
  }

  for (const index in artwork_collections) {
    artwork_collections[index].items = []
  }

  for (const index in literature_collections) {
    literature_collections[index].items = []
  }

  for (const index in artwork_items) {
    const item = artwork_items[index]
    artwork_collections[item.category].items.push(item)
    artwork_collections[item.id.split('-')[0]].items.push(item)
  }

  for (const index in literature_items) {
    const item = literature_items[index]
    literature_collections[item.category].items.push(item)
    literature_collections[item.id.split('-')[0]].items.push(item)
  }

  fs.writeJson('data/prod/artwork-collections.json', artwork_collections)
  fs.writeJson('data/prod/artwork-items.json', artwork_items)
  fs.writeJson('data/prod/literature-collections.json', literature_collections)
  fs.writeJson('data/prod/literature-items.json', literature_items)
}

mergingService()
