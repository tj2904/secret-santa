import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

import { query, collection, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";

import "./nameReveal.css";
import { Reveal } from "react-text-reveal";

function NameReveal() {
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [playNow, setPlayNow] = useState(false);

  function handleClick(e) {
    setPlayNow(true);
  }

  useEffect(() => {
    fetchUserName();
  });

  const fetchUserName = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
      setRecipient(data.recipient);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="pb-4 reveal display-1">Secret Santa 2022</h1>
      <h2 className="pb-4 reveal display-5">Hi, {name}!</h2>
      <h3 className="pb-4 reveal "></h3>
      <div className="col text-center">
        <Button
          variant="success"
          className="btn-lg w-100"
          onClick={handleClick}
        >
          To find out who you will be Secret Santa for this year click this
          button
        </Button>
      </div>
      <Reveal
        className="reveal display-2"
        animateOpacity={true}
        canPlay={playNow}
        // characterOffsetDelay={95}
        // characterWordSpacing={10}
        copy={recipient}
        direction={"bottom"}
        duration={3000}
        ease={"cubic-bezier(0,0.4,0.4,1)"}
        offset={"120px"}
        perspective={true}
        perspectiveX={158}
        perspectiveY={13}
        perspectiveZ={0}
        perspectiveFOV={1000}
      >
        {recipient}{" "}
      </Reveal>
    </>
  );
}

export default NameReveal;
