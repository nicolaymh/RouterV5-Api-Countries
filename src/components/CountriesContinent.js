import React, { useContext } from 'react';
import { AuthContext } from '../context/Context';
import { typesContinent } from '../Types/typesContinent';
import { Cards } from './Cards';

export const CountriesContinent = () => {
    const {
        continents: { data /* state */ },
        stateContinent,
        dispatchContinent,
        selected,
        setSelected,
    } = useContext(AuthContext);

    console.log(data);

    const handleChangeContinent = ({ target }) => {
        setSelected(target.value.toString());

        dispatchContinent({
            type: typesContinent[target.value],
            payload: data,
        });
    };

    return (
        <div className='container mt-2 bg-dark'>
            <select
                className='form-select mt-3'
                value={selected}
                onChange={handleChangeContinent}
            >
                {data.map(({ id, continent }) => (
                    <option
                        className='text-capitalize'
                        key={id}
                        value={continent}
                    >
                        {continent.toUpperCase()}
                    </option>
                ))}
            </select>

            <div className='row row-cols-1 row-cols-md-3 g-4 mt-2'>
                {stateContinent[0]?.countries?.map((country) => (
                    <Cards
                        key={country.name.official}
                        continent={stateContinent}
                        country={country}
                    />
                ))}
            </div>
        </div>
    );
};