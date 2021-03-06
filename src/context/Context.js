import React, { createContext, useEffect, useReducer, useState } from 'react';
import { axiosGetContinents } from '../helpers/axiosGetContinents';
import { initInfoCountry } from '../getLocalStorage/initInfoCountry';
import { initUser } from '../getLocalStorage/initUser';
import { useAxios } from '../hooks/useAxios';
import { continentReducer } from '../reducers/continentReducer';
import { countryReducer } from '../reducers/countryReducer';
import { userReducer } from '../reducers/userReducer';
import { typesContinent } from '../Types/typesContinent';
import { typesCountry } from '../Types/typesCountry';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    //!---------------------------
    //! Manejo de autenticacion:
    //!---------------------------
    //* Reducer para manejar la autenticacion.
    const [user, dispatchUser] = useReducer(userReducer, {}, initUser);

    //* UseEffect que me guarda si el usuario esta logged o no en el localStorage.
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);
    //!-----------------------------------------------------------------
    //!-----------------------------------------------------------------

    //!-------------------------------------------------
    //! Manejo del Router Continents:
    //!-------------------------------------------------
    //* Reducer para manejar los continentes.
    const [stateContinent, dispatchContinent] = useReducer(
        continentReducer,
        [],
    );

    //* useState que me guarda la data de la api REST Countries.
    const [continents, setContinents] = useState({ data: [], state: false });

    //* useState para guardar lo seleccionado en el select del componente (CountriesContinent.js).
    const [selected, setSelected] = useState('Africa');

    //* useEffect que me consume la api de REST Countries solo al iniciar la aplicacion.
    useEffect(
        () => {
            async function loadContinents() {
                const response = await axiosGetContinents();
                if (response[0]?.continent) {
                    setContinents({
                        data: [...response],
                        state: false,
                    });

                    //* Iniciamos el selector de el router continents con Africa y sus paises en la primera carga de la aplicacion.
                    dispatchContinent({
                        type: typesContinent[selected],
                        payload: response,
                    });
                } else {
                    setContinents({ data: [], state: true });
                }
            }

            loadContinents();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    //!-----------------------------------------------------------------
    //!-----------------------------------------------------------------

    //!-------------------------------------------------
    //! Manejo del Router Search:
    //!-------------------------------------------------
    //* Reducer para manejar la consulta por pais a la Api:
    const [countryFetching, dispatchCountryFetching] = useReducer(
        countryReducer,
        {
            data: [],
        },
    );

    //* useState que me guarda lo ingresado en el formulario en el componente SearchCountry al pulsar el boton.
    const [infoCountry, setInfoCountry] = useState(initInfoCountry);

    //* useEffect que se ejecuta cada vez que se busca un pais en el componente SearchCountry.js.
    useEffect(() => {
        async function LoadCountry() {
            const response = await useAxios(
                `https://restcountries.com/v3.1/name/${infoCountry}?fullText=true`,
            );

            //* Guardar consulta de pais del componente SearchCountry.js en el localStorage.
            localStorage.setItem('infoCountry', JSON.stringify(infoCountry));

            if (response?.data) {
                dispatchCountryFetching({
                    type: typesCountry.FETCH_SUCCESS,
                    payload: response.data,
                });
            } else {
                dispatchCountryFetching({
                    type: typesCountry.FETCH_ERROR,
                });
            }
        }

        LoadCountry();
    }, [infoCountry]);
    //!-----------------------------------------------------------------
    //!-----------------------------------------------------------------

    //?-----------------------------------------------------------------
    //? Estado generales a enviar mediante el Context.
    //?-----------------------------------------------------------------
    const data = {
        user,
        dispatchUser,
        continents,
        stateContinent,
        dispatchContinent,
        selected,
        setSelected,
        countryFetching,
        infoCountry,
        setInfoCountry,
    };
    //?-----------------------------------------------------------------
    //?-----------------------------------------------------------------

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthProvider;
