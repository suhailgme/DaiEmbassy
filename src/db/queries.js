module.exports.getCdps = `{
    allCups(
      condition: { deleted: false },
      orderBy: ID_DESC
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
      nodes {
        id
        lad
        art
        ink
        ire
        ratio
        pip
        tab
        actions {
          nodes {
            act
            time
            art
            ink
            tab
          }
        }
      }
    }
  }`

  module.exports.getCdpByAddress = (address) => {
    const query =  `{
      allCups(condition: {lad:${address}}) {
        nodes {
            id
            lad
            art
            ink
            ire
            ratio
            pip
            tab
            actions {
              nodes {
                act
                time
            }
          }
        }
      }
    }`
    return query
  }