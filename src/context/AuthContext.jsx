/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

const ACCOUNTS_KEY = 'campusboard-accounts'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedAccounts, setSavedAccounts] = useState([])

  // Load saved accounts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_KEY)
      if (stored) {
        setSavedAccounts(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to parse saved accounts', e)
    }
  }, [])

  // Sync savedAccounts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(savedAccounts))
  }, [savedAccounts])

  const updateSavedAccounts = useCallback((currentSession, currentProfile) => {
    if (!currentSession?.user) return
    setSavedAccounts(prev => {
      const exists = prev.find(acc => acc.id === currentSession.user.id)
      const newAcc = {
        id: currentSession.user.id,
        email: currentSession.user.email,
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
        full_name: currentProfile?.full_name || currentSession.user.email?.split('@')[0] || 'Member',
        avatar_url: currentProfile?.avatar_url,
        role: currentProfile?.role || 'member'
      }
      
      if (exists) {
        return prev.map(acc => acc.id === currentSession.user.id ? newAcc : acc)
      } else {
        return [...prev, newAcc]
      }
    })
  }, [])

  const fetchProfile = async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    let finalProfile = null

    if (!error && data) {
      // AUTO-HEALER: Fix bad legacy data seamlessly
      if (!data.full_name || data.full_name.trim() === '' || data.full_name === 'Campus Member' || data.full_name === 'Member') {
        const healedName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member'
        data.full_name = healedName
        supabase.from('profiles').update({ full_name: healedName }).eq('id', user.id).then()
      }
      finalProfile = data
    } else if (error && error.code === 'PGRST116') {
      const healedName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member'
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ 
          id: user.id, 
          full_name: healedName,
          role: 'member'
        })
        .select('*')
        .single()
        
      if (!insertError && newProfile) {
        finalProfile = newProfile
      }
    }

    setProfile(finalProfile)
    return finalProfile
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setLoading(false)
      if (initialSession?.user) {
        fetchProfile(initialSession.user).then((prof) => {
           updateSavedAccounts(initialSession, prof)
        })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setLoading(false)
      if (currentSession?.user) {
        fetchProfile(currentSession.user).then((prof) => {
           updateSavedAccounts(currentSession, prof)
        })
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [updateSavedAccounts])

  const signUp = (email, password, options) => supabase.auth.signUp({ email, password, options })

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })

  const switchAccount = async (targetId) => {
    const targetAccount = savedAccounts.find(acc => acc.id === targetId)
    if (!targetAccount) return { error: new Error('Account not found in local storage') }

    setLoading(true)
    const { data, error } = await supabase.auth.setSession({
      access_token: targetAccount.access_token,
      refresh_token: targetAccount.refresh_token
    })
    
    if (error) {
      // If session is expired or invalid, remove it from saved accounts
      setSavedAccounts(prev => prev.filter(acc => acc.id !== targetId))
      setLoading(false)
      return { error }
    }
    
    return { data, error: null }
  }

  const signOutActive = async () => {
    if (session?.user) {
      setSavedAccounts(prev => prev.filter(acc => acc.id !== session.user.id))
    }
    return supabase.auth.signOut()
  }

  const signOutAll = async () => {
    setSavedAccounts([])
    localStorage.removeItem(ACCOUNTS_KEY)
    return supabase.auth.signOut()
  }

  const removeAccount = (accountId) => {
    setSavedAccounts(prev => prev.filter(acc => acc.id !== accountId))
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    savedAccounts,
    signUp,
    signIn,
    signOut: signOutActive,
    signOutAll,
    switchAccount,
    removeAccount
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
