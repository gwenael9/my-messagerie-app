import AuthForm, { FormType } from "@/components/auth/Form";
import Layout from "@/components/Layout/Layout";

export default function Login() {
  return (
    <Layout title="Connexion">
      <div className="flex justify-center items-center h-full">
        <AuthForm type={FormType.REGISTER} />
      </div>
    </Layout>
  );
}
