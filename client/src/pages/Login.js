import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
    return (
        <div>
            <h2>Employee Login</h2>

            <GoogleLoginButton />

            <p>You must sign in using an authorized Google account</p>
        </div>
    );
}
