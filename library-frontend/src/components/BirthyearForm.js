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
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
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