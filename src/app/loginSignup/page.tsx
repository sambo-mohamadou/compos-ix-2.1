'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import styles from '@/styles/login.module.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import AuthLayout from './layout'

const page = () => {
    const [isLogin , setisLogin] = useState(true)
    const [nom , setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const[email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(false)
  const [emailError, setEmailError] = useState("false")
  const [passwordError, setPasswordlError] = useState("false")
  const [passwordIsVisible, setPasswordIsVisible] = useState(false)

  const login = () => {
    if (email.length === 0){
        setError(true)
        setEmailError("Email is required")
    }
    if (password.length === 0){
        setError(true)
        setPasswordlError("Password is required")
    }
    if (email && password){
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (email.match(mailformat)){
            if (password.length < 8){
                setError(true)
                setPasswordlError("Password is too short")
            }
            else{
                if (email === 'haterb2803@gmail.com' && password === 'xccm xccm'){
                    const destination = window.location.origin
                    window.location.href = `${destination}/projects-manager`
                }
                else{
                    setError(true)
                    setEmailError("incorrect email address")
                    setPasswordlError("Incorrect password")
                }
            }
        }
        else{
            setError(true)
            setEmailError("Email is not valid email format")
        }
    }
  }
  const resetError = () => {
    setError(false)
    setEmailError("")
    setPasswordlError("")
  }
  useEffect(() => {
    resetError()
  }, [])
  return (
    <AuthLayout title='login page'>
        <>
        {isLogin?
        <div className={styles.loginForm}>
                <h1 className='font-bold text-xl'>Connexion</h1>
                <div className='w-full flex flex-col justify-between items-center py-4 gap-3 h-64'>
                    <div className={error?styles.loginFieldErr:styles.loginField}>
                        <input type="text" name="" id="" placeholder='Email'
                            className='w-full h-12 border outline-none px-3'
                            onChange={ e => setEmail(e.target.value)}
                            onClick={resetError}
                        />
                        {emailError && (<p className='my-1 text-xs'>{emailError}</p>)}
                        {email && <span className='text-xs'>Email</span>}
                    </div>
                    <div className={error?styles.loginFieldErr:styles.loginField}>
                        <input type={passwordIsVisible? "text" :"password"} name="" id="" placeholder='Mot de passe'
                            className='w-full h-12 border outline-none px-3'
                            onChange={ e => setPassword(e.target.value)}
                            onClick={resetError}
                        />
                        {passwordIsVisible && (<div className={styles.eye}><AiOutlineEye size={24} onClick={() => setPasswordIsVisible(!passwordIsVisible)}/></div>) }
                        {!passwordIsVisible && <div className={styles.eye}><AiOutlineEyeInvisible size={24} onClick={() => setPasswordIsVisible(!passwordIsVisible)}/></div> }
                        {passwordError && (<p className='my-1 text-xs'>{passwordError}</p>)}
                        {password && <span className='text-xs'>Mot de passe</span>}
                        
                    </div>
                    <div>
                        <button className='mt-6 font-bold text-white text-xs bg-blue-500 py-3 px-6 disabled:shadow-none rounded-lg hover:shadow-blue-500/40 hover:shadow-lg hover:shadow-relative' onClick={login}>SE CONNECTER</button>
                    </div>
                    <div>
                    <span>Vous n'avez pas de compte? </span><button onClick={() => setisLogin(false)} className='text-blue-500 hover:underline'>Inscrivez vous</button>
                    </div>
                    
                </div>
            </div>

        :null}


            {!isLogin?

                <div className={styles.signupForm}>
                        <h1 className='font-bold text-xl'>Inscription</h1>
                            <div className='w-full flex flex-col justify-between items-center py-4 mt-4 h-68 gap-3'>
                                <input type='text' placeholder='Nom' className='w-full h-12 border outline-none px-3' onChange={(e) => setNom(e.target.value)}/>
                                <input type='text' placeholder='Prenom' className='w-full h-12 border outline-none px-3' onChange={(e) => setPrenom(e.target.value)}/>
                                <input type='password' placeholder='Entrez votre Mot de Passe' className='w-full h-12 border outline-none px-3' onChange={(e) => setPassword(e.target.value)} required/>
                                <input type='text' placeholder='Confirmez votre Mot de Passe' className='w-full h-12 border outline-none px-3' onChange={(e) => setConfirmPassword(e.target.value)} required/>
                                <input type='text' placeholder='Entrez votre Email' className='w-full h-12 border outline-none px-3' onChange={(e) => setEmail(e.target.value)}/>

                                {password !== confirmPassword && confirmPassword !== ""? <span className='text-rednormal'> Votre Mot de passe est incorrect</span> 
                                :null}
                                {password === confirmPassword && password !== ""? <span> Votre Mot de passe est correct</span>: 
                                null}

                                <div>
                                    <button className='mt-8 font-bold text-white text-xs bg-blue-500 py-3 px-5 disabled:shadow-none rounded-lg hover:shadow-blue-500/40 hover:shadow-lg hover:shadow-relative'>S'INSCRIRE</button>
                                </div>
                                <div>
                                <span>Vous avez deja un compte? </span><button onClick={() => setisLogin(true)} className='text-blue-500 hover:underline'>Connectez Vous</button>
                            </div>
                                
                            
                        
                            
                    </div>
                </div>


            :null}

    </>
            
    </AuthLayout>
  )
}

export default page