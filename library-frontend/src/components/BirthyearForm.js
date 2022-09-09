import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const BirthyearForm = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ updateAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      {  query: ALL_AUTHORS }
    ],
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  const handleChange = (event) => {
    setName(event.target.value)
  }

  const submit = async (event) => {
    event.preventDefault()

    updateAuthor({
      variables: {
        name,
        setBornTo: parseInt(born)
      }
    })

    console.log('update author...')

    setBorn('')
    setName('')
  }
  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={handleChange}>
            {props.authors.map((a) => (
              <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm