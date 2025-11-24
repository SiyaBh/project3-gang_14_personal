import GoogleLoginButton from "../components/GoogleLoginButton";

const colors = {
  primary: '#BF1834',
  secondary: '#FFFFFF',
  dark: '#221713',
};

export default function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: colors.secondary,
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          textAlign: "center",
          border: "2px solid black", // <-- added border
        }}
      >
        <h2
          style={{
            color: colors.primary,
            fontSize: "28px",
            marginBottom: "25px",
            fontWeight: "bold",
          }}
        >
          Employee Login
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <GoogleLoginButton />
        </div>

        <p
          style={{
            color: colors.dark,
            fontSize: "15px",
            marginTop: "10px",
            opacity: 0.8,
          }}
        >
          You must sign in using an authorized Google account
        </p>
      </div>
    </div>
  );
}
