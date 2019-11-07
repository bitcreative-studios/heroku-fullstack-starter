const path = require("path")
const express = require("express")
const morgan = require("morgan")
const generatePassword = require("password-generator")

const app = express()

//  ---------- LOGGING ------------
app.use(morgan("dev"))

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

// ---------- API ------------
app.get("/api/passwords", (req, res) => {
  const count = 5

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )
  // FIXME: remove ... only for development
  console.log("--- DEBUG INFO: [/api/passwords] ---")
  console.log(`cluster-worker: ${process.pid}`)

  // Return them as json
  res.json(passwords)

  console.log(`Sent ${count} passwords`)
})

// ---------- GENERAL SETUP ------------
const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log(`Password generator listening on ${PORT}`)

// ---------- EXCEPTION HANDLING ------------
process.on("uncaughtException", function(err) {
  console.error(err)
  // tell the master we need to disconnect
  require("forky").disconnect()
})
