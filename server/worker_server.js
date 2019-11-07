import path from "path"
import express from "express"
import morgan from "morgan"
import generatePassword from "password-generator"

const DEV_MODE = process.env.NODE_ENV !== "production"
const PORT = process.env.PORT || 5000
const app = express()

//  ---------- LOGGING ------------
app.use(morgan("dev"))

// ---------- API ------------
app.get("/api/passwords", (req, res) => {
  const count = 5

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )
  // FIXME: remove ... only for development
  DEV_MODE &&
    console.log(
      "--- DEBUG INFO: [/api/passwords] ---",
      `cluster-worker: ${process.pid}`
    )

  // Return them as json
  res.json(passwords)

  console.log(`Sent ${count} passwords`)
})

//  ---------- REACT APP ------------
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../client/build")))
/**
 * The catchall handler: for any request that doesn't
 * match one above, send back React's index.html file.
 */
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"))
})

// ---------- GENERAL SETUP ------------
app.listen(PORT)
console.log(`Password generator listening on ${PORT}`)

// ---------- EXCEPTION HANDLING ------------
process.on("uncaughtException", function(err) {
  console.error(err)
  // tell the master we need to disconnect
  require("forky").disconnect()
})
