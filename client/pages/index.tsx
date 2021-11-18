import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { Button } from "@mui/material";

const Home: NextPage = () => {
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    async function getData() {
      const res = await axios.post("http://127.0.0.1:5000/results", {
        hello: "hi",
      });
      console.log(res);
    }

    getData();
  }, []);

  return (
    <div className={styles.container}>
      <Button variant="contained">Contained</Button>
    </div>
  );
};

export default Home;
