import { TextField } from '@mui/material';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  helperText, 
  required = false,
  ...props 
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      variant="outlined"
      margin="normal"
      {...props}
    />
  );
};

export default FormInput;
