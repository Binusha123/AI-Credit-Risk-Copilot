import React, { useState } from "react";
import { motion } from "framer-motion";

function Copilot() {

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {

    if (!question.trim()) return;

    setLoading(true);
    setResult(null);

    try {

      const res = await fetch(
        "http://localhost:5000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question
          })
        }
      );

      const data = await res.json();

      setResult(data);

    } catch {

      setResult({
        explanation: [
          "Error connecting to AI server"
        ],
        factors: [],
        recommendations: []
      });

    }

    setLoading(false);

  };

  return (

    <div style={styles.container}>

      <h1 style={styles.heading}>
        AI Credit Risk Copilot
      </h1>

      {/* INPUT */}

      <div style={styles.inputContainer}>

        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask about customer risk..."
          style={styles.input}
        />

        <button
          onClick={askAI}
          style={styles.button}
        >
          Analyze
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <p style={{color:"white"}}>
          Analyzing with AI...
        </p>
      )}

      {/* RESULT */}

      {result && (

        <motion.div
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          style={styles.resultCard}
        >

          {/* EXPLANATION */}

          <Section
            title="Explanation"
            items={result.explanation}
          />

          {/* FACTORS */}

          <Section
            title="Key Factors"
            items={result.factors}
          />

          {/* RECOMMENDATIONS */}

          <Section
            title="Recommendations"
            items={result.recommendations}
          />

        </motion.div>

      )}

    </div>

  );

}

/* SECTION COMPONENT */

function Section({ title, items }) {

  if (!items || items.length === 0)
    return null;

  return (

    <div style={{marginBottom:"20px"}}>

      <h3>{title}</h3>

      <ul>

        {items.map((item, i) => (

          <li key={i}>
            {item}
          </li>

        ))}

      </ul>

    </div>

  );

}

/* STYLES */

const styles = {

container:{

color:"white"

},

heading:{

marginBottom:"20px"

},

inputContainer:{

display:"flex",
gap:"10px"

},

input:{

flex:1,

padding:"12px",

borderRadius:"8px",

border:"none"

},

button:{

padding:"12px 20px",

background:"#2563eb",

color:"white",

border:"none",

borderRadius:"8px",

cursor:"pointer"

},

resultCard:{

marginTop:"20px",

padding:"20px",

background:"rgba(255,255,255,0.05)",

borderRadius:"10px"

}

};

export default Copilot;
