import express, { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("hej");
});

// New route to send JSON data
app.get("/data", async (req: Request, res: Response) => {
  try {
    // Read the data.json file
    const dataPath = path.join(__dirname, "data", "data.json");
    const jsonData = await fs.readFile(dataPath, "utf-8");

    // Parse the JSON data to send it as an object
    const data = JSON.parse(jsonData);

    // Send the data as a response
    res.json(data);
  } catch (error) {
    console.error("Error reading the file:", error);
    res.status(500).json({ error: "Failed to read the data file." });
  }
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
