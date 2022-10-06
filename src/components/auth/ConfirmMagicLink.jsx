import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  Alert,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const ConfirmMagicLink = () => {
  // const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { getAuth, signInWithEmailLink, isSignInWithEmailLink } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // async function handleSubmit(e) {}

  // const onSubmit = async (data) => {
  //   setError("");
  //   setLoading(true);
  //   try {
  //     await signInWithEmailLink(data.email, location.search);
  //     navigate("/home");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  //       setLoading(false);
  // };
 useEffect(() => {
   if (isSignInWithEmailLink(auth, window.location.href)) {
     // Additional state parameters can also be passed via URL.
     // This can be used to continue the user's intended action before triggering
     // the sign-in operation.
     // Get the email if available. This should be available if the user completes
     // the flow on the same device where they started it.
     let email = window.localStorage.getItem("emailForSignIn");
     if (!email) {
       // User opened the link on a different device. To prevent session fixation
       // attacks, ask the user to provide the associated email again. For example:
       email = window.prompt("Please provide your email for confirmation");
     }
     // The client SDK will parse the code from the link for you.
     signInWithEmailLink(auth, email, window.location.href)
       .then((result) => {
         // Clear email from storage.
         window.localStorage.removeItem("emailForSignIn");
         navigate('/reveal')
         // You can access the new user via result.user
         // Additional user info profile not available via:
         // result.additionalUserInfo.profile == null
         // You can check if the user is new or existing:
         // result.additionalUserInfo.isNewUser
       })
       .catch((error) => {
         console.log(error);
         // Some error occurred, you can inspect the code: error.code
         // Common errors could be invalid email and invalid or expired OTPs.
       });
   }
 }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Magic Entrance</h2>
          {error && <Alert variant="danger">{error}</Alert>}
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel htmlFor="email">Please confirm your email address:</FormLabel>
          <FormControl name="email" placeholder="Email" ref={emailRef} />
          <Button className="btn btn-sucess mt-2 w-100" type="submit">
            Log in
          </Button>
        </FormGroup>
      </form> */}

      You will be re-directed shortly.
      </Card.Body>
    </Card>
    </>
  );
};

export default ConfirmMagicLink;
