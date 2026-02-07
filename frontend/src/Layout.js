import React, { useState } from "react";
import { motion } from "framer-motion";

import Dashboard from "./Dashboard";
import Copilot from "./Copilot";

function Layout() {

  const [view, setView] = useState("dashboard");

  return (

    <div style={styles.container}>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        <h2 style={{color:"white"}}>AI Risk Copilot</h2>

        <SidebarItem
          label="Dashboard"
          active={view==="dashboard"}
          onClick={()=>setView("dashboard")}
        />

        <SidebarItem
          label="AI Copilot"
          active={view==="copilot"}
          onClick={()=>setView("copilot")}
        />

      </div>

      {/* CONTENT */}

      <div style={styles.content}>

        <motion.div
          key={view}
          initial={{opacity:0, x:30}}
          animate={{opacity:1, x:0}}
          transition={{duration:0.4}}
        >

          {view==="dashboard" && <Dashboard/>}

          {view==="copilot" && <Copilot/>}

        </motion.div>

      </div>

    </div>

  );

}

function SidebarItem({label, active, onClick}){

  return(

    <div
      onClick={onClick}
      style={{
        padding:"12px",
        marginTop:"10px",
        borderRadius:"8px",
        cursor:"pointer",
        background: active ? "#2563eb" : "transparent",
        color:"white"
      }}
    >
      {label}
    </div>

  );

}

const styles={

container:{

display:"flex",

minHeight:"100vh",

background:"linear-gradient(135deg,#0f172a,#1e293b)"

},

sidebar:{

width:"220px",

padding:"20px",

background:"rgba(0,0,0,0.3)"

},

content:{

flex:1,

padding:"30px"

}

};

export default Layout;
