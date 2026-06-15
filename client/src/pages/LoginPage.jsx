import LoginForm from '../components/auth/LoginForm.jsx';

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-surface-50">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;