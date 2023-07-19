import React from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import Select from 'react-select';

interface dataAdoption {
  breed: string;
  age: string;
  size: string;
  location: { label: string; value: string };
}

export  function AddAdoptionScreen() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data: dataAdoption) => {
    // Handle form submission here
    console.log(data);
  };

  return (
    <Form
        action="/backedm/api" //enviamos los registros a la API
        onSuccess={() => alert('Data Send (200)')} //mensaje de envio correcto
        onError={() => {
          alert('Submission failed'); // mensaje de error en el envio
        }}
        control={control}
      >
        {/* breed */}
        <TextInput
          {...register('breed', { required: true })}
          aria-invalid={errors.breed ? 'true' : 'false'}
        />
        {/* age */}
        <TextInput
          {...register('age', { required: true })}
          aria-invalid={errors.age ? 'true' : 'false'}
        />
        {/* size */}
        <TextInput
          {...register('size', { required: true })}
          aria-invalid={errors.size ? 'true' : 'false'}
        />
        {/* Location */}
        {/* <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 'el_pintado', label: 'El Pintado' },
                { value: 'el_inca', label: 'El Inca' },
                { value: 'cumbaya', label: 'Cumbayá' },
              ]}
            />
          )}
        /> */}
      </Form>
    // Seccion para foto
  );
}
