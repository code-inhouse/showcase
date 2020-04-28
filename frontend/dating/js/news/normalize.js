export function normalizePosts(data) {
  return data.posts.items.map(p => (
    Object.assign({}, p, {
      poster: p.profile,
      profile: undefined,
      created: new Date(p.created)
    })
  ))
}
