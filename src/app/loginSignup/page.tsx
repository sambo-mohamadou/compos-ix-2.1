'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import styles from '@/styles/login.module.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import AuthLayout from './layout'
import axios from 'axios'
import {API} from '../APIs/app'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext'

const page = () => {

  const {loginDetails} = useAuth();

    const navigation = useRouter();

    const [isLogin , setisLogin] = useState(true)
    const [resetForm, setResetForm] = useState(false);
    const [name , setName] = useState("")
    const [nameError, setNameError] = useState('')
    const[email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [error, setError] = useState(false)

    const [passwordIsVisible, setPasswordIsVisible] = useState(false)
    const [isSubmit, setisSubmit] = useState(false)
    const [signUpError, setSignUpError] = useState('')
    const [loginError, setLoginError] = useState('')

    const emailformat: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 


const signUp = async () => {


    if(!name || !email || !password || !confirmPassword || !email.match(email)){

        if(!name) {
            setNameError('Nom est obligatoire')
            setError(true)
        }
       
        if(!email) {
            setEmailError('Adresse e-mail est obligatoire')
            setError(true)
        } else if (!email.match(emailformat)) {
            setEmailError('Le mail ne correspond pas au format attendu')
            setError(true)
        }
        if(!password) {
        setPasswordError('Mot de passe obligatoire')
        setError(true)
        } 
        if(!confirmPassword) {
        setConfirmPasswordError('Veuillez confirmez le mot de passe')
        setError(true)
        } else if (password !== confirmPassword) {
        setConfirmPasswordError('Les mots de passe ne correspondent pas')
        setError(true)
        }
    }
        
    else {
        try {
        const inscriptionForm = {
            username: name,
            email: email,
            password: password
        };

        const response = await axios.post(API, inscriptionForm)
        const data1 = response.data;
            console.log(data1);
            if (response.data.success) {
               navigation.push('/managerPage')
                const token:  string = response.data.token;
                const Form = {
                  email: email,
                  token: token
                }
              loginDetails(email, token)
            }
            setisSubmit(true)
        }
        catch (error:any) {
        console.error(`Erreur lors de l'inscription`, error);
        if(error.code === "ERR_NETWORK"){
            setSignUpError('Erreur de reseau. Veuillez réessayer.')
        } 

        else if (error.response) {
        
            if (error.response.status === 400) {
            setSignUpError('Cet utilisateur existe déjá. Veuillez réessayer');
            } else{
            setSignUpError('Une erreur s\'est produite. Veuillez réessayer.');
            }
        } 
        } 

    }   
    }

    const login = async() => {

        if(!password || (email.length === 0) || (!email.match(emailformat))){
    
          if (!password) {
            setPasswordError('Mot de passe obligatoire')
            setError(true);
          }
          if (email.length === 0) {
            setEmailError('Adresse e-mail obligatoire')
            setError(true);
          } else if (!email.match(emailformat)) {
            setEmailError ('Le mail ne correspond pas au format attendu');
            setError(true);
          }
        }
    
        else {
    
            try{
    
            const connexionForm = {
              email: email,
              password: password
            }
            
    
            const response = await axios.post( API , connexionForm)
            console.log(response.data);
            if (response.data.success) { 
              navigation.push('/managerPage')
              const token:  string = response.data.token;
              const Form = {
                email: email,
                token: token
              }
              loginDetails(email, token)
            }
    
            setisSubmit(true)
          }
    
          catch (error:any) {
            console.error(`Erreur lors de la Connexion`, error)
            if(error.code === "ERR_NETWORK"){
              setLoginError('Erreur de reseau. Veuillez réessayer.')
            } 
            else if(error.response) {
          
              if (error.response.status === 401) {
                setLoginError(`Adresse e-mail ou mot de passe incorrect. Veuillez réessayer.`)
              } else{
              setLoginError(`Adresse e-mail ou mot de passe incorrect. Veuillez réessayer.`);
              }
            } 
          }
    
        }
      }
    
      const resetError = () => {
    
        setEmailError("")
        setPasswordError("")
        setNameError("")
        setConfirmPasswordError("")
        setLoginError("")
        setSignUpError("")
        setError(false);
      }
      useEffect(() => {
        resetError()
      }, [])
    
      const resetData = () => {
        setPassword("")
        setName("")
        setEmail("")
        setConfirmPassword("")  
      }
    
      useEffect(() => {
        if(resetForm){
        resetData();
        setResetForm(false)
        }
      }, [resetForm])
    
      const resetNameError = () => {
        setNameError("");
        setError(false)
      }
      const resetPasswordError = () => {
        setPasswordError("");
        setError(false)
      }
      const resetEmailError = () => {
        setEmailError("");
        setError(false)
      }
      const resetConfirmPasswordError = () => {
        setConfirmPasswordError("");
        setError(false)
      }

  
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
                            onClick={resetEmailError}
                        />
                        {emailError && (<p className='my-1 text-xs'>{emailError}</p>)}
                        
                    </div>
                    <div className={error?styles.loginFieldErr:styles.loginField}>
                        <input type={passwordIsVisible? "text" :"password"} name="" id="" placeholder='Mot de passe'
                            className='w-full h-12 border outline-none px-3'
                            onChange={ e => setPassword(e.target.value)}
                            onClick={resetPasswordError}
                        />
                        {passwordIsVisible && (<div className={styles.eye}><AiOutlineEye size={24} onClick={() => setPasswordIsVisible(!passwordIsVisible)}/></div>) }
                        {!passwordIsVisible && <div className={styles.eye}><AiOutlineEyeInvisible size={24} onClick={() => setPasswordIsVisible(!passwordIsVisible)}/></div> }
                        {passwordError && (<p className='my-1 text-xs'>{passwordError}</p>)}
                        
                        
                    </div>
                    <div>
                        <button className='mt-6 font-bold text-white text-xs bg-blue-500 py-3 px-6 disabled:shadow-none rounded-lg hover:shadow-blue-500/40 hover:shadow-lg hover:shadow-relative' onClick={login}>SE CONNECTER</button>
                    </div>
                    <div>
                    <span>Vous n'avez pas de compte? </span><button onClick={() => {setisLogin(false); resetError(); setResetForm(true)}} className='text-blue-500 hover:underline'>Inscrivez vous</button>
                    </div>
                    
                </div>
            </div>

        :null}


            {!isLogin?

                <div className={styles.signupForm}>
                        <h1 className='font-bold text-xl'>Inscription</h1>
                            <div className='w-full flex flex-col justify-between items-center py-4 mt-4 h-68 gap-3'>
                               
                              <div className={error?styles.loginFieldErr:styles.loginField}>
                                  <input type='text' placeholder='Nom' className='w-full h-12 border outline-none px-3' onChange={(e) => setName(e.target.value)} onClick={resetNameError}/>
                                  {nameError && (<p style={{ color: 'red', fontSize: '14px', textAlign: 'left'}}>{nameError}</p>)}
                              </div>

                              <div className={error?styles.loginFieldErr:styles.loginField}>
                                <input type='text' placeholder='Entrez votre Email' className='w-full h-12 border outline-none px-3' onChange={(e) => setEmail(e.target.value)} onClick={resetEmailError}/>
                                {emailError && (<p style={{ color: 'red', fontSize: '14px', textAlign: 'left'}}>{emailError}</p>)}
                              </div>

                              <div className={error?styles.loginFieldErr:styles.loginField}>

                                <input type={passwordIsVisible? 'text': 'password'} placeholder='Entrez votre Mot de Passe' className='w-full h-12 border outline-none px-3' onChange={(e) => setPassword(e.target.value)} onClick={resetPasswordError} required/>
                                {passwordError && (<p style={{ color: 'red', fontSize: '14px', textAlign: 'left'}}>{passwordError}</p>)}

                                {passwordIsVisible && (<div className={styles.eye}><AiOutlineEye size={24} onClick={() => setPasswordIsVisible(!passwordIsVisible)}/></div>) }
                                {!passwordIsVisible && <div className={styles.eye}><AiOutlineEyeInvisible size={24} onClick={() => setPasswordIsVisible(!passwordIsVisible)}/></div> }

                              </div>
                              

                              <div className={error?styles.loginFieldErr:styles.loginField}>
                                <input type='text' placeholder='Confirmez votre Mot de Passe' className='w-full h-12 border outline-none px-3' onChange={(e) => setConfirmPassword(e.target.value)}  onClick={resetConfirmPasswordError} required/>
                                {confirmPasswordError && (<p  style={{ color: 'red', fontSize: '14px', textAlign: 'left'}}>{confirmPasswordError}</p>)}   
            
                                {password === confirmPassword && password !== ""? <div style={{color: 'green', marginTop: '3px'}}> Votre Mot de passe est correct</div>: 
                                null}
                              </div>

       
                              <button className='mt-8 font-bold text-white text-xs bg-blue-500 py-3 px-5 disabled:shadow-none rounded-lg hover:shadow-blue-500/40 hover:shadow-lg hover:shadow-relative' onClick={signUp}>S'INSCRIRE</button>
                
                              <div>
                                  <span>Vous avez deja un compte? </span><button onClick={() => {setisLogin(true); resetError(); setResetForm(true)}} className='text-blue-500 hover:underline'>Connectez Vous</button>
                              </div>
                  
                         </div>
                </div>

            :null}

       </>
            
    </AuthLayout>
  )
}

export default page