import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch } from '../../app/store'
import { loginTC } from './authReducer'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import { Loader } from '../../common/components/loader/Loader'
import { Error } from '../../common/components/error/Error'
import { PATH } from '../../common/components/routes/RoutesComponent'
import { PasswordInput } from './loginInputs/PasswordInput'
import { EmailInput } from './loginInputs/EmailInput'
import { CheckBoxInput } from './loginInputs/CheckBoxInput'
import { getIsAuth } from './loginSelectors'
import { useSelector } from 'react-redux'
import { getErrorMessage, getLoading } from '../../app/appSelectors'

const SignupSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required field'),
  password: Yup.string()
    .max(25, 'Password must be 25 characters or less')
    .min(5, 'Password must be 5 characters or more')
    .required('Required field'),
})

export const Login = () => {
  const isAuth = useSelector(getIsAuth)
  const loading = useSelector(getLoading)
  const errorMessage = useSelector(getErrorMessage)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [isHidden, setIsHidden] = useState<boolean>(true)

  const imgOnClickHandler = () => {
    setIsHidden(!isHidden)
  }

  useEffect(() => {
    if (isAuth) {
      navigate(PATH.PROFILE)
    }
  }, [isAuth, navigate])

  return (
    <div>
      {loading && <Loader />}
      <div className={styles.login}>
        {loading && <Loader />}
        <h2>Sign In</h2>
        <Formik
          initialValues={{ email: '', password: '', rememberMe: false }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            dispatch(loginTC(values))
          }}
        >
          <Form>
            <EmailInput />
            <PasswordInput isHidden={isHidden} OnClick={imgOnClickHandler} />
            <CheckBoxInput />

            <div className={styles.forgotPasswordContainer}>
              <NavLink to={PATH.UPDATE_PASSWORD} className={styles.forgotPassword}>
                Forgot Password?
              </NavLink>
            </div>

            <button type="submit" onSubmit={e => e.preventDefault()} className={styles.btn}>
              Sign In
            </button>

            <div className={styles.haveAccount}>Already have an account?</div>
            <div className={styles.signUpBox}>
              <NavLink to={PATH.REGISTRATION} className={styles.signUpLink}>
                Sign Up
              </NavLink>
            </div>
          </Form>
        </Formik>
      </div>
      {errorMessage && <Error message={errorMessage} />}
    </div>
  )
}
