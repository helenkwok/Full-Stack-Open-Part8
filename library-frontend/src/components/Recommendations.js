import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'

const Recommendations = (props) => {
  const [favouriteGenre, setFavouriteGenre] = useState('')
  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: {
      genre: favouriteGenre
    }
  })
  const currentUser = useQuery(CURRENT_USER)

  useEffect(() => {
    if (!currentUser.loading) {
      setFavouriteGenre(currentUser.data.me.favouriteGenre)
    }
  }, [currentUser])

  if (loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>

      <p>books in your favourite genre <b>{currentUser.data.me.favouriteGenre}</b></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((b) =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations