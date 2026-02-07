import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

/* COLORS */

const COLORS = {
  HIGH: "#ff4d4f",
  MEDIUM: "#faad14",
  LOW: "#52c41a"
};

/* MAIN COMPONENT */

function Dashboard() {

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [aiAnalysis, setAiAnalysis] =
    useState(null);

  /* LOAD DATA */

  useEffect(() => {

    fetch("http://localhost:5000/dashboard-data")
      .then(res => res.json())
      .then(setData);

  }, []);

  if (!data.length)
    return <p style={{color:"white"}}>Loading...</p>;

  /* FILTER */

  const filtered = data.filter(c => {

    const matchesSearch =
      c.Customer_ID
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL"
        ? true
        : c.riskLevel === filter;

    return matchesSearch && matchesFilter;

  });

  /* OPEN MODAL */

  const openCustomer = async (customer) => {

    setSelectedCustomer(customer);
    setAiAnalysis(null);

    const res = await fetch(
      "http://localhost:5000/analyze-customer",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({ customer })
      }
    );

    const result = await res.json();

    setAiAnalysis(result);

  };

  const closeModal = () => {

    setSelectedCustomer(null);
    setAiAnalysis(null);

  };

  /* KPI */

  const avgRisk =
    Math.round(
      data.reduce(
        (sum,c)=>sum+c.riskScore,0
      ) / data.length
    );

  const pieData = [

    {
      name:"High",
      value:data.filter(
        c=>c.riskLevel==="HIGH"
      ).length
    },

    {
      name:"Medium",
      value:data.filter(
        c=>c.riskLevel==="MEDIUM"
      ).length
    },

    {
      name:"Low",
      value:data.filter(
        c=>c.riskLevel==="LOW"
      ).length
    }

  ];

  return (

    <div style={styles.container}>

      <h1>AI Credit Risk Intelligence</h1>

      {/* SEARCH + FILTER */}

      <div style={styles.controls}>

        <input
          placeholder="Search Customer..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          style={styles.input}
        />

        <select
          value={filter}
          onChange={e =>
            setFilter(e.target.value)
          }
          style={styles.select}
        >

          <option value="ALL">
            All Risk Levels
          </option>

          <option value="HIGH">
            High Risk
          </option>

          <option value="MEDIUM">
            Medium Risk
          </option>

          <option value="LOW">
            Low Risk
          </option>

        </select>

      </div>

      {/* CHARTS */}

      <div style={styles.row}>

        <div style={styles.card}>

          <h3>Portfolio Risk Score</h3>

          <div style={{width:150}}>

            <CircularProgressbar
              value={avgRisk}
              text={`${avgRisk}%`}
              styles={buildStyles({

                pathColor:
                  avgRisk>70
                  ? COLORS.HIGH
                  : avgRisk>40
                  ? COLORS.MEDIUM
                  : COLORS.LOW,

                textColor:"#fff"

              })}
            />

          </div>

        </div>

        <div style={styles.card}>

          <h3>Risk Distribution</h3>

          <ResponsiveContainer width={250} height={250}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={80}
                label
              >

                <Cell fill={COLORS.HIGH}/>
                <Cell fill={COLORS.MEDIUM}/>
                <Cell fill={COLORS.LOW}/>

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* CUSTOMER GRID */}

      <div style={styles.grid}>

        {filtered.slice(0,20).map(customer=>(

          <div
            key={customer.Customer_ID}
            style={{
              ...styles.customerCard,
              borderLeft:
              `5px solid ${
                COLORS[customer.riskLevel]
              }`
            }}
            onClick={()=>openCustomer(customer)}
          >

            <h4>{customer.Customer_ID}</h4>

            <p>
              Score: {customer.riskScore}
            </p>

            <p style={{
              color:
              COLORS[customer.riskLevel]
            }}>
              {customer.riskLevel}
            </p>

          </div>

        ))}

      </div>

      {/* MODAL */}

      {selectedCustomer && (

        <Modal
          customer={selectedCustomer}
          analysis={aiAnalysis}
          onClose={closeModal}
        />

      )}

    </div>

  );

}

/* MODAL COMPONENT */

function Modal({ customer, analysis, onClose }) {

  const score = customer.riskScore;

  /* RISK PREDICTION */

  let prediction;
  let color;
  let confidence;

  if (score >= 70) {

    prediction = "CRITICAL";
    color = COLORS.HIGH;
    confidence = 90;

  } else if (score >= 40) {

    prediction = "WARNING";
    color = COLORS.MEDIUM;
    confidence = 75;

  } else {

    prediction = "SAFE";
    color = COLORS.LOW;
    confidence = 85;

  }

  /* LOAN DECISION */

  let decision;
  let decisionColor;

  if (score >= 70) {

    decision = "REJECTED";
    decisionColor = COLORS.HIGH;

  } else if (score >= 40) {

    decision = "REVIEW REQUIRED";
    decisionColor = COLORS.MEDIUM;

  } else {

    decision = "APPROVED";
    decisionColor = COLORS.LOW;

  }

  return (

    <div
      style={styles.overlay}
      onClick={onClose}
    >

      <div
        style={styles.modal}
        onClick={e=>e.stopPropagation()}
      >

        <h2>
          Customer {customer.Customer_ID}
        </h2>

        <p>
          Risk Score: {score}
        </p>

        <p>
          Risk Level:
          <span style={{
            color:
            COLORS[customer.riskLevel]
          }}>
            {" "}
            {customer.riskLevel}
          </span>
        </p>

        {/* RISK PREDICTION */}

        <div style={styles.section}>

          <h3>AI Risk Prediction</h3>

          <p style={{
            color:color,
            fontWeight:"bold"
          }}>
            {prediction}
          </p>

          <p>
            Confidence: {confidence}%
          </p>

        </div>

        {/* LOAN SIMULATOR */}

        <div style={styles.section}>

          <h3>Loan Approval Simulator</h3>

          <p style={{
            color:decisionColor,
            fontWeight:"bold",
            fontSize:"18px"
          }}>
            {decision}
          </p>

        </div>

        {/* AI EXPLANATION */}

        <div style={styles.section}>

          <h3>AI Explanation</h3>

          {analysis
            ? (
              <ul>
                {analysis.riskExplanation?.map(
                  (item,i)=>(
                    <li key={i}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            )
            : <p>Loading...</p>
          }

        </div>

        <button
          onClick={onClose}
          style={styles.closeBtn}
        >
          Close
        </button>

      </div>

    </div>

  );

}

/* STYLES */

const styles={

container:{
background:"linear-gradient(135deg,#0f172a,#1e293b)",
minHeight:"100vh",
padding:"30px",
color:"white"
},

controls:{
display:"flex",
gap:"10px",
marginBottom:"20px"
},

input:{
padding:"10px",
borderRadius:"6px"
},

select:{
padding:"10px",
borderRadius:"6px"
},

row:{
display:"flex",
gap:"20px",
marginBottom:"20px"
},

card:{
background:"rgba(255,255,255,0.05)",
padding:"20px",
borderRadius:"10px"
},

grid:{
display:"grid",
gridTemplateColumns:
"repeat(auto-fill,minmax(180px,1fr))",
gap:"15px"
},

customerCard:{
background:"rgba(255,255,255,0.05)",
padding:"15px",
borderRadius:"8px",
cursor:"pointer"
},

overlay:{
position:"fixed",
top:0,left:0,right:0,bottom:0,
background:"rgba(0,0,0,0.7)",
display:"flex",
alignItems:"center",
justifyContent:"center"
},

modal:{
background:"#1e293b",
padding:"25px",
borderRadius:"10px",
width:"400px"
},

section:{
marginTop:"15px"
},

closeBtn:{
marginTop:"15px",
padding:"10px",
background:"#2563eb",
color:"white",
border:"none"
}

};

export default Dashboard;
