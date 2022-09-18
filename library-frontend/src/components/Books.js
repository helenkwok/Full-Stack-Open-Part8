import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const genreResult = useQuery(ALL_GENRES)
  const { loading, data, refetch } = useQuery(ALL_BOOKS, {
    variables: {
      genre: props.genre
    }
  })

  const handleRefetch = (g) => {
    refetch({ genre: g })
    setGenre(g)
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      {props.genre=== ''?
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
          {data.allBooks.map((b) =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        {genreResult.data.allGenres.map((c) => (
          <button key={c} onClick={() => handleRefetch(c)}>{c}</button>
        ))}
        <button onClick={() => handleRefetch('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
