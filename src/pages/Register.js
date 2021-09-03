import React, {useContext, useState} from 'react';
import { Button, Form } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import {useForm} from "../util/hooks";
import {AuthContext} from "../context/auth";

function Register(props) {
  const {login} = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    passwrod: '',
    confirmPassword: ''
  })

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, {data: { register: userData } }) {
      login(userData)
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  })

  // hoisting에 의해 const는 위로 안 올라가지만 function 키워드는 올라간다.
  function registerUser() {
    addUser()
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
        <h1>Register</h1>
        <Form.Input
          label="username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={!!(errors && errors.username)}
          onChange={onChange}
        />
        <Form.Input
          label="email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={!!(errors && errors.email)}
          onChange={onChange}
        />
        <Form.Input
          label="password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={!!(errors && errors.password)}
          onChange={onChange}
        />
        <Form.Input
          label="confirmPassword"
          placeholder="ConfirmPassword.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={!!(errors && errors.confirmPassword)}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {
        Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map(value => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id email username createdAt token
    }
  }
`

export default Register;