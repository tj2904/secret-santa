import React, { useRef, useState, } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { getAuth, sendSignInLinkToEmail } =
    useAuth();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectURL = process.env.REACT_APP_REDIRECT_URL;

  const auth = getAuth();
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: redirectURL,
    // This must be true.
    handleCodeInApp: true,
  };

  async function handleMagicLinkSubmit(e) {
    e.preventDefault();
    setLoading(true);
    sendSignInLinkToEmail(auth, emailRef.current.value, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", emailRef.current.value);
        setSuccess("Check your email for further instructions. Remember to check your spam folder too.")
      })
      .catch((error) => {
        console.log(error.code);
        setError(error.message);
        // ...
      });
    
setLoading(false);
  }

  return (
    <>
      <div className="w-100 centered-div" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="text-center">
                {success}
              </Alert>
            )}

            <p className="text-center">Enter your email address below to be sent a login link:</p>
            <Form onSubmit={handleMagicLinkSubmit}>
              <Form.Group id="magicLink">
                <Form.Control
                  type="email"
                  placeholder="SecretSanta@NorthPole.com"
                  required
                  ref={emailRef}
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100 mt-2 btn-success"
                type="submit"
              >
                Send me a link!
              </Button>
            </Form>
            {/* <div className="w-100 text-center mt-2">
              Need an account? <Link to="/signup">Sign Up</Link>
            </div> */}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
