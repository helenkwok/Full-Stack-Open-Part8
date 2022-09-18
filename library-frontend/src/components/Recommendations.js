import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'

const Recommendations = (props) => {
  const [books, setBooks] = useState([])
  const [booklist, setBooklist] = useState([])
  const [favouriteGenre, setFavouriteGenre] = useState('')
  const result = useQuery(ALL_BOOKS)
  const currentUser = useQuery(CURRENT_USER)

  useEffect(() => {
    if (!result.loading && !currentUser.loading) {
      setBooks(result.data.allBooks)
      setFavouriteGenre(currentUser.data.me.favouriteGenre)
    }
  }, [result, currentUser])

  useEffect(() => {
    if(!result.loading) {
      setBooklist(books.filter((b) => b.genres.includes(favouriteGenre)))
    }
  },[books, favouriteGenre, result.loading])

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>

      <p>books in your favourite genre <b>{favouriteGenre}</b></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booklist.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations