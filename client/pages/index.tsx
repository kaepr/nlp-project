import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { Button, TextField } from "@mui/material";

const Home: NextPage = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    async function getData() {
      const res = await axios.post("http://127.0.0.1:5000/results", {
        hello: "hi",
      });
      console.log(res.data);
    }

    getData();
  }, []);

  const handleChange = (textData: string) => {
    setText(textData);
    console.log(textData);
  };

  return (
    <div className={styles.container}>
      <TextField
        multiline
        variant="outlined"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Home;
