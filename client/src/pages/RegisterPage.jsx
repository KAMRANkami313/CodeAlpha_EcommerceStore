import RegisterForm from '../components/auth/RegisterForm.jsx';

const RegisterPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-surface-50 dark:bg-surface-950">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;