import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/Context';
import { typesUser } from '../Types/typesUser';
import { useForm } from '../hooks/useForm';

const Login = ({ history }) => {
    const [stateAlert, setStateAlert] = useState(false);

    const { dispatchUser } = useContext(AuthContext);

    const {
        stateForm: { name },
        handleInputChange,
    } = useForm({
        name: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();

        //* Enviando a la ultima routa visitada de la aplicacion enel ultimo ingreso.
        const lastPath = localStorage.getItem('lastRoute') || '/';

        if (!name.trim().length) {
            return setStateAlert(true);
        } else {
            setStateAlert(false);
            dispatchUser({ type: typesUser.login, payload: { name: name } });
        }

        history.replace(lastPath);
    };

    return (
        <div className='container'>
            <form
                onSubmit={handleLogin}
                className='d-flex justify-content-center align-items-center mt-5'
            >
                <div className='me-2'>
                    <input
                        onChange={handleInputChange}
                        autoComplete='off'
                        name='name'
                        value={name}
                        className='form-control'
                        placeholder='Nick-Name'
                        type='text'
                    />
                </div>
                <div>
                    <button type='submit' className='btn btn-primary'>
                        Login
                    </button>
                </div>
            </form>
            {stateAlert && (
                <div className='alert alert-danger text-center mt-2 p-1'>
                    <h5 className='m-auto'>Ingresa tu Nickname</h5>
                </div>
            )}
        </div>
    );
};

export default Login;
