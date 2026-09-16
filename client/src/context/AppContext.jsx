import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios"
import toast from "react-hot-toast"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [searchedCities, setSearchedCities] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [propertiesLoading, setPropertiesLoading] = useState(true)
  const [propertiesError, setPropertiesError] = useState(null)
  // CLERK
  const { user } = useUser();
  const {getToken} = useAuth()

  const getProperties = async () => {
    try {
      setPropertiesLoading(true)
      setPropertiesError(null)
      const { data } = await axios.get('/api/crm/listings/public');
      if (data.success && Array.isArray(data.data)) {
        setProperties(data.data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error.message);
      setPropertiesError("Unable to load properties. Please try again.")
      setProperties([]);
    } finally {
      setPropertiesLoading(false)
    }
  };

  const getUser = async ()=>{
    try {
      const {data} = await axios.get('/api/user', {headers: {Authorization: `Bearer ${await getToken()}`}})
      if(data.success){
        setIsOwner(data.role === "agencyOwner")
        setSearchedCities(data.recentSearchedCities || [])
      }else{
        setTimeout(() => {
          getUser()
        }, 5000);
      }

    } catch (error) {
      console.error("getUser error:", error.message)
    }
  }

  useEffect(()=>{
    if(user){
      getUser()
    }
  }, [user])

  useEffect(() => {
    getProperties();
  }, []);

  const value = {
    navigate,
    properties,
    setProperties,
    propertiesLoading,
    propertiesError,
    currency,
    user,
    isOwner,
    setIsOwner,
    axios,
    getToken,
    searchQuery,
    setSearchQuery,
    searchedCities,
    setSearchedCities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);