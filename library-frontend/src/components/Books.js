import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { shouldCanonizeResults } from '@apollo/client/cache/inmemory/helpers'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [booklist, setBooklist] = useState([])
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('')
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (!result.loading) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  useEffect(() => {
    if (!result.loading) {
      let categories = []

      books.forEach(b => {
        categories.push(...b.genres)
      })

      setGenres(
        categories.filter((item, index) => categories.indexOf(item) === index)
      )
    }
  }, [books, result.loading])

  useEffect(() => {
    if(!result.loading) {
      if (genre === '') {
        setBooklist(books)
        return
      }
      setBooklist(books.filter((b) => b.genres.includes(genre)))
    }
  },[books, genre, result.loading])

  const handleGenre = (g) => {
    setGenre(g)
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      {genre === ''?
        <p>all genres</p>
      :
        <p>in genre <b>{genre}</b></p>
      }

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

      <div>
        {genres.map((c) => (
          <button key={c} onClick={() => handleGenre(c)}>{c}</button>
        ))}
        <button onClick={() => handleGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
